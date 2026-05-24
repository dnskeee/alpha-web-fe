/**
 * Returns the device's UTC offset as a string in ±HH:MM format.
 * JS getTimezoneOffset() returns minutes *behind* UTC (inverted), so we negate it.
 * Examples: UTC+5 → "+05:00", UTC-7:30 → "-07:30", UTC+0 → "+00:00"
 */
export function getDeviceTimezoneOffset(): string {
  const offset = -new Date().getTimezoneOffset();
  const sign = offset >= 0 ? '+' : '-';
  const abs = Math.abs(offset);
  const hh = String(Math.floor(abs / 60)).padStart(2, '0');
  const mm = String(abs % 60).padStart(2, '0');
  return `${sign}${hh}:${mm}`;
}
