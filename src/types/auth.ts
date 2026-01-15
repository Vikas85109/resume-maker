export interface IUser {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface IAuthContext {
  user: IUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (data: { name?: string }) => Promise<{ success: boolean; error?: string }>;
}

export interface IStoredUser extends IUser {
  password: string;
}
