import { IUser } from './models/user';
import { IChannel } from './models/channel';
import { IMessage } from './models/message';
import WS, { Server as WSServer } from 'ws';

declare global {
	namespace Express {
		interface User extends IUser {}

		interface Request {
			channel: IChannel;
			message: IMessage;
			wss: WSServer;
		}
	}
}

declare module 'ws' {
	interface Server {
		broadcast(event: string, data: {}, moderatorOnly?: boolean): void;
	}

	interface WebSocket extends WS {
		moderator: boolean;
	}
}
