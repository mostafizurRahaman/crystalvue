// src/lib/utils.ts (add these functions)

/**
 * Format date to display only the date part (no time)
 * @param date - Date string or Date object
 * @param timezone - Optional timezone (default: 'UTC')
 * @returns Formatted date string (e.g., "Jan 15, 2024")
 */
export function formatDateOnly(
  date: string | Date,
  timezone: string = "UTC"
): string {
  if (!date) return "-";

  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;

    if (isNaN(dateObj.getTime())) {
      return "-";
    }

    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
      timeZone: timezone,
    };

    return dateObj.toLocaleDateString("en-US", options);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "-";
  }
}

/**
 * Format date to display date and time in 12-hour format
 * @param date - Date string or Date object
 * @param timezone - Optional timezone (default: 'UTC')
 * @returns Formatted date-time string (e.g., "Jan 15, 2024, 02:30 PM")
 */
export function formatDateTime12Hr(
  date: string | Date,
  timezone: string = "UTC"
): string {
  if (!date) return "-";

  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;

    if (isNaN(dateObj.getTime())) {
      return "-";
    }

    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: timezone,
    };

    return dateObj.toLocaleString("en-US", options);
  } catch (error) {
    console.error("Error formatting date-time:", error);
    return "-";
  }
}

/**
 * Format date to display date and time in 24-hour format
 * @param date - Date string or Date object
 * @param timezone - Optional timezone (default: 'UTC')
 * @returns Formatted date-time string (e.g., "Jan 15, 2024, 14:30")
 */
export function formatDateTime24Hr(
  date: string | Date,
  timezone: string = "UTC"
): string {
  if (!date) return "-";

  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;

    if (isNaN(dateObj.getTime())) {
      return "-";
    }

    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: timezone,
    };

    return dateObj.toLocaleString("en-US", options);
  } catch (error) {
    console.error("Error formatting date-time:", error);
    return "-";
  }
}

/**
 * Format date to ISO format (YYYY-MM-DD)
 * @param date - Date string or Date object
 * @returns ISO formatted date string (e.g., "2024-01-15")
 */
export function formatDateISO(date: string | Date): string {
  if (!date) return "";

  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;

    if (isNaN(dateObj.getTime())) {
      return "";
    }

    return dateObj.toISOString().split("T")[0];
  } catch (error) {
    console.error("Error formatting ISO date:", error);
    return "";
  }
}

/**
 * Format time only (no date)
 * @param date - Date string or Date object
 * @param use12Hour - Use 12-hour format (default: true)
 * @param timezone - Optional timezone (default: 'UTC')
 * @returns Formatted time string (e.g., "02:30 PM" or "14:30")
 */
export function formatTimeOnly(
  date: string | Date,
  use12Hour: boolean = true,
  timezone: string = "UTC"
): string {
  if (!date) return "-";

  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;

    if (isNaN(dateObj.getTime())) {
      return "-";
    }

    const options: Intl.DateTimeFormatOptions = {
      hour: "numeric",
      minute: "2-digit",
      hour12: use12Hour,
      timeZone: timezone,
    };

    return dateObj.toLocaleTimeString("en-US", options);
  } catch (error) {
    console.error("Error formatting time:", error);
    return "-";
  }
}

/**
 * Format date in a relative way (e.g., "Today", "Yesterday", "2 days ago")
 * @param date - Date string or Date object
 * @returns Relative date string
 */
export function formatRelativeDate(date: string | Date): string {
  if (!date) return "-";

  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;

    if (isNaN(dateObj.getTime())) {
      return "-";
    }

    const now = new Date();
    const diffTime = now.getTime() - dateObj.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} ${months === 1 ? "month" : "months"} ago`;
    } else {
      const years = Math.floor(diffDays / 365);
      return `${years} ${years === 1 ? "year" : "years"} ago`;
    }
  } catch (error) {
    console.error("Error formatting relative date:", error);
    return "-";
  }
}

/**
 * Format date with custom pattern
 * @param date - Date string or Date object
 * @param pattern - Pattern string (YYYY, MM, DD, HH, mm, ss)
 * @returns Formatted date string
 */
export function formatCustomDate(
  date: string | Date,
  pattern: string = "YYYY-MM-DD"
): string {
  if (!date) return "-";

  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;

    if (isNaN(dateObj.getTime())) {
      return "-";
    }

    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    const hours = String(dateObj.getHours()).padStart(2, "0");
    const minutes = String(dateObj.getMinutes()).padStart(2, "0");
    const seconds = String(dateObj.getSeconds()).padStart(2, "0");

    return pattern
      .replace("YYYY", String(year))
      .replace("MM", month)
      .replace("DD", day)
      .replace("HH", hours)
      .replace("mm", minutes)
      .replace("ss", seconds);
  } catch (error) {
    console.error("Error formatting custom date:", error);
    return "-";
  }
}
