
const fs = require('fs');
const configFile = require('../../config');

exports.command = 'setConfig [goodReadsId] [goodReadsKey] [cookie]';

exports.describe = 'Search a file within a repository';

exports.builder = yargs => {
    return yargs
        .positional('goodReadsId', {
            type: 'string',
            describe: '8 character Good Reads user ID'
        })
        .positional('goodReadsKey', {
            type: 'string',
            describe: 'good reads developer API key'
        })
        .positional('cookie', {
            type: 'string',
            describe: 'Amazon cookie string'
        }) 
};

exports.handler = (argv = {}) => {    
    const { goodReadsId, goodReadsKey, cookie } = argv;

    let configObj = {};
    goodReadsId ? configObj.GOODREADS_USER = goodReadsId : configObj.GOODREADS_USER = configFile.GOODREADS_USER;
    goodReadsKey ? configObj.GOODREADS_KEY = goodReadsKey : configObj.GOODREADS_KEY = configFile.GOODREADS_KEY;
    cookie ? configObj.COOKIE = cookie : configObj.COOKIE = configFile.COOKIE;

    // add config vars to config file
    fs.writeFileSync(`${__dirname}/../../config.js`, `module.exports = ${JSON.stringify(configObj)}`, err => {
        if (err) console.error(`error writing config file: ${error}`);
        else {
            console.log('updated config with your options');
        }
    })

    console.log('** Success! Your config has been set **')
}