import { Server as HttpServer } from 'http';
import { Server as WSServer, VerifyClientCallbackAsync } from 'ws';
import { Express } from 'express';
import { URL } from 'url';
import User from '../models/user';

const verifyClient: VerifyClientCallbackAsync = async (info, done) => {
	const url = new URL(info.req.url ?? '', 'http://example.com');

	// Get token from query params
	const token = url.searchParams.get('token');
	if (!token) return done(false);

	// Find user with token
	const user = await User.findOne({ token });
	if (user) {
		user.token = undefined;
		await user.save();
	}

	done(!!user);
};

function initWebSocket(app: Express, server: HttpServer) {
	const wss = new WSServer({ server, path: '/gateway', verifyClient });

	// Pass WS server to requests
	app.use((req, res, next) => {
		req.wss = wss;
		next();
	});

	wss.on('connection', () => console.log('WS connected!'));
}

export default initWebSocket;
