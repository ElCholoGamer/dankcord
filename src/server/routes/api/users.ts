import { Router } from 'express';
import User from '../../models/user';
import asyncHandler from '../../util/async-handler';

const router = Router();

// Get a user by ID
router.get(
	'/:id',
	asyncHandler(async (req, res) => {
		const id = req.params.id;
		if (id === '@me') {
			return res.json({
				status: 200,
				user: req.user,
			});
		}

		const user = await User.findById(id);
		if (!user) {
			return res.status(404).json({
				status: 404,
				message: `User by ID "${id}" not found`,
			});
		}

		res.json({
			status: 200,
			user,
		});
	})
);

export default router;
