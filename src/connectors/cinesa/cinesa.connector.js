'use strict';

// config and services
const axiosService = require('../../services/axios.service');
const cheerioService = require('../../services/cheerio.service');
const cinesaDAO = require('./cinesa.DAO');
const config = require('../../config');
const discordService = require('../../services/discord.service');
const logger = require('../../services/logging.service');

async function startConnector(channel) {
	try {
		logger.info(__filename, 'startConnector', 'Initializing cinesa connector');
		const cinesaWeb = await axiosService.get(config.connectors.cinesa.url);
		const cheerioLoadedHtml = cheerioService.loadCheerio(cinesaWeb);
		const cinesaItems = _getDOMItems(cheerioLoadedHtml);
		const filteredItems = await _getNotPublishedItems(cinesaItems);
		filteredItems.forEach(movieItem => {
			channel.send(_enrichMessage(movieItem));
		});
	} catch (e) {
		logger.error(__filename, 'startConnector', e);
	}
}

async function _getNotPublishedItems(cinesaItems) {
	try {
		logger.debug(__filename, '_getNotPublishedItems', 'Getting not published items');
		const nonSentItems = [];
		for (const item of cinesaItems) {
			const myRows = await cinesaDAO.findExistingDataId(item.dataId);
			if (myRows.length === 0) {
				logger.debug(__filename, '_getNotPublishedItems', 'Inserting into DDBB');
				await cinesaDAO.insertRecord(
					item.dataId, item.urlMoviePath, item.image, item.title,
				);
				nonSentItems.push(item);
			}
		}
		return nonSentItems;
	} catch (e) {
		logger.error(__filename, '_getNotPublishedItems', e);
	}
}

function _getDOMItems(cheerioLoadedHtml) {
	try {
		logger.debug(__filename, '_getDOMItems', 'Mapping cinesa cheerio results');
		const urlElems = cheerioLoadedHtml('article#cartelera.cartelera_peliculas ul li.listado-peliculas-item');
		const myDOMArr = [];

		for (let i = 0; i < urlElems.length; i++) {
			const item = {
				dataId: cheerioLoadedHtml(urlElems[i]).attr('data-id'),
				urlMoviePath: cheerioLoadedHtml(urlElems[i]).find('h3 .vf').attr('href'),
				image: cheerioLoadedHtml(urlElems[i]).find('a.linkcartel img').attr('src'),
				title: cheerioLoadedHtml(urlElems[i]).find('h3 .vf').text(),
			};
			myDOMArr.push(item);
		}
		return myDOMArr;
	} catch (e) {
		logger.error(__filename, '_getDOMItems', e);
	}
}

function _enrichMessage(movieItem) {
	try {
		logger.debug(__filename, '_enrichMessage', 'Enriching discord message');
		return discordService.sendRichEmbed({
			color: config.connectors.cinesa.messageColor,
			desc: 'Estrenos de cartelera en CINESA',
			thumbnail: movieItem.image,
			title: movieItem.title,
			URL: config.connectors.cinesa.baseUrl + movieItem.urlMoviePath,
		});
	} catch (e) {
		logger.error(__filename, '_enrichMessage', e);
	}
}

module.exports = {
	startConnector,
};
