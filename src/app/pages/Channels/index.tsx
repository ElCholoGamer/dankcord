import React from 'react';
import { Redirect } from 'react-router-dom';
import { User } from 'structures';
import './Channels.scss';

interface Props {
	user: User | null;
}

const Channels: React.FC<Props> = ({ user }) => {
	if (!user) return <Redirect to="/" />;

	return <div>Channels component</div>;
};

export default Channels;
