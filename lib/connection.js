var AWS = require('aws-sdk');

exports.client = new AWS.DynamoDB();

exports.create = function (options) {
    
    if (!options)
    {
        return new AWS.DynamoDB();
    }
    
    return new AWS.DynamoDB({
        credentials: options,
        region: options.region,
        endpoint: options.endpoint
    });
};
