const parent = module.parent.exports,
client = parent.client,
bot = parent.bot;

module.exports = exports = new parent.Command();

exports.com = new RegExp('^' + parent.bot.prefix + 'chat .+$', 'i');
exports.name = 'Chat';
exports.usage = parent.bot.prefix + 'chat text<String>';
exports.level = 'User';
exports.category = 'Miscellaneous';
exports.description = `"How are you today?".`;

exports.command = async function(msg, comm) {
	try {
		var data = JSON.parse(await parent.get('https://nekos.life/api/v2/chat?text=' + comm[0][1]) || '{}') || { };
		try {
			await msg.reply(decodeURIComponent(data.response));
		} catch(er) {
			await msg.author.send(decodeURIComponent(data.response));
		}
	} catch(err) {
		try {
			await msg.reply('Error occured. /:');
		} catch(er) {
			await msg.author.send('Error occured. /:');
		}
	}
};
