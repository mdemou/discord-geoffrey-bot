'use strict';

// config and services
const config = require('../../config');
const chollometroDAO = require('./chollometro.DAO');
const discordService = require('./../../services/discord.service');
const logger = require('./../../services/logging.service');
const rssService = require('./../../services/rss.parser.service');

async function startScraper(channel) {
	try {
		logger.info(__filename, 'startScraper', 'Initializing Chollometro scraper');
		const rssArray = await rssService.getRss(
			config.scrapers.chollometro.url, _buildCustomRssFields(),
		);
		const filteredItems = await _getNotPublishedItems(rssArray.items);
		filteredItems.forEach(cholloItem => {
			channel.send(_enrichMessage(cholloItem));
		});
	} catch (e) {
		logger.error(__filename, 'startScraper', e);
	}
}

async function _getNotPublishedItems(rssItems) {
	try {
		logger.debug(__filename, '_getNotPublishedItems', 'Getting not published items');
		const nonSentItems = [];
		for (const item of rssItems) {
			const myRows = await chollometroDAO.findExistingGuid(item.guid);
			if (myRows.length === 0) {
				logger.debug(__filename, '_getNotPublishedItems', 'Inserting into DDBB');
				await chollometroDAO.insertRecord(
					item.guid, item.title, item.link, item.pubDate, item.image[0]['$'].url, item.merchant[0]['$'].name,
					item.merchant[0]['$'].price, item.contentSnippet, item.content, item.categories,
				);
				nonSentItems.push(item);
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

function _enrichMessage(rssItem) {
	try {
		logger.debug(__filename, '_enrichMessage', 'Enriching discord message');
		return discordService.sendRichEmbed({
			author: rssItem.merchant[0]['$'].price ? `${rssItem.merchant[0]['$'].name} · ${rssItem.merchant[0]['$'].price}` : rssItem.merchant[0]['$'].name,
			color: config.scrapers.chollometro.messageColor,
			desc: rssItem.contentSnippet.slice(0, config.scrapers.maxDescriptionChars),
			footer: rssItem.categories,
			thumbnail: rssItem.image[0]['$'].url,
			timestamp: rssItem.isoDate,
			title: rssItem.title,
			URL: rssItem.link,
		});

	} catch (e) {
		logger.error(__filename, '_enrichMessage', e);
	}
}

module.exports = {
	startScraper,
};
