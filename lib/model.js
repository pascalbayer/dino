/// <reference path="../typings/tsd.d.ts"/>
var dino_1 = require('./dino');
var Joi = require('joi');
var Uuid = require('node-uuid');
var Model = (function () {
    function Model(schema, client) {
        this.schema = schema;
        this.client = client || dino_1.Dino.getClient();
    }
    Model.prototype.create = function (data) {
        var attributes = this.schema.getAttributes();
        for (var key in attributes) {
            if (attributes.hasOwnProperty(key) && !data[key]) {
                data[key] = Uuid.v4();
            }
        }
        var result = Joi.validate(data, attributes);
        if (!result.error) {
            this.data = data;
        }
        else {
            console.error(result.error);
        }
        return this;
    };
    Model.prototype.save = function (callback) {
        dino_1.Dino.getDocumentClient().put({
            TableName: this.schema.getName(),
            Item: this.data
        }, function (err, data) {
            typeof callback === 'function' && callback(err, data);
        });
        return this;
    };
    return Model;
})();
exports.Model = Model;
