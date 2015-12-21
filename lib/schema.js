/// <reference path="../typings/tsd.d.ts"/>
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
    return Schema;
})();
exports.Schema = Schema;
