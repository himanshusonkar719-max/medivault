/**
 * Input sanitization and validation utilities to defend against
 * XSS, injection, and denial of service via oversized payloads.
 */

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const VALID_BLOOD_GROUPS = new Set(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", ""]);

/**
 * Strips HTML tags and normalizes whitespace
 */
export function sanitizeString(input: unknown, maxLength: number = 255): string {
  if (typeof input !== "string") return "";
  const cleaned = input
    .replace(/<[^>]*>/g, "") // strip html tags
    .replace(/[\u0000-\u0008\u000B-\u000C\u000E-\u001F]/g, "") // strip control characters
    .trim();
  return cleaned.slice(0, maxLength);
}

export function validateEmail(email: string): boolean {
  if (!email || email.length > 254) return false;
  return EMAIL_REGEX.test(email);
}

export function validatePassword(password: string): { valid: boolean; reason?: string } {
  if (!password || password.length < 8) {
    return { valid: false, reason: "Password must be at least 8 characters long." };
  }
  if (password.length > 128) {
    return { valid: false, reason: "Password cannot exceed 128 characters." };
  }
  return { valid: true };
}

export function validateBloodGroup(bg: string): boolean {
  return VALID_BLOOD_GROUPS.has(bg.trim());
}

export function sanitizePhone(phone: string): string {
  // Allow digits, spaces, hyphens, plus sign, parentheses
  return phone.replace(/[^\d\s\-+()]/g, "").slice(0, 30).trim();
}
