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
			timeout: 0,
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
	return dataArray.reduce((pricesObject, el) => {
		//remove whitespace
		const cleanString = el.replace(/\s+/g, ' ').trim();

		// extract book format (kindle, hardcover etc)
		const formatRegex = /([a-z]+)/gim;
		const amazonFormat = cleanString.match(formatRegex)[0].toLowerCase();

		// extract prices
		const priceRegex = /(—|[0-9.]+)/gim;
		const prices = cleanString.match(priceRegex);

		//e.g. 'kindle', 'paperback'
		pricesObject[amazonFormat] = {
			amazon: prices[0],
			new_from: prices[1],
			used_from: prices[2]
		};

		return pricesObject;
	}, {});
};

const pageScraper = async bookInfoArray => {
	const browser = await puppeteer.launch();

	const resolvedBookPrices = await Promise.all(
		bookInfoArray.map(async (bookInfo, index) => {
			const isbn = bookInfo.isbn ? bookInfo.isbn : bookInfo.isbn13;

			if (isbn) {
				// get Amazon Standard Identification Number - the book’s ISBN in its older, 10-digit version
				const aisn = isbn.substring(isbn.length - 10);

				const scrapedDataArray = await getData(aisn, browser);
				const amazonPrices = await formatData(scrapedDataArray);

				console.info(
					`scraped and formatted prices for ${
						bookInfo.title
					}: ${index} of ${bookInfoArray.length}`
				);

				return {
					title: bookInfo.title,
					prices: amazonPrices
				};
			} else {
				console.log(`no isbn for ${bookInfo.title}`);
			}
		})
	);

	return resolvedBookPrices.filter(Boolean);
};

module.exports = pageScraper;
