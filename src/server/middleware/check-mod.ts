import { RequestHandler } from 'express';

interface Options {
	responseStatus?: number;
	responseMessage?: string;
}

function checkMod(options: Options = {}): RequestHandler {
	const { responseStatus = 403, responseMessage = 'Unauthorized.' } = options;

	return (req, res, next) => {
		if (!req.user?.moderator) {
			res.status(responseStatus).json({
				status: responseStatus,
				message: responseMessage,
			});
		} else {
			next();
		}
	};
}

export default checkMod;
