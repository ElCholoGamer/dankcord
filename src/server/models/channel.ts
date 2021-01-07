import { Schema, model, Document } from 'mongoose';
import { generateID } from '../util/db';
import { IUser, UserSchema } from './user';

export interface IChannel extends Document {
	_id: string;
	name: string;
	author: IUser;
	private: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export const ChannelSchema = new Schema(
	{
		_id: String,
		name: { type: String, required: true, minlength: 1 },
		author: { type: UserSchema, required: true },
		private: { type: Boolean, required: true },
	},
	{ timestamps: true }
);

ChannelSchema.pre('save', generateID);

const Channel = model<IChannel>('Channel', ChannelSchema);

export default Channel;
