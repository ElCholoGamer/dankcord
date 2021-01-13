import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import session from 'express-session';
import { createServer } from 'http';
import { config } from 'dotenv';
import connectMongo from 'connect-mongo';
import mongoose from 'mongoose';
import rateLimit from 'express-rate-limit';
import initWebSocket from './ws/init';
import connectDatabase from './util/db';
import initPassport from './passport';
import passport from 'passport';
import authRouter from './routes/auth';
import indexRouter from './routes';
import apiRouter from './routes/api';
import jsonReplacer from './util/json-replacer';
import forceHttps from './middleware/force-https';
config();

// Enviroment stuff
const SESSION_SECRET = (process.env.SESSION_SECRET ||= 'poggers');

const { MONGODB_URI } = process.env;
if (!MONGODB_URI) throw new Error('"MONGODB_URI" env variable missing');

const NODE_ENV = (process.env.NODE_ENV ||= process.argv.includes('-d')
	? 'development'
	: 'production');

const app = express();
const server = createServer(app);
const MongoStore = connectMongo(session);

// Initialization
initPassport();
initWebSocket(app, server);

// Settings
app.enable('trust proxy');
app.set('json replacer', jsonReplacer(['password', '__v', 'token', 'email']));

// Middleware
app.use(forceHttps());
app.use(cors());
app.use(express.json());
if (NODE_ENV === 'development') app.use(morgan('dev'));
app.use(
	session({
		secret: SESSION_SECRET,
		saveUninitialized: false,
		resave: false,
		store: new MongoStore({ mongooseConnection: mongoose.connection }),
		cookie: { secure: NODE_ENV === 'production' },
	})
);
app.use(passport.initialize());
app.use(passport.session());

// API rate limiter
app.use(
	'/api',
	rateLimit({
		windowMs: 60 * 1000, // 1 minute
		max: 120, // 120 requests per minute
		handler(req, res) {
			const now = Date.now();
			res.status(429).json({
				status: 429,
				message: 'You are being rate limited.',
				remaining: (req.rateLimit.resetTime?.getTime() ?? now) - now,
			});
		},
	})
);

// Other routes
app.use('/auth', authRouter);
app.use('/api', apiRouter);

// Static public files or index router
app.use(NODE_ENV === 'development' ? express.static('public') : indexRouter);

// 404 route
app.all('*', (req, res) => {
	res.status(404).json({ status: 404, message: 'Not found' });
});

// Connect to database
connectDatabase(MONGODB_URI)
	.then(() => {
		console.log('Database connected!');

		// Listening
		const { PORT = 8080 } = process.env;
		server.listen(PORT, () => console.log(`App listening on port ${PORT}...`));
	})
	.catch(console.error);
