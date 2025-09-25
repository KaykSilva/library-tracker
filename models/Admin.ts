import { User } from './User';

export interface Admin {
    address: string;
    birthDate: Date;
    cpf: string;
    createdAt?: Date | null;
    id: string;
    name: string;
    phone: string;
    updatedAt?: Date | null;
    user: number;
}

export type AdminWithUser = Omit<Admin,
    'user'> & {
        user: User | number | null;
    };
