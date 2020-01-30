'use strict';

// config and services
const config = require('./config');
const discordService = require('./services/discord.service');
const logger = require('./services/logging.service');
const connectorService = require('./connectors/connector.service');

function app() {
	logger.info(__filename, 'app', 'Running APP');
	const discordClient = discordService.initDiscord();

	discordClient.on('ready', () => {
		logger.info(__filename, 'app', `...${discordClient.user.tag} connected!`);

		const channels = {
			digitalOcean: discordClient.channels.find('name', config.channels.digitalOcean),
			chollometro: discordClient.channels.find('name', config.channels.chollometro),
			cinesa: discordClient.channels.find('name', config.channels.cinesa),
			elitetorrent: discordClient.channels.find('name', config.channels.elitetorrent),
		};

		channels.digitalOcean.send('DigitalOcean --- ' + new Date());
		channels.chollometro.send('Chollometro --- ' + new Date());
		channels.cinesa.send('Cinesa --- ' + new Date());
		channels.elitetorrent.send('Elitetorrent --- ' + new Date());
		connectorService.start(channels);
	});
}

module.exports = {
	app,
};

// discordClient.on("message", async message => {
//   const prefix = "$";
//   const args = message.content.slice(prefix.length).trim().split(/ +/g);
//   const command = args.shift().toLowerCase();

//   if(command === "help"){
//   	message.channel.send("Chutando como debe ser")
//   	return;
//   }
// });
