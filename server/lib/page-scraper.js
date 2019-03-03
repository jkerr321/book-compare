const cheerio = require('cheerio');
const fetch = require('node-fetch');
const { COOKIE } = require('../../config');

const getData = async (aisn, browser) => {
	try {
		const url = `https://www.amazon.co.uk/gp/product/${aisn}`;
		const headers = {
			authority: 'www.amazon.co.uk',
			method: 'GET',
			path: `/gp/product/${aisn}`,
			scheme: 'https',
			accept:
				'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
			'accept-encoding': 'gzip, deflate, br',
			'accept-language': 'en-US,en;q=0.9',
			'cache-control': 'max-age=0',
			cookie: COOKIE,
			'upgrade-insecure-requests': 1,
			'user-agent':
				'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.109 Safari/537.36'
		};

		const res = await fetch(url, { headers });
		const text = await res.text();
		const $ = cheerio.load(text);

		// TODO put this in a function to be more functional
		let arrayOfHtmlPriceTableRows = [];
		$('#twister > .top-level').map((i, el) => {
			arrayOfHtmlPriceTableRows.push($(el).text());
		});

		return arrayOfHtmlPriceTableRows;
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
	const resolvedBookPrices = await Promise.all(
		bookInfoArray.map(async (bookInfo, index) => {
			try {
				const isbn = bookInfo.isbn ? bookInfo.isbn : bookInfo.isbn13;

				if (isbn) {
					// get Amazon Standard Identification Number - the book’s ISBN in its older, 10-digit version
					const aisn = isbn.substring(isbn.length - 10);
					const scrapedDataArray = await getData(aisn);
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
					console.info(`no isbn for ${bookInfo.title}`);
				}
			} catch (error) {
				console.log(error);
			}
		})
	);

	return resolvedBookPrices.filter(Boolean);
};

module.exports = pageScraper;
