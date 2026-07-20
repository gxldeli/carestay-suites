const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function isValidDateInput(value: string): boolean {
  if (!DATE_PATTERN.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export function getTorontoToday(): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Toronto",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

export function getNextDateInput(value: string): string {
  if (!isValidDateInput(value)) return "";
  const date = new Date(`${value}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + 1);
  return date.toISOString().slice(0, 10);
}

export function formatShortDate(value: string): string {
  if (!isValidDateInput(value)) return "";
  const date = new Date(`${value}T12:00:00Z`);
  return new Intl.DateTimeFormat("en-CA", { month: "short", day: "numeric", timeZone: "UTC" }).format(date);
}
