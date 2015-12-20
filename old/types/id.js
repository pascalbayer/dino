var uuid = require('node-uuid'),
    _ = require('lodash');

module.exports = exports = _.assign({}, require('./string'), {
    
    defaultValue: function () {
        return uuid.v4().replace(/\-/g, '');
    }
    
});