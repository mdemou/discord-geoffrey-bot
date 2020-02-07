'use strict';

function formatChollo(cholloItem) {
	const formatedCholloItem = {};
	formatedCholloItem.guid = cholloItem.guid;
	formatedCholloItem.title = cholloItem.title.replace(/'/g, ' ');
	formatedCholloItem.link = cholloItem.link;
	formatedCholloItem.pubDate = cholloItem.pubDate;
	formatedCholloItem.image = cholloItem.image[0]['$'].url;
	formatedCholloItem.merchant = '';
	formatedCholloItem.price = '';
	formatedCholloItem.contentSnippet = cholloItem.contentSnippet.replace(/'/g, ' ');
	formatedCholloItem.content = cholloItem.content.replace(/'/g, ' ');
	formatedCholloItem.categories = JSON.stringify(cholloItem.categories);

	if (cholloItem.merchant && cholloItem.merchant[0] &&
    cholloItem.merchant[0]['$'] && cholloItem.merchant[0]['$'].name) {
		formatedCholloItem.merchant = cholloItem.merchant[0]['$'].name.replace(/'/g, ' ');
	}

	if (cholloItem.merchant && cholloItem.merchant[0] &&
    cholloItem.merchant[0]['$'] && cholloItem.merchant[0]['$'].price) {
		formatedCholloItem.price = cholloItem.merchant[0]['$'].price;
	}

	return formatedCholloItem;
}

module.exports = {
	formatChollo,
};