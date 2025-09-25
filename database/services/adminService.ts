import { Prisma } from '@prisma/client';
import prisma from '../../config/prisma';
import { Admin, AdminWithUser } from '../../models/Admin';
import { User } from '../../models/User';

const userAdmin = {

    /**
    * Create a new admin record.
    * -
    * @param {Admin} admin - The data for the new admin.
    * @returns {Promise<Admin | null>} - The created admin or null if creation fails.
    */
    create: async (admin: Admin): Promise<Admin | null> => {
        try {
            return prisma.admin.create({
                data: {
                    address: admin.address,
                    birthDate: admin.birthDate,
                    cpf: admin.cpf,
                    name: admin.name,
                    phone: admin.phone,
                    user: admin.user,
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


    /**
     * Retrieve all admins matching filters
     * -
     * @param {boolean} [isActive] - Optional flag to filter by active status.
     * @param {number} [offset] - Optional offset for pagination.
     * @param {number} [take] - Optional limit for pagination.
     * @returns {Promise<AdminWithUser[]>} - An array of admins with user details.
     */
    getAll: async (
        isActive?: boolean,
        offset?: number,
        take?: number,
    ):
        Promise<AdminWithUser[]> => {
        try {
            const admins: Admin[] = await prisma.admin.findMany({
                orderBy: {
                    createdAt: 'desc',
                },
                skip: offset ? Number(offset) : undefined,
                take: take ? Number(take) : undefined,
            });

            const adminWithUser: AdminWithUser[] = await Promise
                .all(admins.map(async (admin) => {
                    const user: User | null = await prisma.user.findUnique({
                        where: {
                            id: String(admin.user),
                            ...(isActive && { isActive }),
                        },
                    });
                    return {
                        address: admin.address,
                        birthDate: admin.birthDate,
                        cpf: admin.cpf,
                        id: admin.id,
                        name: admin.name,
                        phone: admin.phone,
                        user: user || null,
                    };
                }));
            return adminWithUser;
        } catch (error: any) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                console.error('Prisma error:');
                throw new Error(error.message);
            }
            console.error('Unexpected error:');
            throw new Error(error);
        }
    },

    /**
    * Retrieve an admin by Id
    * -
    * @param {string} id - The Id of the admin to retrieve.
    * @returns {Promise<AdminWithUser | null>} - The admin with user details or null.
    */
    getById: async (id: string): Promise<AdminWithUser | null> => {
        try {
            const admin: Admin | null = await prisma.admin.findUnique({
                where: { id },
            });
            if (!admin) return null;

            const user: User | null = await prisma.user.findUnique({
                where: {
                    id: String(admin.user),
                },
            });
            return {
                ...admin,
                ...(user && { user }),
            };
        } catch (error: any) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                console.error('Prisma error:');
                throw new Error(error.message);
            }
            console.error('Unexpected error:');
            throw new Error(error);
        }
    },

    /**
    * Retrieve an admin by userId
    * -
    * @param {string} userId - The userId of the admin to retrieve.
    * @returns {Promise<AdminWithUser | null>} - The admin with user details or null.
    */
    getByUserId: async (userId: string): Promise<AdminWithUser | null> => {
        try {
            const admin: Admin | null = await prisma.admin.findUnique({
                where: {
                    user: Number(userId),
                },
            });
            if (!admin) return null;

            const user: User | null = await prisma.user.findUnique({
                where: {
                    id: String(userId),
                },
            });
            return {
                ...admin,
                ...(user && { user }),
            };
        } catch (error: any) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                console.error('Prisma error:');
                throw new Error(error.message);
            }
            console.error('Unexpected error:');
            throw new Error(error);
        }
    },

    /**
     * Retrieve an admin by CPF
     *
     * @param {string} cpf - The CPF of the admin to retrieve.
     * @returns {Promise<AdminWithUser | null>} - The admin with user details or null.
     */
    getByCPF: async (cpf: string): Promise<AdminWithUser | null> => {
        try {
            const admin: Admin | null = await prisma.admin.findFirst({
                where: {
                    cpf,
                },
            });
            if (!admin) return null;

            const user: User | null = await prisma.user.findUnique({
                where: {
                    id: String(admin.user),
                },
            });
            return {
                ...admin,
                ...(user && { user }),
            };
        } catch (error: any) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                console.error('Prisma error:');
                throw new Error(error.message);
            }
            console.error('Unexpected error:');
            throw new Error(error);
        }
    },

    /**
     * Retrieve admins by name
     * -
     * @param {string} name - The name to search for.
     * @param {boolean} [isActive] - Optional flag to filter by active status.
     * @returns {Promise<AdminWithUser[]>} - An array of admins with user details.
     */
    getByName: async (
        name: string,
        isActive?: boolean,
    ):
        Promise<AdminWithUser[]> => {
        try {
            const admins: Admin[] = await prisma.admin.findMany({
                orderBy: {
                    createdAt: 'desc',
                },
                where: {
                    name: { contains: name },
                },
            });

            const adminWithUser: AdminWithUser[] = await Promise
                .all(admins.map(async (admin) => {
                    const user: User | null = await prisma.user.findUnique({
                        where: {
                            id: String(admin.user),
                            ...(isActive && { isActive }),
                        },
                    });
                    return {
                        ...admin,
                        ...(user && { user }),
                    };
                }));
            return adminWithUser;
        } catch (error: any) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                console.error('Prisma error:');
                throw new Error(error.message);
            }
            console.error('Unexpected error:');
            throw new Error(error);
        }
    },

    /**
     * Update an admin by Id.
     * -
     * @param {string} id - The Id of the admin to update.
     * @param {Partial} admin - The partial data to update the admin.
     * @returns {Promise<Admin | null>} - The updated admin or null if update fails.
     */
    update: async (
        id: string,
        admin: Partial<Omit<Admin,
            'birthDate' |
            'createdAt' |
            'id' |
            'updatedAt' |
            'user'
        >>,
    ): Promise<Admin | null> => {
        try {
            return await prisma.admin.update({
                data: {
                    address: admin.address,
                    name: admin.name,
                    phone: admin.phone,
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

    /**
     * Delete an admin by Id
     * -
     * @param {string} id - The Id of the admin to delete.
     * @returns {Promise<Admin | null>} - The deleted admin or null if deletion fails.
     */
    delete: async (id: string): Promise<Admin | null> => {
        try {
            return await prisma.admin.delete({
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

export default userAdmin;