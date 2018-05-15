const parent = module.parent.exports,
bot = parent.bot,
client = parent.client;

exports.com = new RegExp('^' + parent.bot.prefix + 'em(oji)?fy? .+$', 'i');
exports.name = 'Emojify';
exports.usage = parent.bot.prefix + 'em[oji]f[y][ text<String>]';
exports.level = 'User';
exports.category = 'Utility';
exports.description = `Emojify text.`;

exports.command = async function(msg, comm) {
	var cnt = comm[0][1].split('').map(it => it.toLowerCase()),
	cmp = [];
	
	cnt.forEach(it => {
		if (/^[a-zA-Z]$/i.test(it)) {
			cmp.push(`:regional_indicator_${it}:`);
		} else if (/^\d$/i.test(it)) {
			cmp.push(`${it}⃣`);
		} else if (it == '!') {
			cmp.push(':exclamation:');
		} else if (it == '?') {
			cmp.push(':question:');
		} else if (it == '#') {
			cmp.push(':hash:');
		} else if (it == '*') {
			cmp.push(':asterisk:');
		} else {
			cmp.push(it);
		}
	});
	cmp = cmp.join('');
	
	try {
		await msg.reply(cmp, {
			split: true
		});
	} catch(err) {
		await msg.author.send(cmp, {
			split: true
		});
	}
};
