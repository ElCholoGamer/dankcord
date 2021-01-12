import { VerifyClientCallbackAsync } from 'ws';
import User from '../models/user';
import getWsInfo from './get-ws-info';

const verifyClient: VerifyClientCallbackAsync = async (info, done) => {
	const [token, id] = getWsInfo(info.req.url);
	if (!token || !id) return done(false, 401, 'Unauthenticated.');

	// Find user with token
	const user = await User.findOne({ _id: id, token });
	if (user) {
		user.token = undefined;
		await user.save();
		done(true);
	} else {
		done(false, 401, 'Unauthenticated.');
	}
};

export default verifyClient;
