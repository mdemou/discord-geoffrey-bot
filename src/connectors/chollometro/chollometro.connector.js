'use strict';

// config and services
const config = require('../../config');
const chollometroDAO = require('./chollometro.DAO');
const chollometroModel = require('./chollometro.model');
const discordService = require('../../services/discord.service');
const logger = require('../../services/logging.service');
const rssService = require('../../services/rss.parser.service');

async function startConnector(channel) {
	try {
		logger.info(__filename, 'startConnector', 'Initializing Chollometro connector');
		const rssArray = await rssService.getRss(
			config.connectors.chollometro.url, _buildCustomRssFields(),
		);
		const filteredItems = await _getNotPublishedItems(rssArray.items);
		filteredItems.forEach(formatedCholloItem => {
			channel.send(_enrichMessage(formatedCholloItem));
		});
	} catch (e) {
		logger.error(__filename, 'startConnector', e);
	}
}

async function _getNotPublishedItems(rssItems) {
	try {
		logger.debug(__filename, '_getNotPublishedItems', 'Getting not published items');
		const nonSentItems = [];
		for (const item of rssItems) {
			const myRows = await chollometroDAO.findExistingGuid(item.guid);
			if (myRows.length === 0) {
				const formatedCholloItem = chollometroModel.formatChollo(item);
				logger.debug(__filename, '_getNotPublishedItems', 'Inserting into DDBB');
				await chollometroDAO.insertRecord(
					formatedCholloItem.guid, formatedCholloItem.title, formatedCholloItem.link, formatedCholloItem.pubDate,
					formatedCholloItem.image, formatedCholloItem.merchant, formatedCholloItem.price,
					formatedCholloItem.contentSnippet, formatedCholloItem.content, formatedCholloItem.categories,
				);
				nonSentItems.push(formatedCholloItem);
			}
		}
		return nonSentItems;
	} catch (e) {
		logger.error(__filename, '_getNotPublishedItems', e);
	}
}

function _buildCustomRssFields() {
	logger.debug(__filename, '_buildCustomRssFields', 'Building custom RSS fields');
	return {
		customFields: {
			item: [
				['media:content', 'image', { keepArray: true }],
				['pepper:merchant', 'merchant', { keepArray: true }],
			],
		},
	};
}

function _enrichMessage(formatedCholloItem) {
	try {
		logger.debug(__filename, '_enrichMessage', 'Enriching discord message');
		return discordService.sendRichEmbed({
			author: `${formatedCholloItem.merchant} - ${formatedCholloItem.price}`,
			color: config.connectors.chollometro.messageColor,
			desc: formatedCholloItem.contentSnippet.slice(0, config.connectors.maxDescriptionChars),
			footer: JSON.parse(formatedCholloItem.categories),
			thumbnail: formatedCholloItem.image,
			title: formatedCholloItem.title,
			URL: formatedCholloItem.link,
		});

	} catch (e) {
		logger.error(__filename, '_enrichMessage', e);
	}
}

module.exports = {
	startConnector,
};
