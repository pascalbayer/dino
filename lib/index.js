var AWS = require('aws-sdk'),
    Schema = require('./schema'),
    Model = require('./model');

Model.client = new AWS.DynamoDB().client;

module.exports.connect = function (options) {
    Model.client = new AWS.DynamoDB({
        credentials: options,
        region: options.region
    }).client;
};

module.exports.Model = Model;
module.exports.Schema = Schema;