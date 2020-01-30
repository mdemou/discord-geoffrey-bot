'use strict';

// config and services
const axiosService = require('./../../services/axios.service');
const cheerioService = require('./../../services/cheerio.service');
const config = require('./../../config');
const discordService = require('./../../services/discord.service');
const eliteTorrentDAO = require('./elitetorrent.DAO');
const logger = require('./../../services/logging.service');

async function startScraper(channel) {
	try {
		logger.info(__filename, 'startScraper', 'Initializing Elitetorrent scraper');
		const eliteTorrentWeb = await axiosService.get(config.scrapers.elitetorrent.url);
		const cheerioLoadedHtml = cheerioService.loadCheerio(eliteTorrentWeb);
		const eliteTorrentItems = _getDOMItems(cheerioLoadedHtml);
		const filteredItems = await _getNotPublishedItems(eliteTorrentItems);
		filteredItems.forEach(async (movieItem) => {
			channel.send(_enrichMessage(movieItem));
		});
	} catch (e) {
		logger.error(__filename, 'startScraper', e);
	}
}

async function _getNotPublishedItems(eliteTorrentItems) {
	try {
		logger.debug(__filename, '_getNotPublishedItems', 'Getting not published items');
		const nonSentItems = [];
		for (const item of eliteTorrentItems) {
			const myRows = await eliteTorrentDAO.findExistingImage(item.image);
			if (myRows.length === 0) {
				logger.debug(__filename, '_getNotPublishedItems', 'Inserting into DDBB');
				await eliteTorrentDAO.insertRecord(
					item.urlMovie, item.image, item.quality, item.size, item.title, item.urlLang,
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
		logger.debug(__filename, '_getDOMItems', 'Mapping eliteTorrent cheerio results');
		const urlElems = cheerioLoadedHtml('ul.miniboxs li');
		const myDOMArr = [];

		for (let i = 0; i < urlElems.length; i++) {
			const item = {
				urlMovie: cheerioLoadedHtml(urlElems[i]).find('.imagen a').attr('href'),
				image: cheerioLoadedHtml(urlElems[i]).find('.imagen a img').attr('data-src'),
				quality: cheerioLoadedHtml(urlElems[i]).find('.imagen span.marca i').text(),
				size: cheerioLoadedHtml(urlElems[i]).find('.imagen .voto1 span').text(),
				title: cheerioLoadedHtml(urlElems[i]).find('.meta a.nombre').attr('title'),
				urlLang: cheerioLoadedHtml(urlElems[i]).find('.imagen span#idiomacio.marca i img').attr('data-src'),
			};
			(item.urlLang.indexOf('espanol') !== -1) ? myDOMArr.push(item) : '';
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
			color: config.scrapers.elitetorrent.messageColor,
			desc: `Torrent available in Spanish - ${movieItem.size} - ${movieItem.quality}`,
			footer: `${movieItem.size} - ${movieItem.quality}`,
			thumbnail: config.scrapers.elitetorrent.baseUrl + movieItem.image,
			title: movieItem.title,
			URL: movieItem.urlMovie,
		});
	} catch (e) {
		logger.error(__filename, '_enrichMessage', e);
	}
}

module.exports = {
	startScraper,
};
