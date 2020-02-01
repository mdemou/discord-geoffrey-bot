'use strict';

// libs
const cheerio = require('cheerio');

// config and services
const logger = require('./logging.service');

function loadCheerio(html) {
	try {
		logger.info(__filename, 'loadCheerio', 'Scrapping...');
		return cheerio.load(html);
	} catch (e) {
		logger.error(__filename, 'loadCheerio', e);
	}
}

module.exports = {
	loadCheerio,
};
