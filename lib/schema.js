var _ = require('underscore'),
    connection = require('./connection'),
    helper = require('./helper');

var methods = {
    
    createTable: function (callback) {
        
    },
    
    add: function (key, val) {
        
        var self = this,
            attr,
            attrs;
        
        if (key === null
            || key === undefined)
        {
            return self;
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
            //self.attributes[attr] = Object.create(attrs[attr]);
        }
        
        return self;
        
    },
    
    get: function (attr) {
        return this.attributes[attr];
    }
    
};

module.exports = exports = function (options) {
    
    options = options || {};
    
    var defaults = {
            table: options.table || '',
            attributes: {},
            key: options.key || { hash: '' },
            keyDelimiter: options.keyDelimiter || '#'
        },
        schema = Object.create(methods, helper.generateOwnProperties(defaults));
    
    schema.add(options.attributes);
    
    return schema;
};

/*
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
    
    generateKeyAttribute: function (val, attrs) {
        
        var self = this,
            isArr = _.isArray(val);
        
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
    },
    
    deserializeKeyAttribute: function (val, attrs) {
        
        var self = this,
            obj = {};
        
        val = (attrs.length > 1) ? val.S.split(self.constructor.keyDelimiter) : [val.S];
        
        _.each(attrs, function(attr, i){
            obj[attr] = self.get(attr).parseValue(val[i]);
        });
        
        return obj;
    },
    
    deserializeHashAttribute: function (val) {
        return this.deserializeKeyAttribute(val, this.hashKeyAttributes);
    },
    
    deserializeRangeAttribute: function (val) {
        return this.deserializeKeyAttribute(val, this.rangeKeyAttributes);
    },
    
    getDynamoAttributes: function () {
        
        var self = this,
            attrs = _.clone(self.attributes);
        
        if (self.hashKeyAttributes.length > 1)
        {
            _.each(self.hashKeyAttributes, function(attr){
                delete attrs[attr];
            });
            
            attrs[self.hashKey] = {};
        }
        
        if (_.isArray(self.rangeKeyAttributes)
            && self.rangeKeyAttributes.length > 1)
        {
            _.each(self.rangeKeyAttributes, function(attr){
                delete attrs[attr];
            });
            
            attrs[self.rangeKey] = {};
        }
        
        return attrs;
    }
    
});

_.extend(Schema, {
    
    keyDelimiter: '#',
    
    client: new AWS.DynamoDB().client
    
});

module.exports = exports = Schema;*/