const parent = module.parent.exports,
chalk = parent.chalk,
fs = parent.fs;

Object.assign(exports, parent); //NO STRICT!!

var bot = exports.bot = parent.bot = JSON.parse(fs.readFileSync('./config.json') || '{"prefix": "!"}'),
commands = { };

const init = exports.init = async function init() {
	
	if (exports.client) await exports.client.destroy();
	
	bot = exports.bot = parent.bot = JSON.parse((await fs.readFile('./config.json')) || '{"prefix": "!"}');
	commands = exports.commands = parent.commands = [ ];
	const client = parent.client = exports.client = new parent.Discord.Client(bot.client);
	parent.reload();
	client.bot = bot;
	defaults();
	parent.save();
	
	client.on('message', async msg => {
		
		if (msg.author.bot) {
			if (msg.content && msg.content.equals(parent.prefix + 'mock.+') && msg.author.id == client.user.id) {
				msg.content = msg.content.split(' ').slice(1).join(' ');
				msg.delete(1000);
			} else {
				return;
			}
		}
		if (bot.admins.includes(msg.author.id)) {
			msg.content = msg.content.replace(/\$\{((.|\n)+?)\}/gim, (m, ...p) => eval(p.shift()));
		}
		
		msg.content = msg.content ? msg.content : '';
		msg.content = msg.content.replace(/@me/g, '"' + msg.author.username + '"');
		
		const comm = [];
		
		var split = msg.content.split(bot.splitter),
		nar = [ ],
		pass = 0;
		
		await chillout.forEach(split, it => {
			if (pass <= 0) {
				nar.push(it.replace(/(^"|"$)/g, ''));
			} else {
				nar[nar.length - 1] += bot.splitter + it.replace(/(^"|"$)/g, '');
			}
			
			if (it.startsWith('"')) {
				pass++;
			}
			
			if (it.endsWith('"')) {
				pass--;
			}
		});
		
		await chillout.forEach(nar, (it, ind, arr) => {
			comm.push([]);
			arr.forEach((i, indd) => {
				if (indd <= ind) {
					comm[ind].push(i.replace(new RegExp(bot.joiner, 'gi'), bot.splitter).trim());
				}
			});
			comm[ind].push(arr.slice(ind + 1).join(bot.splitter).replace(new RegExp(bot.joiner, 'gi'), bot.splitter).trim());
			comm[ind] = comm[ind].filter(i => i);
		});
		
		if (comm.length > 1) comm.pop();
		
		var trig = parent.commands.filter(comm => comm.com.test(msg.content));
		
		if (trig.length) {
			console.info(`${msg.author.tag} in '${(msg.channel.name || msg.channel.id) + "'" + (msg.guild ? ' (' + msg.guild.name + ')' : '')} : ${msg.content}`);
		}
		
		if (msg.mentions) {
			msg.mentions.emojis = new parent.Discord.Collection();
			await chillout.forEach((msg.content.match(/<:.+?:\d+?>/g) || []).map(emoji => {
				return client.emojis.find('name', emoji.replace(/(^<:|:\d*?>$)/g, '')) ||
				new parent.Discord.Emoji(msg.guild || (new parent.Discord.Guild(client)), {
					id: emoji.replace(/(^<:.+?:|>$)/g, ''),
					name: emoji.replace(/(^<:|:\d*?>$)/g, ''),
					require_colons: false,
					managed: false,
					roles: [ ]
				});
			}).filter(i => i), emoji => msg.mentions.emojis.set(emoji.id, emoji));
		}
		
		if (msg.guild) {
			msg.channel.recipients = msg.channel.recipients || new parent.Discord.Collection();
			await chillout.forEach(msg.channel.members.map(mmb => mmb.user), usr => msg.channel.recipients.set(usr.id, usr));
		}
		
		await chillout.forEach(trig, async com => {
			try {
				await com.command(msg, comm);
			} catch(err) {
				console.warn(chalk.bgRed(parent.util.format(err)));
			}
		});
	});
	
	client.once('disconnect', () => {
		console.log(chalk.yellow.dim('Disconnected'), chalk.gray(Date()));
	});
	
	return new Promise((rsl, rjc) => {
		client.once('ready', async () => {
			if (bot.hook) client.vale = await client.fetchWebhook(bot.hook);
			console.info(`Logged in as ${chalk.green(client.user.tag)}\nListening to '${bot.prefix}'`);
			client.user.setPresence({
				status: 'online',
				afk: false,
				game: {
					name: bot.prefix + 'help',
					type: 'LISTENING'
				},
				since: new Date()
			});
			client.admin = await client.fetchUser(bot.admins[0] || client.user.id);
			rsl();
		});
		
		client.login((process.env.tkn || fs.readFileSync('.token') || 'null').toString() || bot.token || 'null');
	});
},
defaults = parent.defaults = exports.defaults = function defaults() {
	var tmp = JSON.parse(fs.readFileSync('./.pre/config.json') || '{"prefix": "!"}');
	Object.assign(tmp, bot);
	return Object.assign(bot, tmp);
};
