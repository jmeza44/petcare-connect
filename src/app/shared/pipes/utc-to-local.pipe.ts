import { Pipe, PipeTransform } from '@angular/core';

/**
 * Angular Pipe: `utcToLocal`
 *
 * Transforms a UTC date or datetime string into a localized string representation based on the user's current locale and time zone.
 *
 * This pipe is especially useful when your backend stores all datetimes in UTC (e.g., ISO 8601 strings like "2025-07-18T03:00:00Z"),
 * but you want to display them in the user's local time in the UI (e.g., "July 17, 2025, 10:00 PM" for UTC-5).
 *
 * ## Usage in Template:
 *
 * ```html
 * {{ createdAt | utcToLocal }}
 * {{ createdAt | utcToLocal:'es-CO' }}
 * {{ createdAt | utcToLocal:'en-US':{ dateStyle: 'short', timeStyle: 'short' } }}
 * ```
 *
 * @example
 * Input: "2025-07-18T03:00:00Z" (UTC)
 * Output (in UTC-5): "7/17/2025, 10:00 PM"
 *
 * @example
 * Input: "invalid-date"
 * Output: "Invalid date"
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString
 */
@Pipe({
  name: 'utcToLocal',
  standalone: true,
})
export class UtcToLocalPipe implements PipeTransform {
  /**
   * Transforms a UTC date or datetime string into a localized string.
   *
   * @param value - The date input (ISO string, Date object, or null/undefined). Expected to be a UTC datetime.
   * @param locale - Optional BCP 47 language tag to format the output (e.g., "en-US", "es-CO"). Defaults to browser language.
   * @param options - Optional `Intl.DateTimeFormatOptions` to control formatting (e.g., timeStyle, dateStyle).
   * @returns A localized date-time string, or "Invalid date" if the input is not a valid date.
   */
  transform(
    value: string | Date | null | undefined,
    locale: string = navigator.language,
    options?: Intl.DateTimeFormatOptions,
  ): string {
    if (!value) return '';

    const date =
      typeof value === 'string' || value instanceof String
        ? new Date(value)
        : value;

    if (isNaN(date.getTime())) return 'Invalid date';

    return date.toLocaleString(locale, options);
  }
}
