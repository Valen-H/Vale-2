const parent = module.parent.exports,
bot = parent.bot,
client = parent.client;

module.exports = exports = new parent.Command();

exports.com = new RegExp('^' + parent.bot.prefix + 'he?lp( .+)?$', 'i');
exports.name = 'Help';
exports.usage = parent.bot.prefix + 'h[e]lp[ command<String>]';
exports.level = 'User';
exports.category = 'Miscellaneous';
exports.description = `Help page.`;

exports.command = async function(msg, comm) {
	let message = '```Examples:\n!id user\n!id "user name"\n\nSyntax:\n[abc] - optional\n(grp1|grp2) - grouping (one or other)\n<Object> - datatype\n',
	categories = { };
	
	if (comm[0][1]) {
		return await chillout.forOf(parent.commands.sort().filter(com => ['name', 'category', 'level'].some(som => new RegExp(comm[0][1], 'i').test(com[som]))).filter(com => !com.hidden), com => {
			message = '```js\n' + `Category: ${com.category}\nLevel: ${com.level}\nName: ${com.name}\nDescription: ${com.description}\nUsage: ${com.usage}\nPattern: ${com.com}` + '```';
			msg.channel.send(message, {
				split: true
			}).catch(parent.ignore);
		}, this);
	}
	
	await chillout.forEach(parent.commands.sort().filter(com => !com.hidden), command => {
		categories[command.category || 'Uncategorised'] = categories[command.category || 'Uncategorised'] || [ ];
		categories[command.category || 'Uncategorised'].push(command);
	});
	
	for (let cat in categories) {
		message += '\n' + cat + ':\n';
		cat = categories[cat].sort();
		await chillout.forEach(cat, comm => {
			message += `- ${comm.name}\n${comm.description}\n\t${comm.usage}\n`;
		});
	}
	
	message += '```';
	
	try {
		await msg.reply(message, {
			split: true
		});
	} catch(err) {
		await msg.author.send(message, {
			split: true
		});
	}
};
