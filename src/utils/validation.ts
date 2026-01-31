const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email: string): { valid: boolean; message?: string } {
  const trimmed = email.trim();
  if (!trimmed) return { valid: false, message: "Email is required" };
  if (!EMAIL_REGEX.test(trimmed)) return { valid: false, message: "Invalid email format" };
  return { valid: true };
}

export function validatePassword(
  password: string,
  minLength: number = 6
): { valid: boolean; message?: string } {
  if (!password) return { valid: false, message: "Password is required" };
  if (password.length < minLength)
    return { valid: false, message: `Password must be at least ${minLength} characters` };
  return { valid: true };
}
