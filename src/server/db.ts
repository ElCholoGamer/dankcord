import { Document, connect, NativeError, Model } from 'mongoose';

const connectDatabase = (uri: string) =>
	connect(uri, {
		useUnifiedTopology: true,
		useNewUrlParser: true,
	});

export async function generateID(
	this: Document,
	done: (err?: NativeError | null | undefined) => void
) {
	if (this._id) return done();

	let id;
	const model = this.constructor as Model<any>;

	do {
		const num = Math.floor(Math.random() * 1e18);
		id = num.toString().padStart(18, '0');
	} while (await model.findById(id));

	this._id = id;
	done();
}

export default connectDatabase;
