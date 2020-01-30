'use strict';

// config and services
const config = require('./../../config');
const logger = require('./../../services/logging.service');
const pgService = require('./../../services/pg.service');
const TABLE = config.scrapers.elitetorrent.ddbbTable;

async function findExistingImage(image) {
	try {
		logger.debug(__filename, 'findExistingImage', 'Checking if image already exists in DDBB');
		const existingImage = await pgService.query(
			`
      select *
      from ${TABLE}
      where image = '${image}'
      `,
		);
		return existingImage.rows;
	} catch (e) {
		logger.error(__filename, 'findExistingImage', e);
	}
}

async function insertRecord(urlMovie, image, quality, size, title, urlLang) {
	try {
		logger.debug(__filename, 'insertRecord', 'Inserting in ddbb new record');
		await pgService.query(
			`
      INSERT INTO ${TABLE} (url_base, url_movie, image, quality, size, title, url_lang)
      VALUES (
        '${config.scrapers.elitetorrent.baseUrl}', '${urlMovie}', '${image}', '${quality}', '${size}', '${title}', '${urlLang}'
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