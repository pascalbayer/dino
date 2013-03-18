var uuid = require('node-uuid'),
    StringType = require('./string');

module.exports = exports = StringType.extend({},{
    
    defaultValue: function () {
        return uuid.v4().replace(/\-/g, '');
    }
    
});