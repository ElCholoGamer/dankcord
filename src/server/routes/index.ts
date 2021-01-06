import express from 'express';
import { join } from 'path';

const router = express.Router();

router.use(express.static('build'));

router.get('*', (req, res, next) => {
	if (req.headers.accept?.indexOf('text/html') !== -1) {
		res.sendFile(join(process.cwd(), 'build/index.html'));
	} else {
		next();
	}
});

export default router;
