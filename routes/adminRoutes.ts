import { Request, Response, Router } from 'express';
import adminController from '../database/controllers/userController';
import authentication from '../authentication';

const router = Router();
const handlers = [
    {
        key: 'cpf',
        handler: adminController
            .getByCPF,
    },
    {
        key: 'id',
        handler: adminController
            .getById,
    },
    {
        key: 'name',
        handler: adminController
            .getByName,
    },
    {
        key: 'userId',
        handler: adminController
            .getByUserId,
    },
];

router.post(
    '/',
    authentication.verifyJWT,
    adminController.create,
);
router.get(
    '/',
    authentication.verifyJWT,
    (req: Request, res: Response) => {
        const queryKeys = Object.keys(req.query).sort();
        const handler = handlers.find((item) => {
            return queryKeys.includes(item.key);
        });

        if (handler) return handler.handler(req, res);
        return adminController.getAll(req, res);
    },
);
router.put(
    '/',
    authentication.verifyJWT,
    adminController.update,
);
router.delete(
    '/',
    authentication.verifyJWT,
    adminController.delete,
);

export default router;
