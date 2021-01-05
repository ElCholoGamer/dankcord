import express from 'express';
import { resolve, join } from 'path';

const router = express.Router();

const BUILD = resolve(__dirname, '../../build');
router.use(express.static(BUILD));

const indexHtml = join(BUILD, 'index.html');

router.get('*', (req, res, next) => {
	if (req.headers.accept?.indexOf('text/html') !== -1) {
		res.sendFile(indexHtml);
	} else {
		next();
	}
});

export default router;
