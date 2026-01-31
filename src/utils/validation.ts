const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim());
}

export function isValidPassword(
  password: string,
  minLength: number = 6
): boolean {
  return password.length >= minLength;
}

export function getEmailError(email: string): string | null {
  if (!email.trim()) return "Email is required";
  if (!isValidEmail(email)) return "Please enter a valid email address";
  return null;
}

export function getPasswordError(
  password: string,
  minLength: number = 6
): string | null {
  if (!password) return "Password is required";
  if (!isValidPassword(password, minLength))
    return `Password must be at least ${minLength} characters`;
  return null;
}
