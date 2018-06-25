const parent = module.parent.exports,
client = parent.client,
bot = parent.bot;

module.exports = exports = new parent.Command();

exports.com = new RegExp('^' + bot.prefix + '(rel(oad)?|res(tart)?)$', 'i');
exports.name = 'Reload/Restart';
exports.usage = bot.prefix + '(rel[oad]|res[tart])';
exports.level = 'Owner';
exports.category = 'Bot';
exports.description = `Reload/Restart bot.`;

exports.command = async function(msg) {
	if (!bot.admins.includes(msg.author.id)) return;
	parent.commands = [ ];
	msg.delete().catch(() => msg.reply('Done.'));
	if (msg.content.includes('s')) {
		await parent.init();
	} else {
		await parent.reload();
	}
};
