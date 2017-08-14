

var mysql = require('promise-mysql');
var config = require('./config');
module.exports = mysql.createPool(config.mysql)
