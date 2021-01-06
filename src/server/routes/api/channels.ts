import { Router } from 'express';
import Channel from '../../models/channel';
import asyncHandler from '../../util/async-handler';

const router = Router();

// Get all channels
router.get(
	'/',
	asyncHandler(async (req, res) => {
		const channels = await Channel.find(
			req.user?.moderator ? {} : { private: false }
		);
		res.json(channels);
	})
);

// Get a channel by ID
router.get(
	'/:id',
	asyncHandler(async (req, res) => {
		const id = req.params.id;
		const channel = await Channel.findById(id);

		if (!channel) {
			return res.status(404).json({
				status: 404,
				message: `Channel by ID "${id}" not found.`,
			});
		}

		if (!req.user?.moderator && channel.private) {
			return res.status(403).json({
				status: 403,
				message: 'Unauthorized.',
			});
		}

		res.json(channel);
	})
);

export default router;
