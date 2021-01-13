import axios from 'axios';
import { ChannelState } from 'pages/Channels';
import { Dispatch, SetStateAction } from 'react';
import { Channel } from './structures';

async function messageHandler(
	setChannels: Dispatch<SetStateAction<ChannelState>>,
	event: MessageEvent<any>
) {
	const { e, d } = JSON.parse(event.data);

	switch (e) {
		case 'READY':
			const res = await axios.get('/api/channels');
			const channels: Channel[] = res.data;

			setChannels(
				channels.reduce(
					(acc, channel) => ({ ...acc, [channel.id]: channel }),
					{}
				)
			);
			break;
	}
}

export default messageHandler;
