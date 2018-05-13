const parent = module.parent.exports;

exports.com = new RegExp('^' + parent.bot.prefix + 'inv(ite)?$', 'i');
exports.name = 'Invite';
exports.usage = parent.bot.prefix + 'invite';
exports.level = 'User';
exports.category = 'Miscellaneous';
exports.description = `Generate an invite link for the bot.`;

exports.command = async function(msg, comm) {
	try {
		await msg.reply(await parent.client.generateInvite());
	} catch(err) {
		await msg.author.send(await parent.client.generateInvite());
	}
};
