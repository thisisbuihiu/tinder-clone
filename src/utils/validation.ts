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

export function getNameError(name: string): string | null {
  if (!name.trim()) return "Name is required";
  if (name.trim().length < 2) return "Name must be at least 2 characters";
  return null;
}

export function getAgeError(age: string): string | null {
  if (!age.trim()) return "Age is required";
  const num = parseInt(age, 10);
  if (isNaN(num) || num < 18 || num > 120) return "Enter a valid age (18-120)";
  return null;
}

export function getBioError(bio: string, maxLength: number = 500): string | null {
  if (bio.length > maxLength) return `Bio must be at most ${maxLength} characters`;
  return null;
}
