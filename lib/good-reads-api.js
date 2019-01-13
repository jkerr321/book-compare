const fetch = require('node-fetch');
const convert = require('xml-js');
const { GOODREADS_KEY, GOODREADS_USER } = require('../config')

// amazon URL = https://www.amazon.co.uk/gp/product/[ISBN or ASIN]/
//TODO turn this into async await func
const getBookInfo = (res) => {
    fetch(`https://www.goodreads.com/review/list/${GOODREADS_USER}.xml?key=${GOODREADS_KEY}&v=2&shelf=to-read&per_page=200&page=1`)
        .then(result => result.text())
        .then(text => convert.xml2json(text, {
            compact: true,
            spaces: 4
        }))
        .then(jsonLike => {
            const json = JSON.parse(jsonLike);
            const booksParent = json.GoodreadsResponse.reviews.review
            const toReads = booksParent.map(bookInfo => {
                const book = bookInfo.book;
                const bookObj =  {
                    title: book.title._text,
                    author: book.authors.author.name_text,
                    average_rating: book.average_rating._text,
                    isbn: book.isbn._text || null,
                    isbn13: book.isbn13._text || null
                }
                return bookObj;
            });            
            const result = JSON.stringify(toReads);
            res.render('page', {result}); //TODO don't do this here this is lib file only!
        })
}

module.exports = getBookInfo;