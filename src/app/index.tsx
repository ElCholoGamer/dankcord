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
			.then(reg => {
				console.log('SW registered with scope:', reg.scope);

				reg.addEventListener('updatefound', () => {
					const installingWorker = reg.installing;
					installingWorker?.addEventListener('statechange', () => {
						if (installingWorker.state !== 'installed') return;

						if (navigator.serviceWorker.controller) {
							console.log(
								'Dankcord has been updated. This page will refresh in 5 seconds.'
							);
							setTimeout(() => location.reload(), 5000);
						} else {
							console.log('Dankcord is cached for offline use.');
						}
					});
				});
			})
			.catch(err => console.log('SW registration failed:', err));
	});
}
