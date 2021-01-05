import { hash } from 'bcrypt';
import { Strategy as LocalStrategy } from 'passport-local';
import User from '../models/user';

// This regex isnt mine btw
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*$/;

const registerStrategy = new LocalStrategy(
	{
		usernameField: 'username',
		passwordField: 'password',
		passReqToCallback: true,
	},
	async (req, username, password, done) => {
		username = username.trim();
		const email: string = req.body.email.toLowerCase().trim();

		// Validate email
		if (!EMAIL_REGEX.test(email)) {
			return done(null, false, { message: 'The provided email is invalid' });
		}

		// Check if user with email already exists
		let existing = await User.findOne({ email });
		if (existing) {
			return done(null, false, { message: 'Email is already registered' });
		}

		// Check if username already exists
		existing = await User.findOne({ username });
		if (existing) {
			return done(null, false, { message: 'Username is already in use' });
		}

		// Validate username
		if (username.length > 20) {
			return done(null, false, { message: 'Username is too long' });
		}

		// Validate password
		if (password.length < 4) {
			return done(null, false, {
				message: 'Password must have a minimum of 4 characters',
			});
		}

		// Create user document
		password = await hash(password, 10);
		const user = new User({
			email,
			username,
			password,
		});
		await user.save();

		done(null, user);
	}
);

export default registerStrategy;
