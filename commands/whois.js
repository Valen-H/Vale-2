const parent = module.parent.exports,
bot = parent.bot,
client = parent.client;

exports.com = new RegExp('^' + parent.bot.prefix + 'whom? ?is ?(an?|the)? .+\\??$', 'i');
exports.name = 'WhoIs';
exports.usage = parent.bot.prefix + 'who[[m] ]Is[ [A[n]]] trait<String>';
exports.level = 'User';
exports.category = 'Utility';
exports.description = `Fetch a random member.`;

exports.command = async function(msg, comm) {
	var vic = msg.channel.members.random(),
	name = vic.displayName || vic.username;
	
	try {
		await msg.reply(`'${name}' is ${(comm.last().param(['x', 1])[0].match(/(an?|the)$/i) || [''])[0]} ${comm.last().last().replace(/ ?\?*$/g, '')}!`, {
			split: true
		});
	} catch(err) {
		await msg.author.send(`'${name}' is ${(comm.last().param(['x', 1])[0].match(/(an?|the)$/i) || [''])[0]} ${comm.last().last().replace(/ ?\?*$/g, '')}!`, {
			split: true
		});
	}
};
