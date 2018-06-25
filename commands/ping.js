const parent = module.parent.exports,
client = parent.client,
bot = parent.bot;

module.exports = exports = new parent.Command();

exports.com = new RegExp('^' + bot.prefix + 'pings?$', 'i');
exports.name = 'Ping';
exports.usage = bot.prefix + 'ping[s]';
exports.level = 'User';
exports.category = 'Utility';
exports.description = `Return client ping(s).`;

exports.command = async function(msg, comm) {
	try {
		await msg.reply(`Pong${msg.content.endsWith('s') ? 's! ' + client.pings.map(ping => ping.toFixed(2)).join(',') : '! ' + client.ping.toFixed(2)}ms`);
	} catch(err) {
		await msg.author.send(`Pong${msg.content.endsWith('s') ? 's! ' + client.pings.map(ping => ping.toFixed(2)).join(',') : '! ' + client.ping.toFixed(2)}ms`);
	}
};
