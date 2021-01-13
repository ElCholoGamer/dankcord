import React, { useEffect, useRef, useState } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import messageHandler from '../../util/message-handler';
import { Channel, Message, User } from 'util/structures';
import Loading from '@components/Loading';
import ConnectingText from '@components/ConnectingText';
import './Channels.scss';

export type ChannelState = { [key: string]: Channel } | null;

interface Props {
	user: User | null;
}

const Channels: React.FC<Props> = ({ user }) => {
	const [connected, setConnected] = useState(false);
	const [channels, setChannels] = useState<ChannelState>(null);
	const [selected, setSelected] = useState<Channel | null>(null);
	const [messages, setMessages] = useState<{ [key: string]: Message[] }>({});

	// Set connected when channels are available
	useEffect(() => {
		if (!connected && channels) {
			setConnected(true);
			setSelected(Object.values(channels)[0]);
		}
	}, [channels]);

	// Update messages when selected changes
	useEffect(() => {
		if (!selected || selected.id in messages) return;

		let timer: ReturnType<typeof setTimeout> | null = null;
		(async function fetchMessages() {
			try {
				const res = await axios.get(`/api/channels/${selected.id}/messages`);
				setMessages(prev => ({ ...prev, [selected.id]: res.data }));
			} catch {
				timer = setTimeout(fetchMessages, 1000);
			}
		})();

		return () => {
			if (timer) clearTimeout(timer);
		};
	}, [selected]);

	useEffect(() => {
		if (!user) return;

		// WebSocket startup
		const host =
			process.env.NODE_ENV === 'development' ? 'localhost:8080' : location.host;

		const secure = location.protocol.indexOf('https') !== -1;
		const url = `${secure ? 'wss' : 'ws'}://${host}/gateway`;

		const ws = new WebSocket(url);
		ws.addEventListener('message', e => messageHandler(setChannels, e));
	}, [user]);

	if (!user) return <Redirect to="/" />;

	if (!connected || !channels || !selected)
		return (
			<main style={{ padding: 0 }}>
				<ConnectingText />
			</main>
		);

	return (
		<main style={{ padding: 0 }} id="channels-container">
			<div id="channels-list" className="scrollable">
				{Object.values(channels).map(channel => (
					<div
						key={channel.id}
						onClick={() => setSelected(channel)}
						className={`channel-item${
							channel.id === selected?.id ? ' selected' : ''
						}`}>
						# <span className="bold">{channel.name}</span>
					</div>
				))}
			</div>

			<div id="channel-messages">
				{!(selected.id in messages) ? (
					<Loading />
				) : !messages[selected.id].length ? (
					<p id="no-messages-text" className="italic">
						This channel doesn't have any messages yet!
					</p>
				) : (
					<>
						{messages[selected.id].map(message => (
							<div key={message.id} className="message">
								<span className="bold">{message.author.username}:</span>{' '}
								{message.content}
							</div>
						))}
					</>
				)}
			</div>

			<div id="users-list" className="scrollable"></div>
		</main>
	);
};

export default Channels;
