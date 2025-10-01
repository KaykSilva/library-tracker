import { Prisma } from '@prisma/client';
import { Library } from '../../models/Library';
import prisma from '../../config/prisma';

export default {
    create: async (library: Library): Promise<Library | null> => {
        try {
            return await prisma.library.create({
                data: {
                    address: library.address,
                    name: library.name,
                    user: {},
                    book: {},
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

    getById: async (id: string): Promise<Library | null> => {
        try {
            return await prisma.library.findUnique({
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

    getAll: async (
        offset?: number,
        take?: number,
    ):
        Promise<Library[]> => {
        try {
            return await prisma.library.findMany({
                orderBy: {
                    name: 'asc',
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


    update: async (id: string, libraryData: Partial<Omit<Library,
        'id' | 'createdAt' | 'updatedAt' | 'user' | 'book'>>)
        : Promise<Library | null> => {
        try {
            return await prisma.library.update({
                data: {
                    ...libraryData,
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

    delete: async (id: string): Promise<Library | null> => {
        try {
            return await prisma.library.delete({
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
