export interface User {
  id: string;
  email: string;
  name: string ;
  password: string;
  isActive: boolean;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date | null;
}