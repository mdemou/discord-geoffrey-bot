'use strict';

// libs
const axios = require('axios');

// config and services
const logger = require('./logging.service');

async function get(url) {
	try {
		logger.info(__filename, 'get', `Getting ${url}`);
		const request = await axios.get(url);
		return request.data;
	} catch (e) {
		logger.error(__filename, 'get', e);
	}
}

module.exports = {
	get,
};
