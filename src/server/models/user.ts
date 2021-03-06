import { Schema, model, Document } from 'mongoose';
import { generateID } from '../util/db';

export interface IUser extends Document {
	_id: string;
	username: string;
	email: string;
	password: string;
	moderator: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export const UserSchema = new Schema(
	{
		_id: String,
		username: {
			type: String,
			required: true,
			minlength: 1,
			maxlength: 20,
			trim: true,
		},
		email: { type: String, required: true, minlength: 1 },
		password: { type: String, required: true, minlength: 1 },
		moderator: { type: Boolean, required: false, default: false },
	},
	{ timestamps: true }
);

UserSchema.pre('save', generateID);

const User = model<IUser>('User', UserSchema);

export default User;
