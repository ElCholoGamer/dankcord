import React, { Dispatch, MouseEvent, SetStateAction, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { Redirect, useHistory } from 'react-router-dom';
import FormCard from '@components/FormCard';
import { User } from '../util/structures';

interface Props {
	setLoaded: Dispatch<SetStateAction<boolean>>;
	user: User | null;
}

const Login: React.FC<Props> = ({ setLoaded, user }) => {
	const history = useHistory();
	const [alert, setAlert] = useState('');
	const [input, setInput] = useState({ username: '', password: '' });

	if (user) return <Redirect to="/channels" />;

	const handleClick = (
		e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
	) => {
		e.preventDefault();

		const btn = e.currentTarget;
		btn.disabled = true;

		axios
			.post('/auth/login', input)
			.then(() => {
				localStorage.setItem('loggedIn', 'true');
				setLoaded(false);
				history.push('/channels');
			})
			.catch((err: AxiosError) => {
				setAlert(err.response?.data?.message || 'Unknown error.');
				console.error(err);
				btn.disabled = false;
			});
	};

	return (
		<main>
			<FormCard
				title="Welcome back!"
				buttonLabel="Log In"
				data={input}
				setData={setInput}
				onSubmit={handleClick}
				fields={[
					{
						label: 'Username',
						value: 'username',
						type: 'text',
						required: true,
						transform: s => s.trimStart(),
					},
					{
						label: 'Password',
						value: 'password',
						type: 'password',
						required: true,
					},
				]}
				alert={alert}
				footer={{
					text: "Don't have an account yet?",
					to: '/register',
				}}
			/>
		</main>
	);
};

export default Login;
