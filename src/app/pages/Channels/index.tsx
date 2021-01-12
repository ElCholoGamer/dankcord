import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import messageHandler from '../../util/message-handler';
import { Channel, Message, User } from 'util/structures';
import './Channels.scss';

export type ExtChannel = Channel & { messages: Message[] | null };
export type ChannelState = Map<string, ExtChannel> | null;

interface Props {
	user: User | null;
}

const Channels: React.FC<Props> = ({ user }) => {
	const [connected, setConnected] = useState(false);
	const [channels, setChannels] = useState<ChannelState>(null);

	// Set connected when channels are available
	useEffect(() => {
		if (!connected && channels) setConnected(true);
	}, [channels]);

	// WebSocket startup
	useEffect(() => {
		if (!user) return;

		(async () => {
			// Fetch token
			const res = await axios.post('/auth/token');
			const { authToken } = res.data;

			const host =
				process.env.NODE_ENV === 'development'
					? 'localhost:8080'
					: location.host;

			const secure = location.protocol.indexOf('https') !== -1;
			const url = `${
				secure ? 'wss' : 'ws'
			}://${host}/gateway?token=${authToken}&user=${user.id}`;

			const ws = new WebSocket(url);

			ws.onmessage = e => messageHandler(setChannels, e);
		})().catch(console.error);
	}, [user]);

	if (!user) return <Redirect to="/" />;

	if (!connected)
		return (
			<main style={{ padding: 0 }}>
				<ConnectingText />
			</main>
		);

	return <div>Channels component</div>;
};

const ConnectingText: React.FC = () => {
	const [count, setCount] = useState(0);

	useEffect(() => {
		const timer = setInterval(() => setCount(c => c + 1), 500);

		return () => {
			clearInterval(timer);
		};
	}, []);

	return <p id="connecting-text">Connecting{'.'.repeat(count % 4)}</p>;
};

export default Channels;
