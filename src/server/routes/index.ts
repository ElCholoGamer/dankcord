import express from 'express';

const router = express.Router();

router.use(express.static('build'));

router.get('*', (req, res, next) => {
	if (req.headers.accept?.indexOf('text/html') !== -1) {
		res.sendFile('build/index.html');
	} else {
		next();
	}
});

export default router;
