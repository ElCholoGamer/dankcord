import axios from 'axios';
import { ChannelState, ExtChannel } from 'pages/Channels';
import { Dispatch, SetStateAction } from 'react';
import { Channel } from './structures';

async function messageHandler(
	setChannels: Dispatch<SetStateAction<ChannelState>>,
	event: MessageEvent<any>
) {
	const { e, d } = JSON.parse(event.data);
	console.log('Received event:', e);
	console.log('Data:', d);

	switch (e) {
		case 'READY':
			const res = await axios.get('/api/channels');
			const channels: Channel[] = res.data;

			setChannels(
				channels.reduce((acc, channel) => {
					acc.set(channel.id, { ...channel, messages: null });
					return acc;
				}, new Map<string, ExtChannel>())
			);
			break;
	}
}

export default messageHandler;
