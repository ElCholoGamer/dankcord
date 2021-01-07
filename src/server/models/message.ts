import { Schema, model, Document } from 'mongoose';
import { generateID } from '../util/db';
import { IUser, UserSchema } from './user';

export interface IMessage extends Document {
	_id: string;
	content: string;
	author: IUser;
	channel: string;
	createdAt: Date;
	updatedAt: Date;
}

export const MessageSchema = new Schema(
	{
		_id: String,
		content: { type: String, required: true, minLength: 1, maxLength: 2000 },
		author: { type: UserSchema, required: true },
		channel: { type: String, required: true },
	},
	{ timestamps: true }
);

MessageSchema.pre('save', generateID);

const Message = model<IMessage>('Message', MessageSchema);

export default Message;
