import React from 'react';
import Header from '../../components/Header';
import './Home.scss';

const Home: React.FC = () => {
	return (
		<>
			<Header />
			<main>
				<div id="home-content">
					<h1 id="home-title">Your place NOT to talk</h1>
					<p>
						Seriously tho, this app is just some random Discord clone anyways.
					</p>
				</div>
			</main>
		</>
	);
};

export default Home;
