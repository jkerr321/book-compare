//********* APP SET UP *********//
const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const pageScraper = require('./lib/page-scraper');
const getGoodReadBooks = require('./lib/good-reads-api');

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
    
app.get('/', async (req, res) => {
    try {
        const toReadList = await getGoodReadBooks();
        const result = JSON.stringify(toReadList);
        res.render('page', {result});
    } catch(err) {
        console.log(err);
    }
});

app.listen(process.env.PORT || 8001, () => {
    console.log('book-list: listening');
});