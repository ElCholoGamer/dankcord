import React from 'react';
import Logo from '@assets/images/logo.png';
import './Home.scss';
import { useHistory } from 'react-router-dom';

const Home: React.FC = () => {
	const history = useHistory();

	return (
		<main id="home-main">
			<img src={Logo} alt="Dankcord logo" />

			<h1 id="home-title">Your place NOT to talk</h1>
			<p>
				Seriously tho, this app is just some random Discord clone anyways.
				Haven't you noticed yet?
			</p>

			<button
				onClick={() => history.push('/channels')}
				className="btn purple-btn"
				id="channels-btn">
				Channels
			</button>
		</main>
	);
};

export default Home;
