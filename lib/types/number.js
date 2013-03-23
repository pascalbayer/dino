var _ = require('underscore'),
    Type = require('../type');

module.exports = exports = Type.extend({},{
    
    key: 'N',
    
    parseValue: function (val) {
        if (!val) return null;
        if (val%1 === 0) return parseInt(val, 10);
        val = parseFloat(val);
        return (_.isNumber(val) && !_.isNaN(val)) ? val : this.getDefaultValue();
    },
    
    transformValue: function (val) {
        if (!_.isNumber(val)) return null;
        return '' + val;
    }
    
});