import { IUser } from '../models/user';

const sanitizeUser = (user: IUser) => {
	const clone = user.toObject();
	return {
		...clone,
		id: clone._id,
		_id: undefined,
		password: undefined,
		email: undefined,
		__v: undefined,
	};
};

export default sanitizeUser;
