/// <reference path="../typings/joi/joi.d.ts"/>
var Schema = (function () {
    function Schema(schema) {
        this.name = schema.name;
        this.schema = schema.attributes;
        this.key = schema.key;
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
    return Schema;
})();
exports.Schema = Schema;
