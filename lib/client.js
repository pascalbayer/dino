/// <reference path="../typings/tsd.d.ts"/>
var dino_1 = require('./dino');
var Client = (function () {
    function Client(config) {
        dino_1.Dino.setClientConfig(config);
    }
    return Client;
})();
exports.Client = Client;
