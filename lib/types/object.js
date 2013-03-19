var Type = require('../type'),
    _ = require('underscore');

module.exports = exports = Type.extend({},{
    
    parseValue: function (val) {
        
        var parsed = null;
        
        try
        {
            parsed = JSON.parse(val);
        }
        catch (ex)
        {
            return null;
        }
        
        return parsed;
    },
    
    transformValue: function (val) {
        return JSON.stringify(val);
    }
    
});