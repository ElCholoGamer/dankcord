import { RequestHandler } from 'express';

interface Options {
	responseStatus?: number;
	responseMessage?: string;
}

function authenticate(options: Options = {}): RequestHandler {
	const {
		responseStatus = 403,
		responseMessage = 'Unauthorized request.',
	} = options;

	return (req, res, next) => {
		if (!req.isAuthenticated()) {
			res.status(responseStatus).json({
				status: responseStatus,
				message: responseMessage,
			});
		} else {
			next();
		}
	};
}

export default authenticate;
