var AWS = require('aws-sdk'),
    connection = {};

connection.client = new AWS.DynamoDB().client;

connection.create = function (options) {
    return new AWS.DynamoDB({
        credentials: options,
        region: options.region
    }).client;
};

module.exports = connection;