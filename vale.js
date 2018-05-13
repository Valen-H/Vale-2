#!/usr/bin/env node

Array.prototype.last = function (ind = 0) {
	return this[this.length - 1 - (ind | 0)];
};

Array.prototype.param = function (arr = [], jn = exports.bot.splitter) {
	var nar = [],
	last = 0,
	sp = Array.from(this);
	arr.forEach((it, ind) => {
		if (it == 'x') it = sp.length - arr.slice(ind + 1).concat(0).reduce((acc, it) => acc += it | 0);
		nar.push(sp.splice(0, (it | 0) || 1).join(jn));
	});
	return nar = nar.concat(sp);
};

const Discord = exports.Discord = require('discord.js'),
fs = exports.fs = require('fs-extra'),
chalk = exports.chalk = require('chalk'),
readline = exports.readline = require('readline'),
stream = exports.stream = require('stream'),
debug = exports.debug = require('util').debuglog('index'),
util = exports.util = require('util'),
stripAnsi = exports.stripAnsi = require('strip-ansi'),
cluster = exports.cluster = require('cluster'),
os = exports.os = require('os'),
http = exports.http = require('http'),
child_process = exports.child_process = require('child_process');

const logs = exports.logs = fs.createWriteStream('log.txt', {
	flags: 'a+'
});

fs.ensureFileSync('config.json');
fs.ensureFileSync('log.txt');
fs.ensureDirSync('commands');

console._log = console.log;
console._error = console.error;
console.log = function(...args) {
	console._log(...args);
	if (exports.client && exports.client.vale && args.join(' ')) {
		try {
			logs.write(args.join(' '));
			if (exports.client.vale) exports.client.vale.send(stripAnsi(args.join(' ')));
		} catch(ign) { }
	}
};
console.error = function(...args) {
	console._error(...args);
	if (exports.client && exports.client.vale && args.join(' ')) {
		try {
			logs.write(args.join(' '));
			if (exports.client.vale) exports.client.vale.send(stripAnsi(args.join(' ')));
		} catch(ign) { }
	}
};

var rel = true;

logs.write('-'.repeat(process.stdout.columns || 10) + '\n');

const init = exports.init = async function init() {
	console.log('Restarting...', chalk.gray(new Date()));
	if (exports.client) {
		await exports.client.destroy();
	}
	delete require.cache[require.resolve('./init.js')];
	await require('./init.js').init();
	console.log('Restarted', chalk.gray(new Date()));
},
reload = exports.reload = async function() {
	if (!rel) return;
	rel = false;
	exports.commands = [];
	(await fs.readdir('./commands')).forEach(comm => {
		try {
			delete require.cache[require.resolve('./commands/' + comm)];
			exports.commands.push(require('./commands/' + comm));
		} catch(err) {
			console.warn(err);
		}
	});
	console.info(chalk.yellow.dim('Commands reloaded'), chalk.gray(new Date()));
	rel = true;
},
save = exports.save = async function() {
	exports.defaults();
	await fs.writeFile('config.json', JSON.stringify(exports.bot, null, 2));
},
completer = exports.completer = function(line) {
	rl.comps = rl.comps.sort();
	return [rl.comps.filter(cmp => (cmp.includes(line) && line.length > 5) || cmp.startsWith(line)), line];
},
rl = exports.rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
	completer: completer
}),
rnd = exports.rnd = function rnd(frm, to, rd) {
	if (frm === undefined) {
		return "#" + Math.round(Math.random() * 16777215).toString(16);
	} else {
		to = to === undefined ? frm : to;
		frm = frm == to ? 0 : frm;
		var tmp = [Math.min(frm, to), Math.max(frm, to)];
		frm = tmp[0] ? tmp[0] : 0;
		to = tmp[1];
		return !rd || [frm, to].every(function(val) {
			return !/\./gmi.test(val.toString())
		}) ? Math.round(Math.random() * (to - frm) + frm) : (Math.random() * (to - frm) + frm);
	}
};

rl.comps = ['stop', 'nocolor', 'color',
'reload', 'restart', 'clear',
'save', 'memory', '# '];

rl.on('line', async line => {
	if (/^\.(stop|q(ui)?t|exit|close|pause|kill)$/i.test(line)) {
		if (exports.client) await exports.client.destroy();
		process.exit();
	} else if (/^\.res(tart)?$/i.test(line)) {
		exports.init();
	} else if (/^\.rel(oad)?$/i.test(line)) {
		exports.reload();
	} else if (/^\.save?$/i.test(line)) {
		await save();
	} else if (/^\.mem(ory)?$/i.test(line)) {
		var mem = (process.memoryUsage().heapUsed / process.memoryUsage().heapTotal).toFixed(2),
		red = 255 * mem,
		green = 255 - red;
		console.info(chalk.rgb(red, green, 5)(100 * mem + '%'));
	} else if (/^\.(no)?col(or)?$/i.test(line)) {
		chalk.enabled = !/^no/i.test(line);
		console.info(`Colors ${chalk.enabled ? 'En' : 'Dis'}abled`.split('').map(le => chalk.hex(rnd())(le)).join(''));
	} else if (/^\.cl(ea)?[rn]$/i.test(line)) {
		readline.cursorTo(process.stdout, 0, 0);
		readline.clearScreenDown(process.stdout);
		readline.cursorTo(process.stdout, 0, process.stdout.rows - 1);
		await fs.truncate('log.txt');
		fs.unlink('npm-debug.log', err => { });
		console.info('\n'.repeat(process.stdout.rows || 10) + 'Logs Erased.', chalk.gray(new Date()));
	} else if (/^# .+/i.test(line)) {
		const proc = child_process.spawn(line.split(' ')[1], line.split(' ').slice(2).concat(/(^|\W|\b| )ls( |\W|\b|$)/g.test(line.split(' ').slice(1).join(' ')) ? ['--color=auto'] : []), {
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
	} else {
		with (exports) {
			try {
				console.info(chalk.green(util.format(eval(line))));
			} catch(err) {
				console.warn(chalk.red(util.format(err)));
			}
		}
	}
});

exports.catch = function(...dat) {
	console.warn(...dat);
};
exports.ignore = () => { };

process.on('unhandledRejection', console.warn);
process.on('warning', console.warn);
process.on('error', console.error);
process.on('uncaughtException', console.error);

init().catch(console.error);

if (process.env.PORT) {
	exports.server = http.createServer((req, res) => res.end('OK.')).listen(process.env.PORT, () => console.info(chalk`Server bound to port {green.bold ${process.env.PORT}}`));
}
