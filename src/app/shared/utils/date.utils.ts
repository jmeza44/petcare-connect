/**
 * Converts a UTC datetime string into a localized datetime string based on the user's current timezone.
 *
 * @param utcDateString - A string representing a UTC datetime in ISO format (e.g., "2025-07-18T03:00:00Z").
 * @returns A string representation of the date and time in the user's local time zone, formatted based on browser locale.
 *
 * @example
 * convertUtcToLocal("2025-07-18T03:00:00Z") // "July 17, 2025, 10:00 PM" (if user is in UTC-5)
 */
export function convertUtcToLocal(utcDateString: string): string {
  const utcDate = new Date(utcDateString);
  return utcDate.toLocaleString(); // Automatically converts UTC to local time
}

/**
 * Converts local calendar date strings into a UTC date range (ISO strings) that represent the full coverage
 * of the selected local dates. This is useful for filtering backend records that are stored in UTC,
 * but need to be filtered based on the user's local calendar day.
 *
 * - The "from" date is converted to the UTC start of the local day (`00:00:00` local time).
 * - The "to" date is converted to the UTC start of the next local day (`00:00:00` local time the following day),
 *   making the range exclusive of the "to" date itself.
 *
 * @param localFromDateStr - A date string in "YYYY-MM-DD" format representing the start date in local time (optional).
 * @param localToDateStr - A date string in "YYYY-MM-DD" format representing the end date in local time (optional).
 * @returns An object with optional `fromUtc` and `toUtc` ISO strings in UTC format.
 *
 * @example
 * getUtcDateRange("2025-07-18", "2025-07-18")
 * // Returns:
 * // {
 * //   fromUtc: "2025-07-18T05:00:00.000Z",
 * //   toUtc:   "2025-07-19T05:00:00.000Z"
 * // } (if local timezone is UTC-5)
 */
export function getUtcDateRange(
  localFromDateStr?: string | null,
  localToDateStr?: string | null,
): { fromUtc?: string; toUtc?: string } {
  const result: { fromUtc?: string; toUtc?: string } = {};

  if (localFromDateStr) {
    // Parse YYYY-MM-DD string into local date at midnight
    const [year, month, day] = localFromDateStr.split('-').map(Number);
    const localFrom = new Date(year, month - 1, day, 0, 0, 0);
    result.fromUtc = localFrom.toISOString(); // Convert to UTC ISO string
  }

  if (localToDateStr) {
    // Parse YYYY-MM-DD string and move to start of next local day
    const [year, month, day] = localToDateStr.split('-').map(Number);
    const localTo = new Date(year, month - 1, day + 1, 0, 0, 0);
    result.toUtc = localTo.toISOString(); // Convert to UTC ISO string
  }

  return result;
}
