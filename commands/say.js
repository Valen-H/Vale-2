const parent = module.parent.exports,
client = parent.client,
bot = parent.bot;

module.exports = exports = new parent.Command();

exports.com = new RegExp('^' + parent.bot.prefix + 'say( \\d{,3})? (.|\\n)+$', 'i');
exports.name = 'Say';
exports.usage = parent.bot.prefix + 'say[ times<Number>] phrase<String>';
exports.level = 'User';
exports.category = 'Utility';
exports.description = `Repeat a sentence.`;

exports.command = async function(msg, comm) {
	var txt = comm[1] && /^[0-9]+$/.test(comm[1][1]) ? comm[1][2] : comm[0][1],
	reps = comm[1] && /^[0-9]+$/.test(comm[1][1]) ? comm[1][1] : '1',
	ad = false;
	if (bot.admins.includes(msg.author.id)) {
		msg.delete();
		reps |= 0;
		ad = true;
	} else {
		reps = reps.slice(0, 2) | 0;
	}
	return await chillout.repeat(reps, i => {
		(ad ? msg.channel.send(txt) : msg.reply(txt)).catch(err => {
			msg.author.send(txt, {
				split: true
			}).catch(parent.ignore);
		});
	});
};
