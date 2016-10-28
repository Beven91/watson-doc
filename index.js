var watson = require('./src/make.js')

module.exports = watson;

watson.make({
    "loader": "module",
    "name": "dante",
    "out": "./out"
});

