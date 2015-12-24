var AWS = require('aws-sdk');
var Dino = (function () {
    function Dino() {
    }
    Dino.setClientConfig = function (config) {
        this.client = new AWS.DynamoDB({
            credentials: config,
            region: config.region,
            endpoint: config.endpoint
        });
        this.documentClient = new AWS.DynamoDB.DocumentClient({
            credentials: config,
            region: config.region,
            endpoint: config.endpoint
        });
    };
    Dino.getClient = function () {
        return this.client;
    };
    Dino.getDocumentClient = function () {
        return this.documentClient;
    };
    return Dino;
})();
exports.Dino = Dino;
