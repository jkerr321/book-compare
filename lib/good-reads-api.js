const fetch = require('node-fetch');
const convert = require('xml-js');
const { GOODREADS_KEY, GOODREADS_USER } = require('./config')


fetch(`https://www.goodreads.com/user/show/47220005.xml?key=${GOODREADS_KEY}&user=${GOODREADS_USER}`)
    .then(res => res.text())
    .then(text => convert.xml2json(text, {
        compact: true,
        spaces: 4
    }))
    .then(json => {
        const result = JSON.parse(json);
        console.log('==================');
        console.log('result._declaration', result._declaration);
        console.log('==================');

        console.log('==================');
        console.log('type of', typeof result);
        console.log('==================');

        res.render('page', {
            result
        })
    })