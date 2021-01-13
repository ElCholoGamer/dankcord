import { Schema, model, Document } from 'mongoose';

export interface ISession extends Document {
	_id: string;
	expires: Date;
	session: string;
}

const SessionSchema = new Schema({
	_id: String,
	expires: { type: Date, required: true },
	session: { type: String, required: true },
});

const Session = model<ISession>('Session', SessionSchema);

export default Session;
