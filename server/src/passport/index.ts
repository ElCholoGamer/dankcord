import passport from 'passport';
import User from '../models/user';
import loginStrategy from './login-strategy';
import registerStrategy from './register-strategy';

function initPassport() {
	passport.serializeUser((user, done) => done(null, user._id));
	passport.deserializeUser(async (id, done) => {
		const user = await User.findById(id);
		done(null, user ?? undefined);
	});

	passport.use('local-login', loginStrategy);
	passport.use('local-register', registerStrategy);
}

export default initPassport;
