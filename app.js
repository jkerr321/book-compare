//********* APP SET UP *********//
const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const pageScraper = require('./lib/page-scraper');

app.engine('html', exphbs({
    defaultLayout: 'main',
    extname: '.html',
    layoutsDir: 'views/layouts/'
}));

app.set('view engine', 'html');
app.set('views', path.join(__dirname, '/views'));
// app.use(express.static(path.join(__dirname, 'public'))); //serve static stuff from public folder - styles
// app.use('/bower_components', express.static(path.join(__dirname, '../bower_components')));
app.use(bodyParser.urlencoded({ extended: true }));

//******** PATHS ********//

const getBooks = (json) => {
    // const booksParent = json.GoodreadsResponse.user.updates.update
    // return booksParent.map(book => {
    //     if (book.object.read_stats.status === 'to-read')
    //     return {
    //         title: book.book.title._text,
    //         author: book.shelf_display_name._text,
    //         isbn: book.isbn,
    //         isbn13: book.isbn13
    //     }
    // })
}

    pageScraper();

    
app.get('/', (req, res) => {
    pageScraper();
});

// console.log(getBooks(json))

app.listen(process.env.PORT || 8001, () => {
    console.log('book-list: listening');
});