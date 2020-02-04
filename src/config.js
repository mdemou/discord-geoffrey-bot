'use strict';

require('dotenv').config();

module.exports = {
	botName: 'Geoffrey',
	channels: {
		chollometro: 'chollometro',
		cinesa: 'cinesa',
		digitalocean: 'digitalocean',
		elitetorrent: 'elitetorrent',
		eltiemponet: 'eltiemponet',
	},
	discord: {
		apiKey: process.env.DISCORD_APIKEY,
	},
	connectors: {
		maxDescriptionChars: 200,
		chollometro: {
			baseUrl: 'https://www.chollometro.com',
			ddbbTable: 'chollometro',
			enabled: JSON.parse(process.env.CONNECTORS_CHOLLOMETRO_ENABLED),
			messageColor: '#ff7900',
			timeout: parseInt(process.env.CONNECTORS_CHOLLOMETRO_TIMEOUT, 10) || 300000, // in ms
			url: 'https://www.chollometro.com/rss',
		},
		cinesa: {
			baseUrl: 'https://www.cinesa.es',
			ddbbTable: 'cinesa',
			enabled: JSON.parse(process.env.CONNECTORS_CINESA_ENABLED),
			messageColor: '#2d4e82',
			timeout: parseInt(process.env.CONNECTORS_CINESA_TIMEOUT, 10) || 600000, // in ms
			url: 'https://www.cinesa.es/Peliculas/Estrenos',
		},
		digitalocean: {
			balanceUrl: 'https://api.digitalocean.com/v2/customers/my/balance',
			enabled: JSON.parse(process.env.CONNECTORS_DIGITALOCEAN_ENABLED),
			image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/DigitalOcean_logo.svg/1200px-DigitalOcean_logo.svg.png',
			messageColor: '#0069ff',
			timeout: parseInt(process.env.CONNECTORS_DIGITALOCEAN_TIMEOUT, 10) || 300000, // in ms
			token: process.env.CONNECTORS_DIGITALOCEAN_TOKEN,
		},
		elitetorrent: {
			baseUrl: 'https://elitetorrent.li',
			ddbbTable: 'elitetorrent',
			enabled: JSON.parse(process.env.CONNECTORS_ELITETORRENT_ENABLED),
			messageColor: '#2c6eb1',
			timeout: parseInt(process.env.CONNECTORS_ELITETORRENT_TIMEOUT, 10) || 1200000, // in ms
			url: 'https://www.elitetorrent.li/calidad/1080p-10/',
		},
		eltiemponet: {
			baseUrl: 'https://www.el-tiempo.net',
			ddbbTable: 'eltiemponet',
			enabled: JSON.parse(process.env.CONNECTORS_ELTIEMPONET_ENABLED),
			image: 'https://blog.macsales.com/wp-content/uploads/2019/02/ios12-weather-app-icon-thumbnail_2x.png',
			messageColor: '#275280',
			sendBefore: 6, // just send before 6am
			timeout: parseInt(process.env.CONNECTORS_ELTIEMPONET_TIMEOUT, 10) || 21600000, // in ms
			apiUrl: `https://www.el-tiempo.net/api/json/v1/provincias/${process.env.CONNECTORS_ELTIEMPONET_CITYCODE}/municipios/${process.env.CONNECTORS_ELTIEMPONET_TOWNCODE}/weather`,
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
