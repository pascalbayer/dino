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
        return _.map(self.schema.hashKeyAttributes, function(key){
            return self.get(key);
        }).join(Schema.keyDelimiter);
    },
    
    getRangeKey: function () {
        var self = this;
        return _.map(self.schema.rangeKeyAttributes, function(key){
            return self.get(key);
        }).join(Schema.keyDelimiter);
    },
    
    toJSON: function () {
        return _.clone(this.attributes);
    },
    
    toDynamo: function () {
        
        var self = this,
            attrs = self.toJSON(),
            keyAttrs = self.schema.hashKeyAttributes.concat(self.schema.rangeKeyAttributes),
            attr;
        
        _.each(keyAttrs, function(key){
            delete attrs[key];
        });
        
        attrs[self.schema.hashKey] = self.getHashKey();
        
        if (self.schema.rangeKey)
        {
            attrs[self.schema.rangeKey] = self.getRangeKey();
        }
        
        for (attr in attrs)
        {
            attrs[]
        }
        
        return attrs;
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