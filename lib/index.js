var AWS = require('aws-sdk'),
    Schema = require('./schema');

module.exports.Schema = Schema;
module.exports.Model = require('./model');
module.exports.Type = require('./type');
module.exports.types = require('./types/');
module.exports.connect = function (options) {
    Schema.client = new AWS.DynamoDB({
        credentials: options,
        region: options.region
    }).client;
};