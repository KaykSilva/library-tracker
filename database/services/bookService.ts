import { Prisma } from '@prisma/client';
import { Book } from '../../models/Book';
import prisma from '../../config/prisma';

export default {
    create: async (book: Book): Promise<Book | null> => {
        try {
            return await prisma.book.create({
                data: {
                    author: book.author,
                    available: book.available,
                    city: book.city,
                    copies: book.copies,
                    cdd: book.cdd,
                    edition: book.edition,
                    idCutter: book.idCutter,
                    library: {
                        connect: { id: book.libraryId },
                    },
                    publisher: book.publisher,
                    releaseDate: book.releaseDate,
                    title: book.title,
                    tomo: book.tomo,
                    volume: book.volume,
                },
            });
        } catch (error: any) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                console.error('Prisma error:');
                throw new Error(error.message);
            }
            console.error('Unexpected error:');
            throw new Error(error);
        }
    },

    getAll: async (
        offset?: number,
        take?: number,
    ):
        Promise<Book[]> => {
        try {
            return await prisma.book.findMany({
                orderBy: {
                    title: 'asc',
                },
                skip: offset ? Number(offset) : undefined,
                take: take ? Number(take) : undefined,
            });
        } catch (error: any) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                console.error('Prisma error:');
                throw new Error(error.message);
            }
            console.error('Unexpected error:');
            throw new Error(error);
        }
    },

    getById: async (id: string): Promise<Book | null> => {
        try {
            return await prisma.book.findUnique({
                where: { id },
            });
        } catch (error: any) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                console.error('Prisma error:');
                throw new Error(error.message);
            }
            console.error('Unexpected error:');
            throw new Error(error);
        }
    },

    getByTitle: async (title: string): Promise<Book | null> => {
        try {
            return await prisma.book.findFirst({
                where: { title },
            });
        } catch (error: any) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                console.error('Prisma error:');
                throw new Error(error.message);
            }
            console.error('Unexpected error:');
            throw new Error(error);
        }
    },

    update: async (id: string, bookData: Partial<Omit<Book,
        'id' | 'createdAt' | 'updatedAt' | 'cdd' | 'idCutter' |
        'library' | 'libraryId'>>)
        : Promise<Book | null> => {
        try {
            return await prisma.book.update({
                data: {
                    ...bookData,
                },
                where: { id },
            });
        } catch (error: any) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                console.error('Prisma error:');
                throw new Error(error.message);
            }
            console.error('Unexpected error:');
            throw new Error(error);
        }
    },

    delete: async (id: string): Promise<Book | null> => {
        try {
            return await prisma.book.delete({
                where: { id },
            });
        } catch (error: any) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                console.error('Prisma error:');
                throw new Error(error.message);
            }
            console.error('Unexpected error:');
            throw new Error(error);
        }
    },
};