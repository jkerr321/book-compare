const scrapePrices = require('./lib/page-scraper');
const getGoodReadBooks = require('./lib/good-reads-api');
const outputToCsv = require('./lib/output-to-csv');
// test data sets
const goodReadsTestResponse = require('./test/fixtures/good-reads-api-output');
const testBookDetailsWithPrices = require('./test/fixtures/book-objects-for-render');

const renderPriceCompareTable = (async () => {
	try {
		// const toReadList = await getGoodReadBooks(); // production values
		// // const toReadList = toReadList1.slice(0, 49); // production values
		// const toReadList = goodReadsTestResponse; // test values
		// const bookPricesArray = await scrapePrices(toReadList);

		// const bookDetailsWithPrices = bookPricesArray.map(amazonPriceObject => {
		// 	let mergedBookData;
		// 	toReadList.forEach(book => {
		// 		if (book.title === amazonPriceObject.title) {
		// 			mergedBookData = Object.assign({}, book, {
		// 				prices: amazonPriceObject.prices
		// 			});
		// 		}
		// 	});
		// 	return mergedBookData;
		// });

		const books = testBookDetailsWithPrices

		console.log('==================');
		console.dir(books, { depth: 10 });
		console.log('==================');

		return outputToCsv(books);

	} catch (err) {
		console.log(err);
	}
})();

module.exports = renderPriceCompareTable;
