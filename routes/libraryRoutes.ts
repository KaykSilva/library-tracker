import { Request, Response, Router } from 'express';
import authentication from '../authentication';
import libraryController from '../database/controllers/libraryController';

const router = Router();
const handlers = [
    {
        key: 'id',
        handler: libraryController
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
        return libraryController.getAll(req, res);
    },
);

router.post(
    '/',
    authentication.verifyJWT,
    libraryController.create,
);
