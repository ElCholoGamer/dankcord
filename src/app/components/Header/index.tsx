import React from 'react';
import Logo from '@assets/images/logo.png';
import { User } from '../../structures';
import './Header.scss';

interface Props {
	user: User | null;
}

const Header: React.FC<Props> = ({ user }) => {
	return (
		<nav>
			<div id="header-brand">
				<img src={Logo} id="header-logo" />
				<h2>Dankcord</h2>
			</div>

			{!user ? (
				<button className="btn" id="login-btn">
					Log in
				</button>
			) : (
				<button className="btn" id="logout-btn">
					Log Out
				</button>
			)}
		</nav>
	);
};

export default Header;
