import { Server as HttpServer } from 'http';
import { Server as WSServer, WebSocket } from 'ws';
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
		if (client.OPEN && (!moderatorOnly || client.user.moderator))
			client.send(JSON.stringify({ e: event, d: data }));
	});
};

export function getParams(
	url = ''
): [token: string | null, user: string | null] {
	const { searchParams } = new URL(url, 'http://example.com');
	return [searchParams.get('token'), searchParams.get('user')];
}

function noop() {}

function initWebSocket(app: Express, server: HttpServer) {
	const wss = new WSServer({ server, path: '/gateway', verifyClient });

	// Pass WS server to requests
	app.use((req, res, next) => {
		req.wss = wss;
		next();
	});

	wss.on('connection', async (client, req) => {
		client.isAlive = true;

		const [, id] = getParams(req.url);
		const user = await User.findById(id);

		if (!user) return client.close();
		client.user = user;

		client.on('pong', function () {
			(this as WebSocket).isAlive = true;
		});

		console.log('WS client connected');
	});

	// Schedule client pings
	wss.on('listening', () => {
		const timer = setInterval(() => {
			wss.clients.forEach(client => {
				if (!client.isAlive) return client.terminate();

				client.isAlive = false;
				client.ping(noop);
			});
		}, 3e4);

		wss.on('close', () => clearInterval(timer));
	});
}

export default initWebSocket;
