import { Router, Request, Response } from 'express';
import { IVerifyOptions } from 'passport-local';
import passport from 'passport';
import { IUser } from '../models/user';
import validator from '../middleware/validator';

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
			res.json({ status: 200, user });
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
		message: 'Logged out successfully',
	});
});

export default router;
