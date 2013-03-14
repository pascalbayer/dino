var _ = require('underscore'),
    moment = require('moment'),
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
            this.attributes[attr] = this.getType(attrs[attr]);
        }
        
        return this;
    },
    
    getType: function (key) {
        
        switch (key)
        {
            case String:
                return (function(){
                    var parse = function (val) {
                        return (val) ? '' + val : null;
                    };
                    return {
                        parse: parse,
                        toDynamo: function (val) {
                            return {
                                S: parse(val)
                            };
                        }
                    };
                })();
                
            case Number:
                return (function(){
                    var parse = function (val) {
                        return (_.isNumber(val)) ? val : null;
                    };
                    return {
                        parse: parse,
                        toDynamo: function (val) {
                            return {
                                S: parse(val)
                            };
                        }
                    };
                })();
            
            case Boolean:
                return (function(){
                    var parse = function (val) {
                        return (val === true) ? 1 : 0;
                    };
                    return {
                        parse: parse,
                        toDynamo: function (val) {
                            return {
                                S: parse(val)
                            };
                        }
                    };
                })();
                
            case Date:
                return (function(){
                    var parse = function (val) {
                        return (true) ? val.format() : null;
                    };
                    return {
                        parse: parse,
                        toDynamo: function (val) {
                            return {
                                S: parse(val)
                            };
                        }
                    };
                })();
        }
        
    }
    
});

_.extend(Schema, {
    
    keyDelimiter: '#'
    
});

module.exports = exports = Schema;