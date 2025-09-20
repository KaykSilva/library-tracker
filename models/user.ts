export interface User {
  id: number;
  email: string;
  name: string | null;
  password: string;
  isActive: boolean;
  isAdmin: boolean;
  permission: unknown;
  createdAt: Date;
  updatedAt: Date | null;
}