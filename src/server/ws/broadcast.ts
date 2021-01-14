import { Server as WSServer } from 'ws';
import jsonReplacer from '../util/json-replacer';

WSServer.prototype.broadcast = function (
	event: string,
	data: {},
	moderatorOnly = false
) {
	const payload = JSON.stringify({ e: event, d: data }, jsonReplacer);
	console.log('Payload:', payload);
	this.clients.forEach(client => {
		if (client.ready && (!moderatorOnly || client.user.moderator))
			client.send(payload);
	});
};
