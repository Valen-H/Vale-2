const parent = module.parent.exports,
client = parent.client,
bot = parent.bot;

module.exports = exports = new parent.Command();

exports.com = new RegExp('^' + bot.prefix + '(kick|ban) .+?( .+)?$', 'i');
exports.name = 'Kick/Ban';
exports.usage = bot.prefix + '(kick|ban) user[ reason<String>]';
exports.level = 'Admin';
exports.category = 'Moderation';
exports.description = `Kick/Ban member (Requires BAN_MEMBERS and/or KICK_MEMBERS permissions respectively).`;

exports.command = async function(msg, comm) {
	var user = null;
	if (msg.mentions && msg.mentions.users && msg.mentions.users.array().length) {
		user = msg.mentions.users.first();
	} else if (comm[0][1] && msg.channel) {
		if (msg.channel.members) {
			user = msg.channel.members.find(/^[0-9]+$/.test(comm.last().param([1, 1, 'x'])[1]) ? 'id' : 'displayName', comm[1] ? comm.last()[1] : comm[0][1]);
			if (!user) {
				user = msg.channel.members.find(mmb => {
					var param = /^[0-9]+$/.test(comm.last().param([1, 1, 'x'])[1]) ? 'id' : 'displayName';
					if ((new RegExp(comm[1] ? comm.last().param([1, 1, 'x'])[1] : comm[0][1], 'i')).test(mmb[param] || mmb.user[param])) {
						return user = mmb;
					}
				});
			}
		}
		if (msg.channel.recipients && !user) {
			user = msg.channel.recipients.find(mmb => {
				var param = /^[0-9]+$/.test(comm.last().param([1, 1, 'x'])[1]) ? 'id' : (/#[0-9]{3,5}$/.test(comm.last().param([1, 1, 'x'])[1]) ? 'tag' : 'username');
				if ((new RegExp(comm[1] ? comm.last().param([1, 1, 'x'])[1] : comm[0][1], 'i')).test(mmb[param])) {
					return user = mmb;
				}
			});
		} else if (msg.channel.recipient) {
			user = comm[0][1] == parent.client.user.username ? parent.client.user : msg.channel.recipient;
		}
	}
	
	var type = comm[0][0].replace(new RegExp('^' + bot.prefix, ''), '').toLowerCase(),
	message = '';
	if (!user) {
		message = `Error occured. (Wrong parameters? try: ${parent.bot.prefix}help ${exports.name})`;
	} else if ((type == 'kick' && (!user.kickable || !user.kick)) || (type == 'ban' && (!user.bannable || !user.ban))) {
		message = `Action not possible. (Missing ${type == 'kick' ? 'KICK' : 'BAN'}_MEMBERS permission on my (or your) side, or user is not ${type}-able)`;
	} else if (type == 'kick') {
		try {
			await user.kick(comm.last().param([1, 1, 'x'])[2]);
			message = 'User kicked.';
		} catch(err) {
			message = 'Action failed.';
		}
	} else if (type == 'ban') {
		try {
			await user.ban(comm.last().param([1, 1, 'x'])[2]);
			message = 'User banned.';
		} catch(err) {
			message = 'Action failed.';
		}
	}
	
	try {
		await msg.reply(message);
	} catch(err) {
		await msg.author.send(message);
	}
};
