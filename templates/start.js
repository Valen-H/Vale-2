const parent = module.parent.exports;

async function command(data) {
	return await parent.client.user.setPresence({
		status: 'online',
		afk: false,
		game: {
			name: (data.pop() || parent.client.bot.prefix) + 'help',
			type: 'LISTENING'
		},
		since: new Date()
	});
} //command

module.exports = new parent.Command('Presence', 'Fancy Presence', '.*', 'status<String>', command);
