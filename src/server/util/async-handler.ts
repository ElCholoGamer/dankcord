import { RequestHandler } from 'express';

const asyncHandler = (handler: RequestHandler): RequestHandler => async (
	req,
	res,
	next
) => {
	try {
		await handler(req, res, next);
	} catch (err) {
		next(err);
	}
};

export default asyncHandler;
