import React from 'react';
import Logo from '../../assets/images/logo.png';
import './Header.scss';

const Header: React.FC = () => {
	return (
		<nav>
			<img src={Logo} id="header-logo" />
			<h2>Dankcord</h2>
		</nav>
	);
};

export default Header;
