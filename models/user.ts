export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  isActive: boolean;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date | null;
}

export type LoginForm = Pick<User,
  'email' | 'password'>;
