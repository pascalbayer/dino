var _ = require('underscore'),
    connection = require('./connection'),
    helper = require('./helper');

var methods = {
    
    createTable: function (options, callback) {
        
        options = options || {};
        
        if (!_.isFunction(callback))
        {
            callback = function () {};
        }
        
        var self = this,
            keySchema = {},
            client = options.client || connection.client;
        
        client.createTable({
            TableName: self.table,
            KeySchema: {
                HashKeyElement: {
                    AttributeName: 'id',
                    AttributeType: 'S'
                }
            },
            ProvisionedThroughput: {
                ReadCapacityUnits: options.readUnits || 1,
                WriteCapacityUnits: options.writeUnits || 1
            }
        }, function(err, units){
            if (err) return callback(err);
            callback(null, units);
        });
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
            self.attributes[attr] = Object.create(attrs[attr]);
        }
        
        return self;
        
    },
    
    get: function (attr) {
        return this.attributes[attr];
    },
    
    serializeKeyAttribute: function (val, attrs) {
        
        var self = this,
            isArr = _.isArray(val);
        
        if (!isArr)
        {
            return self.get(attrs[0]).serializeObject(val);
        }
        
        return {
            S: _.map(attrs, function(attr, i){
                return self.get(attr).serialize(val[i]);
            }).join(self.keyDelimiter)
        };
    },
    
    serializeHashAttribute: function (val) {
        return this.serializeKeyAttribute(val, this.hashKeyAttributes);
    },
    
    serializeRangeAttribute: function (val) {
        return this.serializeKeyAttribute(val, this.rangeKeyAttributes);
    },
    
    deserializeKeyAttribute: function (val, attrs) {
        
        var self = this,
            obj = {};
        
        val = (attrs.length > 1) ? val.S.split(self.keyDelimiter) : [val.S];
        
        _.each(attrs, function(attr, i){
            obj[attr] = self.get(attr).deserialize(val[i]);
        });
        
        return obj;
    },
    
    deserializeHashAttribute: function (val) {
        return this.deserializeKeyAttribute(val, this.hashKeyAttributes);
    },
    
    deserializeRangeAttribute: function (val) {
        return this.deserializeKeyAttribute(val, this.rangeKeyAttributes);
    },
    
    getSerializedAttributes: function () {
        
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
    
};

var normalizeKey = function (keys) {
    if (_.isString(keys)) return [keys];
    if (_.isArray(keys)) return keys;
    return null;
};

module.exports = exports = function (options) {
    
    options = options || {};
    options.key = options.key || { hash: '', range: null };
    
    var delimiter = options.keyDelimiter || '#',
        hashKeyAttributes = normalizeKey(options.key.hash),
        rangeKeyAttributes = normalizeKey(options.key.range),
        ownProperties = helper.ownProperties({
            attributes: {},
            table: options.table || '',
            hashKeyAttributes: hashKeyAttributes,
            rangeKeyAttributes: rangeKeyAttributes,
            hashKey: hashKeyAttributes.join(delimiter),
            rangeKey: rangeKeyAttributes ? rangeKeyAttributes.join(delimiter) : null,
            keyDelimiter: delimiter
        });
    
    return Object.create(methods, ownProperties).add(options.attributes);
};