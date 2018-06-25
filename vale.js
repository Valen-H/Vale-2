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

String.prototype.equals = function(...args) {
	var str = this + '';
	return args.some(arg => {
		return (new RegExp('^' + arg + '$', 'gi')).test(str);
	});
};


const Discord = exports.Discord = require('discord.js'),
fs = exports.fs = require('fs-extra'),
chalk = exports.chalk = require('chalk'),
readline = exports.readline = require('readline'),
stream = exports.stream = require('stream'),
debug = exports.debug = require('util').debuglog('index'),
util = exports.util = require('util'),
stripAnsi = exports.stripAnsi = require('strip-ansi'),
os = exports.os = require('os'),
http = exports.http = require('http'),
https = exports.https = require('http2'),
child_process = exports.child_process = require('child_process'),
chillout = exports.chillout = global.chillout = require('chillout-es7');

class Command {
	constructor(name = '', desc = name, pattern = name, usage = pattern, comm = this.command, hidden = false) {
		this.name = name;
		this.description = desc;
		try {
			this.pattern = !(pattern instanceof RegExp) ? (new RegExp('^' + pattern + '$', 'mi')) : pattern;
		} catch(err) {
			this.pattern = /^$/mi;
		}
		this.usage = usage;
		this.hidden = hidden;
		this.command = comm.bind(this);
	} //ctor
	
	//@override
	command(params) { } //command
	
	set com(value) {
		this.pattern = value;
	} //legacy
	get com() {
		return this.pattern;
	} //legacy
	
	get comm() {
		return this.command;
	} //legacy
	set comm(value) {
		this.command = value;
	} //legacy
} //Command

exports.Command = Command;

const logs = exports.logs = fs.createWriteStream('log.txt', {
	flags: 'a+'
});

fs.ensureFileSync('config.json');
fs.ensureFileSync('log.txt');
fs.ensureDirSync('commands');
try {
	fs.unlinkSync('.stop');
} catch(e) { }

console._log = console.log;
console._error = console.error;
console.log = function log(...args) {
	console._log(...args);
	if (exports.client && exports.client.vale && args.join(' ')) {
		try {
			logs.write(args.join(' ') + os.EOL);
			if (exports.client.vale) exports.client.vale.send(stripAnsi(args.join(' ')));
		} catch(ign) { }
	}
};
console.error = function error(...args) {
	console._error(...args);
	if (exports.client && exports.client.vale && args.join(' ')) {
		try {
			logs.write(args.join(' ') + os.EOL);
			if (exports.client.vale) exports.client.vale.send(stripAnsi(args.join(' ')));
		} catch(ign) { }
	}
};

var rel = true,
caches = exports.caches = {
	aw: 0
},
collectors = exports.collectors = [ ],
commands = exports.commands = [ ],
prefix = exports.prefix = '\\.';

logs.write('-'.repeat((process.stdout.columns || 10) - 2) + '\n');

const init = exports.init = async function init() {
	console.log('Restarting...', chalk.gray(Date()));
	if (exports.client) {
		await exports.client.destroy();
	}
	delete require.cache[require.resolve('./init.js')];
	await require('./init.js').init();
	exports.prefix = '(' + exports.client.bot.prefix + '|\\.)';
	await chillout.forEach(exports.commands.filter(com => com.cache), com => {
		exports.caches[com.name] = com.cache;
	});
	console.log('Restarted', chalk.gray(Date()));
},
reload = exports.reload = async function reload() {
	if (!rel) return;
	rel = false;
	exports.commands = [ ];
	exports.templates = [ ];
	await chillout.forEach((await fs.readdir('./commands')).filter(fil => fil.endsWith('.js') && !fil.startsWith('.')), comm => {
		try {
			delete require.cache[require.resolve('./commands/' + comm)];
			exports.commands.push(require('./commands/' + comm));
		} catch(err) {
			console.warn(err);
		}
	});
	await chillout.forEach((await fs.readdir('./templates')).filter(fil => fil.endsWith('.js') && !fil.startsWith('.')), comm => {
		try {
			delete require.cache[require.resolve('./templates/' + comm)];
			exports.templates.push(require('./templates/' + comm));
		} catch(err) {
			console.warn(err);
		}
	});
	try {
		delete require.cache[require.resolve('./cli.js')];
		require('./cli.js');
	} catch(err) {
		console.warn(err);
	}
	console.info(chalk.yellow.dim('Commands reloaded'), chalk.gray(Date()));
	rel = true;
},
save = exports.save = async function save() {
	exports.defaults();
	await fs.writeFile('config.json', JSON.stringify(exports.bot, null, 2));
},
completer = exports.completer = function completer(line) {
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
},
get = exports.get = async function get(params, cb = () => { }) {
	return new Promise((rsl, rjc) => {
		var which = typeof params == 'string' ? params.startsWith('https') : false;
		return (which ? https : http).get(params, msg => {
			var data = '';
			msg.on('data', dt => data += dt);
			msg.once('end', () => {
				rsl(data);
				cb(data);
			});
			msg.once('error', err => rjc(err));
		});
	});
},
load = exports.load = async function load(file, cb = () => { }) {
	return new Promise((rsl, rjc) => {
		fs.readFile(file, (err, data) => {
			if (!err) {
				rsl(data);
			} else {
				rjc(err);
			}
			cb(data);
		});
	});
},
store = exports.store = async function store(file, data = '', cb = () => { }) {
	return new Promise((rsl, rjc) => {
		fs.writeFile(file, data, err => {
			if (err) {
				rjc(err);
			} else {
				rsl(data);
			}
			cb(data);
		});
	});
};

exports.catch = function(...dat) {
	console.warn(...dat);
};
exports.ignore = exports.ign = () => { };

process.on('unhandledRejection', console.warn);
process.on('warning', console.warn);
process.on('error', console.error);
process.on('uncaughtException', console.error);

init().then(() => {
	try {
		require('./templates/start.js')(exports);
		exports.lin(process.argv.slice(2).join(' '));
	} catch(err) { }
}).catch(console.error);
rl.prompt();

if (process.env.PORT) {
	exports.server = http.createServer((req, res) => res.end('OK.')).listen(process.env.PORT, () => console.info(chalk`Server bound to port {green.bold ${process.env.PORT}}`));
} //HEROKU

fs.watch('./commands', {
	recursive: true,
	persistent: false
}, reload);
fs.watch('./templates', {
	recursive: true,
	persistent: false
}, reload);
fs.watch('./cli.js', {
	persistent: false
}, reload);
fs.watch('./', {
	persistent: false
}, (type, file) => {
	if (file.endsWith('.stop')) {
		fs.unlink(file, () => exports.lin('.kill'));
	}
});
