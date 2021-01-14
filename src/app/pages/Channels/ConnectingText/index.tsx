import React, { useEffect, useState } from 'react';
import './ConnectingText.scss';

const ConnectingText: React.FC = () => {
	const [count, setCount] = useState(0);

	useEffect(() => {
		const timer = setInterval(() => setCount(c => c + 1), 500);

		return () => {
			clearInterval(timer);
		};
	}, []);

	return <p id="connecting-text">Connecting{'.'.repeat(count % 4)}</p>;
};

export default ConnectingText;
