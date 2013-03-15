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
            return schema.attributes[attr].parse(self.get(attr));
        }).join(Schema.keyDelimiter);
    },
    
    getRangeAttribute: function () {
        
        var self = this,
            schema = self.constructor.schema;
        
        return _.map(schema.rangeKeyAttributes, function(attr){
            return schema.attributes[attr].parse(self.get(attr));
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
            
            dynamoAttrs[schema.hashKey] = schema.getType(String).toDynamo(self.getHashAttribute());
        }
        
        if (_.isArray(schema.rangeKeyAttributes)
            && schema.rangeKeyAttributes.length > 1)
        {
            _.each(schema.rangeKeyAttributes, function(key){
                delete attrs[key];
            });
            
            dynamoAttrs[schema.rangeKey] = schema.getType(String).toDynamo(self.getRangeAttribute());
        }
        
        for (attr in attrs)
        {
            dynamoAttrs[attr] = schema.attributes[attr].toDynamo(attrs[attr]);
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
    
    parse: function (data) {
        return data;
    },
    
    find: function (options, callback) {
        
        _.defaults(options, {
            skip: 0,
            take: 10
        });
        
        db.query({
            TableName: 'TODO',
            HashKeyValue: 'TODO',
            ScanIndexForward: false,
            Limit: options.skip + options.take
        }, function(err, data){
            
            if (err)
            {
                return callback(err);
            }
            
            callback(null, Model.parse(data));
        });
    },
    
    findOne: function (options, callback) {
        
        
        
    }
    
});

Model.generateId = function () {
    return uuid.v4().replace(/\-/g, '');
};

Model.extend = require('./helper').extend;

module.exports = exports = Model;