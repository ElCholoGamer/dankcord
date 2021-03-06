import { IUser } from './models/user';
import { IChannel } from './models/channel';
import { IMessage } from './models/message';
import ws, { Server as WSServer } from 'ws';
import { SecureUser } from './ws/verify-client';

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

declare module 'http' {
	interface IncomingMessage {
		wsUser: IUser;
	}
}

declare module 'ws' {
	interface Server {
		broadcast(event: string, data: {}, moderatorOnly?: boolean): void;
		broadcast(
			event: 'MESSAGE_CREATE',
			data: IMessage,
			moderatorOnly?: boolean
		): void;
		broadcast(
			event: 'MESSAGE_EDIT',
			data: IMessage,
			moderatorOnly?: boolean
		): void;
		broadcast(
			event: 'MESSAGE_DELETE',
			data: IMessage,
			moderatorOnly?: boolean
		): void;
		broadcast(
			event: 'CHANNEL_CREATE',
			data: IChannel,
			moderatorOnly?: boolean
		): void;
		broadcast(
			event: 'CHANNEL_EDIT',
			data: IChannel,
			moderatorOnly?: boolean
		): void;
		broadcast(
			event: 'CHANNEL_DELETE',
			data: IChannel,
			moderatorOnly?: boolean
		): void;
		broadcast(event: 'USER_JOIN', data: IUser, moderatorOnly?: boolean): void;
		broadcast(event: 'USER_LEAVE', data: IUser, moderatorOnly?: boolean): void;
	}

	interface WebSocket extends ws {
		user: IUser;
		isAlive: boolean;
		ready: boolean;
	}
}
