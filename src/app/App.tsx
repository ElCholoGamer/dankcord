import axios, { AxiosError } from 'axios';
import React, { lazy, Suspense, useEffect, useState } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import Loading from '@components/Loading';
import { User } from './structures';
import './App.scss';

const Header = lazy(() => import('@components/Header'));
const Channels = lazy(() => import('./pages/Channels'));
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));

const App: React.FC = () => {
	const [user, setUser] = useState<User | null>(null);
	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		axios
			.get('/api/users/@me')
			.then(res => setUser(res.data))
			.catch((err: AxiosError) => {
				if (err.response?.status !== 401) console.error(err);
			})
			.finally(() => setLoaded(true));
	});

	if (!loaded) return <Loading />;

	return (
		<Suspense fallback={<Loading />}>
			<Header user={user} />
			<Switch>
				<Route exact path="/" component={Home} />
				<Route exact path="/channels" component={Channels} />
				<Route exact path="/login" component={Login} />
				<Route exact path="/register" component={Register} />

				<Redirect to="/" />
			</Switch>
		</Suspense>
	);
};

export default App;
