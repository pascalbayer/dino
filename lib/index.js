var AWS = require('aws-sdk'),
    Model = require('./model');

var Dino = function () {};

Dino.prototype.connect = function (options) {
    this.db = new AWS.DynamoDB({
        credentials: options,
        region: options.region
    }).client;
};

Dino.prototype.model = function (name, schema) {
    
    var _Model = function (fields) {
        Model.call(this, fields);
    };
    
    _Model.name = name;
    _Model.schema = schema;
    _Model.__proto__ = Model;
    _Model.prototype.__proto__ = Model.prototype;
    _Model.prototype.db = this.db;
    _Model.prototype.schema = schema;
    _Model.prototype.table = name.toLowerCase() + 's';
    
    return _Model;
};

Dino.prototype.Schema = require('./schema');

module.exports = exports = new Dino;