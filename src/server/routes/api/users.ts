import { Router } from 'express';
import validator from '../../middleware/validator';
import User from '../../models/user';
import asyncHandler from '../../util/async-handler';

const router = Router();

// Get self user
router.get('/@me', (req, res) => res.json(req.user));

// Get a user by ID
router.get(
	'/:id',
	asyncHandler(async (req, res) => {
		const { id } = req.params;

		const user = await User.findById(id);
		if (!user) {
			return res.status(404).json({
				status: 404,
				message: `User by ID "${id}" not found`,
			});
		}

		res.json(user);
	})
);

// Edit self user
router.patch(
	'/@me',
	validator({
		username: { type: 'string', minLength: 1, maxLength: 20 },
	}),
	asyncHandler(async (req, res) => {
		req.user!.username = req.body.username;
		await req.user?.save();

		res.json(req.user);
	})
);

export default router;
