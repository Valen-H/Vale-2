const parent = module.parent.exports,
bot = parent.bot,
client = parent.client;

module.exports = exports = new parent.Command();

var trans = null;

try {
	trans = require('translate');
	trans.engine = 'yandex';
	trans.key = bot.key;
} catch(ign) { }

exports.com = new RegExp('^' + parent.bot.prefix + 'tra?ns(late)? .+( .+)?$', 'i');
exports.name = 'Translate';
exports.usage = parent.bot.prefix + 'trans word<String>[ from-to<String>]';
exports.level = 'User';
exports.category = 'Utility';
exports.description = `Translate a word.`;

exports.command = async function(msg, comm) {
	if (!trans) {
		try {
			await msg.reply('Translate module is missing. /:');
		} catch(err) {
			await msg.author.send('Translate module is missing. /:');
		}
	} else {
		var lang = ['en', 'en'],
		txt = '',
		emb = new parent.Discord.RichEmbed();
		if (comm[1] && comm[1][2] && comm[1][2].includes('-')) {
			lang = comm.concat([]).pop().pop().split('-');
			txt = comm.last().param([1, 'x', 1])[1];
		} else {
			txt = comm[0].last();
		}
		try {
			emb.setDescription(`From ${lang[0]} to ${lang.last()}`)
			.setColor('RANDOM')
			.setTitle(txt)
			.setFooter('Powered by translate.js')
			.setTimestamp()
			.addBlankField(true)
			.addField('Translation:', await trans(txt, {
				from: lang[0],
				to: lang.last()
			}), true);
			txt = {
				split: true,
				embed: emb
			};
		} catch(err) {
			txt = 'An Error occured. /:';
		}
		try {
			await msg.reply(txt);
		} catch(err) {
			await msg.author.send(txt);
		}
	}
};
