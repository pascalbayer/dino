var Type = require('../type'),
    moment = require('moment');

module.exports = exports = Type.extend({},{
    
    defaultValue: function () {
        return moment.utc();
    },
    
    parseValue: function (val) {
        return moment.utc(val);
    },
    
    transformValue: function (val) {
        return val.format();
    },
    
    toJSON: function (val) {
        return val.format();
    }
    
});