const parent = module.parent.exports;

exports.com = new RegExp('^' + parent.bot.prefix + 'kill$', 'i');
exports.name = 'Kill';
exports.usage = parent.bot.prefix + 'kill';
exports.level = 'Owner';
exports.category = 'Bot';
exports.description = `Kill bot.`;

exports.command = async function(msg) {
	if (parent.bot.admins.includes(msg.author.id)) {
		try {
			await msg.channel.send('*Shuting down...*');
		} catch(err) {
			await msg.author.send('*Shuting down...*');
		}
		parent.client.user.setPresence({
			status: 'offline',
			afk: true,
			game: {
				name: parent.bot.prefix + 'help',
				type: 'STREAMING'
			}
		});
		parent.client.destroy();
	} else {
		try {
			await msg.reply('This is an owner-only command.');
		} catch(err) {
			await msg.author.send('This is an owner-only command.');
		}
	}
};
