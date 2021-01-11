import React, { useState, MouseEvent, Dispatch, SetStateAction } from 'react';
import axios, { AxiosError } from 'axios';
import { useHistory } from 'react-router-dom';
import FormCard from '@components/FormCard';

interface Props {
	setLoaded: Dispatch<SetStateAction<boolean>>;
}

const Register: React.FC<Props> = ({ setLoaded }) => {
	const history = useHistory();
	const [alert, setAlert] = useState('');
	const [input, setInput] = useState({ username: '', password: '', email: '' });

	const onSubmit = (
		e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
	) => {
		if (input.password.length < 4) {
			return setAlert('Your password must have a minimum of 4 characters');
		}

		if (input.username.length > 20) {
			return setAlert('Username must be less than 20 characters long');
		}

		const btn = e.currentTarget;
		btn.disabled = true;

		axios
			.post('/auth/register', input)
			.then(() => {
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
				title="Welcome to Dankcord!"
				buttonLabel="Register"
				data={input}
				setData={setInput}
				onSubmit={onSubmit}
				fields={[
					{
						label: 'Email',
						type: 'text',
						value: 'email',
						required: true,
						transform: s => s.trim(),
					},
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
					text: 'Already have an account?',
					to: '/login',
				}}
			/>
		</main>
	);
};

export default Register;
