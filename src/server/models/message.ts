import { Schema, model, Document } from 'mongoose';
import { generateID } from '../util/db';

export interface IMessage extends Document {
	_id: string;
	content: string;
	author: string;
	channel: string;
	createdAt: Date;
	updatedAt: Date;
}

const MessageSchema = new Schema(
	{
		_id: String,
		content: { type: String, required: true, minLength: 1, maxLength: 2000 },
		author: { type: String, required: true },
		channel: { type: String, required: true },
	},
	{ timestamps: true }
);

MessageSchema.pre('save', generateID);

const Message = model<IMessage>('Message', MessageSchema);

export default Message;
