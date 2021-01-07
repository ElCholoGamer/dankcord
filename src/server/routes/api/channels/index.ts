import { Router } from 'express';
import checkMod from '../../../middleware/check-mod';
import validator from '../../../middleware/validator';
import Channel from '../../../models/channel';
import asyncHandler from '../../../util/async-handler';
import messagesRouter from './messages';

const router = Router();

const channelValidator = validator({
	name: { type: 'string', minLength: 1, maxLength: 20 },
	private: { type: 'boolean', required: false },
});

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

router.get('/:id', (req, res) => res.json(req.channel)); // Get a channel by ID
router.use('/:id/messages', messagesRouter); // Messages router

// Moderator-only routes
router.use(checkMod());

// Create a new channel
router.post(
	'/',
	checkMod(),
	channelValidator,
	asyncHandler(async (req, res) => {
		// Create and save channel
		const { name, private: priv = false } = req.body;
		const channel = await Channel.create({
			name,
			private: priv,
			author: req.user!._id,
		});

		// TODO: Emit 'CHANNEL_CREATE' event
		res.json(channel);
	})
);

// Edit a channel
router.patch('/:id', channelValidator, async (req, res) => {
	const { name, private: priv = false } = req.body;

	// Update and save channel
	if (name) req.channel.name = name;
	req.channel.private = priv;
	await req.channel.save();

	// TODO: Emit 'CHANNEL_EDIT' event
	res.json(req.channel);
});

// Delete a channel
router.delete(
	'/:id',
	asyncHandler(async (req, res) => {
		await req.channel.delete();

		// TODO: Emit 'CHANNEL_DELETE' event
		res.json({
			status: 200,
			message: 'Channel deleted.',
		});
	})
);

export default router;
