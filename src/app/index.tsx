import React, { StrictMode } from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

render(
	<StrictMode>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</StrictMode>,
	document.getElementById('root')
);

if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
	window.addEventListener('load', () => {
		navigator.serviceWorker
			.register('/service-worker.js')
			.then(reg => console.log('SW registration succeede. Scope:', reg.scope))
			.catch(err => console.log('SW registration failed: ', err));
	});
}
