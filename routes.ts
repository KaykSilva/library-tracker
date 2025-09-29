import { Router } from 'express';
import authentication from './authentication';

const router: Router = Router();
router.post('/login', authentication.login);

const routePaths: string[] = [
    '/admin',
    '/book',
];

routePaths.forEach(async (path) => {
    const routeModule = await import(`./routes/${path.split('/')[1]}Routes`);
    router.use(path, routeModule.default);
});

export default router;
