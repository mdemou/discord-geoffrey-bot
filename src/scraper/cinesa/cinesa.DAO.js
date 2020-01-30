'use strict';

// config and services
const config = require('../../config');
const logger = require('../../services/logging.service');
const pgService = require('../../services/pg.service');
const TABLE = config.scrapers.cinesa.ddbbTable;

async function findExistingDataId(dataId) {
	try {
		logger.debug(__filename, 'findExistingDataId', 'Checking if cinesa_id already exists in DDBB');
		const existingDataId = await pgService.query(
			`
      select *
      from ${TABLE}
      where cinesa_id = '${dataId}'
      `,
		);
		return existingDataId.rows;
	} catch (e) {
		logger.error(__filename, 'findExistingDataId', e);
	}
}

async function insertRecord(dataId, urlMoviePath, image, title) {
	try {
		logger.debug(__filename, 'insertRecord', 'Inserting in ddbb new record');
		await pgService.query(
			`
      INSERT INTO ${TABLE} (cinesa_id, base_url, url_movie_path, image, title)
      VALUES (
        '${dataId}', '${config.scrapers.cinesa.baseUrl}', '${urlMoviePath}', '${image}', '${title}'
      )
      `,
		);
	} catch (e) {
		logger.error(__filename, 'insertRecord', e);
	}
}

module.exports = {
	findExistingDataId,
	insertRecord,
};