const puppeteer = require('puppeteer');

const getData = async (aisn, browser) => {
	try {
		//scrape prices from amazon using puppeteer (or testData if in test mode)
		const url = `https://www.amazon.co.uk/gp/product/${aisn}`;
		const page = await browser.newPage();
		await page.setViewport({
			width: 1920,
			height: 926
		});
		// await page.goto(url);
		await page.goto(url, {
			// timeout: 0,
			waitUntil: 'networkidle2'
		});

		// array of each row of amazon book format price table
		const htmlArray = await page.$$eval('#twister > .top-level', element =>
			element.map(el => el.innerText)
		);
		await page.close();

		return htmlArray;
	} catch (error) {
		console.log(error);
	}
};

const formatData = async dataArray => {
	return dataArray.map(el => {
		//remove whitespace
		const cleanString = el.replace(/\s+/g, ' ').trim();

		// extract book format (kindle, hardcover etc)
		const formatRegex = /([a-z]+)/gim;
		const amazonFormat = cleanString.match(formatRegex)[0];

		// extract prices
		const priceRegex = /(—|[0-9.]+)/gim;
		const prices = cleanString.match(priceRegex);

		return {
			[amazonFormat]: {
				amazon: prices[0],
				new_from: prices[1],
				used_from: prices[2]
			}
		};
	});
};

const pageScraper = async bookModelArray => {
	const browser = await puppeteer.launch();

	const resolvedBookModels = await Promise.all(
		bookModelArray.map(async (bookModel, index) => {
			const isbn = bookModel.model.isbn
				? bookModel.model.isbn
				: bookModel.model.isbn13;

			try {
				if (isbn) {
					// get Amazon Standard Identification Number - the book’s ISBN in its older, 10-digit version
					const aisn = isbn.substring(isbn.length - 10);

					const scrapedDataArray = await getData(aisn, browser);
					const amazonPrices = await formatData(scrapedDataArray);

					console.info(
						`scraped and formatted prices for ${
							bookModel.model.title
						}: ${index} of ${bookModelArray.length}`
					);

					return {
						title: bookModel.model.title,
						prices: amazonPrices
					};
				} else {
					console.log(`no isbn for ${bookModel.model.title}`); //TODO handle this better
				}
			} catch (error) {
				console.log('error', error);
			}
		})
	);
	return resolvedBookModels.filter(Boolean);
};

module.exports = pageScraper;
