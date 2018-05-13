const parent = module.parent.exports,
bot = parent.bot,
client = parent.client;

exports.com = new RegExp('^' + parent.bot.prefix + 'up(time)?$', 'i');
exports.name = 'Uptime';
exports.usage = parent.bot.prefix + 'up[time]';
exports.level = 'User';
exports.category = 'Miscellaneous';
exports.description = `Get uptime.`;

exports.command = async function(msg, comm) {
	try {
		await msg.reply(`Bot has been up since:\n${Date(client.uptime)}`);
	} catch(err) {
		await msg.author.send(`Bot has been up since:\n${Date(client.uptime)}`);
	}
};
