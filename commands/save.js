const parent = module.parent.exports,
bot = parent.bot;

exports.com = new RegExp('^' + parent.bot.prefix + 'save?$', 'i');
exports.name = 'Save';
exports.usage = parent.bot.prefix + 'sav[e]';
exports.level = 'Owner';
exports.category = 'Bot';
exports.description = `Save data files.`;

exports.command = async function(msg, comm) {
	if (bot.admins.includes(msg.author.id)) {
		msg.delete().catch(() => msg.reply('Done.'));
		await parent.save();
	}
};
