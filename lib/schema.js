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
            this.attributes[attr] = new attrs[attr];
        }
        
        return this;
    },
    
    get: function (attr) {
        return this.attributes[attr]
    },
    
    getType: function (key) {
        
        switch (key)
        {
            case String:
                return {
                    parseAttribute: Schema.parse.stringAttribute,
                    parseValue: Schema.parse.stringValue,
                    transformAttribute: Schema.transform.stringAttribute,
                    transformValue: Schema.transform.stringValue
                };
                
            case Number:
                return {
                    parseAttribute: Schema.parse.numberAttribute,
                    parseValue: Schema.parse.numberValue,
                    transformAttribute: Schema.transform.numberAttribute,
                    transformValue: Schema.transform.numberValue
                };
            
            case Boolean:
                return {
                    parseAttribute: Schema.parse.boolAttribute,
                    parseValue: Schema.parse.boolValue,
                    transformAttribute: Schema.transform.boolAttribute,
                    transformValue: Schema.transform.boolValue
                };
                
            case Date:
                return {
                    parseAttribute: Schema.parse.dateAttribute,
                    parseValue: Schema.parse.dateValue,
                    transformAttribute: Schema.transform.dateAttribute,
                    transformValue: Schema.transform.dateValue
                };
        }
        
    },
    
    generateKeyAttribute: function (val, attrs) {
        
        var self = this,
            isArr = _.isArray(val),
            attr;
        
        if (!isArr)
        {
            return self.get(attrs[0]).transform(val);
        }
        
        return {
            S: _.map(attrs, function(attr, i){
                return self.get(attr).transformValue(val[i]);
            }).join(Schema.keyDelimiter)
        };
    },
    
    generateHashAttribute: function (val) {
        return this.generateKeyAttribute(val, this.hashKeyAttributes);
    },
    
    generateRangeAttribute: function (val) {
        return this.generateKeyAttribute(val, this.rangeKeyAttributes);
    }
    
});

_.extend(Schema, {
    
    keyDelimiter: '#',
    
    transform: {
        stringAttribute: function (attr) {
            return { S: Schema.transform.stringValue(attr) };
        },
        stringValue: function (val) {
            return Schema.parse.stringValue(val);
        },
        numberAttribute: function (attr) {
            return { N: Schema.transform.numberValue(attr) };
        },
        numberValue: function (val) {
            return Schema.parse.numberValue(val);
        },
        boolAttribute: function (attr) {
            return { N: Schema.transform.boolValue(attr) };
        },
        boolValue: function (val) {
            return (val === true) ? 1 : 0;
        },
        dateAttribute: function (attr) {
            return { S: Schema.transform.dateValue(attr) };
        },
        dateValue: function (val) {
            return (moment.isMoment(val)) ? val.format() : null;
        }
    },
    
    parse: {
        stringAttribute: function (attr) {
            return Schema.parse.stringValue(attr.S);
        },
        stringValue: function (val) {
            return val ? '' + val : null;
        },
        numberAttribute: function (attr) {
            return Schema.parse.numberValue(attr.N);
        },
        numberValue: function (val) {
            return _.isNumber(val) ? val : null;
        },
        boolAttribute: function (attr) {
            return Schema.parse.boolValue(attr.N);
        },
        boolValue: function (val) {
            return (val === 1) ? true : false;
        },
        dateAttribute: function (attr) {
            return Schema.parse.dateValue(attr.S);
        },
        dateValue: function (val) {
            return val ? moment.utc(val) : null;
        }
    }
    
});

module.exports = exports = Schema;