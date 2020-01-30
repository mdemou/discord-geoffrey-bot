'use strict';

// config and services
const axiosService = require('../../services/axios.service');
const config = require('../../config');
const discordService = require('../../services/discord.service');
const logger = require('../../services/logging.service');

async function startConnector(channel) {
	try {
		logger.info(__filename, 'startConnector', 'Initializing digital ocean connector');
		const balance = await axiosService.get(config.connectors.digitalOcean.balanceUrl, _buildHttpsRequest());
		channel.send(_enrichMessage(balance));
	} catch (e) {
		logger.error(__filename, 'startConnector', e);
	}
}

function _buildHttpsRequest() {
	logger.debug(__filename, '_buildHttpsRequest', 'Building https request');
	return {
		headers: {
			'Content-Type': 'application/json',
			'Authorization': 'Bearer ' + config.connectors.digitalOcean.token,
		}
	};
}

function _enrichMessage(balance) {
	try {
		logger.debug(__filename, '_enrichMessage', 'Enriching discord message');
		return discordService.sendRichEmbed({
			color: config.connectors.digitalOcean.messageColor,
			desc: ` \
			Month to date: ${balance.month_to_date_balance} \n \
			Account balance: ${balance.account_balance} \n \
			Month to date usage: ${balance.month_to_date_usage} \
			`,
			footer: `Generated at ${balance.generated_at}`,
			thumbnail: config.connectors.digitalOcean.image,
			title: 'Digital Ocean Balance',
		});
	} catch (e) {
		logger.error(__filename, '_enrichMessage', e);
	}
}

module.exports = {
	startConnector,
};
