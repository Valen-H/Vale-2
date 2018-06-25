const parent = module.parent.exports,
bot = parent.bot,
client = parent.client;

module.exports = exports = new parent.Command();

exports.com = new RegExp('^' + bot.prefix + 'kill$', 'i');
exports.name = 'Kill';
exports.usage = bot.prefix + 'kill';
exports.level = 'Owner';
exports.category = 'Bot';
exports.description = `Kill bot.`;

exports.command = async function(msg) {
	if (bot.admins.includes(msg.author.id)) {
		try {
			await msg.channel.send('*Shuting down...*');
		} catch(err) {
			await msg.author.send('*Shuting down...*');
		}
		await client.user.setPresence({
			status: 'offline',
			afk: true,
			game: {
				name: bot.prefix + 'help',
				type: 'STREAMING'
			}
		});
		await client.destroy();
	} else {
		try {
			await msg.reply('This is an owner-only command.');
		} catch(err) {
			await msg.author.send('This is an owner-only command.');
		}
	}
};
