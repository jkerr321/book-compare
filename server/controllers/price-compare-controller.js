const scrapePrices = require('../lib/page-scraper');
const getGoodReadBooks = require('../lib/good-reads-api');
const BookModel = require('../models/book-model');

const renderPriceCompareTable = async (req, res) => {
    try {
        const testMode = false //TODO, make this conditional?
        // const toReadList = await getGoodReadBooks();

        const toReadList2 = 
            [{
                title: 'Natives: Race and Class in the Ruins of Empire',
                author: 'Akala',
                average_rating: '4.61',
                isbn: null,
                isbn13: '9781473661219'
            },
            {
                title: 'The Color Purple',
                author: 'Alice Walker',
                average_rating: '4.19',
                isbn: '0671727796',
                isbn13: '9780671727796'
            },
            {
                title: 'How Do You Like Me Now?',
                author: 'Holly Bourne',
                average_rating: '3.91',
                isbn: '1473667720',
                isbn13: '9781473667723'
            },
            {
                title: 'Frenchman\'s Creek',
                author: 'Daphne du Maurier',
                average_rating: '3.93',
                isbn: '1844080412',
                isbn13: '9781844080410'
            }]
            // }]

        // for each toRead get price info and add to book object
        const booksWithPrices = toReadList2.map(async bookInfo => {
            try {
                const bookModel = new BookModel;
                bookModel.addBookInfo(bookInfo);
                const isbn = bookModel.model.isbn ? bookModel.model.isbn : bookModel.model.isbn13;
                const prices = await scrapePrices({isbn, bookModel, testMode: testMode});
                // bookModel.addPriceInfo(prices); //TODO instead of inside lib?
                return bookModel.model;
            } catch(err) {
                console.log(err);
            }
        })

        const result = JSON.stringify(await Promise.all(booksWithPrices));
        res.render('page', { result });
    } catch (err) {
        console.log(err);
    }
};

module.exports = renderPriceCompareTable;