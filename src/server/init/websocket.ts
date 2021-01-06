import { Server as HttpServer } from 'http';
import { Server as WSServer } from 'ws';

function initWebSocket(server: HttpServer) {
	const wss = new WSServer({ server, path: '/gateway' });

	wss.on('connection', () => console.log('WS connected!'));
}

export default initWebSocket;
