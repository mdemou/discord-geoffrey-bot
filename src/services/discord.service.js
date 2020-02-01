'use strict';

// libs
const Discord = require('discord.js');

// config and services
const config = require('./../config');
const logger = require('./logging.service');

function initDiscord() {
	try {
		logger.info(__filename, 'initDiscord', 'Starting and login Discord Client');
		const discordClient = new Discord.Client();
		discordClient.login(config.discord.apiKey);
		return discordClient;
	} catch (e) {
		logger.error(__filename, 'initDiscord', e);
	}
}

function sendRichEmbed(richEmbed) {
	try {
		logger.info(__filename, 'sendRichEmbed', `Sending RichEmbed ${richEmbed}`);
		const myRichEmbed = new Discord.RichEmbed();
		richEmbed.author ? myRichEmbed.setAuthor(richEmbed.author) : '';
		richEmbed.color ? myRichEmbed.setColor(richEmbed.color) : '';
		richEmbed.desc ? myRichEmbed.setDescription(richEmbed.desc) : '';
		richEmbed.footer ? myRichEmbed.setFooter(richEmbed.footer) : '';
		richEmbed.thumbnail ? myRichEmbed.setThumbnail(richEmbed.thumbnail) : '';
		richEmbed.timestamp ? myRichEmbed.setTimestamp(richEmbed.timestamp) : '';
		richEmbed.title ? myRichEmbed.setTitle(richEmbed.title) : '';
		richEmbed.URL ? myRichEmbed.setURL(richEmbed.URL) : '';
		return myRichEmbed;
	} catch (e) {
		logger.error(__filename, 'sendRichEmbed', e);
	}
}

module.exports = {
	initDiscord,
	sendRichEmbed,
};
