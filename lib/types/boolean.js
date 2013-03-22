var Type = require('../type');

module.exports = exports = Type.extend({},{
    
    key: 'N',
    
    defaultValue: false,
    
    parseValue: function (val) {
        return val === '1';
    },
    
    transformValue: function (val) {
        return (val === true) ? '1' : '0';
    }
    
});