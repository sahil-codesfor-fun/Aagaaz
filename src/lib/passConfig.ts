/**
 * Event Pass & Registration Configuration
 * Deadline: 12:30 PM IST on October 3, 2026
 */

export const REGISTRATION_CLOSE_TIMESTAMP = new Date("2026-10-03T12:30:00+05:30").getTime();

export const PASS_CLOSED_MESSAGE = {
  title: "Passes Distributed",
  subtitle: "Registration Closed",
  description: "The passes are distributed. No more entries are allowed. Thanks for your support and have a nice day!",
};

export function isPassRegistrationClosed(): boolean {
  return Date.now() >= REGISTRATION_CLOSE_TIMESTAMP;
}
