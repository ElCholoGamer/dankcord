import axios from 'axios';
import { Dispatch, SetStateAction } from 'react';
import { Channel, Message, User } from './structures';

type SetState<T> = Dispatch<SetStateAction<T>>;

interface Setters {
	setChannels: SetState<Record<string, Channel>>;
	setUsers: SetState<User[]>;
	setMessages: SetState<Record<string, Message[]>>;
	setConnected: SetState<boolean>;
}

const messageHandler = (
	user: User | null,
	{ setChannels, setConnected, setMessages, setUsers }: Setters
) =>
	async function (event: MessageEvent<any>) {
		if (!user) return;

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
				setUsers(prev => prev.filter(u => u.id !== d.id || u.id === user.id));
				break;
			case 'MESSAGE_CREATE':
				setMessages(prev => {
					const list = prev[d.channel] ?? [];
					return { ...prev, [d.channel]: [...list, d] };
				});
				break;
			case 'MESSAGE_EDIT':
				setMessages(prev => {
					const index = prev[d.channel].findIndex(m => m.id === d.id);
					prev[d.channel][index] = d;
					return prev;
				});
				break;
			case 'MESSAGE_DELETE':
				setMessages(prev => ({
					...prev,
					[d.channel]: prev[d.channel].filter(m => m.id !== d.id),
				}));
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
		}
	};

export default messageHandler;
