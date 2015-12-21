/// <reference path="../typings/tsd.d.ts"/>
var AWS = require('aws-sdk');
var dino_1 = require('./dino');
var Client = (function () {
    function Client(config) {
        dino_1.Dino.setClient(new AWS.DynamoDB.DocumentClient({
            credentials: config,
            region: config.region,
            endpoint: config.endpoint
        }));
    }
    return Client;
})();
exports.Client = Client;
