var _ = require('underscore'),
    uuid = require('node-uuid'),
    Schema = require('./schema');

var Model = function (attributes) {
    this.attributes = {};
    this.client = '';
    this.schema = this.schema;
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
    
    getHashKey: function () {
        var self = this;
        return _.map(self.schema.hashKeyAttributes, function(attr){
            return self.schema.attributes[attr].parse(self.get(attr));
        }).join(Schema.keyDelimiter);
    },
    
    getRangeKey: function () {
        var self = this;
        return _.map(self.schema.rangeKeyAttributes, function(attr){
            return self.schema.attributes[attr].parse(self.get(attr));
        }).join(Schema.keyDelimiter);
    },
    
    toJSON: function () {
        return _.clone(this.attributes);
    },
    
    toDynamo: function () {
        
        var self = this,
            dynamoAttrs = {},
            attrs = self.toJSON(),
            attr;
        
        if (self.schema.hashKeyAttributes.length > 1)
        {
            _.each(self.schema.hashKeyAttributes, function(key){
                delete attrs[key];
            });
            
            dynamoAttrs[self.schema.hashKey] = self.schema.getType(String).toDynamo(self.getHashKey());
        }
        
        if (_.isArray(self.schema.rangeKeyAttributes)
            && self.schema.rangeKeyAttributes.length > 1)
        {
            _.each(self.schema.rangeKeyAttributes, function(key){
                delete attrs[key];
            });
            
            dynamoAttrs[self.schema.rangeKey] = self.schema.getType(String).toDynamo(self.getRangeKey());
        }
        
        for (attr in attrs)
        {
            dynamoAttrs[attr] = self.schema.attributes[attr].toDynamo(attrs[attr]);
        }
        
        return dynamoAttrs;
    },
    
    parse: function (data) {
        
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
    
    find: function (options, callback) {
        
        
        
    },
    
    findOne: function (options, callback) {
        
        
        
    }
    
});

Model.generateUuid = function () {
    return uuid.v4().replace(/\-/g, '');
};

Model.extend = require('./helper').extend;

module.exports = exports = Model;