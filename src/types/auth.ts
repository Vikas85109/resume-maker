export interface IUser {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  profilePicture?: string;
}

export interface IAuthContext {
  user: IUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (data: { name?: string; profilePicture?: string }) => Promise<{ success: boolean; error?: string }>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
}

export interface IStoredUser extends IUser {
  password: string;
}

// Saved CV/Draft types
export interface ISavedCV {
  id: string;
  name: string;
  templateId: string;
  createdAt: string;
  updatedAt: string;
  thumbnail?: string;
}

export interface IDraft {
  id: string;
  name: string;
  templateId: string;
  createdAt: string;
  expiresAt: string;
  data: unknown;
}

export interface IInvoice {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  description: string;
  downloadUrl?: string;
}
