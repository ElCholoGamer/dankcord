import React, { useEffect, KeyboardEvent, useState, useRef } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import { Channel, Message, User } from '../../util/structures';
import Loading from '@components/Loading';
import ConnectingText from '@components/ConnectingText';
import './Channels.scss';

export type ChannelState = Record<string, Channel>;

interface Props {
	user: User | null;
}

const Channels: React.FC<Props> = ({ user }) => {
	const inputRef = useRef<HTMLInputElement>(null);
	const messagesRef = useRef<HTMLDivElement>(null);

	const [connected, setConnected] = useState(false);
	const [users, setUsers] = useState<User[]>([]);
	const [channels, setChannels] = useState<ChannelState>({});
	const [selected, setSelected] = useState('');
	const [messages, setMessages] = useState<Record<string, Message[]>>({});
	const [input, setInput] = useState('');

	const scrollMessages = () => {
		const messagesDiv = messagesRef.current;
		if (messagesDiv) messagesDiv.scrollTop = messagesDiv.scrollHeight;
	};

	const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key !== 'Enter' || !input) return;

		const field = e.currentTarget;
		field.disabled = true;
		setInput('');

		axios
			.post(`/api/channels/${selected}/messages`, { content: input })
			.catch(console.error)
			.finally(() => {
				field.disabled = false;
				inputRef.current?.focus();
			});
	};

	// Select default channel when connected
	useEffect(() => {
		if (!connected) return;

		const lastChannel = localStorage.getItem('lastChannel') ?? '';
		setSelected(channels[lastChannel]?.id || Object.values(channels)[0]?.id);
	}, [connected]);

	// Update messages when selected changes
	useEffect(() => {
		if (selected) localStorage.setItem('lastChannel', selected);
		if (!selected) return;

		// Fetch selected channel messages
		if (selected in messages) return scrollMessages();

		let timer: ReturnType<typeof setTimeout> | null = null;
		(async function fetchMessages() {
			try {
				const res = await axios.get(`/api/channels/${selected}/messages`);
				setMessages(prev => ({ ...prev, [selected]: res.data }));

				scrollMessages();
			} catch {
				timer = setTimeout(fetchMessages, 1000);
			}
		})();

		return () => {
			if (timer) clearTimeout(timer);
		};
	}, [selected]);

	// Component mounted
	useEffect(() => {
		if (!user) return;

		// WebSocket startup
		const host =
			process.env.NODE_ENV === 'development' ? 'localhost:8080' : location.host;

		const secure = location.protocol.indexOf('https') !== -1;
		const url = `${secure ? 'wss' : 'ws'}://${host}/gateway`;

		const ws = new WebSocket(url);
		ws.addEventListener('message', async event => {
			const { e, d } = JSON.parse(event.data);
			console.log('e:', e, 'd:', d);

			switch (e) {
				case 'READY':
					// Fetch channels
					let res = await axios.get('/api/channels');
					const channels: Channel[] = res.data;
					setChannels(
						channels.reduce(
							(acc, channel) => ({ ...acc, [channel.id]: channel }),
							{}
						)
					);

					// Fetch online users
					res = await axios.get('/api/users');
					const users: User[] = res.data;
					setUsers(users);

					setConnected(true);
					break;
				case 'USER_JOIN':
					setUsers(prev => {
						if (prev.some(user => user.id === d.id)) return prev;
						return [...prev, d];
					});
					break;
				case 'USER_LEAVE':
					setUsers(prev => prev.filter(user => user.id !== d.id));
					break;
				case 'MESSAGE_CREATE':
					setMessages(prev => {
						const list = prev[d.channel] ?? [];
						return { ...prev, [d.channel]: [...list, d] };
					});

					if (d.channel === selected) scrollMessages();
					break;
				case 'MESSAGE_EDIT':
					setMessages(prev => {
						const index = prev[d.channel].findIndex(m => m.id === d.id);
						prev[d.channel][index] = d;
						return prev;
					});
					break;
				case 'MESSAGE_DELETE':
					setMessages(prev => {
						prev[d.channel] = prev[d.channel].filter(m => m.id !== d.id);
						return prev;
					});
					break;
				case 'CHANNEL_CREATE':
					setChannels(prev => ({ ...prev, [d.id]: d }));
					break;
				case 'CHANNEL_EDIT':
					if (!d.private || user.moderator) {
						setChannels(prev => ({ ...prev, [d.id]: d }));
						break;
					}
				case 'CHANNEL_DELETE':
					setChannels(prev => {
						delete prev[d.id];
						return prev;
					});
					break;
			}
		});
	}, [user]);

	if (!user) return <Redirect to="/login" />;

	if (!connected) {
		return (
			<main style={{ padding: 0 }}>
				<ConnectingText />
			</main>
		);
	}

	return (
		<main style={{ padding: 0 }} id="channels-container">
			<div id="channels-list" className="scrollable">
				{Object.values(channels).map(channel => (
					<div
						key={channel.id}
						onClick={() => setSelected(channel.id)}
						className={`channel-item${
							channel.id === selected ? ' selected' : ''
						}`}>
						# <span className="bold">{channel.name}</span>
					</div>
				))}
			</div>

			<div id="channel-messages">
				{!(selected in messages) ? (
					<Loading />
				) : (
					<>
						<div id="messages" ref={messagesRef}>
							{!messages[selected].length ? (
								<p id="no-messages-text" className="italic">
									This channel doesn't have any messages yet!
								</p>
							) : (
								<>
									{messages[selected].map(message => (
										<div key={message.id} className="message">
											<span className="bold">{message.author.username}:</span>{' '}
											{message.content}
										</div>
									))}
								</>
							)}
						</div>
						<div id="message-input">
							<input
								type="text"
								placeholder={`Message #${channels[selected].name}`}
								value={input}
								autoFocus
								onChange={e => setInput(e.target.value.trimStart())}
								onKeyPress={handleKeyPress}
								ref={inputRef}
							/>
						</div>
					</>
				)}
			</div>

			<div id="users-list" className="scrollable">
				<h3>Online users</h3>

				{users.map(user => (
					<p className="online-user" key={user.id}>
						{user.username}
					</p>
				))}
			</div>
		</main>
	);
};

export default Channels;
