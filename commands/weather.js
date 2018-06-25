const parent = module.parent.exports,
bot = parent.bot,
client = parent.client;

var weather = null

try {
	weather = require('yahoo-weather');
} catch(err) {
	weather = null;
}

module.exports = exports = new parent.Command();

exports.com = new RegExp('^' + bot.prefix + 'wea(ther)? .+', 'i');
exports.name = 'Weather';
exports.usage = bot.prefix + 'weather location<String>';
exports.level = 'User';
exports.category = 'Utility';
exports.description = `Fetch local weather stats.`;

exports.command = async function command(msg, comm) {
	if (weather) {
		var loc = comm[0][1],
		emb = new parent.Discord.RichEmbed(),
		w = await weather(loc);
		
		emb.setTimestamp()
		.setTitle(w.title)
		.setDescription(`${w.description}\n\nCoordinates: [${w.item.lat}, ${w.item.long}]\nDate: ${w.item.condition.date}\nCondition: ${w.item.condition.text}`)
		.addField('Wind', `Chill: ${w.wind.chill}\nDirection: ${w.wind.direction}\nSpeed: ${w.wind.speed}`, true)
		.addField('Atmosphere', `Humidity: ${w.atmosphere.humidity}\nPressure: ${w.atmosphere.pressure}\nRising: ${w.atmosphere.rising}\nVisibility: ${w.atmosphere.visibility}`, true)
		.addField('Astronomy', `Sunrise: ${w.astronomy.sunrise}\nSunset: ${w.astronomy.sunset}`, true)
		.addField('Forecast', `${w.item.forecast[0].day}, ${w.item.forecast[0].date}\n${w.item.forecast[0].high}~${w.item.forecast[0].low}\n${w.item.forecast[0].text}\n\n${w.item.forecast[1].day}, ${w.item.forecast[1].date}\n${w.item.forecast[1].high}~${w.item.forecast[1].low}\n${w.item.forecast[1].text}`, true)
		.setURL(w.link)
		.setColor('RANDOM')
		.setThumbnail(w.image.link)
		.setFooter('Powered by yahoo-weather', w.image.link);
		
		try {
			await msg.reply({
				embed: emb
			});
		} catch(err) {
			await msg.author.send({
				embed: emb
			});
		}
	} else {
		try {
			await msg.reply('yahoo-weather module is missing. /:');
		} catch(err) {
			await msg.author.send('yahoo-weather module is missing. /:');
		}
	}
};
