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