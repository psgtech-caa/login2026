export const normalizeEventRecord = (event: any): any => {
  if (!event || typeof event !== 'object') return event;

  const normalized = { ...event };
  const eventName = String(normalized.name || '').trim().toLowerCase();

  if (eventName.includes('nostos')) {
    normalized.date = '2026-09-15';
    normalized.day = 15;
  }

  if (eventName.includes('codexcape') || (eventName.includes('code') && eventName.includes('escape'))) {
    normalized.date = '2026-09-16';
    normalized.day = 16;
  }

  if (eventName.includes('hunt your treasure') || eventName.includes('treasure')) {
    normalized.date = '2026-09-18';
    normalized.day = 18;
  }

  return normalized;
};

export const normalizeEvents = (events: any[] = []) =>
  Array.isArray(events) ? events.map((event) => normalizeEventRecord(event)) : [];

export const formatEventDate = (date: string): string => {
  if (!date) return 'Date TBA';

  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
  }).format(new Date(`${date}T00:00:00+05:30`));
};

export const formatEventTime = (time: string): string => {
  if (!time) return 'Time TBA';
  const [hours, minutes] = time.split(':').map(Number);
  const date = new Date(2026, 0, 1, hours, minutes);

  return new Intl.DateTimeFormat('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata',
  }).format(date);
};

export const formatEventTiming = (date: string, startTime: string, endTime: string): string =>
  `${formatEventDate(date)} | ${formatEventTime(startTime)} - ${formatEventTime(endTime)} IST`;