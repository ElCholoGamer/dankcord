import { Router } from 'express';
import authenticate from '../../middleware/authenticate';
import usersRouter from './users';

const router = Router();

router.use(authenticate());
router.use('/users', usersRouter);

export default router;
