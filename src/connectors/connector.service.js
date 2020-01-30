'use strict';

// config and services
const chollosConnector = require('./chollometro/chollometro.connector');
const cinesaConnector = require('./cinesa/cinesa.connector');
const config = require('../config');
const digitalOceanConnector = require('./digitalocean/digitalocean.connector');
const elitetorrentConnector = require('./elitetorrent/elitetorrent.connector');
const logger = require('../services/logging.service');

function _loadConnectorsConfig() {
	logger.debug(__filename, '_loadConnectorsConfig', 'Loading connectors config');
	return [
		{
			enabled: config.connectors.chollometro.enabled,
			handler: chollosConnector,
			name: config.channels.chollometro,
			timeout: config.connectors.chollometro.timeout,
		},
		{
			enabled: config.connectors.cinesa.enabled,
			handler: cinesaConnector,
			name: config.channels.cinesa,
			timeout: config.connectors.cinesa.timeout,
		},
		{
			enabled: config.connectors.digitalOcean.enabled,
			handler: digitalOceanConnector,
			name: config.channels.digitalOcean,
			timeout: config.connectors.digitalOcean.timeout,
		},
		{
			enabled: config.connectors.elitetorrent.enabled,
			handler: elitetorrentConnector,
			name: config.channels.elitetorrent,
			timeout: config.connectors.elitetorrent.timeout,
		},
	];
}

function _scheduleConnector(connector, channel) {
	logger.debug(__filename, '_scheduleConnector', 'Scheduling connectors');
	setTimeout(async () => {
		await connector.handler.startConnector(channel);
		_scheduleConnector(connector, channel);
	}, connector.timeout);
}

function start(channels) {
	try {
		logger.info(__filename, 'start', 'Initializing connectors');
		_loadConnectorsConfig().forEach((connector) => {
			connector.enabled ? _scheduleConnector(connector, channels[connector.name]) : '';
		});
	} catch (e) {
		logger.error(__filename, 'start', e);
	}
}

module.exports = {
	start,
};
