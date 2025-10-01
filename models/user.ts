import { Library } from './Library';

export interface User {
  id: string;
  email: string;
  name: string;
  library?: Library
  libraryId: string;
  password: string;
  isActive: boolean;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date | null;
}

export type LoginForm = Pick<User,
  'email' | 'password'>;
