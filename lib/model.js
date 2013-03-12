var _ = require('underscore'),
    uuid = require('node-uuid');

var Model = function (fields) {
    
    var self = this;
    
    self.keys = {};
    
    self.set('_id', uuid.v4().replace('-', ''));
    
    _.each(fields, function(val, name){
        self.set(name, val);
    });
};

Model.prototype.set = function (name, val) {
    
    var self = this,
        fields = self.schema.fields;
    
    if (!fields[name])
    {
        return;
    }
    
    self.keys[name] = val;
};

Model.prototype.get = function (name) {
    return this.keys[name];
};

Model.prototype.toJSON = function () {
    return _.clone(this.keys);
};

Model.prototype.toDynamo = function () {
    
    var obj = {};
    
    _.each(this.keys, function(val, name){
        obj[name] = {
            S: val
        };
    });
    
    return obj;
};

Model.prototype.save = function (callback) {
    this.db.putItem({
        TableName: 'fonts',
        Item: this.toDynamo()
    }, function(err, data){
        callback(err);
    });
};

Model.find = function (options, callback) {
    
    
    
};

Model.findOne = function (options, callback) {
    
    
    
};

Model.findById = function (id, callback) {
    
    
    
};

module.exports = exports = Model;