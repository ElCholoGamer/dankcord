import { Router } from 'express';
import validator from '../../../middleware/validator';
import Channel from '../../../models/channel';
import asyncHandler from '../../../util/async-handler';
import messagesRouter from './messages';

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

// Create a new channel
router.post(
	'/',
	validator({
		name: { type: 'string', minLength: 1, maxLength: 20 },
		private: { type: 'boolean', required: false },
	}),
	asyncHandler(async (req, res) => {
		// Check that user is moderator
		if (!req.user?.moderator) {
			return res.status(403).json({
				status: 403,
				message: 'Unauthorized.',
			});
		}

		// Create and save channel
		const { name, private: priv = false } = req.body;
		const channel = await Channel.create({
			name,
			private: priv,
			author: req.user._id,
		});

		// TODO: Emit 'CHANNEL_CREATE' event
		res.json(channel);
	})
);

// Middleware to find channels by ID
router.use(
	asyncHandler(async (req, res, next) => {
		const { id } = req.params;
		const channel = await Channel.findById(id);

		// Check that channel was found
		if (!channel) {
			return res.status(404).json({
				status: 404,
				message: `Channel by ID "${id}" not found.`,
			});
		}

		// Check that user has permission to access channel
		if (!req.user?.moderator && channel.private) {
			return res.status(403).json({
				status: 403,
				message: 'Unauthorized.',
			});
		}

		req.channel = channel;
		next();
	})
);

// Get a channel by ID
router.get('/:id', (req, res) => res.json(req.channel));

// Messages router
router.use('/:id/messages', messagesRouter);

export default router;
