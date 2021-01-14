import axios from 'axios';
import React, {
	Dispatch,
	SetStateAction,
	MouseEvent,
	ChangeEvent,
	useState,
} from 'react';
import { Channel, User } from '../../../util/structures';
import './ChannelsList.scss';

interface Props {
	channels: Record<string, Channel>;
	selected: string;
	setSelected: Dispatch<SetStateAction<string>>;
	user: User;
}

const ChannelsList: React.FC<Props> = ({
	channels,
	setSelected,
	selected,
	user,
}) => {
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

export default ChannelsList;
