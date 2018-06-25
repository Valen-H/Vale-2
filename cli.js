const parent = module.parent.exports,
Command = parent.Command,
chalk = parent.chalk,
readline = parent.readline,
fs = parent.fs,
child_process = parent.child_process,
util = parent.util,
stripAnsi = parent.stripAnsi,
debug = util.debuglog('cli'),
rnd = parent.rnd,
rl = parent.rl;

Object.assign(exports, parent);

const clics = parent.clics = [
	new Command('Kill', 'Stop bot', exports.prefix + '(sto?p|q(ui)?t|e(xit)?|clo?se?|pause?|kill?)', exports.prefix + '(kill|stop|quit|close|pause|exit)', async line => {
		if (exports.client) await exports.client.destroy();
		if (!line.includes('pause')) process.exit();
	}),
	new Command('Restart', 'Restart bot', exports.prefix + 'res(tart)?', exports.prefix + 'restart', async line => {
		await exports.init();
	}),
	new Command('Reload', 'Reload bot commands', exports.prefix + 'rel(oad)?', exports.prefix + 'reload', async line => {
		await exports.reload();
	}),
	new Command('Save', 'Save bot configuration', exports.prefix + 'save?', exports.prefix + 'save', async line => {
		await exports.save();
	}),
	new Command('Memory', 'View memory usage (needs 256-truecolor term)', exports.prefix + 'mem(ory)?', exports.prefix + 'memory', line => {
		var mem = (process.memoryUsage().heapUsed / process.memoryUsage().heapTotal).toFixed(2),
		red = 255 * mem,
		green = 255 - red;
		console.info(chalk.rgb(red, green, 5)(100 * mem + '%'));
	}),
	new Command('Colors', 'Toggle console colors', exports.prefix + '(no)?col(or)?s?', exports.prefix + '[no]colors', line => {
		chalk.enabled = !line.includes('no');
		console.info(`Colors ${chalk.enabled ? 'En' : 'Dis'}abled`.split('').map(le => chalk.hex(rnd())(le)).join(''));
	}),
	new Command('Session', 'Start/Stop bot spying session', exports.prefix + 'ses(sion)?(s?top)?( \\d+)?', exports.prefix + 'session[stop][ channelID<Number>]', async line => {
		var chan = exports.client.channels.get(line.split(' ').slice(1).join(' '));
		if (chan && chan.createMessageCollector && !exports.collectors.some(col => col.channel.id == chan.id) && !line.split(' ').shift().endsWith('top')) {
			let col = chan.createMessageCollector(msg => msg, { });
			col.on('collect', (msg, col) => {
				console.info(chalk.yellow.dim(msg.author.tag) + ` {${col.channel.name || col.channel.id}${col.channel.guild ? ' / ' + col.channel.guild.name : ''}}` + ': ' + chalk.keyword('orange')(msg.content));
			});
			col.on('end', (cols, reas) => console.info(chalk.green(reas)));
			exports.collectors.push(col);
			console.info(chalk.green(`Spying started at '${chan.name || chan.id}${chan.guild ? ' / ' + chan.guild.name : ''}'`));
			let ms = await chan.fetchMessages({limit: 2});
			await chillout.forEach(ms.array().reverse(), ms => {
				console.info(chalk.yellow.dim(ms.author.tag) + ` {${col.channel.name || col.channel.id}${col.channel.guild ? ' / ' + col.channel.guild.name : ''}}` + ': ' + chalk.keyword('orange')(ms.content));
			});
		} else if (line.split(' ').shift().endsWith('top')) {
			if (line.split(' ').length < 2 && !chan) {
				exports.collectors.forEach(col => col.stop(`Spying ended in ${col.channel.name || col.channel.id}${col.channel.guild ? ' / ' + col.channel.guild.name : ''}...`));
				exports.collectors = [ ];
				console.info(chalk.green.dim('Spying End.'));
			} else {
				let chann = exports.collectors.find(col => col.channel.id == chan.id);
				if (chann) {
					await chann.stop(`Spying ended in ${chan.name || chan.id}${chan.guild ? ' / ' + chan.guild.name : ''}`);
				} else {
					console.warn(chalk.red('Channel is not being monitored.'));
				}
			}
		} else {
			console.warn(chalk.redBright('Error occured.'));
			//bad/no id, or chan is spied
		}
	}),
	new Command('Forwarding', 'Start bot forwarding session', exports.prefix + 'se?nd \\d+( .+)?', exports.prefix + 'send channelID<Number>[ message<String>]', async line => {
		var chan = exports.client.channels.get(line.split(' ')[1]),
		text = line.split(' ').slice(2).join(' ');
		if (text && chan) {
			await chan.send(text, {
				split: true
			});
		} else if (chan) {
			rl.block = 'send';
			rl.data = {
				chan: chan
			};
			rl._prompt = chan.id + ' ';
			console.info(chalk.green(`Forwarding to '${chan.name || chan.id}${chan.guild ? ' / ' + chan.guild.name : ''}'`));
		} else {
			console.warn(chalk.red('Error occured.'));
			//chan
		}
	}),
	new Command('Clear', 'Clear console and logs', exports.prefix + 'c(l(ea)?[rn])?', exports.prefix + 'clear', async line => {
		readline.cursorTo(process.stdout, 0, 0);
		readline.clearScreenDown(process.stdout);
		readline.cursorTo(process.stdout, 0, process.stdout.rows - 1);
		await fs.truncate('log.txt');
		fs.unlink('npm-debug.log', err => { });
		console.info('\n'.repeat(process.stdout.rows || 10) + 'Logs Erased.', chalk.gray(Date()));
	}),
	new Command('Spawn', 'Spawn process', exports.prefix + ' .+', exports.prefix + ' command<String>', line => {
		const proc = child_process.spawn(line.split(' ')[1], line.split(' ').slice(2).concat(/(^|\W|\b| )ls( |\W|\b|$)/g.test(line.split(' ').slice(1).join(' ')) ? ['--color=auto', '-A'] : [ ]), {
			cwd: process.cwd(),
			detached: false,
			stdio: 'inherit',
			shell: true
		});
		proc.on('error', console.error);
		proc.on('close', code => {
			if (code) {
				code = chalk`{red ${code}}`;
			} else {
				code = chalk`{cyan.dim ${code}}`;
			}
			console.info(chalk`\n{grey.dim.bgYellow.bold child process exited with code ${code}.}`);
			rl.resume();
		});
		rl.pause();
	}),
	new Command('Map', 'Map client IDs', exports.prefix + 'map(g|c)( .+)?', exports.prefix + 'map(g|c)[ index<Number>]', line => {
		var param = line.split(' ')[1],
		param2 = line.split(' ').slice(2).join(' ');
		if (line.split(' ').shift().endsWith('g')) {
			console.info(exports.client.guilds.filter((gld, ind) => ind == param || gld.id.includes(param) || gld.name.includes(param) || !param).array().map((guild, ind) => chalk.yellow(ind) + ') ' + chalk.underline(guild.name) + ' : ' + chalk.bold(guild.id)).join('\n'));
		} else {
			let gld = exports.client.guilds.array()[param];
			console.info(([chalk.bold.underline.gray(gld.name)].concat(gld.channels.filter((gld, ind) => ind == param2 || gld.id.includes(param2) || gld.name.includes(param2) || !param2).array().map((chn, ind) => chalk.yellow(ind) + ') ' + chalk.underline(chn.name) + ' : ' + chalk.bold(chn.id)))).join('\n'));
		}
	}),
	new Command('List', 'List templates', exports.prefix, exports.prefix, line => {
		chillout.forEach(exports.templates, (temp, ind) => {
			console.info(chalk.underline(chalk.yellow(ind + ') ') + chalk.bold(temp.name)));
			console.info(chalk.gray(temp.pattern));
			console.info(chalk.dim(temp.description));
		});
	}),
	new Command('Template', 'Execute template or show its manual', exports.prefix + '\\d+\\.?.*', exports.prefix + 'id<Number>[.][data<String>]', line => {
		var targ = line.split(' ')[0].replace(new RegExp(exports.prefix, 'ig'), '') | 0,
		tar = exports.templates[targ],
		args = line.split(' ').slice(1);
		if (line.split(' ')[0].endsWith('.')) {
			console.info(chalk.dim(tar.description));
		} else {
			tar.command(args);
		}
	}),
	new Command('Uptime', 'Process uptime', exports.prefix + 'up(time?)?', exports.prefix + 'uptime', line => {
		console.info(chalk.yellow.dim(process.uptime() / 60), 'mins');
	}),
	new Command('Mock', 'Send a mock message', exports.prefix + 'mock .+', exports.prefix + 'mock message<String>', async line => {
		if (exports.client.bot.mock) {
			await exports.client.channels.get(exports.client.bot.mock).send('.mock ' + line.split(' ').slice(1).join(' '));
		} else {
			console.warn(chalk.red('No mock channel specified in config.json'));
		}
	}),
	new Command('Log', 'Show logs', '', '', line => {
		parent.fs.createReadStream('log.txt').once('end', () => {
			console.info('-'.repeat(process.stdout.columns || 10));
		}).pipe(process.stdout);
	}),
	new Command('Eval', 'Evaluate command', '', 'command<JavaScript>', line => {
		with (exports) {
			try {
				console.info(chalk.green(util.format(eval(line))));
			} catch(err) {
				console.warn(chalk.red(util.format(err)));
			}
		}
	})
];

