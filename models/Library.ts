import { Book } from './Book';

export interface Library {
    address: string;
    book?: Book[];
    createdAt: Date;
    id: string;
    name: string;
    updatedAt: Date | null;
}
