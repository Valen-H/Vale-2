const parent = module.parent.exports,
chalk = parent.chalk,
fs = parent.fs;

Object.assign(exports, parent);

var bot = exports.bot = parent.bot = JSON.parse(fs.readFileSync('./config.json') || '{"prefix": "!"}');

const init = exports.init = async function init() {
	
	if (exports.client) await exports.client.destroy();
	
	bot = exports.bot = parent.bot = JSON.parse((await fs.readFile('./config.json')) || '{"prefix": "!"}'),
	commands = exports.commands = parent.commands = [];
	const client = parent.client = exports.client = new parent.Discord.Client(bot.client);
	parent.reload();
	defaults();
	
	client.on('message', msg => {
		
		if (msg.author.bot) return;
		
		msg.content = msg.content ? msg.content : '';
		msg.content = msg.content.replace(/@me/g, '"' + msg.author.username + '"');
		
		const comm = [];
		
		var split = msg.content.split(bot.splitter),
		nar = [ ],
		pass = 0;
		
		split.forEach(it => {
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
		
		nar.forEach((it, ind, arr) => {
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
			(msg.content.match(/<:.+?:\d+?>/g) || []).map(emoji => {
				return client.emojis.find('name', emoji.replace(/(^<:|:\d*?>$)/g, '')) ||
				new parent.Discord.Emoji(msg.guild || (new parent.Discord.Guild(client)), {
					id: emoji.replace(/(^<:.+?:|>$)/g, ''),
					name: emoji.replace(/(^<:|:\d*?>$)/g, ''),
					require_colons: false,
					managed: false,
					roles: [ ]
				});
			}).filter(i => i).forEach(emoji => msg.mentions.emojis.set(emoji.id, emoji));
		}
		
		trig.forEach(async com => {
			try {
				await com.command(msg, comm);
			} catch(err) {
				console.warn(chalk.bgRed(parent.util.format(err)));
			}
		});
	});
	
	client.on('disconnect', () => {
		console.log(chalk.yellow.dim('Disconnected'), chalk.gray(new Date()));
	});
	
	return new Promise((rsl, rjc) => {
		client.on('ready', async () => {
			if (bot.hook) client.vale = await client.fetchWebhook(bot.hook);
			console.info(`Logged in as ${chalk.green(client.user.tag)}`);
			client.user.setPresence({
				status: 'online',
				afk: false,
				game: {
					name: bot.prefix + 'help',
					type: 'STREAMING'
				},
				since: new Date()
			});
			client.admin = await client.fetchUser(bot.admins[0] || client.user.id);
			rsl();
		});
		
		client.login((fs.readFileSync('.token') || 'null').toString() || bot.token || 'null');
	});
},
defaults = parent.defaults = exports.defaults = function defaults() {
	var tmp = {
		"client": {
			"disableEveryone": true,
			"apiRequestMethod": "burst",
			"messageCacheLifetime": 10,
			"messageSweepInterval": 20,
			"shardId": 0,
			"shardCount": 0,
			"messageCacheMaxSize": 100,
			"fetchAllMembers": false,
			"sync": false,
			"restWsBridgeTimeout": 4000,
			"disabledEvents": [ ],
			"restTimeOffset": 500,
		},
		"prefix": "!",
		"hook": "",
		"admins": [
			"266915298664382464"
		],
		"joiner": "%s",
		"splitter": " "
	};
	Object.assign(tmp, bot);
	return Object.assign(bot, tmp);
};

if (bot.watch !== false) fs.watch('./commands', {
	recursive: true,
	persistent: false
}, parent.reload);
