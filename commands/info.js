const parent = module.parent.exports;

exports.com = new RegExp('^' + parent.bot.prefix + 'info?( .+)?$', 'i');
exports.name = 'Info';
exports.usage = parent.bot.prefix + 'inf[o][ user<String>]';
exports.level = 'User';
exports.category = 'Miscellaneous';
exports.description = `User info.`;

exports.command = async function(msg, comm) {
	var message = new parent.Discord.RichEmbed();
	if (!comm[0][1]) {
		var app = await parent.client.fetchApplication();
		message.setAuthor(parent.client.admin.username, parent.client.admin.displayAvatarURL, 'https://github.com/ValentinHacker')
		.setColor('RANDOM')
		.setDescription(`${app.name} is a bot developed by ${parent.client.admin.tag}.`)
		.setImage('https://cdn.discordapp.com/icons/443340924605693952/3ca51c3a354b3efa7657bc04516ca3a2.jpg')
		.setFooter(app.description, 'https://cdn.discordapp.com/icons/443340924605693952/3ca51c3a354b3efa7657bc04516ca3a2.jpg')
		.setTitle('Info')
		.setTimestamp()
		.setThumbnail(app.iconURL)
		.attachFile('./resources/Akai Miku.jpg', 'Hatsune Miku')
		.setURL('https://discord.gg/XJgrGkf')
		.addBlankField(true)
	} else if (/(guild?|serv(er)?)$/i.test(comm[0][1])) {
		var target = msg.guild || msg.channel;
		message.setAuthor(target.owner.displayName || target.owner.username, target.owner.displayAvatarURL || target.owner.user.displayAvatarURL, target.owner.user ? target.owner.user.displayAvatarURL : target.owner.displayAvatarURL)
		.setColor(target.owner.displayColor || 'RANDOM')
		.setThumbnail(target.iconURL)
		.setURL(target.owner.user ? target.owner.user.displayAvatarURL : target.owner.displayAvatarURL)
		.setTitle('Info')
		.setDescription(target.name)
		.setTimestamp()
		.setFooter('Created at : ' + target.createdAt, parent.client.user.displayAvatarURL)
		.addField('Id', target.id);
		if (target.memberCount) {
			message.addField('AFK Channel', (target.afkChannel || {name: 'none'}).name)
			.addField('AFK Timeout', target.afkTimeout + '')
			.addField('Default Channel', (target.defaultChannel || {name: 'none'}).name)
			.addField('Embeds Enabled', target.embedEnabled + '')
			.addField('Default Role', (target.defaultRole || {name: 'none'}).name)
			.addField('Members Count', target.memberCount + '')
			.addField('Region', target.region)
			.addField('Splash URL', target.splashURL)
			.addField('System Channel', (target.systemChannel || {name: 'none'}).name);
			try {
				var inv = await target.fetchInvites();
				if (inv.array.length) {
					message.setURL(inv.first().url);
				}
			} catch(err) { }
		} else {
			message.addField('Members Count', target.recipients.array().length + '');
		}
	} else {
		var user = msg.author;
		if (msg.mentions && msg.mentions.users && msg.mentions.users.array().length) {
			user = msg.mentions.users.first();
		} else if (comm[0][1] && msg.channel) {
			if (msg.channel.members) {
				user = msg.channel.members.find(comm[1] ? comm.last().param([1, 'x', 1])[2] : 'displayName', comm[1] ? comm.last().param([1, 'x', 1])[1] : comm[0][1]);
				if (!user) {
					user = msg.channel.members.find(mmb => {
						var param = comm[1] ? comm.last().param([1, 'x', 1])[2] : (/^[0-9]+$/.test(comm.last().param([1, 'x', 1])[1]) ? 'id' : 'displayName');
						if ((new RegExp(comm[1] ? comm.last().param([1, 'x', 1])[1] : comm[0][1], 'i')).test(mmb[param] || mmb.user[param])) {
							return user = mmb;
						}
					});
				}
			}
			if (msg.channel.recipients.length && !user) {
				user = msg.channel.recipients.find(mmb => {
					var param = comm[1] ? comm.last().param([1, 'x', 1])[2] : (/^[0-9]+$/.test(comm.last().param([1, 'x', 1])[1]) ? 'id' : (/#[0-9]{3,5}$/.test(comm.last().param([1, 'x', 1])[1]) ? 'tag' : 'username'));
					if ((new RegExp(comm[1] ? comm.last().param([1, 'x', 1])[1] : comm[0][1], 'i')).test(mmb[param])) {
						return user = mmb;
					}
				});
			} else if (msg.channel.recipient) {
				user = comm[0][1] == parent.client.user.username ? parent.client.user : msg.channel.recipient;
			}
		}
		
		//user = user ? user : (msg.guild ? msg.guild.members.get(msg.author.id) : msg.author);
		if (user) {
			user.presence.game = user.presence.game || {};
		
			message.setColor('RANDOM')
			.setTitle('Info')
			.setAuthor(user.user ? user.user.username : user.username, parent.client.user.displayAvatarURL, user.user ? user.user.displayAvatarURL : user.displayAvatarURL)
			.setDescription(user.user ? `Guild Member of ${msg.guild}` : 'Discord User')
			.setTimestamp()
			.setThumbnail(user.user ? user.user.displayAvatarURL : user.displayAvatarURL)
			.setFooter('Created at : ' + (user.user ? user.user.createdAt : user.createdAt), 'https://cdn.discordapp.com/icons/443340924605693952/3ca51c3a354b3efa7657bc04516ca3a2.jpg')
			.setURL(user.user ? user.user.displayAvatarURL : user.displayAvatarURL)
			.addField('Id', user.id)
			.addField('Status', user.presence.status)
			.addField('Game', user.presence.name + (user.presence.game.url ? ' (' + user.presence.game.url + ')' : ''))
			.addField('Tag', user.user ? user.user.tag : user.tag);
			
			if (user.user) {
				message.addField('Joined', user.joinedAt)
				.addField('Nickname', user.nickname)
				.addField('Highest Role', user.highestRole.name)
				.addField('Roles', user.roles.array().map(role => role.name).join(', '), true)
				.setColor(user.displayColor)
			}
		} else {
			try {
				await msg.reply(`Error occured. (Wrong parameters? try: ${parent.bot.prefix}help ${exports.name})`);
			} catch(err) {
				await msg.author.send(`Error occured. (Wrong parameters? try: ${parent.bot.prefix}help ${exports.name})`);
			}
			return;
		}
	}
	
	try {
		await msg.reply({
			split: true,
			embed: message
		});
	} catch(err) {
		await msg.author.send({
			split: true,
			embed: message
		});
	}
};
