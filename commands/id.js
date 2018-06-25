const parent = module.parent.exports,
bot = parent.bot,
client = parent.client;

module.exports = exports = new parent.Command();

exports.com = new RegExp('^' + parent.bot.prefix + 'id( (.|\\n)+)?$', 'i');
exports.name = 'Id';
exports.usage = parent.bot.prefix + 'id[ (user|role|emoji|channel)<String>]';
exports.level = 'User';
exports.category = 'Utility';
exports.description = `Get ID.`;

exports.command = async function(msg, comm) {
	var params = Array.from(comm.last()),
	ids = { },
	message = [ ];
	params.shift();
	
	if (!params.length) {
		message.push(msg.author.tag + ' : ' + msg.author.id);
		message.push(msg.channel.name + ' : ' + msg.channel.id);
	}
	
	await chillout.forEach(msg.mentions.users.array().concat(msg.mentions.channels.array()).concat(msg.mentions.roles.array()).concat(msg.mentions.emojis.array()), mention => {
		ids[mention.toString()] = mention.id || mention;
	});
	
	for (let id in ids) {
		message.push(id + ' : ' + ids[id]);
	}
	
	try {
		await msg.reply(message.join('\n'), {
			split: true
		});
	} catch(err) {
		await msg.author.send(message.join('\n'), {
			split: true
		});
	}
};
