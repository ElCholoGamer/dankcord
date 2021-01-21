import axios from 'axios';
import React, {
	Dispatch,
	SetStateAction,
	MouseEvent,
	ChangeEvent,
	useState,
	useRef,
} from 'react';
import { Channel, User } from '../../../util/structures';
import './ChannelsList.scss';

interface Props {
	channels: Record<string, Channel>;
	selected: string;
	setSelected: Dispatch<SetStateAction<string>>;
	user: User;
}

const ChannelsList: React.FC<Props> = props => {
	const { channels, setSelected, selected, user } = props;
	const [input, setInput] = useState('');

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		setInput(
			e.target.value
				.toLowerCase()
				.trimStart()
				.replace(/\s/g, '-')
				.replace(/-{2,}/g, '-')
		);
	};

	const createChannel = (
		e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
	) => {
		if (!input || !user?.moderator) return;

		setInput('');
		const btn = e.currentTarget;
		btn.disabled = true;

		axios
			.post(`/api/channels`, { name: input })
			.then(res => setSelected(res.data.id))
			.catch(console.error)
			.finally(() => (btn.disabled = false));
	};

	return (
		<div id="channels-list">
			<div id="channels" className="scrollable">
				{Object.values(channels).map(channel => (
					<ChannelItem key={channel.id} {...props} channel={channel} />
				))}
			</div>

			{user.moderator && (
				<div id="create-channel">
					<input
						type="text"
						name="channel"
						placeholder="Channel name"
						value={input}
						onChange={handleChange}
					/>
					<br />
					<button className="btn purple-btn" onClick={createChannel}>
						Add channel
					</button>
				</div>
			)}
		</div>
	);
};

type ChannelItemProps = Props & { channel: Channel };

const ChannelItem: React.FC<ChannelItemProps> = ({
	channels,
	channel,
	selected,
	setSelected,
	user,
}) => {
	const divRef = useRef<HTMLDivElement>(null);

	const handleClick = (
		e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>
	) => {
		if (e.target !== divRef.current) return e.stopPropagation();
		setSelected(channel.id);
	};

	const deleteChannel = (
		e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
	) => {
		const btn = e.currentTarget;
		btn.disabled = true;

		axios.delete(`/api/channels/${channel.id}`).catch(err => {
			btn.disabled = false;
			console.error(err);
		});
	};

	return (
		<div
			key={channel.id}
			ref={divRef}
			onClick={handleClick}
			className={`channel-item${channel.id === selected ? ' selected' : ''}`}>
			# <span className="bold">{channel.name}</span>
			{user.moderator && Object.keys(channels).length > 1 && (
				<button onClick={deleteChannel} className="delete-channel-btn">
					&times;
				</button>
			)}
		</div>
	);
};

export default ChannelsList;
