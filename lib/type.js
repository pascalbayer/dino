var _ = require('underscore');

var Type = function () {};

_.extend(Type.prototype, {
    
    key: 'S',
    
    defaultValue: null,
    
    getDefaultValue: function () {
        return _.isFunction(this.defaultValue) ? this.defaultValue() : this.defaultValue;
    },
    
    parse: function (obj) {
        
        if (obj.hasOwnProperty(this.key))
        {
            return this.parseValue(obj[this.key]);
        }
        
        if (obj.hasOwnProperty(this.key + this.key))
        {
            return _.map(obj[this.key + this.key], this.parseValue);
        };
    },
    
    parseValue: function (val) {
        return val;
    },
    
    transform: function (val) {
        
        var obj = {},
            isArray = _.isArray(val),
            key = this.key;
        
        if (isArray)
        {
            key += this.key;
        }
        
        obj[key] = isArray ? _.map(val, this.transformValue) : this.transformValue(val);
        
        return obj;
    },
    
    transformValue: function (val) {
        return val;
    },
    
    toJSON: function (val) {
        return val;
    }
    
});

Type.extend = require('./helper').extend;

module.exports = exports = Type;