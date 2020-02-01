'use strict';
// libs
const pino = require('pino');

// config and services
const config = require('../config');

const logger = pino({
	level: config.logLevel,
	timestamp: () => `,"humanDate":"${new Date().toISOString()}"`,
});

function _formatResponse(fileName, methodName, logItem) {
	return {
		filename: fileName.slice(fileName.lastIndexOf('/') + 1, -3),
		methodName,
		extra: JSON.stringify(logItem),
	};
}

function debug(fileName, methodName, message, logItem) {
	return logger.debug(_formatResponse(fileName, methodName, logItem), message);
}

function info(fileName, methodName, message, logItem) {
	return logger.info(_formatResponse(fileName, methodName, logItem), message);
}

function warn(fileName, methodName, message, logItem) {
	return logger.warn(_formatResponse(fileName, methodName, logItem), message);
}

function error(fileName, methodName, message, logItem) {
	return logger.error(_formatResponse(fileName, methodName, logItem), message);
}

function fatal(fileName, methodName, message, logItem) {
	return logger.fatal(_formatResponse(fileName, methodName, logItem), message);
}

module.exports = {
	debug,
	info,
	warn,
	error,
	fatal,
};
