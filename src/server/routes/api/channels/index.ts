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

// Create a new channel
router.post(
	'/',
	checkMod(),
	channelValidator,
	asyncHandler(async (req, res) => {
		const priv: boolean = req.body.private ?? false;
		const name: string = req.body.name
			.toLowerCase()
			.trimStart()
			.replace(/\s/g, '-')
			.replace(/-{2,}/g, '-')
			.replace(/(^-|-$)/g, '');

		// Check that name is unique
		const existing = await Channel.findOne({ name });
		if (existing) {
			return res.status(409).json({
				status: 409,
				message: 'Channel with name already exists.',
			});
		}

		// Create and save channel
		const channel = new Channel({
			name,
			private: priv,
			author: req.user,
		});

		await channel.save();
		req.wss.broadcast('CHANNEL_CREATE', channel, priv);

		res.json(channel);
	})
);

// Middleware to find channels by ID
router.use(
	'/:id',
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

// Edit a channel
router.patch('/:id', checkMod(), channelValidator, async (req, res) => {
	const priv: boolean = req.body.private ?? false;
	const name: string = req.body.name.toLowerCase();

	// Update and save channel
	if (name) req.channel.name = name;
	req.channel.private = priv;

	await req.channel.save();
	req.wss.broadcast('CHANNEL_EDIT', req.channel, priv);

	res.json(req.channel);
});

// Delete a channel
router.delete(
	'/:id',
	checkMod(),
	asyncHandler(async (req, res) => {
		await req.channel.delete();
		req.wss.broadcast('CHANNEL_DELETE', req.channel);

		res.json({
			status: 200,
			message: 'Channel deleted.',
		});
	})
);

export default router;
