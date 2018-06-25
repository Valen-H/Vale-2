const parent = module.parent.exports,
client = parent.client,
bot = parent.bot;

module.exports = exports = new parent.Command();

exports.com = new RegExp('^' + parent.bot.prefix + 'owo(fy)? .+$', 'i');
exports.name = 'Owoify';
exports.usage = parent.bot.prefix + 'owo text<String>';
exports.level = 'User';
exports.category = 'Miscellaneous';
exports.description = `oweow!.`;

exports.command = async function(msg, comm) {
	try {
		var data = JSON.parse(await parent.get('https://nekos.life/api/v2/owoify?text=' + comm[0][1]) || '{}') || { };
		try {
			await msg.reply(decodeURIComponent(data.owo));
		} catch(er) {
			await msg.author.send(decodeURIComponent(data.owo));
		}
	} catch(err) {
		try {
			await msg.reply('Error occured. /:');
		} catch(er) {
			await msg.author.send('Error occured. /:');
		}
	}
};
