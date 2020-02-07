'use strict';

// config and services
const config = require('../../config');
const logger = require('../../services/logging.service');
const pgService = require('../../services/pg.service');
const TABLE = config.connectors.chollometro.ddbbTable;

async function findExistingGuid(guid) {
	try {
		logger.debug(__filename, 'findExistingGuid', 'Checking if guid already exists in DDBB');
		const existingDataId = await pgService.query(
			`
      select *
      from ${TABLE}
      where guid = '${guid}'
      `,
		);
		return existingDataId.rows;
	} catch (e) {
		logger.error(__filename, 'findExistingGuid', e);
	}
}

async function insertRecord(
	guid, title, link, pubDate, image, merchantName,
	price, contentSnippet, content, categories,
) {
	try {
		logger.debug(__filename, 'insertRecord', 'Inserting in ddbb new record');

		await pgService.query(
			`
      INSERT INTO ${TABLE} (
				guid, base_url, title, url_chollo, publish_date, image,
				merchant, price, content_snippet, content, categories
			)
      VALUES (
				'${guid}', '${config.connectors.chollometro.baseUrl}', '${title}', '${link}',
				'${pubDate}', '${image}', '${merchantName}', '${price}', '${contentSnippet}',
				'${content}', '${categories}'
      )
      `,
		);
	} catch (e) {
		logger.error(__filename, 'insertRecord', e);
	}
}

module.exports = {
	findExistingGuid,
	insertRecord,
};
