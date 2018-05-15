const parent = module.parent.exports;

exports.com = new RegExp('^' + parent.bot.prefix + 'col(or)?( .+)?$', 'i');
exports.name = 'Color';
exports.usage = parent.bot.prefix + 'col[or][ code<String>]';
exports.level = 'User';
exports.category = 'Utility';
exports.description = `Color info.`;

exports.command = function(msg, comm) {
	const message = new parent.Discord.RichEmbed();
	message.setColor((comm.last()[1] || 'RANDOM').toUpperCase())
	.setTitle(message.color);
	msg.reply((comm.last()[1] || 'RANDOM').toUpperCase(), {
			embed: message
	});
};
