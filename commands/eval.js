const parent = module.parent.exports,
client = parent.client;

exports.com = new RegExp('^' + parent.bot.prefix + 'e(val)? (.|\\n)+$', 'i');
exports.name = 'Eval';
exports.usage = parent.bot.prefix + 'eval code<String>';
exports.level = 'Owner';
exports.category = 'Bot';
exports.description = `Evaluate JavaScript code.`;

Object.assign(exports, parent);

exports.command = async function(msg, comm) {
	if (parent.bot.admins.includes(msg.author.id)) {
		with (exports) {
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
