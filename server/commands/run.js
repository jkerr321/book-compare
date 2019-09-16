const { init } = require('../index');

exports.command = 'run';

exports.describe = 'run tsundoku - output the books in your Goodreads To Read list in a csv file, along with their Amazon prices for different formats. You need to add your config details first';

exports.handler = () => {
    init();
}