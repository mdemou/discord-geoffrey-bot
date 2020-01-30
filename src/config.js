'use strict';

require('dotenv').config();

module.exports = {
	botName: 'Geoffrey',
	channels: {
		chollometro: 'testing',
		cinesa: 'testing',
		elitetorrent: 'testing',
	},
	discord: {
		apiKey: process.env.DISCORD_APIKEY,
	},
	scrapers: {
		maxDescriptionChars: 200,
		chollometro: {
			baseUrl: 'https://www.chollometro.com',
			ddbbTable: 'chollometro',
			enabled: JSON.parse(process.env.SCRAPERS_CHOLLOMETRO_ENABLED),
			messageColor: '#ff7900',
			timeout: parseInt(process.env.SCRAPERS_CHOLLOMETRO_TIMEOUT, 10) || 300000, // in ms
			url: 'https://www.chollometro.com/rss',
		},
		cinesa: {
			baseUrl: 'https://www.cinesa.es',
			ddbbTable: 'cinesa',
			enabled: JSON.parse(process.env.SCRAPERS_CINESA_ENABLED),
			messageColor: '#2d4e82',
			timeout: parseInt(process.env.SCRAPERS_CINESA_TIMEOUT, 10) || 600000, // in ms
			url: 'https://www.cinesa.es/Peliculas/Estrenos',
		},
		elitetorrent: {
			baseUrl: 'https://elitetorrent.li',
			ddbbTable: 'elitetorrent',
			enabled: JSON.parse(process.env.SCRAPERS_ELITETORRENT_ENABLED),
			messageColor: '#2c6eb1',
			timeout: parseInt(process.env.SCRAPERS_ELITETORRENT_TIMEOUT, 10) || 1200000, // in ms
			url: 'https://www.elitetorrent.li/calidad/1080p-10/',
		},
	},
	logLevel: process.env.LOG_LEVEL || 'debug',
	postgreSQL: {
		host: process.env.PGHOST,
		password: process.env.PGPASSWORD,
		user: process.env.PGUSER,
		database: process.env.PGDATABASE,
		port: process.env.PGPORT,
	},
};
