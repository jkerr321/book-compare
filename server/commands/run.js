const { init } = require('../index');

exports.command = 'run';

exports.describe = 'get goodReads book list - you need to add your config details first';

exports.handler = (argv = {}) => {
    init();
}