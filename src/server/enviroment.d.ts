import { IUser } from './models/user';
import { IChannel } from './models/channel';
import { IMessage } from './models/message';

declare global {
	namespace Express {
		interface User extends IUser {}

		interface Request {
			channel: IChannel;
			message: IMessage;
		}
	}
}
