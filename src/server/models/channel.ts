import { Schema, model, Document } from 'mongoose';
import { generateID } from '../db';

export interface IChannel extends Document {
	_id: string;
	name: string;
	author: string;
	private: boolean;
	createdAt: Date;
	updatedAt: Date;
}

const ChannelSchema = new Schema(
	{
		_id: String,
		name: { type: String, required: true, minlength: 1 },
		author: { type: String, required: true },
		private: { type: Boolean, required: true },
	},
	{ timestamps: true }
);

const Channel = model<IChannel>('Channel', ChannelSchema);

ChannelSchema.pre('save', generateID);

export default Channel;
