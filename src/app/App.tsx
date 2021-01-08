import React, { lazy, Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import './App.scss';

const Channels = lazy(() => import('./pages/Channels'));
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));

const App: React.FC = () => {
	return (
		<Suspense fallback={<h2>Loading...</h2>}>
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
