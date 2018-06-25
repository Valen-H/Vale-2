const parent = module.parent.exports,
client = parent.client,
bot = parent.bot;

module.exports = exports = new parent.Command();

exports.com = new RegExp('^' + parent.bot.prefix + 'ima?ge?( .+)?$', 'i');
exports.name = 'Image';
exports.usage = parent.bot.prefix + 'image tag<String>';
exports.level = 'User';
exports.category = 'Miscellaneous';
exports.description = `°_° oh my...`;

var types = exports.types = [
	'feet', 'yuri', 'trap',
	'futanari', 'hololewd', 'lewdkemo',
	'solog', 'feetg', 'cum',
	'erokemo', 'les', 'wallpaper',
	'lewdk', 'ngif', 'meow',
	'tickle', 'lewd', 'feed',
	'gecg', 'eroyuri', 'eron',
	'cum_jpg', 'bj', 'nsfw_neko_gif',
	'solo', 'kemonomimi', 'nsfw_avatar',
	'gasm', 'poke', 'anal',
	'slap', 'hentai', 'avatar',
	'erofeet', 'holo', 'keta',
	'blowjob', 'pussy', 'tits',
	'holoero', 'lizard', 'pussy_jpg',
	'pwankg', 'classic', 'kuni',
	'waifu', 'pat', '8ball',
	'kiss', 'femdom', 'neko',
	'cuddle', 'erok', 'fox_girl',
	'boobs', 'Random_hentai_gif', 'smallboobs',
	'hug', 'ero'
].sort(),
cache = exports.cache = { };

chillout.forEach(types, type => {
	cache[type] = [ ];
});

exports.command = async function(msg, comm) {
	if (!msg.channel.nsfw && msg.guild/* && !bot.admins.includes(msg.author.id)*/) {
		try {
			msg.reply('This command can only be used in NSFW channels. /:');
		} catch(err) {
			msg.author.send('This command can only be used in NSFW channels. /:');
		}
		return;
	}
	
	try {
		var data;
		if (comm[0][1] && types.includes(comm[0][1])) {
			data = cache[comm[0][1]].shift() || JSON.parse(await parent.get('https://nekos.life/api/v2/img/' + comm[0][1]) || '{}');
			data.text = '';
		} else {
			data = {
				text: 'Possible Types : ```' + types.join(', ') + '```'
			};
		}
		try {
			await msg.reply(decodeURIComponent(data.text) || data.url);
		} catch(er) {
			await msg.author.send(decodeURIComponent(data.text) || data.url);
		}
	} catch(err) {
		try {
			await msg.reply('Error occured. /:');
		} catch(er) {
			await msg.author.send('Error occured. /:');
		}
	}
	return setTimeout(async () => {
		if (comm[0][1]) cache[comm[0][1]].push(JSON.parse(await parent.get('https://nekos.life/api/v2/img/' + comm[0][1]) || '{}'));
		parent.caches.aw--;
	}, bot.asyncs + (parent.caches.aw++) * bot.balance);
};
