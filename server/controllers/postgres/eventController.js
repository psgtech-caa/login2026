const fs = require("fs");
const path = require("path");
const { Op } = require("sequelize");
const eventModel = require("../../models/postgres/eventModel");
const eventCoordinatorModel = require("../../models/postgres/eventCoordinatorModel");
const userModel = require("../../models/postgres/userModel");

const getSlug = (value) => String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const loadEventCatalog = () => {
  const candidates = [
    path.resolve(__dirname, '../../data/events.json'),
    path.resolve(__dirname, '../../../client/src/data/events.json'),
    path.resolve(__dirname, '../../../data/events.json'),
  ];

  for (const candidate of candidates) {
    try {
      if (fs.existsSync(candidate)) {
        const raw = fs.readFileSync(candidate, 'utf8');
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (error) {
      console.warn('Event catalog load warning:', error.message);
    }
  }

  return [];
};

const eventCatalog = loadEventCatalog();
const eventCatalogById = new Map(eventCatalog.map((event) => [String(event.id), event]));
const eventCatalogBySlug = new Map(eventCatalog.map((event) => [getSlug(event.name), event]));

const enrichEvent = (event) => {
  const plainEvent = event && typeof event.toJSON === 'function' ? event.toJSON() : event;
  const catalogEntry = eventCatalogById.get(String(plainEvent.id)) || eventCatalogBySlug.get(getSlug(plainEvent.name));
  const slug = catalogEntry?.slug || getSlug(plainEvent.name);

  return {
    ...plainEvent,
    slug,
    detail: catalogEntry?.detail || {
      name: plainEvent.name,
      guardianName: 'GUARDIAN',
      quote: plainEvent.description || 'Enter the arena.',
      durationText: `${plainEvent.start_time || 'TBA'} - ${plainEvent.end_time || 'TBA'}`,
      shortDesc: plainEvent.description || '',
      fullDesc: plainEvent.description || '',
      skills: [],
      briefing: plainEvent.description || 'Enter the arena.'
    },
    guardian_asset: catalogEntry?.guardian_asset || plainEvent.guardian_asset || '/assets/login.png',
  };
};

const createEvent = async (req, res) => {
  try {
    const event = await eventModel.create(req.body);
    return res.status(201).json({ message: "Event created", event });
  } catch (error) {
    return res.status(500).json({ message: "Failed to create event", error: error.message });
  }
};

const getAllEvents = async (req, res) => {
  try {
    const events = await eventModel.findAll({
      order: [["date", "ASC"], ["start_time", "ASC"]],
    });
    const orderedEvents = [...events].sort((a, b) => {
      const rank = (event) => event.name.toLowerCase().includes("nostos") ? -1 : event.is_flagship || event.name.toLowerCase().includes("star of login") ? 1 : 0;
      return rank(a) - rank(b);
    });
    return res.json(orderedEvents.map(enrichEvent));
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch events", error: error.message });
  }
};

const getAssignedEvents = async (req, res) => {
  try {
    if (String(req.user?.role || '').trim().toLowerCase() === 'registration_desk') {
      const events = await eventModel.findAll({
        order: [["date", "ASC"], ["start_time", "ASC"]],
      });
      return res.json(events.map(enrichEvent));
    }

    const assignments = await eventCoordinatorModel.findAll({
      where: { user_id: req.user.id },
      include: [{ model: eventModel, as: "event" }],
    });

    return res.json(assignments.map((assignment) => assignment.event).filter(Boolean));
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch assigned events", error: error.message });
  }
};

const getEvent = async (req, res) => {
  try {
    let event = null;
    const lookup = req.params.id;

    if (lookup && !Number.isNaN(Number(lookup))) {
      event = await eventModel.findByPk(Number(lookup));
    }

    if (!event) {
      const allEvents = await eventModel.findAll();
      const slug = getSlug(lookup);
      event = allEvents.find((entry) => getSlug(entry.name) === slug || String(entry.id) === String(lookup));
    }

    if (!event) return res.status(404).json({ message: "Event not found" });
    return res.json(enrichEvent(event));
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch event", error: error.message });
  }
};

const updateEvent = async (req, res) => {
  try {
    const event = await eventModel.findByPk(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const oldVenue = event.venue;
    const oldTime = event.start_time;

    await event.update(req.body);

    // If venue or time changed, trigger notifications
    if (req.body.venue !== oldVenue || req.body.start_time !== oldTime) {
      const { sendEventChangeNotification } = require("../../services/emailService");
      const announcementModel = require("../../models/postgres/announcementModel");
      const registrationModel = require("../../models/postgres/registrationModel");
      
      // 1. Create Announcement
      await announcementModel.create({
        title: `VENUE/TIME ALERT: ${event.name.toUpperCase()}`,
        message: `${event.name} venue updated to ${event.venue} (Start: ${event.start_time} IST)`,
        is_active: true
      });

      // 2. Dispatch Emails
      const registrations = await registrationModel.findAll({
        where: { event_id: event.id },
        include: [{ model: userModel, as: 'student' }]
      });

      for (const reg of registrations) {
        const studentUser = reg.student || (await userModel.findByPk(reg.student_id));
        if (studentUser && studentUser.email) {
          await sendEventChangeNotification(studentUser, event, { venue: event.venue, start_time: event.start_time });
        }
      }
    }

    return res.json({ message: "Event updated", event });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update event", error: error.message });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const event = await eventModel.findByPk(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    await event.destroy();
    return res.json({ message: "Event deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete event", error: error.message });
  }
};

const assignCoordinator = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { user_id } = req.body;

    const coordinator = await userModel.findOne({
      where: { id: user_id, role: "coordinator" },
    });

    if (!coordinator) {
      return res.status(400).json({ message: "User is not an event coordinator" });
    }

    const existingAssignment = await eventCoordinatorModel.findOne({
      where: { user_id },
    });

    if (existingAssignment) {
      return res.status(409).json({ message: "Each event coordinator can coordinate only one event" });
    }

    const assignment = await eventCoordinatorModel.create({
      event_id: eventId,
      user_id,
    });

    return res.status(201).json({ message: "Coordinator assigned", assignment });
  } catch (error) {
    return res.status(500).json({ message: "Failed to assign coordinator", error: error.message });
  }
};

const getTimeline = async (req, res) => {
  try {
    const { date } = req.query;
    const where = { is_online: false };
    if (date) where.date = date;

    const events = await eventModel.findAll({
      where,
      order: [["start_time", "ASC"]],
    });

    return res.json(events);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch timeline", error: error.message });
  }
};

module.exports = {
  createEvent,
  getAllEvents,
  getAssignedEvents,
  getEvent,
  updateEvent,
  deleteEvent,
  assignCoordinator,
  getTimeline,
};
