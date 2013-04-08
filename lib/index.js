var connection = require('./connection');

module.exports.connection = connection;
module.exports.connect = function (options) {
    connection.client = connection.create(options);
};