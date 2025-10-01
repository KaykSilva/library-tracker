import { Request, Response } from 'express';
import { Library } from '../../models/Library';
import authentication from '../../authentication';
import libraryService from '../services/libraryService';


function checkLibraryRequiredFields(library: Library): boolean {
    const requiredFields: (keyof Library)[] = [
        'address', 'name'];
    return requiredFields.every((field) => {
        return library[field as keyof Library] !== undefined
            && library[field as keyof Library] !== null;
    });
}

export default {
    create: async (req: Request, res: Response): Promise<void> => {
        if (!req?.body || !req?.headers?.['x-access-token']) {
            res.status(400).json({
                error: 'Request data is incorrect or unfulfilled',
            });
            return;
        }

        const token: string = req.headers['x-access-token'] as string;
        const decodedToken = authentication.verifyToken(token);
        if (!decodedToken.isAdmin) {
            res.sendStatus(403); return;
        }

        const { library: libraryData }: { library: Library } = req.body || {};

        if (!libraryData || !checkLibraryRequiredFields(libraryData)) {
            res.status(400).json({
                error: 'User data is incorrect or unfulfilled',
            });
            return;
        }

        try {
            await libraryService.create(libraryData);
            res.sendStatus(201);
        } catch (error: any) {
            console.error('Error creating library:', error.message);
            const statusCode = error.status || 500;
            const errorDetails = {
                details: error.message || 'An unexpected error occurred',
                error: 'Failed to create library',
            };
            res.status(statusCode).json(errorDetails);
        }
    },

    /**
             * Retrieve a library by Id.
             */
    getById: async (req: Request, res: Response): Promise<void> => {
        if (!req?.headers?.['x-access-token']
            || !req?.query?.id) {
            res.sendStatus(400); return;
        }

        const token = req.headers['x-access-token'] as string;
        const decodedToken = authentication.verifyToken(token);
        if (!decodedToken) {
            res.status(403).json({
                error: 'Token is expired or invalid',
            });
            return;
        }

        const id: number = parseInt(req.query.id as string, 10);
        if (Number.isNaN(id)) {
            res.sendStatus(400); return;
        }

        try {
            const library: Library | null = await libraryService.getById(String(id));
            if (!library) {
                res.sendStatus(404); return;
            }
            res.status(200).json(library);

        } catch (error: any) {
            console.error('Error retrieving library:', error.message);
            const statusCode = error.status || 500;
            const errorDetails = {
                details: error.message || 'An unexpected error occurred',
                error: 'Failed to retrieve library',
            };
            res.status(statusCode).json(errorDetails);
        }
    },

    getAll: async (req: Request, res: Response): Promise<void> => {
        if (!req?.headers?.['x-access-token']) {
            res.sendStatus(400); return;
        }

        const token: string = req.headers['x-access-token'] as string;
        if (!authentication.verifyToken(token)) {
            res.sendStatus(403); return;
        }
        try {
            const bookList: Library[] | null = await libraryService.getAll();
            if (!bookList) {
                res.sendStatus(404); return;
            }
            if (bookList.length === 0) {
                res.sendStatus(204); return;
            }
            res.status(200).json(bookList);
        } catch (error: any) {
            console.error('Error retrieving all library:', error);
            res.status(500).json({
                details: error.message,
                error: 'Failed to retrieve all library',
            });
        }
    },
};
