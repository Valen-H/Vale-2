const parent = module.parent.exports,
client = parent.client;

exports.com = new RegExp('^' + parent.bot.prefix + 'ava(tar)?( .+)?$', 'i');
exports.name = 'Avatar';
exports.usage = parent.bot.prefix + 'ava[tar][ user<String>=msg.author[ trait<String>=(displayName|username|id)]]';
exports.level = 'User';
exports.category = 'Utility';
exports.description = `Fetch user avatar.`;

exports.command = async function(msg, comm) {
	var user = msg.author;
	if (msg.mentions && msg.mentions.users && msg.mentions.users.array().length) {
		user = msg.mentions.users.first();
	} else if (comm[0][1] && msg.channel) {
		if (msg.channel.members) {
			user = msg.channel.members.find(comm[1] ? comm.last().param([1, 'x', 1])[2] : 'displayName', comm[1] ? comm.last().param([1, 'x', 1])[1] : comm[0][1]);
			if (!user) {
				user = msg.channel.members.find(mmb => {
					var param = comm[1] ? comm.last().param([1, 'x', 1])[2] : (/^[0-9]+$/.test(comm.last().param([1, 'x', 1])[1]) ? 'id' : 'displayName');
					if ((new RegExp(comm[1] ? comm.last().param([1, 'x', 1])[1] : comm[0][1], 'i')).test(mmb[param] || mmb.user[param])) {
						return user = mmb;
					}
				});
			}
		}
		if (msg.channel.recipients && !user) {
			user = msg.channel.recipients.find(mmb => {
				var param = comm[1] ? comm.last().param([1, 'x', 1])[2] : (/^[0-9]+$/.test(comm.last().param([1, 'x', 1])[1]) ? 'id' : (/#[0-9]{3,5}$/.test(comm.last().param([1, 'x', 1])[1]) ? 'tag' : 'username'));
				if ((new RegExp(comm[1] ? comm.last().param([1, 'x', 1])[1] : comm[0][1], 'i')).test(mmb[param])) {
					return user = mmb;
				}
			});
		} else if (msg.channel.recipient) {
			user = comm[0][1] == parent.client.user.username ? parent.client.user : msg.channel.recipient;
		}
	}
	
	if (/^(guild?|serv(er)?)$/i.test(comm[0][1])) {
		user = msg.guild || msg.channel;
		user.displayAvatarURL = user.iconURL;
	}
	
	user = user ? (user.user || user) : user;
	if (user && user.displayAvatarURL) {
		try {
			await msg.reply(user.displayAvatarURL);
		} catch(err) {
			await msg.author.send(user.displayAvatarURL);
		}
	} else {
		try {
			await msg.reply(`Error occured. (Wrong parameters? try: ${parent.bot.prefix}help ${exports.name})`);
		} catch(err) {
			await msg.author.send(`Error occured. (Wrong parameters? try: ${parent.bot.prefix}help ${exports.name})`);
		}
	}
};
