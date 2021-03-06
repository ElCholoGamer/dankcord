import axios, { AxiosError } from 'axios';
import React, { lazy, Suspense, useEffect, useState } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import Loading from '@components/Loading';
import { User } from './util/structures';
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
		if (localStorage.getItem('loggedIn') !== 'true') {
			setUser(null);
			return setLoaded(true);
		}

		if (loaded) return;

		axios
			.get('/api/users/@me')
			.then(res => setUser(res.data))
			.catch((err: AxiosError) => {
				setUser(null);
				localStorage.removeItem('loggedIn');
				if (err.response?.status !== 401) console.error(err);
			})
			.finally(() => setLoaded(true));
	}, [loaded]);

	if (!loaded) return <PageLoading />;

	return (
		<Suspense fallback={<PageLoading />}>
			<Header setLoaded={setLoaded} user={user} />
			<Switch>
				<Route exact path="/" render={() => <Home user={user} />} />
				<Route exact path="/channels" render={() => <Channels user={user} />} />
				<Route
					exact
					path="/login"
					render={() => <Login user={user} setLoaded={setLoaded} />}
				/>
				<Route
					exact
					path="/register"
					render={() => <Register user={user} setLoaded={setLoaded} />}
				/>

				<Redirect to="/" />
			</Switch>
		</Suspense>
	);
};

const PageLoading: React.FC = () => (
	<div style={{ height: '100vh' }}>
		<Loading />
	</div>
);
export default App;
