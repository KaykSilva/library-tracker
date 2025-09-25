import { Prisma } from '@prisma/client';
import { User } from '../../models/User';
import prisma from '../../config/prisma';

const userService = {
    create: async (user: User): Promise<User | null> => {
        try {
            return await prisma.user.create({
                data: {
                    email: user.email,
                    name: user.name,
                    isActive: user.isActive,
                    isAdmin: user.isAdmin,
                    password: user.password,
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

    getAll: async (isAdmin?: boolean): Promise<User[]> => {
        try {
            return await prisma.user.findMany({
                where: {
                    isActive: true,
                    ...(isAdmin && {
                        isAdmin,
                    }),
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

    getById: async (id: string): Promise<User | null> => {
        try {
            return await prisma.user.findUnique({
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

    getByEmail: async (email: string): Promise<User | null> => {
        try {
            return await prisma.user.findFirst({
                where: { email },
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

    update: async (id: string, user: Partial<Omit<User,
        'createdAt' |
        'email' |
        'id' |
        'updatedAt'
    >>):
        Promise<User | null> => {
        try {
            return await prisma.user.update({
                data: {
                    isActive: user.isActive,
                    password: user.password,
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

    delete: async (id: string): Promise<User | null> => {
        try {
            return await prisma.user.delete({
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

export default userService;