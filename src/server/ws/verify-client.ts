import { VerifyClientCallbackAsync } from 'ws';
import { parse } from 'cookie';
import { signedCookie } from 'cookie-parser';
import { Document } from 'mongoose';
import Session from '../models/session';
import User, { IUser } from '../models/user';

export type SecureUser = Omit<IUser, 'password' | keyof Document>;

const verifyClient: VerifyClientCallbackAsync = async ({ req }, done) => {
	// Parse session ID cookie
	const cookie = parse(req.headers.cookie ?? '');
	const sessionID = signedCookie(
		cookie['connect.sid'],
		process.env.SESSION_SECRET ?? ''
	);
	if (!sessionID) return done(false, 401, 'Unauthenticated.');

	// Find session in database
	const session = await Session.findById(sessionID);
	if (!session) return done(false, 401, 'Unauthenticated.');

	// Find user by the ID on the session
	const { passport } = JSON.parse(session.session);
	const user = await User.findById(passport.user);
	if (!user) return done(false, 401, 'Unauthenticated.');

	const clone: any = user.toObject();

	delete clone.password;
	delete clone.__v;

	req.user = clone;
	done(true);
};

export default verifyClient;
