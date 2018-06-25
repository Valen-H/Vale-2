const parent = module.parent.exports,
bot = parent.bot,
client = parent.client;

module.exports = exports = new parent.Command();

exports.com = new RegExp('^' + bot.prefix + 'save?$', 'i');
exports.name = 'Save';
exports.usage = bot.prefix + 'sav[e]';
exports.level = 'Owner';
exports.category = 'Bot';
exports.description = `Save data files.`;

exports.command = async function(msg, comm) {
	if (bot.admins.includes(msg.author.id)) {
		msg.delete().catch(() => msg.reply('Done.'));
		await parent.save();
	}
};
