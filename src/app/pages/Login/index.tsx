import axios, { AxiosError } from 'axios';
import React, {
	ChangeEvent,
	Dispatch,
	MouseEvent,
	SetStateAction,
	useState,
} from 'react';
import { useHistory } from 'react-router-dom';
import './Login.scss';

interface Props {
	setLoaded: Dispatch<SetStateAction<boolean>>;
}

const Login: React.FC<Props> = ({ setLoaded }) => {
	const history = useHistory();
	const [alert, setAlert] = useState('');
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	const handleClick = (
		e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
	) => {
		e.preventDefault();

		const btn = e.currentTarget;
		btn.disabled = true;

		axios
			.post('/auth/login', { username, password })
			.then(() => {
				setLoaded(false);
				history.push('/');
			})
			.catch((err: AxiosError) => {
				setAlert(err.response?.data?.message || 'Unknown error.');
				console.error(err);
				btn.disabled = false;
			});
	};

	const handleChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
		if (target.name === 'username') {
			setUsername(target.value.trimStart());
		} else {
			setPassword(target.value);
		}
	};

	return (
		<main>
			<div id="login-card">
				<h2>Welcome back!</h2>
				<hr />

				<form>
					<div className="form-group">
						<label htmlFor="username">Username:</label>
						<br />
						<input
							type="text"
							id="username"
							name="username"
							value={username}
							onChange={handleChange}
						/>
					</div>

					<div className="form-group" style={{ marginBottom: '2px' }}>
						<label htmlFor="password">Password:</label>
						<br />
						<input
							type="password"
							id="password"
							name="password"
							value={password}
							onChange={handleChange}
						/>
					</div>

					{alert && <p className="alert-text">{alert}</p>}

					<button
						onClick={handleClick}
						className="btn"
						disabled={!username || !password}
						id="form-login-btn">
						Log In
					</button>

					<br />
					<a className="card-bottom" onClick={() => history.push('/register')}>
						Don't have an account yet?
					</a>
				</form>
			</div>
		</main>
	);
};

export default Login;
