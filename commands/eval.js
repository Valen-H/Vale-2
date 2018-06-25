const parent = module.parent.exports,
client = parent.client,
bot = parent.bot;

module.exports = exports = new parent.Command();

exports.com = new RegExp('^' + parent.bot.prefix + 'e(v(al)?)? (.|\\n)+$', 'i');
exports.name = 'Eval';
exports.usage = parent.bot.prefix + 'e[v[al]] code<String>';
exports.level = 'Owner';
exports.category = 'Bot';
exports.description = `Evaluate JavaScript code.`;

exports.command = async function(msg, comm) {
	if (bot.admins.includes(msg.author.id)) {
		with (parent) {
			try {
				await msg.channel.send('```js\n' + parent.util.format(eval(comm[0][1])) + '```', {split: true});
			} catch(err) {
				await msg.channel.send('```js\n' + parent.util.format(err) + '```', {split: true});
			}
		}
	} else {
		try {
			await msg.reply('This is an owner-only command.');
		} catch(err) {
			await msg.author.send('This is an owner-only command.');
		}
	}
};
