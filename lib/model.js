var _ = require('underscore'),
    uuid = require('node-uuid'),
    Schema = require('./schema');

var Model = function (attributes) {
    this.attributes = {};
    this.set(attributes);
};

_.extend(Model.prototype, {
    
    set: function (key, val) {
        
        var attr,
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
            this.attributes[attr] = attrs[attr];
        }
        
        return this;
    },
    
    get: function (attr) {
        return this.attributes[attr]
    },
    
    getHashAttribute: function () {
        
        var self = this,
            schema = self.constructor.schema;
        
        return _.map(schema.hashKeyAttributes, function(attr){
            return schema.attributes[attr].parseValue(self.get(attr));
        }).join(Schema.keyDelimiter);
    },
    
    getRangeAttribute: function () {
        
        var self = this,
            schema = self.constructor.schema;
        
        return _.map(schema.rangeKeyAttributes, function(attr){
            return schema.attributes[attr].parseValue(self.get(attr));
        }).join(Schema.keyDelimiter);
    },
    
    toJSON: function () {
        return _.clone(this.attributes);
    },
    
    toDynamo: function () {
        
        var self = this,
            schema = self.constructor.schema,
            dynamoAttrs = {},
            attrs = self.toJSON(),
            attr;
        
        if (schema.hashKeyAttributes.length > 1)
        {
            _.each(schema.hashKeyAttributes, function(key){
                delete attrs[key];
            });
            
            dynamoAttrs[schema.hashKey] = schema.getType(String).transformAttribute(self.getHashAttribute());
        }
        
        if (_.isArray(schema.rangeKeyAttributes)
            && schema.rangeKeyAttributes.length > 1)
        {
            _.each(schema.rangeKeyAttributes, function(key){
                delete attrs[key];
            });
            
            dynamoAttrs[schema.rangeKey] = schema.getType(String).transformAttribute(self.getRangeAttribute());
        }
        
        for (attr in attrs)
        {
            dynamoAttrs[attr] = schema.attributes[attr].transformAttribute(attrs[attr]);
        }
        
        return dynamoAttrs;
    },
    
    save: function () {
        this.client.putItem({
            TableName: this.schema.table,
            Item: this.toDynamo()
        }, function(err, data){
            callback(err);
        });
    },
    
    destroy: function () {
        this.client.deleteItem({
            TableName: this.schema.table,
            Item: this.toDynamo()
        }, function(err, data){
            callback(err);
        });
    }
    
});

_.extend(Model, {
    
    parse: function (item_0) {
        
        var self = this,
            item = {};
        
        _.each(self.schema.attributes, function(val, key){
            
            if (!item_0[key])
            {
                return;
            }
            
            item[key] = val.parseAttribute(item_0[key]);
        });
        
        return new self(item);
    },
    
    find: function (options, callback) {
        
        var self = this,
            schema = self.schema,
            query = {
                TableName: schema.table,
                HashKeyValue: schema.generateHashAttribute(options.hash),
                ScanIndexForward: false
            };
        
        if (options.range)
        {
            query.RangeKeyValue = schema.generateHashAttribute(options.range);
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
    
    findOne: function (options, callback) {
        
        var self = this,
            schema = self.schema,
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
        
        self.client.getItem(query, function(err, data, c){
            
            if (err
                || !data.Item)
            {
                return callback(err);
            }
            
            callback(null, self.parse(data.Item), data.ConsumedCapacityUnits);
        });
    }
    
});

Model.generateId = function () {
    return uuid.v4().replace(/\-/g, '');
};

Model.extend = require('./helper').extend;

module.exports = exports = Model;