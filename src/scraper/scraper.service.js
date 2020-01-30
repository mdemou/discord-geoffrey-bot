'use strict';

// config and services
const chollosScraper = require('./chollometro/chollometro.scraper');
const cinesaScraper = require('./cinesa/cinesa.scraper');
const config = require('./../config');
const elitetorrentScraper = require('./elitetorrent/elitetorrent.scraper');
const logger = require('./../services/logging.service');

function _loadScrapersConfig() {
	logger.debug(__filename, '_loadScrapersConfig', 'Loading SCRAPERS config');
	return [
		{
			enabled: config.scrapers.chollometro.enabled,
			handler: chollosScraper,
			name: config.channels.chollometro,
			timeout: config.scrapers.chollometro.timeout,
		},
		{
			enabled: config.scrapers.cinesa.enabled,
			handler: cinesaScraper,
			name: config.channels.cinesa,
			timeout: config.scrapers.cinesa.timeout,
		},
		{
			enabled: config.scrapers.elitetorrent.enabled,
			handler: elitetorrentScraper,
			name: config.channels.elitetorrent,
			timeout: config.scrapers.elitetorrent.timeout,
		},
	];
}

function _scheduleScraper(scraper, channel) {
	logger.debug(__filename, '_scheduleScraper', 'Scheduling scrapers');
	setTimeout(async () => {
		await scraper.handler.startScraper(channel);
		_scheduleScraper(scraper, channel);
	}, scraper.timeout);
}

function start(channels) {
	try {
		logger.info(__filename, 'start', 'Initializing scrapers');
		_loadScrapersConfig().forEach((scraper) => {
			scraper.enabled ? _scheduleScraper(scraper, channels[scraper.name]) : '';
		});
	} catch (e) {
		logger.error(__filename, 'start', e);
	}
}

module.exports = {
	start,
};
