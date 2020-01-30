'use strict';

// libs
// const { Pool, Client } = require('pg');
const { Pool } = require('pg');

// config and services
const config = require('../config');
const logger = require('./logging.service');

const pool = new Pool({
	user: config.postgreSQL.user,
	host: config.postgreSQL.host,
	database: config.postgreSQL.database,
	password: config.postgreSQL.password,
	port: config.postgreSQL.port,
});

async function query(queryToRun) {
	try {
		logger.debug(__filename, 'query', `Querying ${queryToRun}`);
		return await pool.query(queryToRun);
	} catch (e) {
		logger.error(__filename, 'query', e);
	}
}

module.exports = {
	pool,
	query,
};
