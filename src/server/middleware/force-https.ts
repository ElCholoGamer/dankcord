import { RequestHandler } from 'express';

interface Options {
	checkEnv?: boolean;
}

function forceHttps(options: Options = {}): RequestHandler {
	const { checkEnv = true } = options;

	return (req, res, next) => {
		if (!req.secure && (!checkEnv || process.env.NODE_ENV === 'production')) {
			res.redirect(`https://${req.headers.host}${req.url}`);
		} else {
			next();
		}
	};
}

export default forceHttps;
