// User Information
export interface IUser {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

// Stored user with password (for localStorage mock auth)
export interface IStoredUser extends IUser {
  password: string;
}

// Auth Context Type
export interface IAuthContextType {
  user: IUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

// Login Form Data
export interface ILoginForm {
  email: string;
  password: string;
  rememberMe: boolean;
}

// Register Form Data
export interface IRegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

// Form Errors
export interface IFormErrors {
  [key: string]: string;
}

// Password Strength
export type PasswordStrength = 'weak' | 'medium' | 'strong';

export const getPasswordStrength = (password: string): PasswordStrength => {
  if (password.length < 6) return 'weak';

  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[^a-zA-Z0-9]/.test(password)) strength++;

  if (strength >= 3) return 'strong';
  if (strength >= 2) return 'medium';
  return 'weak';
};

// Utility to generate user ID
export const generateUserId = (): string => {
  return 'user_' + Math.random().toString(36).substring(2, 11);
};
