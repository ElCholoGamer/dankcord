import Loading from '@components/Loading';
import axios from 'axios';
import React, {
	RefObject,
	MouseEvent,
	KeyboardEvent,
	useState,
	ChangeEvent,
	useRef,
} from 'react';
import { Channel, Message, User } from 'src/app/util/structures';
import './ChannelMessages.scss';

interface Props {
	selected: string;
	messages: Record<string, Message[]>;
	messagesRef: RefObject<HTMLDivElement>;
	channels: Record<string, Channel>;
	user: User;
}

const ChannelMessages: React.FC<Props> = ({
	selected,
	messages,
	messagesRef,
	user,
	channels,
}) => {
	const inputRef = useRef<HTMLInputElement>(null);
	const [input, setInput] = useState('');

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		setInput(e.target.value.trimStart());
	};

	const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key !== 'Enter' || !input) return;

		setInput('');
		const field = e.currentTarget;
		field.disabled = true;

		axios
			.post(`/api/channels/${selected}/messages`, { content: input })
			.catch(console.error)
			.finally(() => {
				field.disabled = false;
				inputRef.current?.focus();
			});
	};

	const deleteMessage = (
		e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
		id: string
	) => {
		const btn = e.currentTarget;
		btn.disabled = true;

		axios.delete(`/api/channels/${selected}/messages/${id}`).catch(err => {
			console.error(err);
			btn.disabled = false;
		});
	};

	return (
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
										{message.author.id === user.id && (
											<button
												className="delete-btn"
												onClick={e => deleteMessage(e, message.id)}>
												&times;
											</button>
										)}
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
							name="message"
							onChange={handleChange}
							onKeyPress={handleKeyPress}
							ref={inputRef}
						/>
					</div>
				</>
			)}
		</div>
	);
};

export default ChannelMessages;
