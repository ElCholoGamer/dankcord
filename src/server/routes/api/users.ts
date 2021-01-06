import { Router } from 'express';
import asyncHandler from '../../util/async-handler';

const router = Router();

// Get a user by ID
router.get(
	'/:id',
	asyncHandler(async (req, res) => {})
);

export default router;
