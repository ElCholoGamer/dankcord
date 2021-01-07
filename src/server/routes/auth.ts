import { Router, Request, Response } from 'express';
import { IVerifyOptions } from 'passport-local';
import passport from 'passport';
import { IUser } from '../models/user';
import validator from '../middleware/validator';
import asyncHandler from '../util/async-handler';
import authenticate from '../middleware/authenticate';
import User from '../models/user';

const router = Router();

const authCallback = (req: Request, res: Response) => (
	err: any,
	user: IUser,
	info: IVerifyOptions | undefined
) => {
	if (err) {
		console.error(err);
		return res.status(500).json({ status: 500, error: err });
	}

	if (!user) {
		return res.status(401).json({
			status: 401,
			message: info?.message || '[No message provided]',
		});
	}

	req.login(user, err => {
		if (err) {
			console.error(err);
			res.status(500).json({ status: 500, error: err });
		} else {
			res.json(user);
		}
	});
};

router.post(
	'/register',
	validator({
		username: 'string',
		password: 'string',
		email: 'string',
	}),
	(req, res) => {
		passport.authenticate('local-register', authCallback(req, res))(req, res);
	}
);

router.post(
	'/login',
	validator({ username: 'string', password: 'string' }),
	(req, res) => {
		passport.authenticate('local-login', authCallback(req, res))(req, res);
	}
);

// Log out user session
router.post('/logout', (req, res) => {
	req.logout();
	res.json({
		status: 200,
		message: 'Logged out.',
	});
});

// Generate auth token for WebSocket
router.post(
	'/wstoken',
	authenticate(),
	asyncHandler(async (req, res) => {
		let token: string;

		do {
			token = [...Array(6)]
				.map(() => Math.random().toString(16).substr(3))
				.join('');
		} while (await User.findOne({ token }));

		req.user!.token = token;
		await req.user?.save();

		res.json({
			status: 200,
			token,
		});
	})
);

export default router;
