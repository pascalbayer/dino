/// <reference path="../typings/tsd.d.ts"/>
var dino_1 = require('./dino');
var type_1 = require('./type');
var Schema = (function () {
    function Schema(schema) {
        this.name = schema.name;
        this.schema = schema;
        this.key = schema.key;
        this.attributes = schema.attributes;
    }
    Schema.prototype.getName = function () {
        return this.name;
    };
    Schema.prototype.getSchema = function () {
        return this.schema;
    };
    Schema.prototype.getKey = function () {
        return this.key;
    };
    Schema.prototype.getAttributes = function () {
        return this.attributes;
    };
    Schema.prototype.createTable = function (config, callback) {
        if (config === void 0) { config = null; }
        if (callback === void 0) { callback = null; }
        var schema = {
            TableName: this.getName(),
            KeySchema: [],
            AttributeDefinitions: [],
            ProvisionedThroughput: {
                ReadCapacityUnits: config && config.readUnits || 5,
                WriteCapacityUnits: config && config.writeUnits || 5
            }
        };
        for (var key in this.getKey()) {
            schema.KeySchema.push({
                AttributeName: this.getKey()[key],
                KeyType: key.toUpperCase()
            });
        }
        for (var attribute in this.getAttributes()) {
            for (var _i = 0, _a = schema.KeySchema; _i < _a.length; _i++) {
                var key = _a[_i];
                if (key.AttributeName == attribute) {
                    schema.AttributeDefinitions.push({
                        AttributeName: attribute,
                        AttributeType: type_1.Type.getTypeMapping(this.getAttributes()[attribute])
                    });
                }
            }
        }
        dino_1.Dino.getClient().createTable(schema, function (err, data) {
            typeof callback === 'function' && callback(err, data);
        });
    };
    return Schema;
})();
exports.Schema = Schema;
