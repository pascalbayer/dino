var _ = require('underscore'),
    connection = require('./connection'),
    collection = require('./collection'),
    helper = require('./helper');

var model = {
    
    connection: connection,
    
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
            
            self.attributes[attr] = !_.isUndefined(attrs[attr])
                ? attrs[attr]
                : self.schema.get(attr).getDefaultValue();
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
        
        var self = this,
            schema = self.schema,
            json = {},
            attrs = _.clone(self.attributes);
        
        _.each(attrs, function(val, attr){
            var transformed = schema.get(attr).toJSON(val);
            if (transformed) json[attr] = transformed;
        });
        
        return json;
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
            
            dynamoAttrs[schema.hashKey] = schema.serializeHashAttribute(self.getHash());
        }
        
        if (_.isArray(schema.rangeKeyAttributes)
            && schema.rangeKeyAttributes.length > 1)
        {
            _.each(schema.rangeKeyAttributes, function(key){
                delete attrs[key];
            });
            
            dynamoAttrs[schema.rangeKey] = schema.serializeRangeAttribute(self.getRange());
        }
        
        _.each(attrs, function(val, attr){
            
            var transformed = schema.get(attr).serializeObject(val);
            
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
        
        self.connection.client.putItem({
            TableName: self.schema.table,
            Item: self.serialize(),
            ReturnConsumedCapacity: 'TOTAL'
        }, function(err, data){
            if (err) return callback(err);
            return callback(err, data.ConsumedCapacity.CapacityUnits);
        });
        
    },
    
    destroy: function (callback) {
        
        if (!_.isFunction(callback))
        {
            callback = function () {};
        }
        
        var self = this;
            key = {
                HashKeyElement: self.schema.serializeHashAttribute(self.getHash())
            };
        
        if (self.schema.rangeKey)
        {
            key.RangeKeyElement = self.schema.serializeRangeAttribute(self.getRange());
        }
        
        self.connection.client.deleteItem({
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
    
    var Model = {
        
        connection: connection,
        
        create: function (attributes) {
            
            attributes = attributes || {};
            
            var self = this,
                instanceOwnProperties = {
                    schema: options.schema,
                    attributes: {}
                };
            
            if (options.client)
            {
                instanceOwnProperties.connection = { client: options.client };
            }
            
            // Set the defaults
            _.each(self.schema.attributes, function(type, attr){
                attributes[attr] = attributes[attr];
            });
            
            return Object.create(model, helper.ownProperties(instanceOwnProperties)).set(attributes);
        },
        
        findOne: function (attrs, callback) {
            
            if (!_.isFunction(callback))
            {
                callback = function () {};
            }
            
            if (_.isEmpty(attrs))
            {
                callback(new Error('You must specify match attributes'));
            }
            
            var self = this,
                schema = self.schema;
            
            self.find({ match: attrs }, function(err, collection, units){
                if (err) return callback(err);
                if (collection.models.length < 1) return callback(new Error('Item does not exist'));
                if (collection.models.length > 1) return callback(new Error('You must specify range or secondary attributes'));
                callback(null, collection.models[0], units);
            });
        },
        
        find: function (options, callback) {
            
            if (!_.isFunction(callback))
            {
                callback = function () {};
            }
            
            var self = this,
                schema = self.schema,
                query;
            
            try
            {
                query = schema.generateQueryParams(options.match);
                
                if (_.isString(options.sortBy))
                {
                    if (schema.secondaryKeyAttributes.indexOf(options.sortBy) < 0)
                    {
                        throw new Error('You can only sort by Secondary attributes');
                    }
                    
                    query.IndexName = options.sortBy + '-index';
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
            }
            catch (err)
            {
                return callback(err);
            }
            
            self.connection.client.query(query, function(err, data){
                if (err) return callback(err);
                try
                {
                    data.Items = _.isNumber(options.skip) ?  data.Items.slice(options.skip) : data.Items;
                }
                catch (err)
                {
                    return callback(err);
                }
                callback(null, collection(_.map(data.Items, self.parse, self)), data.ConsumedCapacity.CapacityUnits);
            });
            
        },
        
        destroy: function (attrs, callback) {
            
            if (!_.isFunction(callback))
            {
                callback = function () {};
            }
            
            if (_.isEmpty(attrs))
            {
                callback(new Error('You must specify match attributes'));
            }
            
            var self = this,
                key = {
                    HashKeyElement: self.schema.serializeHashAttribute(options.hash)
                };
            
            if (self.schema.rangeKey)
            {
                key.RangeKeyElement = self.schema.serializeRangeAttribute(options.range);
            }
            
            self.connection.client.deleteItem({
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
                
                item[attr] = type.deserializeObject(a);
            });
            
            return self.create(item);
        }
        
    };
    
    var ownProperties = {
        schema: options.schema
    };
    
    if (options.client)
    {
        ownProperties.connection = { client: options.client };
    }
    
    return Object.create(Model, helper.ownProperties(ownProperties));
};