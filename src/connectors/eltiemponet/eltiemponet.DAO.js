'use strict';

// config and services
const config = require('../../config');
const logger = require('../../services/logging.service');
const pgService = require('../../services/pg.service');
const TABLE = config.connectors.elitetorrent.ddbbTable;

async function findExistingImage(aemetLink) {
	try {
		logger.debug(__filename, 'findExistingLink', 'Checking if AEMET link already exists in DDBB');
		const existingAEMETLink = await pgService.query(
			`
      select *
      from ${TABLE}
      where image = '${aemetLink}'
      `,
		);
		return existingAEMETLink.rows;
	} catch (e) {
		logger.error(__filename, 'findExistingLink', e);
	}
}

async function insertRecord(urlMovie, image, quality, size, title, urlLang) {
	try {
		logger.debug(__filename, 'insertRecord', 'Inserting in ddbb new record');
		await pgService.query(
			`
      INSERT INTO ${TABLE} (url_base, url_movie, image, quality, size, title, url_lang)
      VALUES (
        '${config.connectors.elitetorrent.baseUrl}', '${urlMovie}', '${image}', '${quality}', '${size}', '${title}', '${urlLang}'
      )
      `,
		);
	} catch (e) {
		logger.error(__filename, 'insertRecord', e);
	}
}

module.exports = {
	findExistingImage,
	insertRecord,
};