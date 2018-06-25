const parent = module.parent.exports,
client = parent.client,
bot = parent.bot;

module.exports = exports = new parent.Command();

var wordnet;

try {
	wordnet = require('wordnet');
} catch(err) {
	wordnet = null;
}

exports.com = new RegExp('^' + parent.bot.prefix + 'def(ine)? .+$', 'i');
exports.name = 'Define';
exports.usage = parent.bot.prefix + 'def[ine] word<String>';
exports.level = 'User';
exports.category = 'Utility';
exports.description = `Define a word/sentence.`;

exports.command = async function(msg, comm) {
	if (wordnet) {
		wordnet.lookup(comm[0][1], async (err, defs) => {
			if (err) {
				try {
					await msg.reply('An error occured.');
				} catch(err) {
					await msg.author.send('An error occured.');
				}
			} else {
				const message = new parent.Discord.RichEmbed();
				message.setTitle(comm[0][1])
				.setDescription(`Definition(s) for ${comm[0][1]} [${defs.length}]:`)
				.setColor('RANDOM')
				.setFooter('Powered by WordNet')
				.setTimestamp()
				.addBlankField(true);
				defs.forEach((def, ind) => message.addField(`${def.meta.words.map(word => word.word)} :`, def.glossary, true));
				try {
					await msg.reply({
						embed: message,
						split: true
					});
				} catch(err) {
					await msg.author.send({
						embed: message,
						split: true
					});
				}
			}
		});
	} else {
		try {
			await msg.reply('Wordnet module is missing. /:');
		} catch(err) {
			await msg.author.send('Wordnet module is missing. /:');
		}
	}
};
