import { Router } from 'express';
import authenticate from '../../middleware/authenticate';
import usersRouter from './users';
import channelsRouter from './channels';

const router = Router();

router.use(authenticate());

router.use('/users', usersRouter);
router.use('/channels', channelsRouter);

export default router;
