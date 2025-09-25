import { Request, Response } from 'express';
import { Admin, AdminWithUser } from '../../models/Admin';
import { User } from '../../models/User';
import authentication from '../../authentication';
import userService from '../services/userService';
import adminService from '../services/adminService';

/**
 * Check if all required fields are present in the admin object.
 */
function checkAdminRequiredFields(admin: Admin): boolean {
    const requiredFields = ['address', 'birthDate', 'cpf', 'name', 'phone'];
    return requiredFields.every((field) => {
        return admin[field as keyof Admin] !== undefined
            && admin[field as keyof Admin] !== null;
    });
}

/**
 * Check if all required fields are present in the user object.
 */
function checkUserRequiredFields(user: User): boolean {
    const requiredFields = ['email', 'password', 'isActive', 'isAdmin'];
    return requiredFields.every((field) => {
        return user[field as keyof User] !== undefined
            && user[field as keyof User] !== null;
    });
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {

    /**
     * Create a new admin record.
     */
    create: async (req: Request, res: Response): Promise<void> => {
        if (!req?.body || !req?.headers?.['x-access-token']) {
            res.status(400).json({
                error: 'Request data is incorrect or unfulfilled',
            });
            return;
        }

        const token = req.headers['x-access-token'] as string;
        const decodedToken = authentication.verifyToken(token);
        if (!decodedToken) {
            res.status(403).json({
                error: 'Token is expired or invalid',
            });
            return;
        }

        const { admin: adminData }: { admin: Admin } = req.body || {};
        const { user: userData }: { user: User } = req.body || {};

        if (!adminData || !checkAdminRequiredFields(adminData)) {
            res.status(400).json({
                error: 'Admin data is incorrect or unfulfilled',
            });
            return;
        }

        if (!userData || !checkUserRequiredFields(userData)) {
            res.status(400).json({
                error: 'User data is incorrect or unfulfilled',
            });
            return;
        }

        try {
            // Verificar se email já existe
            if (await userService.getByEmail(userData.email)) {
                res.status(409).json({
                    error: 'User email already registered',
                });
                return;
            }

            // Verificar se CPF já existe (sem locationId)
            if (await adminService.getByCPF(adminData.cpf)) {
                res.status(409).json({
                    error: 'Admin CPF already registered',
                });
                return;
            }

            // Hash da senha e criar usuário
            userData.password = await authentication.hashPassword(userData.password);
            const newUser: User | null = await userService.create(userData);

            if (!newUser) {
                res.status(500).json({
                    error: 'Unexpected error occurred while creating user',
                });
                return;
            }

            // Associar admin ao usuário (convertendo string ID para number)
            adminData.user = parseInt(newUser.id, 10);
            await adminService.create(adminData);
            res.sendStatus(201);
        } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
            console.error('Error creating admin:', error.message);
            const statusCode = error.status || 500;
            const errorDetails = {
                details: error.message || 'An unexpected error occurred',
                error: 'Failed to create admin',
            };
            res.status(statusCode).json(errorDetails);
        }
    },

    /**
     * Retrieve a list of admins based on filters.
     */
    getAll: async (req: Request, res: Response): Promise<void> => {
        if (!req?.headers?.['x-access-token']) {
            res.status(400).json({
                error: 'Request data is incorrect or unfulfilled',
            });
            return;
        }

        const token = req.headers['x-access-token'] as string;
        const decodedToken = authentication.verifyToken(token);
        if (!decodedToken) {
            res.status(403).json({
                error: 'Token is expired or invalid',
            });
            return;
        }

        // Filtros simplificados (sem locationId)
        const isActive = req.query.isActive === 'true';
        const offset = req.query.offset ? parseInt(req.query.offset as string, 10) : undefined;
        const take = req.query.take ? parseInt(req.query.take as string, 10) : undefined;

        if (offset && Number.isNaN(offset)) {
            res.status(400).json({
                error: 'Offset is not a valid number',
            });
            return;
        }

        if (take && Number.isNaN(take)) {
            res.status(400).json({
                error: 'Take is not a valid number',
            });
            return;
        }

        try {
            const adminList: AdminWithUser[] = await adminService.getAll(isActive, offset, take);

            if (!adminList) {
                res.status(404).json({
                    error: 'Admin list is null or undefined',
                });
                return;
            }

            if (adminList.length === 0) {
                res.status(204).json({
                    message: 'Admin list is empty',
                });
                return;
            }

            res.status(200).json(adminList);
        } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
            console.error('Error retrieving all admins:', error.message);
            const statusCode = error.status || 500;
            const errorDetails = {
                details: error.message || 'An unexpected error occurred',
                error: 'Failed to retrieve all admins',
            };
            res.status(statusCode).json(errorDetails);
        }
    },

    /**
     * Retrieve a admin by Id.
     */
    getById: async (req: Request, res: Response): Promise<void> => {
        if (!req?.headers?.['x-access-token'] || !req?.query?.id) {
            res.status(400).json({
                error: 'Request data is incorrect or unfulfilled',
            });
            return;
        }

        const token = req.headers['x-access-token'] as string;
        const decodedToken = authentication.verifyToken(token);
        if (!decodedToken) {
            res.status(403).json({
                error: 'Token is expired or invalid',
            });
            return;
        }

        const id = req.query.id as string;
        if (!id) {
            res.status(400).json({
                error: 'Id is required',
            });
            return;
        }

        try {
            const admin: AdminWithUser | null = await adminService.getById(id);
            if (!admin) {
                res.status(404).json({
                    error: 'Admin not found',
                });
                return;
            }

            res.status(200).json(admin);
        } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
            console.error('Error retrieving admin:', error.message);
            const statusCode = error.status || 500;
            const errorDetails = {
                details: error.message || 'An unexpected error occurred',
                error: 'Failed to retrieve admin',
            };
            res.status(statusCode).json(errorDetails);
        }
    },

    /**
     * Retrieve a admin by userId.
     */
    getByUserId: async (req: Request, res: Response): Promise<void> => {
        if (!req?.headers?.['x-access-token'] || !req?.query?.userId) {
            res.status(400).json({
                error: 'Request data is incorrect or unfulfilled',
            });
            return;
        }

        const token = req.headers['x-access-token'] as string;
        const decodedToken = authentication.verifyToken(token);
        if (!decodedToken) {
            res.status(403).json({
                error: 'Token is expired or invalid',
            });
            return;
        }

        const userId = req.query.userId as string;
        if (!userId) {
            res.status(400).json({
                error: 'User ID is required',
            });
            return;
        }

        try {
            const admin: AdminWithUser | null = await adminService.getByUserId(String(userId));
            if (!admin) {
                res.status(404).json({
                    error: 'Admin not found for this user',
                });
                return;
            }

            res.status(200).json(admin);
        } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
            console.error('Error retrieving admin:', error.message);
            const statusCode = error.status || 500;
            const errorDetails = {
                details: error.message || 'An unexpected error occurred',
                error: 'Failed to retrieve admin',
            };
            res.status(statusCode).json(errorDetails);
        }
    },

    /**
     * Retrieve a admin by CPF.
     */
    getByCPF: async (req: Request, res: Response): Promise<void> => {
        if (!req?.headers?.['x-access-token'] || !req?.query?.cpf) {
            res.status(400).json({
                error: 'Request data is incorrect or unfulfilled',
            });
            return;
        }

        const token = req.headers['x-access-token'] as string;
        const decodedToken = authentication.verifyToken(token);
        if (!decodedToken) {
            res.status(403).json({
                error: 'Token is expired or invalid',
            });
            return;
        }

        const cpf = req.query.cpf as string;
        if (!cpf) {
            res.status(400).json({
                error: 'CPF is required',
            });
            return;
        }

        try {
            const admin: AdminWithUser | null = await adminService.getByCPF(cpf);
            if (!admin) {
                res.status(404).json({
                    error: 'Admin not found',
                });
                return;
            }

            res.status(200).json(admin);
        } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
            console.error('Error retrieving admin:', error.message);
            const statusCode = error.status || 500;
            const errorDetails = {
                details: error.message || 'An unexpected error occurred',
                error: 'Failed to retrieve admin',
            };
            res.status(statusCode).json(errorDetails);
        }
    },

    /**
     * Retrieve admins by name.
     */
    getByName: async (req: Request, res: Response): Promise<void> => {
        if (!req?.headers?.['x-access-token'] || !req?.query?.name) {
            res.status(400).json({
                error: 'Request data is incorrect or unfulfilled',
            });
            return;
        }

        const token = req.headers['x-access-token'] as string;
        const decodedToken = authentication.verifyToken(token);
        if (!decodedToken) {
            res.status(403).json({
                error: 'Token is expired or invalid',
            });
            return;
        }

        const name = req.query.name as string;
        const isActive = req.query.isActive === 'true';

        if (!name) {
            res.status(400).json({
                error: 'Name is required',
            });
            return;
        }

        try {
            const adminList: AdminWithUser[] = await adminService.getByName(name, isActive);

            if (!adminList) {
                res.status(404).json({
                    error: 'Admin list not found',
                });
                return;
            }

            if (adminList.length === 0) {
                res.status(204).json({
                    message: 'No admins found with this name',
                });
                return;
            }

            res.status(200).json(adminList);
        } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
            console.error('Error retrieving admins:', error.message);
            const statusCode = error.status || 500;
            const errorDetails = {
                details: error.message || 'An unexpected error occurred',
                error: 'Failed to retrieve admins',
            };
            res.status(statusCode).json(errorDetails);
        }
    },

    /**
     * Update a admin by Id.
     */
    update: async (req: Request, res: Response): Promise<void> => {
        if (!req.body || !req?.headers?.['x-access-token'] || !req?.query?.id) {
            res.status(400).json({
                error: 'Request data is incorrect or unfulfilled',
            });
            return;
        }

        const token = req.headers['x-access-token'] as string;
        const decodedToken = authentication.verifyToken(token);
        if (!decodedToken) {
            res.status(403).json({
                error: 'Token is expired or invalid',
            });
            return;
        }

        const id = req.query.id as string;
        const { admin: adminData }: { admin: Admin } = req.body || {};
        const { user: userData }: { user: User } = req.body || {};

        if (!id) {
            res.status(400).json({
                error: 'Id is required',
            });
            return;
        }

        try {
            const existingAdmin: AdminWithUser | null = await adminService.getById(id);
            if (!existingAdmin) {
                res.status(404).json({
                    error: 'Admin not found',
                });
                return;
            }

            // Atualizar admin
            await adminService.update(id, adminData);

            // Atualizar usuário associado se existir
            if (existingAdmin.user && typeof existingAdmin.user === 'object' && 'id' in existingAdmin.user) {
                await userService.update(existingAdmin.user.id, userData);
            }

            res.sendStatus(200);
        } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
            console.error('Error updating admin:', error.message);
            const statusCode = error.status || 500;
            const errorDetails = {
                details: error.message || 'An unexpected error occurred',
                error: 'Failed to update admin',
            };
            res.status(statusCode).json(errorDetails);
        }
    },

    /**
     * Delete a admin by Id.
     */
    delete: async (req: Request, res: Response): Promise<void> => {
        if (!req?.headers?.['x-access-token'] || !req?.query?.id) {
            res.status(400).json({
                error: 'Request data is incorrect or unfulfilled',
            });
            return;
        }

        const token = req.headers['x-access-token'] as string;
        const decodedToken = authentication.verifyToken(token);
        if (!decodedToken) {
            res.status(403).json({
                error: 'Token is expired or invalid',
            });
            return;
        }

        const id = req.query.id as string;
        if (!id) {
            res.status(400).json({
                error: 'Id is required',
            });
            return;
        }

        try {
            const admin: AdminWithUser | null = await adminService.getById(id);
            if (!admin) {
                res.status(404).json({
                    error: 'Admin not found',
                });
                return;
            }

            await adminService.delete(id);
            res.sendStatus(204);
        } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
            console.error('Error deleting admin:', error.message);
            const statusCode = error.status || 500;
            const errorDetails = {
                details: error.message || 'An unexpected error occurred',
                error: 'Failed to delete admin',
            };
            res.status(statusCode).json(errorDetails);
        }
    },
};