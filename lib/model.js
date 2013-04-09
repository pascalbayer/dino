var _ = require('underscore'),
    connection = require('./connection'),
    helper = require('./helper');

var model = {
    
    set: function (key, val) {
        
        var self = this,
            attr,
            attrs;
            
        if (key === null
            || key === undefined)
        {
            return self;
        }
        
        if (_.isObject(key))
        {
            attrs = key;
        }
        else
        {
            (attrs = {})[key] = val;
        }
        
        for (attr in attrs)
        {
            if (!attr)
            {
                continue;
            }
            
            self.attributes[attr] = !_.isUndefined(attrs[attr]) ? attrs[attr] : self.schema.get(attr).getDefaultValue();
        }
        
        return self;
    },
    
    get: function (attr) {
        return this.attributes[attr]
    },
    
    getHash: function () {
        
        var self = this;
        
        return _.map(self.schema.hashKeyAttributes, function(attr){
            return self.get(attr);
        });
    },
    
    getRange: function () {
        
        var self = this;
        
        return _.map(self.schema.rangeKeyAttributes, function(attr){
            return self.get(attr);
        });
    },
    
    toJSON: function () {
        return _.clone(this.attributes);
    },
    
    serialize: function () {
        
        var self = this,
            schema = self.schema,
            dynamoAttrs = {},
            attrs = _.clone(self.attributes);
        
        if (schema.hashKeyAttributes.length > 1)
        {
            _.each(schema.hashKeyAttributes, function(key){
                delete attrs[key];
            });
            
            dynamoAttrs[schema.hashKey] = schema.generateHashAttribute(self.getHash());
        }
        
        if (_.isArray(schema.rangeKeyAttributes)
            && schema.rangeKeyAttributes.length > 1)
        {
            _.each(schema.rangeKeyAttributes, function(key){
                delete attrs[key];
            });
            
            dynamoAttrs[schema.rangeKey] = schema.generateRangeAttribute(self.getRange());
        }
        
        _.each(attrs, function(val, attr){
            
            var transformed = schema.get(attr).transform(val);
            
            if (transformed)
            {
                dynamoAttrs[attr] = transformed;
            }
            
        });
        
        return dynamoAttrs;
    },
    
    save: function (callback) {
        
        if (!_.isFunction(callback))
        {
            callback = function () {};
        }
        
        var self = this;
        
        self.client.putItem({
            TableName: self.schema.table,
            Item: self.serialize()
        }, function(err, data){
            if (err) return callback(err);
            callback(err, data.ConsumedCapacityUnits);
        });
        
    },
    
    destroy: function (callback) {
        
        if (!_.isFunction(callback))
        {
            callback = function () {};
        }
        
        var self = this;
            key = {
                HashKeyElement: self.schema.generateHashAttribute(self.getHash())
            };
        
        if (self.schema.rangeKey)
        {
            key.RangeKeyElement = self.schema.generateRangeAttribute(self.getRange());
        }
        
        self.client.deleteItem({
            TableName: self.schema.table,
            Key: key
        }, function(err, data){
            if (err) return callback(err);
            callback(err, data.ConsumedCapacityUnits);
        });
        
    }
    
};

module.exports = exports = function (options) {
    
    options = options || {};
    options.client = options.client || connection.client;
    
    var Model = {
        
        create: function (attributes) {
            
            var m = _.extend({}, model, options),
                ownProperties = {
                    attributes: {}
                };
            
            return Object.create(m, helper.ownProperties(ownProperties)).set(attributes);
        },
        
        findOne: function (options, callback) {
            
            if (!_.isFunction(callback))
            {
                callback = function () {};
            }
            
            var self = this,
                query = {
                    TableName: self.schema.table,
                    Key: {
                        HashKeyElement: self.schema.generateHashAttribute(options.hash)
                    }
                };
            
            if (options.range)
            {
                query.Key.RangeKeyElement = self.schema.generateRangeAttribute(options.range);
            }
            
            client.getItem(query, function(err, data){
                
                if (err
                    || !data.Item)
                {
                    return callback(err);
                }
                
                callback(null, self.parse(data.Item), data.ConsumedCapacityUnits);
            });
            
        },
        
        find: function (options, callback) {
            
            if (!_.isFunction(callback))
            {
                callback = function () {};
            }
            
            var self = this,
                query = {
                    TableName: self.schema.table,
                    HashKeyValue: self.schema.generateHashAttribute(options.hash),
                    ScanIndexForward: false
                };
            
            if (options.range)
            {
                query.RangeKeyValue = self.schema.generateRangeAttribute(options.range);
            }
            
            if (_.isNumber(options.take))
            {
                query.Limit = options.take;
            }
            
            if (_.isNumber(options.skip)
                && query.Limit)
            {
                query.Limit += options.skip;
            }
            
            self.client.query(query, function(err, data){
                
                if (err)
                {
                    return callback(err);
                }
                
                data.Items = _.isNumber(options.skip) ?  data.Items.slice(options.skip) : data.Items;
                
                callback(null, _.map(data.Items, self.parse, self), data.ConsumedCapacityUnits);
            });
            
        },
        
        destroy: function () {
            
            var self = this,
                key = {
                    HashKeyElement: self.schema.generateHashAttribute(options.hash)
                };
            
            if (self.schema.rangeKey)
            {
                key.RangeKeyElement = self.schema.generateRangeAttribute(options.range);
            }
            
            self.client.deleteItem({
                TableName: self.schema.table,
                Key: key
            }, function(err, data){
                if (err) return callback(err);
                callback(err, data.ConsumedCapacityUnits);
            });
            
        },
        
        parse: function (item_0) {
            
            var self = this,
                attrs = self.schema.getSerializedAttributes(),
                item = {};
            
            _.each(attrs, function(type, attr){
                
                var a = item_0[attr];
                
                if (!a)
                {
                    return;
                }
                
                if (attr === self.schema.hashKey)
                {
                    _.extend(item, self.schema.deserializeHashAttribute(a));
                    
                    return;
                }
                
                if (attr === self.schema.rangeKey)
                {
                    _.extend(item, self.schema.deserializeRangeAttribute(a));
                    
                    return;
                }
                
                item[attr] = type.parse(a);
            });
            
            return self.create(item);
        }
        
    };
    
    return Object.create(Model, helper.ownProperties({
        schema: options.schema
    }));
};