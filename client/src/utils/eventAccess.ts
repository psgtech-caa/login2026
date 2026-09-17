const EVENT_ACCESS_STORAGE_KEY = 'login2026_event_access_overrides';
const FRONTEND_CLOSED_EVENT_NAMES = ['nostos', 'codexcape', 'hunt your treasure', 'debug arena', 'in the slot', 'code relay', 'blind coding'];
//

export type EventAccessStatus = 'open' | 'closed';

export const getEventAccessOverrides = (): Record<string, EventAccessStatus> => {
  if (typeof window === 'undefined') return {};

  try {
    const raw = window.localStorage.getItem(EVENT_ACCESS_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return {};
    return Object.entries(parsed).reduce<Record<string, EventAccessStatus>>((acc, [key, value]) => {
      if (value === 'open' || value === 'closed') acc[String(key)] = value;
      return acc;
    }, {});
  } catch (error) {
    return {};
  }
};

export const setEventAccessOverride = (eventId: number | string, status: EventAccessStatus) => {
  if (typeof window === 'undefined') return;

  const overrides = getEventAccessOverrides();
  overrides[String(eventId)] = status;
  window.localStorage.setItem(EVENT_ACCESS_STORAGE_KEY, JSON.stringify(overrides));
  return status;
};

export const resetEventAccessOverrides = () => {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(EVENT_ACCESS_STORAGE_KEY);
};

export const getEffectiveEventStatus = (event: any): string => {
  const baseStatus = String(event?.status || '').trim().toLowerCase();
  const override = getEventAccessOverrides()[String(event?.id)];
  if (override) return String(override).trim().toLowerCase();

  const eventName = String(event?.name || '').trim().toLowerCase();
  if (FRONTEND_CLOSED_EVENT_NAMES.some((name) => eventName.includes(name))) return 'closed';

  return baseStatus;
};

export const toggleEventAccessOverride = (event: any): EventAccessStatus => {
  const current = getEffectiveEventStatus(event);
  const nextStatus: EventAccessStatus = current === 'open' ? 'closed' : 'open';
  setEventAccessOverride(event.id, nextStatus);
  return nextStatus;
};
