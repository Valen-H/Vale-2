const parent = module.parent.exports,
client = parent.client;

exports.com = new RegExp('^' + parent.bot.prefix + '(prune|purge) ?\\d*$', 'i');
exports.name = 'Prune/Purge';
exports.usage = parent.bot.prefix + '(prune|purge)[ messages<Number>=1]';
exports.level = 'Admin';
exports.category = 'Moderation';
exports.description = `Delete a number of messages in current channel (Requires MANAGE_MESSAGES permission).`;

exports.command = async function(msg, comm) {
	var def = msg.channel instanceof parent.Discord.TextChannel ? 1 : 50;
	if (msg.guild && msg.channel && msg.guild.members.get(client.user.id)) {
		if (msg.channel.permissionsFor(msg.author).has('MANAGE_MESSAGES') && msg.channel.permissionsFor(client.user).has('MANAGE_MESSAGES')) {
			var msgs = (await msg.channel.fetchMessages({limit: (comm[0][1] || def) | 0, before: msg.id})).array().filter(ms => ms.deletable);
			await msg.channel.bulkDelete(msgs);
			try {
				await msg.reply(`Purged ${msgs.length} messages.`);
			} catch(err) {
				await msg.author.send(`Purged ${msgs.length} messages.`);
			}
		} else if (msg.channel.permissionsFor(msg.author).has('MANAGE_MESSAGES')) {
			try {
				await msg.reply('Missing MANAGE_MESSAGES permission my your side.');
			} catch(err) {
				await msg.author.send('Missing MANAGE_MESSAGES permission my your side.');
			}
		} else {
			try {
				await msg.reply('Missing MANAGE_MESSAGES permission on your side.');
			} catch(err) {
				await msg.author.send('Missing MANAGE_MESSAGES permission on your side.');
			}
		}
	} else {
		var msgs = (await msg.channel.fetchMessages({limit: (comm[0][1] || def) | 0, before: msg.id})).array().filter(ms => ms.deletable);
		await msg.channel.bulkDelete(msgs);
		try {
			await msg.reply(`Purged ${msgs.length} messages.`);
		} catch(err) {
			await msg.author.send(`Purged ${msgs.length} messages.`);
		}
	}
};
