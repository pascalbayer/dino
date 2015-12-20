var moment = require('moment');

module.exports = exports = {
    
    defaultValue: function () {
        return moment.utc();
    },
    
    deserialize: function (val) {
        return moment.utc(val);
    },
    
    serialize: function (val) {
        var m;

        if(Object.prototype.toString.call(val) === '[object Date]') {
            m = moment(val);
        } else {
            m = val;
        }

        return m.format();
    },
    
    toJSON: function (val) {
        var m;

        if(Object.prototype.toString.call(val) === '[object Date]') {
            m = moment(val);
        } else {
            m = val;
        }

        return m.format();
    }
    
};