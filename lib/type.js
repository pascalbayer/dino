var _ = require('underscore');

var Type = function () {};

_.extend(Type.prototype, {
    
    key: 'S',
    
    defaultValue: null,
    
    parse: function (obj) {
        return this.parseValue(obj[this.key]);
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
    }
    
});

Type.extend = require('./helper').extend;

module.exports = exports = Type;