import React, { Dispatch, SetStateAction, MouseEvent } from 'react';
import Logo from '@assets/images/logo.png';
import { User } from '../../util/structures';
import { useHistory } from 'react-router-dom';
import './Header.scss';
import axios from 'axios';

interface Props {
	user: User | null;
	setLoaded: Dispatch<SetStateAction<boolean>>;
}

const Header: React.FC<Props> = ({ user, setLoaded }) => {
	const history = useHistory();

	const logOut = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
		e.currentTarget.disabled = true;
		axios.post('/auth/logout').finally(() => {
			localStorage.removeItem('loggedIn');
			setLoaded(false);
		});
	};

	return (
		<nav>
			<div onClick={() => history.push('/')} id="header-brand">
				<img src={Logo} id="header-logo" />
				<h2>Dankcord</h2>
			</div>

			{!user ? (
				<div id="auth-buttons">
					<button
						onClick={() => history.push('/login')}
						className="btn purple-btn">
						Log In
					</button>
					<button
						onClick={() => history.push('/register')}
						className="btn purple-btn">
						Register
					</button>
				</div>
			) : (
				<div>
					<h3 id="header-user">
						Logged in as <span>{user.username}</span>
					</h3>
					<button className="btn" id="logout-btn" onClick={logOut}>
						Log Out
					</button>
				</div>
			)}
		</nav>
	);
};

export default Header;
