import { Server as WSServer } from 'ws';
import jsonReplacer from '../util/json-replacer';

WSServer.prototype.broadcast = function (
	event: string,
	data: {},
	moderatorOnly = false
) {
	this.clients.forEach(client => {
		if (client.ready && (!moderatorOnly || client.user.moderator))
			client.send(JSON.stringify({ e: event, d: data }, jsonReplacer));
	});
};
