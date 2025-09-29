import { Request, Response, Router } from 'express';
import authentication from '../authentication';
import bookController from '../database/controllers/bookController';

const router = Router();
const handlers = [
    {
        key: 'id',
        handler: bookController
            .getById,
    },
];

router.get(
    '/',
    authentication.verifyJWT,
    (req: Request, res: Response) => {
        const queryKeys = Object.keys(req.query).sort();
        const handler = handlers.find((item) => {
            return queryKeys.includes(item.key);
        });

        if (handler) return handler.handler(req, res);
        return bookController.getAll(req, res);
    },
);
router.put(
    '/:id(\\d+)',
    authentication.verifyJWT,
    bookController.update,
);
router.delete(
    '/:id(\\d+)',
    authentication.verifyJWT,
    bookController.delete,
);