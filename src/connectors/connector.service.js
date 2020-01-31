'use strict';

// config and services
const chollosConnector = require('./chollometro/chollometro.connector');
const cinesaConnector = require('./cinesa/cinesa.connector');
const config = require('../config');
const digitalOceanConnector = require('./digitalocean/digitalocean.connector');
const elitetorrentConnector = require('./elitetorrent/elitetorrent.connector');
const logger = require('../services/logging.service');

const _connectorConfigMapper = ({handler, name}) => ({
  enabled: config.connectors[name].enabled,
  handler,
  name: config.channels[name],
  timeout: config.connectors[name].timeout,
})

function _loadConnectorsConfig() {
  logger.debug(__filename, '_loadConnectorsConfig', 'Loading connectors config');
  return [
    {handler: chollosConnector, name: config.channels.chollometro},
    {handler: cinesaConnector, name: config.channels.cinesa},
    {handler: digitalOceanConnector, name: config.channels.digitalOcean},
    {handler: elitetorrentConnector, name: config.channels.elitetorrent},
  ].map(_connectorConfigMapper);
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
