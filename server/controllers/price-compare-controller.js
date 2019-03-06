const scrapePrices = require('../lib/page-scraper');
const getGoodReadBooks = require('../lib/good-reads-api');

// test data sets
const goodReadsTestResponse = require('../test/fixtures/good-reads-api-output');
const testBookDetailsWithPrices = require('../test/fixtures/bookObjectsForRender');

const renderPriceCompareTable = async (req, res) => {
	try {
		// const toReadList = await getGoodReadBooks(); // production values
		const toReadList = goodReadsTestResponse; // test values
		const bookPricesArray = await scrapePrices(toReadList); //?? would it be better to only pass one book at a time into the scraper so that it's more decoupled from the Array?

		const bookDetailsWithPrices = bookPricesArray.map(amazonPriceObject => {
			let mergedBookData;
			toReadList.forEach(book => {
				if (book.title === amazonPriceObject.title) {
					mergedBookData = Object.assign({}, book, {
						prices: amazonPriceObject.prices
					});
				}
			});
			return mergedBookData;
		});

		const books = bookDetailsWithPrices;
		res.render('page', {
			books
		});
	} catch (err) {
		console.log(err);
	}
};

module.exports = renderPriceCompareTable;
