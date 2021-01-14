import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import { Channel, Message, User } from '../../util/structures';
import usePrevious from '../../util/use-previous';
import ConnectingText from './ConnectingText';
import './Channels.scss';
import ChannelsList from './ChannelsList';
import ChannelMessages from './ChannelMessages';
import messageHandler from '../../util/message-handler';

interface Props {
	user: User | null;
}

const Channels: React.FC<Props> = ({ user }) => {
	const messagesRef = useRef<HTMLDivElement>(null);

	const [connected, setConnected] = useState(false);
	const [users, setUsers] = useState<User[]>([]);
	const [channels, setChannels] = useState<Record<string, Channel>>({});
	const [selected, setSelected] = useState('');
	const [messages, setMessages] = useState<Record<string, Message[]>>({});

	const previousMessages = usePrevious(messages);
	const handler = useMemo(
		() =>
			messageHandler(user, {
				setChannels,
				setConnected,
				setMessages,
				setUsers,
			}),
		[user]
	);

	const scrollMessages = () => {
		const messagesDiv = messagesRef.current;
		if (messagesDiv) messagesDiv.scrollTop = messagesDiv.scrollHeight;
	};

	// Scroll on new message
	useEffect(() => {
		const prev = previousMessages?.[selected]?.length ?? 0;
		const curr = messages[selected]?.length ?? 0;

		if (prev < curr) scrollMessages();
	}, [messages]);

	// Select default channel when connected
	useEffect(() => {
		if (!connected) return;

		const lastChannel = localStorage.getItem('lastChannel') ?? '';
		setSelected(channels[lastChannel]?.id || Object.values(channels)[0]?.id);
	}, [connected]);

	// Update messages when selected changes
	useEffect(() => {
		let mounted = true;

		if (!selected) return;
		localStorage.setItem('lastChannel', selected);

		if (selected in messages) return scrollMessages();

		// Fetch selected channel messages
		let timer: ReturnType<typeof setTimeout> | null = null;
		(async function fetchMessages() {
			try {
				const res = await axios.get(`/api/channels/${selected}/messages`);
				if (mounted) setMessages(prev => ({ ...prev, [selected]: res.data }));
			} catch {
				timer = setTimeout(fetchMessages, 1000);
			}
		})();

		return () => {
			mounted = false;
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
		ws.addEventListener('message', handler);

		return () => ws.close();
	}, [user]);

	if (!user) return <Redirect to="/login" />;

	if (!connected) {
		return (
			<main style={{ padding: 0 }}>
				<ConnectingText />
			</main>
		);
	}

	const props = {
		channels,
		selected,
		user,
	};

	return (
		<main style={{ padding: 0 }} id="channels-container">
			<ChannelsList {...props} setSelected={setSelected} />

			<ChannelMessages
				{...props}
				messages={messages}
				messagesRef={messagesRef}
			/>

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
