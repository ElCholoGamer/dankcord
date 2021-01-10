import { VerifyClientCallbackAsync } from 'ws';
import User from '../models/user';
import { getParams } from './init';

const verifyClient: VerifyClientCallbackAsync = async (info, done) => {
	const [token, id] = getParams(info.req.url);
	if (!token || !id) return done(false);

	// Find user with token
	const user = await User.findOne({ _id: id, token });
	if (user) {
		user.token = undefined;
		// await user.save();
	}

	done(!!user);
};

export default verifyClient;