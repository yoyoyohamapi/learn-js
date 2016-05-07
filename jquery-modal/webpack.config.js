var path = require('path');

module.exports = {
    entry: [
        './index',
    ],
    output: {
        path: __dirname + '/dist/',
        filename: 'bundle.js'
    }
}