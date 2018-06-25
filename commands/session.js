const parent = module.parent.exports,
bot = parent.bot,
client = parent.client;

module.exports = exports = new parent.Command();

exports.com = new RegExp('^' + parent.bot.prefix + '(ses(sion)?(s?top)?|se?nd|sto?p)$', 'i');
exports.name = 'Session';
exports.usage = parent.bot.prefix + '(ses[sion][stop]|send|stop)';
exports.level = 'Owner';
exports.category = 'Bot';
exports.description = `Start channel-spying session.`;
exports.hidden = true;

exports.command = async function(msg, comm) {
	if (bot.admins.includes(msg.author.id)) {
		msg.delete().catch(parent.ignore);
		return parent.lin(comm[0][0].replace(new RegExp('^' + bot.prefix, 'i'), '.') + ' ' + msg.channel.id);
	}
};
