import { Router } from 'express';
import authenticate from '../../middleware/authenticate';
import usersRouter from './users';
import channelsRouter from './channels';

const router = Router();

router.use(authenticate());

// Idk what to put here
router.get('/', (req, res) => res.json({ hello: 'world' }));

router.use('/users', usersRouter);
router.use('/channels', channelsRouter);

export default router;
