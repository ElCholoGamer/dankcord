import React, { Dispatch, SetStateAction, MouseEvent } from 'react';
import Logo from '@assets/images/logo.png';
import { User } from '../../structures';
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
		axios.post('/auth/logout').finally(() => setLoaded(false));
	};

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
				<button className="btn" id="logout-btn" onClick={logOut}>
					Log Out
				</button>
			)}
		</nav>
	);
};

export default Header;
