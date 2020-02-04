'use strict';

// config and services
const axiosService = require('../../services/axios.service');
const config = require('../../config');
const discordService = require('../../services/discord.service');
const logger = require('../../services/logging.service');

async function startConnector(channel) {
	try {
		logger.info(__filename, 'startConnector', 'Initializing eltiemponet connector');
		const eltiempo = await axiosService.get(config.connectors.eltiemponet.apiUrl);
		if(_timeToSend() === true) {
			channel.send(_enrichMessage(eltiempo));
		}
	} catch (e) {
		logger.error(__filename, 'startConnector', e);
	}
}

function _timeToSend() {
	try {
		logger.info(__filename, '_timeToSend', 'Checking if it is time to send');
		return ((new Date().getUTCHours() <= config.connectors.eltiemponet.sendBefore) ? true : false);
	} catch (e) {
		logger.error(__filename, '_timeToSend', e);
	}
}

function _enrichMessage(eltiempo) {
	try {
		logger.debug(__filename, '_enrichMessage', 'Enriching discord message');
		return discordService.sendRichEmbed({
			color: config.connectors.eltiemponet.messageColor,
			desc: ` \
Today
Temperatura: ${eltiempo.prediccion.dia[0].temperatura.maxima}°C - ${eltiempo.prediccion.dia[0].temperatura.minima}°C \n \
Sensacion térmica: ${eltiempo.prediccion.dia[0].sens_termica.maxima}°C - ${eltiempo.prediccion.dia[0].sens_termica.minima}°C \n\n \
Tomorrow
Temperatura: ${eltiempo.prediccion.dia[1].temperatura.maxima}°C - ${eltiempo.prediccion.dia[0].temperatura.minima}°C \n \
Sensacion térmica: ${eltiempo.prediccion.dia[1].sens_termica.maxima}°C - ${eltiempo.prediccion.dia[0].sens_termica.minima}°C \
			`,
			footer: `${eltiempo.elaborado} - ${eltiempo.origen.productor}`,
			thumbnail: config.connectors.eltiemponet.image,
			title: `El tiempo en ${eltiempo.nombre}, ${eltiempo.provincia}`,
		});
	} catch (e) {
		logger.error(__filename, '_enrichMessage', e);
	}
}

module.exports = {
	startConnector,
};
