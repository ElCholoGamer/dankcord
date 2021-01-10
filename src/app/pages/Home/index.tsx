import React from 'react';
import Logo from '@assets/images/logo.png';
import './Home.scss';

const Home: React.FC = () => {
	return (
		<main>
			<div id="home-content">
				<img src={Logo} alt="Dankcord logo" />

				<h1 id="home-title">Your place NOT to talk</h1>
				<p>
					Seriously tho, this app is just some random Discord clone anyways.
					Haven't you noticed yet?
				</p>
			</div>
		</main>
	);
};

export default Home;
