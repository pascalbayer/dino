/// <reference path="../typings/tsd.d.ts"/>
var Joi = require('joi');
var Type = (function () {
    function Type() {
    }
    Type.getTypeMapping = function (type) {
        switch (type) {
            case Type.Guid:
                return 'S';
            case Type.String:
                return 'S';
            case Type.Object:
                return 'M';
            case Type.Array:
                return 'L';
            case Type.Number:
                return 'N';
            case Type.Boolean:
                return 'B';
            case Type.Date:
                return 'S';
        }
    };
    Type.string = function () {
        return Joi.string();
    };
    Type.object = function () {
        return Joi.object();
    };
    Type.array = function () {
        return Joi.array();
    };
    Type.number = function () {
        return Joi.number();
    };
    Type.guid = function () {
        return Joi.string().guid();
    };
    Type.boolean = function () {
        return Joi.boolean();
    };
    Type.date = function () {
        return Joi.date();
    };
    Type.Guid = Type.guid();
    Type.String = Type.string();
    Type.Object = Type.object();
    Type.Array = Type.array();
    Type.Number = Type.number();
    Type.Boolean = Type.boolean();
    Type.Date = Type.date();
    return Type;
})();
exports.Type = Type;