rl.comps = [
	'stop', 'nocolor', 'color',
	'reload', 'restart', 'clear',
	'save', 'memory', 'session ',
	'sessionStop ', 'mapg', 'mapc ',
	'send ', ' ', '',
	'mock ', 'uptime'
].map(it => '.' + it).sort();

rl.removeAllListeners();
rl.on('line', parent.lin = exports.lin = async line => {
	try {
		line = line.toString().trim();
		line = line.replace(/\$\{((.|\n)+?)\}/gim, (m, ...p) => eval(p.shift()));
		if (rl.block && !line.equals(exports.prefix + '.+')) {
			switch(rl.block) {
				case 'send':
					rl.data.chan.send(line, {
						split: true
					}).catch(exports.ignore);
					break;
			}
			rl.prompt();
			return;
		} else if (rl.block) {
			if (line.equals(exports.prefix + '(sto?p|q(ui)?t|e(xit)?|clo?se?).*')) {
				rl.block = false;
				console.info(chalk.green(`Disconnected from '${rl.data.chan.name || rl.data.chan.id}${rl.data.chan.guild ? ' / ' + rl.data.chan.guild.name : ''}'`));
				delete rl.data;
				rl._prompt = '> ';
				rl.prompt();
				return;
			}
		}
		await ((clics.find(clc => clc.pattern.test(line)) || clics.last()).command)(line);
		if (!rl.paused) rl.prompt();
	} catch(err) {
		console.warn(err);
	}
}).on('error', console.warn);
