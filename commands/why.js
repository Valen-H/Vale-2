const parent = module.parent.exports,
client = parent.client,
bot = parent.bot;

module.exports = exports = new parent.Command();

exports.com = new RegExp('^' + parent.bot.prefix + 'why$', 'i');
exports.name = 'Why';
exports.usage = parent.bot.prefix + 'why';
exports.level = 'User';
exports.category = 'Miscellaneous';
exports.description = `NAZE?!?`;

var cache = exports.cache = [ ];
setTimeout(async () => {
	cache.push(JSON.parse(await parent.get('https://nekos.life/api/v2/why') || '{}'));
	parent.caches.aw--;
}, bot.asyncs + (parent.caches.aw++) * bot.balance);

exports.command = async function(msg, comm) {
	try {
		var data = cache.shift() || JSON.parse(await parent.get('https://nekos.life/api/v2/why') || '{}') || { };
		try {
			await msg.reply(decodeURIComponent(data.why));
		} catch(er) {
			await msg.author.send(decodeURIComponent(data.why));
		}
	} catch(err) {
		try {
			await msg.reply('Error occured. /:');
		} catch(er) {
			await msg.author.send('Error occured. /:');
		}
	}
	return setTimeout(async () => {
		cache.push(JSON.parse(await parent.get('https://nekos.life/api/v2/why') || '{}'));
		parent.caches.aw--;
	}, bot.asyncs + (parent.caches.aw++) * bot.balance);
};
