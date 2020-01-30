'use strict';

// libs
const Parser = require('rss-parser');

// config and services
const logger = require('./logging.service');

async function getRss(rssUrl, rssParserOptions) {
	try {
		logger.info(__filename, 'getRss', `Getting RSS from ${rssUrl}`);
		const rssParser = new Parser(rssParserOptions);
		return await rssParser.parseURL(rssUrl);
	} catch (e) {
		logger.error(__filename, 'getRss', e);
	}
}

module.exports = {
	getRss,
};
