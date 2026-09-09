const fs = require("fs");
const path = require("path");
const { QueryTypes } = require("sequelize");
const eventModel = require("../../models/postgres/eventModel");
const eventCoordinatorModel = require("../../models/postgres/eventCoordinatorModel");
const userModel = require("../../models/postgres/userModel");
const { neonSequelize } = require("../../config/db/postgres");

const readFromNeon = ['true', '1', 'yes', 'on'].includes(
  String(process.env.READ_EVENTS_FROM_NEON || '').toLowerCase()
);

const findAllEvents = async (options = {}) => {
  if (readFromNeon && neonSequelize) {
    try {
      const [rows] = await neonSequelize.query(`
        SELECT * FROM "events"
        ORDER BY "date" ASC, "start_time" ASC
      `);
      if (Array.isArray(rows) && rows.length > 0) return rows;
    } catch (error) {
      console.warn('[Events] Neon read failed; falling back to local database:', error.message);
    }
  }

  try {
    return await eventModel.findAll(options);
  } catch (err) {
    console.warn('[Events] Local query failed, syncing model:', err.message);
    try {
      await eventModel.sync();
      return await eventModel.findAll(options);
    } catch (syncErr) {
      console.warn('[Events] Sync failed, returning catalog fallback:', syncErr.message);
      return eventCatalog;
    }
  }
};

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
    status: String(plainEvent.status || '').trim().toLowerCase(),
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
    guardian_asset: catalogEntry?.guardian_asset || plainEvent.guardian_asset || '/assets/login.webp',
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
    let events = await findAllEvents({
      order: [["date", "ASC"], ["start_time", "ASC"]],
    });

    if (!events || events.length === 0) {
      events = eventCatalog;
    }

    const orderedEvents = [...events].sort((a, b) => {
      const rank = (event) => (event.name || '').toLowerCase().includes("nostos") ? -1 : event.is_flagship || (event.name || '').toLowerCase().includes("star of login") ? 1 : 0;
      return rank(a) - rank(b);
    });
    return res.json(orderedEvents.map(enrichEvent));
  } catch (error) {
    console.error("Failed to fetch events:", error.message || error);
    return res.json(eventCatalog.map(enrichEvent));
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
      if (readFromNeon && neonSequelize) {
        const rows = await neonSequelize.query('SELECT * FROM "events" WHERE "id" = :id LIMIT 1', {
          replacements: { id: Number(lookup) },
          type: QueryTypes.SELECT,
        });
        event = rows[0] || null;
      } else {
        event = await eventModel.findByPk(Number(lookup));
      }
    }

    if (!event) {
      const allEvents = await findAllEvents();
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

    const events = await findAllEvents({
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
