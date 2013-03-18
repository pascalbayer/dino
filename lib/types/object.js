var Type = require('../type'),
    _ = require('underscore');

module.exports = exports = Type.extend({},{
    
    parseValue: function (val) {
        if (!_.isObject(val))
        {
            return null;
        }
        return JSON.parse(val);
    },
    
    transformValue: function (val) {
        return JSON.stringify(val);
    }
    
});