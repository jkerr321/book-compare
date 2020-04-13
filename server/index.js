const scrapePrices = require('./lib/page-scraper');
const getGoodReadBooks = require('./lib/good-reads-api');
const { getCsvName, exportToCsv, deleteOldCsv } = require('./lib/csv-helpers');
// test data sets
const goodReadsTestResponse = require('./test/fixtures/good-reads-api-output'); // eslint-disable-line
const testBookDetailsWithPrices = require('./test/fixtures/book-objects-for-export'); // eslint-disable-line 

const isScrapeWithinPreviousDay = (timestampNow, csvName) => {
	if (!csvName) {
		console.log('no existing csv file, scraping for fresh prices');
		return false;
	} else {
		const twentyFourHours = 86400000;
		const timestampPreviousString = csvName.split('.')[0];
		const timestampPrevious = new Date(parseInt(timestampPreviousString));

		if (timestampNow - timestampPrevious < twentyFourHours) {
			return true;
		} else {
			console.log('prices scraped over 24 hours ago. Scraping for fresh prices...');
			return false;
		}
	}
}

const init = async () => {
	const timestampNow = new Date().valueOf();
	const existingCsv = await getCsvName();

	try {
		const pricesScrapedInLast24Hours = isScrapeWithinPreviousDay(timestampNow, existingCsv);

		if (pricesScrapedInLast24Hours) {
			console.log('prices scraped in the last 24 hours - please use existing output.csv file (or delete that csv file if you\'d like to get new prices)');
		} else {
			const toReadList = await getGoodReadBooks(); // production values
			// const toReadList = goodReadsTestResponse; // test values
			const bookPricesArray = await scrapePrices(toReadList);

			const bookDetailsWithPrices = bookPricesArray.map(amazonPriceObject => {
				let mergedBookData;
				toReadList.forEach(book => {
					if (book.title === amazonPriceObject.title) {
						mergedBookData = Object.assign(
							{}, 
							book, 
							{ prices: amazonPriceObject.prices },
							{ amazon_link: amazonPriceObject.amazon_link }
						);
					}
				});

				return mergedBookData;
			});

			const books = bookDetailsWithPrices // production values
			// const books = testBookDetailsWithPrices // test values

			exportToCsv(books, timestampNow);
			if (existingCsv) deleteOldCsv(existingCsv);
			const newCsv = await getCsvName()

			console.log(`** Success! Prices have been exported to ${newCsv} in the Tsundoku project root :) **`)
			console.log(`** The full file path for your book price csv file is: ${__dirname}/${newCsv} **`);
		}
	} catch (err) {
		console.log(err);
	}
};

module.exports = { init, isScrapeWithinPreviousDay };
