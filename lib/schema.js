var _ = require('underscore'),
    normalizeKey = function (keys) {
        
        if (_.isString(keys))
        {
            return [keys];
        }
        
        if (_.isArray(keys))
        {
            return keys;
        }
        
        return null;
    };

var Schema = function (table, attributes, key) {
    this.table = table;
    this.attributes = {};
    this.hashKeyAttributes = normalizeKey(key.hash);
    this.hashKey = this.hashKeyAttributes.join(Schema.keyDelimiter);
    this.rangeKeyAttributes = normalizeKey(key.range);
    this.rangeKey = this.rangeKeyAttributes ? this.rangeKeyAttributes.join(Schema.keyDelimiter) : null;
    this.add(attributes);
};

_.extend(Schema.prototype, {
    
    add: function (key, val) {
        
        var attr,
            attrs;
            
        if (key === null)
        {
            return this;
        }
        
        if (typeof key === 'object')
        {
            attrs = key;
        }
        else
        {
            (attrs = {})[key] = val;
        }
        
        for (attr in attrs)
        {
            this.attributes[attr] = attrs[attr];
        }
        
        return this;
    }
    
});

_.extend(Schema, {
    
    keyDelimiter: '#'
    
});

/*Schema.prototype.add = function (name, val) {
    
    var self = this,
        obj;
    
    switch (val)
    {
        case Boolean:
            obj = {
                transform: function (val_0) {
                    return {
                        N: (val_0 === true) ? 1 : 0
                    };
                }
            };
            break;
        case String:
            obj = {
                transform: function (val_0) {
                    return {
                        S: '' + val_0
                    };
                }
            };
            break;
    }
    
    if (!obj)
    {
        return;
    }
    
    self.fields[name] = obj;
    
    return;
};*/

module.exports = exports = Schema;