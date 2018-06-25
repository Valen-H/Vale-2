const parent = module.parent.exports;

async function command(args) {
	args.forEach(arg => {
		parent.lin(`.session ${arg}`);
		parent.lin(`.send ${arg}`);
	});
	return 0;
} //command

module.exports = new parent.Command('Sessions', 'Activate Spying and forwarding sessions on specific channel(s)', '(\\d+ )+', 'ids<Number[]>', command);
