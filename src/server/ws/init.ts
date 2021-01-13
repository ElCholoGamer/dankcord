import { Server as HttpServer } from 'http';
import { Server as WSServer, WebSocket } from 'ws';
import { Express } from 'express';
import verifyClient from './verify-client';
import User from '../models/user';
import './broadcast';

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
		client.ready = false;
		client.user = req.user;

		client.on('pong', function () {
			(this as WebSocket).isAlive = true;
		});

		// Emit 'READY' event
		client.send(JSON.stringify({ e: 'READY', d: {} }));
		client.ready = true;

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
