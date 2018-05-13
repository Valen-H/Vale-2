const parent = module.parent.exports;

exports.com = new RegExp('^' + parent.bot.prefix + 'pings?$', 'i');
exports.name = 'Ping';
exports.usage = parent.bot.prefix + 'ping[s]';
exports.level = 'User';
exports.category = 'Utility';
exports.description = `Return client ping(s).`;

exports.command = async function(msg, comm) {
	try {
		await msg.reply(`Pong${msg.content.endsWith('s') ? 's! ' + parent.client.pings.map(ping => ping.toFixed(2)).join(',') : '! ' + parent.client.ping.toFixed(2)}`);
	} catch(err) {
		await msg.author.send(`Pong${msg.content.endsWith('s') ? 's! ' + parent.client.pings.map(ping => ping.toFixed(2)).join(',') : '! ' + parent.client.ping.toFixed(2)}`);
	}
};
