'use strict';

// config and services
const app = require('./src/app');
const config = require('./src/config');
const logger = require('./src/services/logging.service');

(function init() {
	logger.info(__filename, 'init', `Starting ${config.botName}...`);
	app.app();
}());
