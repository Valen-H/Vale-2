const parent = module.parent.exports;

exports.com = new RegExp('^' + parent.bot.prefix + '(rel(oad)?|res(tart)?)$', 'i');
exports.name = 'Reload/Restart';
exports.usage = parent.bot.prefix + '(rel[oad]|res[tart])';
exports.level = 'Owner';
exports.category = 'Bot';
exports.description = `Reload/Restart bot.`;

Object.assign(exports, parent);

exports.command = async function(msg) {
	if (!parent.bot.admins.includes(msg.author.id)) return;
	parent.commands = [];
	msg.delete().catch(() => msg.reply('Done.'));
	// replies "done" if the message fails to delete... might as well just reply done
	if (msg.content.includes('s')) {
		await parent.init();
	} else {
		await parent.reload();
	}
};
