const parent = module.parent.exports,
bot = parent.bot,
client = parent.client;

module.exports = exports = new parent.Command();

exports.com = new RegExp('^' + bot.prefix + 'y[oa]m[ou]m(ma?)?', 'i');
exports.name = 'YoMomma';
exports.usage = bot.prefix + 'yoMomma';
exports.level = 'User';
exports.category = 'Miscellaneous';
exports.description = `Fetch a yommoma joke.`;

var cache = exports.cache = [ ];
setTimeout(async () => {
	cache.push(JSON.parse(await parent.get('http://api.yomomma.info/') || '{}'));
	parent.caches.aw--;
}, bot.asyncs + (parent.caches.aw++) * bot.balance);

exports.command = async function command(msg, comm) {
	var data = cache.shift() || JSON.parse(await parent.get('http://api.yomomma.info/') || '{"joke": ""}');
	data = data.joke;
	var rep = new parent.Discord.RichEmbed();
	rep.setTitle('Yo Momma!')
	.setURL('http://yomomma.info/')
	.setDescription(data)
	.setColor('RANDOM')
	.setTimestamp();
	try {
		await msg.reply({
			embed: rep
		});
	} catch(err) {
		await msg.author.send({
			embed: rep
		});
	}
	return setTimeout(async () => {
		cache.push(JSON.parse(await parent.get('http://api.yomomma.info/') || '{}'));
		parent.caches.aw--;
	}, bot.asyncs + (parent.caches.aw++) * bot.balance);
};
