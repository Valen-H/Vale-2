const parent = module.parent.exports,
bot = parent.bot,
client = parent.client;

module.exports = exports = new parent.Command();

exports.com = new RegExp('^' + bot.prefix + 'raw .+$', 'i');
exports.name = 'Raw';
exports.usage = bot.prefix + 'raw data<String>';
exports.level = 'Owner';
exports.category = 'Bot';
exports.description = `Execute a console command.`;
exports.hidden = true;

exports.command = async function(msg, comm) {
	if (bot.admins.includes(msg.author.id)) {
		msg.delete().catch(parent.ignore);
		return await parent.lin(comm[0][1]);
	}
};
