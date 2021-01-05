import express from 'express';
import { resolve, join } from 'path';

const router = express.Router();

const BUILD = resolve(__dirname, '../../build');
router.use(express.static(BUILD));

const indexHtml = join(BUILD, 'index.html');

router.get('*', (req, res, next) => {
	const { method, headers } = req;

	if (
		method.toUpperCase() === 'GET' &&
		headers.accept?.indexOf('text/html') !== -1 &&
		!req.path.startsWith('/api')
	) {
		res.sendFile(indexHtml);
	} else {
		next();
	}
});

export default router;
