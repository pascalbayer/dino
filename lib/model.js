var _ = require('underscore'),
    Schema = require('./schema'),
    types = require('./types/');

var Model = function (attributes) {
    this.attributes = {};
    this.set(attributes);
};

_.extend(Model.prototype, {
    
    set: function (key, val) {
        
        var schema = this.constructor.schema,
            attr,
            attrs;
            
        if (key === null)
        {
            return this;
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
            this.attributes[attr] = !_.isUndefined(attrs[attr]) ? attrs[attr] : schema.get(attr).getDefaultValue();
        }
        
        return this;
    },
    
    get: function (attr) {
        return this.attributes[attr]
    },
    
    getHash: function () {
        
        var self = this,
            schema = self.constructor.schema;
        
        return _.map(schema.hashKeyAttributes, function(attr){
            return self.get(attr);
        });
    },
    
    getRange: function () {
        
        var self = this,
            schema = self.constructor.schema;
        
        return _.map(schema.rangeKeyAttributes, function(attr){
            return self.get(attr);
        });
    },
    
    toJSON: function () {
        return _.clone(this.attributes);
    },
    
    toDynamo: function () {
        
        var self = this,
            schema = self.constructor.schema,
            dynamoAttrs = {},
            attrs = _.clone(self.attributes),
            attr;
        
        if (schema.hashKeyAttributes.length > 1)
        {
            _.each(schema.hashKeyAttributes, function(key){
                delete attrs[key];
            });
            
            dynamoAttrs[schema.hashKey] = new types.String().transform(self.getHash());
        }
        
        if (_.isArray(schema.rangeKeyAttributes)
            && schema.rangeKeyAttributes.length > 1)
        {
            _.each(schema.rangeKeyAttributes, function(key){
                delete attrs[key];
            });
            
            dynamoAttrs[schema.rangeKey] = new types.String().transform(self.getRange());
        }
        
        for (attr in attrs)
        {
            dynamoAttrs[attr] = schema.get(attr).transform(attrs[attr]);
        }
        
        return dynamoAttrs;
    },
    
    save: function (callback) {
        
        var self = this,
            schema = self.constructor.schema,
            client = schema.constructor.client;
        
        client.putItem({
            TableName: schema.table,
            Item: self.toDynamo()
        }, function(err, data){
            callback(err, data.ConsumedCapacityUnits);
        });
    },
    
    destroy: function (callback) {
        
        var self = this,
            schema = self.constructor.schema,
            client = schema.constructor.client;
            key = {
                HashKeyElement: schema.generateHashAttribute(self.getHash())
            };
        
        if (schema.rangeKey)
        {
            key.RangeKeyElement = schema.generateRangeAttribute(self.getRange());
        }
        
        client.deleteItem({
            TableName: schema.table,
            Key: key
        }, function(err, data){
            callback(err, data.ConsumedCapacityUnits);
        });
    }
    
});

_.extend(Model, {
    
    parse: function (item_0) {
        
        var self = this,
            item = {};
        
        _.each(self.schema.attributes, function(type, attr){
            
            if (!item_0[attr])
            {
                return;
            }
            
            item[attr] = type.parse(item_0[attr]);
        });
        
        return new self(item);
    },
    
    find: function (options, callback) {
        
        var self = this,
            schema = self.schema,
            client = schema.constructor.client,
            query = {
                TableName: schema.table,
                HashKeyValue: schema.generateHashAttribute(options.hash),
                ScanIndexForward: false
            };
        
        if (options.range)
        {
            query.RangeKeyValue = schema.generateRangeAttribute(options.range);
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
        
        client.query(query, function(err, data){
            
            if (err)
            {
                return callback(err);
            }
            
            data.Items = _.isNumber(options.skip) ?  data.Items.slice(options.skip) : data.Items;
            
            callback(null, _.map(data.Items, self.parse, self), data.ConsumedCapacityUnits);
        });
    },
    
    findOne: function (options, callback) {
        
        var self = this,
            schema = self.schema,
            client = schema.constructor.client,
            query = {
                TableName: self.schema.table,
                Key: {
                    HashKeyElement: schema.generateHashAttribute(options.hash)
                }
            };
        
        if (options.range)
        {
            query.Key.RangeKeyElement = schema.generateRangeAttribute(options.range);
        }
        
        client.getItem(query, function(err, data, c){
            
            if (err
                || !data.Item)
            {
                return callback(err);
            }
            
            callback(null, self.parse(data.Item), data.ConsumedCapacityUnits);
        });
    },
    
    destroy: function (options) {
        
        var self = this,
            schema = self.schema,
            client = schema.constructor.client,
            key = {
                HashKeyElement: schema.generateHashAttribute(options.hash)
            };
        
        if (schema.rangeKey)
        {
            key.RangeKeyElement = schema.generateRangeAttribute(options.range);
        }
        
        client.deleteItem({
            TableName: schema.table,
            Key: key
        }, function(err, data){
            callback(err, data.ConsumedCapacityUnits);
        });
        
    }
    
});

Model.extend = require('./helper').extend;

module.exports = exports = Model;