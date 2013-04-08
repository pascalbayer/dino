var connection = require('./connection');

exports.connection = connection;
exports.connect = function (options) {
    connection.client = connection.create(options);
};
exports.schema = require('./schema');
exports.type = require('./type');
exports.types = require('./types');