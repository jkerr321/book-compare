//********* APP SET UP *********//
const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const renderPriceCompare = require('./server/controllers/price-compare-controller');

app.engine('html', exphbs({
    defaultLayout: 'main',
    extname: '.html',
    layoutsDir: 'views/layouts/'
}));

app.set('view engine', 'html');
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

//******** PATHS ********//
    
app.get('/', renderPriceCompare);

app.listen(process.env.PORT || 8001, () => {
    console.log('book-list: listening');
});