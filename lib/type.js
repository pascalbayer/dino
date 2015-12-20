/// <reference path="../typings/joi/joi.d.ts"/>
var Joi = require('joi');
var Type = (function () {
    function Type() {
    }
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
    Type.Guid = Type.guid();
    Type.String = Type.string();
    Type.Object = Type.object();
    Type.Array = Type.array();
    Type.Number = Type.number();
    return Type;
})();
exports.Type = Type;
