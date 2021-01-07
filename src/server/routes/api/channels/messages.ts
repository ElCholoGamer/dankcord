import { Router } from 'express';
import validator from '../../../middleware/validator';
import Message from '../../../models/message';
import asyncHandler from '../../../util/async-handler';

const router = Router();

const messageValidator = validator({
	content: { type: 'string', minLength: 1, maxLength: 2000 },
});

// Get a channel's messages
router.get(
	'/',
	asyncHandler(async (req, res) => {
		const messages = await Message.find({ channel: req.channel.id });
		res.json(messages);
	})
);

// Middleware to find messages by ID
router.use(
	asyncHandler(async (req, res, next) => {
		const { params, channel } = req;
		const id = params.messageId;

		// Find message
		const message = await Message.findOne({
			_id: id,
			channel: channel.id,
		});

		// Check that message was found
		if (!message) {
			return res.status(404).json({
				status: 404,
				message: `Message by ID "${id}" not found.`,
			});
		}

		req.message = message;
		next();
	})
);

// Get a channel message by ID
router.get('/:messageId', (req, res) => res.json(req.message));

// Post a message
router.post(
	'/',
	messageValidator,
	asyncHandler(async (req, res) => {
		const message = new Message({
			channel: req.channel.id,
			content: req.body.content,
			author: req.user!.id,
		});

		await message.save();
		req.wss.broadcast('MESSAGE_CREATE', message);

		res.json(message);
	})
);

// Edit a message
router.patch(
	'/:messageId',
	messageValidator,
	asyncHandler(async (req, res) => {
		const { message, user } = req;

		// Check that user is message author
		if (message.author._id !== user!._id) {
			return res.status(403).json({
				status: 403,
				message: 'Unauthorized.',
			});
		}

		// Update and save message
		message.content = req.body.content;
		await message.save();
		req.wss.broadcast('MESSAGE_EDIT', message);

		res.json(message);
	})
);

// Delete a message by ID
router.delete(
	'/:messageId',
	asyncHandler(async (req, res) => {
		const { message } = req;

		// Check that user is the author or a moderator
		if (message.author._id !== req.user!._id && !req.user!.moderator) {
			return res.status(403).json({
				status: 403,
				message: 'Unauthorized.',
			});
		}

		await message.delete();
		req.wss.broadcast('CHANNEL_DELETE', message);

		res.json({
			status: 200,
			message: 'Message deleted.',
		});
	})
);

export default router;
