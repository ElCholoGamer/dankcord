import React from 'react';
import Logo from '@assets/images/logo.png';
import { User } from '../../structures';
import { useHistory } from 'react-router-dom';
import './Header.scss';

interface Props {
	user: User | null;
}

const Header: React.FC<Props> = ({ user }) => {
	const history = useHistory();

	return (
		<nav>
			<div onClick={() => history.push('/')} id="header-brand">
				<img src={Logo} id="header-logo" />
				<h2>Dankcord</h2>
			</div>

			{!user ? (
				<div id="auth-buttons">
					<button onClick={() => history.push('/login')} className="btn">
						Log In
					</button>
					<button onClick={() => history.push('/register')} className="btn">
						Register
					</button>
				</div>
			) : (
				<button className="btn" id="logout-btn">
					Log Out
				</button>
			)}
		</nav>
	);
};

export default Header;
