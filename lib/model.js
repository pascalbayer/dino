/// <reference path="../typings/joi/joi.d.ts"/>
var dino_1 = require('./dino');
var Joi = require('joi');
var Uuid = require('node-uuid');
var Model = (function () {
    function Model(schema, client) {
        this.schema = schema;
        this.client = client || dino_1.Dino.getClient();
    }
    Model.prototype.create = function (data) {
        for (var key in this.schema.getSchema()) {
            if (!data[key]) {
                data[key] = Uuid.v4();
            }
        }
        var result = Joi.validate(data, this.schema.getSchema());
        if (!result.error) {
            this.data = data;
        }
        else {
            console.error(result.error);
        }
        return this;
    };
    Model.prototype.save = function (callback) {
        dino_1.Dino.getClient().put({
            TableName: this.schema.getName(),
            Item: Object.assign({}, this.data)
        }, function (err, data) {
            typeof callback === 'function' && callback(err, data);
        });
        return this;
    };
    return Model;
})();
exports.Model = Model;
