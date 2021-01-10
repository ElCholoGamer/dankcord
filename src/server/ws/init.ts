import { Server as HttpServer } from 'http';
import { Server as WSServer } from 'ws';
import { Express } from 'express';
import { URL } from 'url';
import verifyClient from './verify-client';
import User from '../models/user';

// Broadcast function
WSServer.prototype.broadcast = function (
	event: string,
	data: {},
	moderatorOnly = false
) {
	this.clients.forEach(client => {
		if (client.OPEN && (!moderatorOnly || client.moderator))
			client.send(JSON.stringify({ event, data }));
	});
};

export function getParams(
	url = ''
): [token: string | null, user: string | null] {
	const { searchParams } = new URL(url, 'http://example.com');
	return [searchParams.get('token'), searchParams.get('user')];
}

function initWebSocket(app: Express, server: HttpServer) {
	const wss = new WSServer({ server, path: '/gateway', verifyClient });

	// Pass WS server to requests
	app.use((req, res, next) => {
		req.wss = wss;
		next();
	});

	wss.on('connection', async (client, req) => {
		const [, id] = getParams(req.url);

		// Find client user
		const user = await User.findById(id);
		if (!user) return client.close();

		client.moderator = user?.moderator ?? false;

		console.log('WebSocket connected!');
	});
}

export default initWebSocket;
