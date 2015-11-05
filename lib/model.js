var _ = require('lodash'),
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
        
        _.forEach(attrs, function(val, attr){

            // check if the attributes value is a function, if yes don't try to serialize it
            if(_.isFunction(val)){
                return;
            }

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
            _.forEach(schema.hashKeyAttributes, function(key){
                delete attrs[key];
            });
            
            dynamoAttrs[schema.hashKey] = schema.serializeHashAttribute(self.getHash());
        }
        
        if (_.isArray(schema.rangeKeyAttributes)
            && schema.rangeKeyAttributes.length > 1)
        {
            _.forEach(schema.rangeKeyAttributes, function(key){
                delete attrs[key];
            });
            
            dynamoAttrs[schema.rangeKey] = schema.serializeRangeAttribute(self.getRange());
        }
        
        _.forEach(attrs, function(val, attr){
            
            // check if the attributes value is a function, if yes don't try to serialize it
            if(_.isFunction(val)){
                return;
            }

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
            var consumedCapacity = null;

            if (err) return callback(err);
            if (data.ConsumedCapacity && data.ConsumedCapacity.CapacityUnits) {
                consumedCapacity = data.ConsumedCapacity.CapacityUnits;
            }
            return callback.call(self, err, consumedCapacity);
        });
        
    },
    
    destroy: function (callback) {
        
        if (!_.isFunction(callback))
        {
            callback = function () {};
        }
        
        var self = this,
            schema = self.schema,
            match = {};
        
        try
        {
            match[schema.hashKey] = self.getHash().join(schema.keyDelimiter);
            
            if (schema.hasRangeAttributes())
            {
                match[schema.rangeKey] = self.getRange()[0];
            }
        }
        catch (err)
        {
            
            return callback(err);
        }
        
        self.Model.destroy(match, callback);
    }
    
};

var Model = {
    
    connection: connection,
    
    create: function (attributes) {
        
        attributes = attributes || {};
        
        var self = this,
            instanceOwnProperties = {
                schema: self.schema,
                connection: self.connection,
                attributes: {},
                Model: this
            },
            reserved = ['options', 'schema', 'connection', 'client', 'attributes', 'Model'];
        
        _.forEach(self.options, function(val, key){
            if (reserved.indexOf(key) >= 0) return;
            instanceOwnProperties[key] = val;
        });
        
        _.forEach(self.schema.attributes, function(type, attr){
            attributes[attr] = attributes[attr];
        });
        
        return _.bindAll(Object.create(model, helper.ownProperties(instanceOwnProperties)).set(attributes));
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
            schema = self.schema,
            params;
        
        if (!schema.hasRangeAttributes()
            && attrs[schema.hashKey])
        {
            params = {
                TableName: schema.table,
                ReturnConsumedCapacity: 'TOTAL',
                ConsistentRead: true,
                Key: {}
            };
            params.Key[schema.hashKey] = schema.serializeHashAttribute(schema.getHashFromMatch(attrs));
            return self.connection.client.getItem(params, function(err, data){
                var consumedCapacity = null;

                if (err) return callback(err);
                if (!data.Item) return callback(new Error('Item does not exist'));
                if (data.ConsumedCapacity && data.ConsumedCapacity.CapacityUnits) {
                    consumedCapacity = data.ConsumedCapacity.CapacityUnits;
                }
                callback(null, self.parse(data.Item), consumedCapacity);
            });
        }
        
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
                
                query.IndexName = schema.table + '.' + options.sortBy;
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
            var consumedCapacity = null;

            if (err) return callback(err);
            try
            {
                data.Items = _.isNumber(options.skip) ?  data.Items.slice(options.skip) : data.Items;
            }
            catch (err)
            {
                return callback(err);
            }
            if (data.ConsumedCapacity && data.ConsumedCapacity.CapacityUnits) {
                consumedCapacity = data.ConsumedCapacity.CapacityUnits;
            }
            callback(null, collection(_.map(data.Items, self.parse, self)), consumedCapacity);
        });
        
    },
    
    destroy: function (attrs, callback) {
        
        if (!_.isFunction(callback))
        {
            callback = function () {};
        }
        
        var self = this,
            schema = self.schema,
            params = {
                TableName: schema.table,
                ReturnConsumedCapacity: 'TOTAL',
                Key: {}
            };
        
        try
        {
            params.Key[schema.hashKey] = schema.serializeHashAttribute(schema.getHashFromMatch(attrs));
        }
        catch (err)
        {
            return callback(err);
        }
        
        if (!schema.hasRangeAttributes())
        {
            return self.connection.client.deleteItem(params, function(err, data){
                var consumedCapacity = null;

                if (err) return callback(err);
                if (data.ConsumedCapacity && data.ConsumedCapacity.CapacityUnits) {
                    consumedCapacity = data.ConsumedCapacity.CapacityUnits;
                }
                callback(err, consumedCapacity);
            });
        }
        
        if (schema.isValidRangeMatch(attrs))
        {
            params.Key[schema.rangeKey] = schema.serializeRangeAttribute(schema.getRangeFromMatch(attrs));
            
            return self.connection.client.deleteItem(params, function(err, data){
                var consumedCapacity = null;

                if (err) return callback(err);
                if (data.ConsumedCapacity && data.ConsumedCapacity.CapacityUnits) {
                    consumedCapacity = data.ConsumedCapacity.CapacityUnits;
                }
                callback(err, consumedCapacity);
            });
        }
        
        if (schema.isValidSecondaryMatch(attrs))
        {
            return self.findOne(attrs, function(e1, m, u1){
                if (e1) return callback(e1);
                m.destroy(function(e2, u2){
                    if (e2) return callback(e2);
                    callback(null, (u1 + u2));
                });
            });
        }
        
        return callback(new Error('You must specify range or secondary attribute(s)'));
    },
    
    parse: function (item_0) {
        
        var self = this,
            attrs = self.schema.getSerializedAttributes(),
            item = {};
        
        _.forEach(attrs, function(type, attr){
            
            var a = item_0[attr];
            
            if (!a)
            {
                return;
            }
            
            if (attr === self.schema.hashKey)
            {
                _.assign(item, self.schema.deserializeHashAttribute(a));
                
                return;
            }
            
            if (attr === self.schema.rangeKey)
            {
                _.assign(item, self.schema.deserializeRangeAttribute(a));
                
                return;
            }
            
            item[attr] = type.deserializeObject(a);
        });
        
        return self.create(item);
    }
    
};

module.exports = exports = function (options) {
    
    options = options || {};
    
    var ownProperties = {
        options: options,
        schema: options.schema
    };
    
    if (options.client)
    {
        ownProperties.connection = { client: options.client };
    }
    
    return _.bindAll(Object.create(Model, helper.ownProperties(ownProperties)));
};
