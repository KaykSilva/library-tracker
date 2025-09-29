import { Request, Response } from 'express';
import { Book } from '../../models/Book';
import authentication from '../../authentication';
import bookService from '../services/bookService';


function checkBookRequiredFields(book: Book): boolean {
    const requiredFields: (keyof Book)[] = [
        'author', 'available', 'city', 'copies', 'createdAt',
        'cdd', 'edition', 'id', 'idCutter', 'publisher',
        'releaseDate', 'title', 'updatedAt'
    ];
    return requiredFields.every((field) => {
        return book[field as keyof Book] !== undefined
            && book[field as keyof Book] !== null;
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

        const { book: bookData }: { book: Book } = req.body || {};

        if (!bookData || !checkBookRequiredFields(bookData)) {
            res.status(400).json({
                error: 'User data is incorrect or unfulfilled',
            });
            return;
        }

        try {
            await bookService.create(bookData);
            res.sendStatus(201);
        } catch (error: any) {
            console.error('Error creating admin:', error.message);
            const statusCode = error.status || 500;
            const errorDetails = {
                details: error.message || 'An unexpected error occurred',
                error: 'Failed to create admin',
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
            const bookList: Book[] | null = await bookService.getAll();
            if (!bookList) {
                res.sendStatus(404); return;
            }
            if (bookList.length === 0) {
                res.sendStatus(204); return;
            }
            res.status(200).json(bookList);
        } catch (error: any) {
            console.error('Error retrieving all groups:', error);
            res.status(500).json({
                details: error.message,
                error: 'Failed to retrieve all groups',
            });
        }
    },


    /**
         * Retrieve a admin by Id.
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
            const book: Book | null = await bookService.getById(String(id));
            if (!book) {
                res.sendStatus(404); return;
            }
            res.status(200).json(book);

        } catch (error: any) {
            console.error('Error retrieving admin:', error.message);
            const statusCode = error.status || 500;
            const errorDetails = {
                details: error.message || 'An unexpected error occurred',
                error: 'Failed to retrieve admin',
            };
            res.status(statusCode).json(errorDetails);
        }
    },


    update: async (req: Request, res: Response): Promise<void> => {
        if (!req?.body
            || !req?.headers?.['x-access-token']
            || !req?.query?.id) {
            res.sendStatus(400); return;
        }

        const { ...bookData }: Book = req.body;
        const id: number = parseInt(req.query.id as string, 10);
        if (Number.isNaN(id)) {
            res.sendStatus(400); return;
        }

        const token: string = req.headers['x-access-token'] as string;
        const decodedToken = authentication.verifyToken(token);
        if (!decodedToken.isAdmin) {
            res.sendStatus(403); return;
        }

        const idData = String(id);

        try {
            if (!await bookService.getById(idData)) {
                res.sendStatus(404); return;
            }

            await bookService.update(idData, bookData);
            res.sendStatus(200);
        } catch (error: any) {
            console.error('Error updating group info:', error);
            res.status(500).json({
                details: error.message,
                error: 'Failed to update group info',
            });
        }
    },

    delete: async (req: Request, res: Response): Promise<void> => {
        if (!req?.headers?.['x-access-token']
            || !req?.query?.id) {
            res.sendStatus(400); return;
        }

        const token: string = req.headers['x-access-token'] as string;
        const decodedToken = authentication.verifyToken(token);
        if (!decodedToken.isAdmin) {
            res.sendStatus(403); return;
        }

        const id: number = parseInt(req.query.id as string, 10);
        if (Number.isNaN(id)) {
            res.sendStatus(400); return;
        }

        const idData = String(id);

        try {
            const book: Book | null = await bookService.getById(idData);
            if (!book) {
                res.sendStatus(404); return;
            }
            await bookService.delete(idData);
            res.sendStatus(204);
        } catch (error: any) {
            console.error('Error removing group:', error);
            res.status(500).json({
                details: error.message,
                error: 'Failed to delete group',
            });
        }
    },
};
