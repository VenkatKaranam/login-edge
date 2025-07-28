/**
 * Date utility functions for authentication-related operations
 */

/**
 * Get a date that is a specified number of minutes in the past
 */
export function getDateMinutesAgo(minutes: number): Date {
  const now = new Date();
  return new Date(now.getTime() - (minutes * 60 * 1000));
}

/**
 * Get a date that is a specified number of minutes in the future
 */
export function getDateMinutesLater(minutes: number): Date {
  const now = new Date();
  return new Date(now.getTime() + (minutes * 60 * 1000));
}
