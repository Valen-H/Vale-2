const parent = module.parent.exports,
bot = parent.bot,
client = parent.client;

module.exports = exports = new parent.Command();

exports.com = new RegExp('^' + parent.bot.prefix + 'ra?nd(om)? \\d+( \\d+)?$', 'i');
exports.name = 'Random';
exports.usage = parent.bot.prefix + 'rnd[ from=0<Number>] to<Number>';
exports.level = 'User';
exports.category = 'Miscellaneous';
exports.description = `Random Number.`;

exports.command = async function(msg, comm) {
	var frm = 0, to;
	if (comm[1] && comm[1][2]) {
		to = comm[1].last();
		frm = comm[1][1];
	} else {
		to = comm[0].last();
	}
	var rnd = Math.round(Math.random() * (to - frm) + frm).toString();
	try {
		await msg.reply(rnd);
	} catch(err) {
		await msg.author.send(rnd);
	}
};
