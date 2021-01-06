import { Strategy as LocalStrategy } from 'passport-local';
import { compare } from 'bcrypt';
import User from '../models/user';

const loginStrategy = new LocalStrategy(
	{
		usernameField: 'email',
		passwordField: 'password',
	},
	async (email, password, done) => {
		const user = await User.findOne({ email });
		if (!user) {
			return done(null, false, { message: 'User not found' });
		}

		const match = await compare(password, user.password);
		if (!match) {
			return done(null, false, { message: 'Invalid password' });
		}

		done(null, user);
	}
);

export default loginStrategy;
