const parent = module.parent.exports,
client = parent.client,
bot = parent.bot;

module.exports = exports = new parent.Command();

exports.com = new RegExp('^' + parent.bot.prefix + '8b(all)?', 'i');
exports.name = '8ball';
exports.usage = parent.bot.prefix + '8ball[ query<String>]';
exports.level = 'User';
exports.category = 'Miscellaneous';
exports.description = `Get an 8ball reply.`;

var cache = exports.cache = [ ];
setTimeout(async () => {
	cache.push(JSON.parse(await parent.get('https://nekos.life/api/v2/8ball') || '{}'));
	parent.caches.aw--;
}, bot.asyncs + (parent.caches.aw++) * bot.balance);

exports.command = async function(msg, comm) {
	try {
		var data = cache.shift() || JSON.parse(await parent.get('https://nekos.life/api/v2/8ball') || '{}') || { };
		try {
			await msg.reply(decodeURIComponent(data.response), {
				file: data.url
			});
		} catch(er) {
			await msg.author.send(decodeURIComponent(data.response), {
				file: data.url
			});
		}
	} catch(err) {
		try {
			await msg.reply('Error occured. /:');
		} catch(er) {
			await msg.author.send('Error occured. /:');
		}
	}
	return setTimeout(async () => {
		cache.push(JSON.parse(await parent.get('https://nekos.life/api/v2/8ball') || '{}'));
		parent.caches.aw--;
	}, bot.asyncs + (parent.caches.aw++) * bot.balance);
};
