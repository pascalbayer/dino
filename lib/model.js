var _ = require('underscore');

var Model = function (fields) {
    
    var self = this;
    
    self.keys = {};
    
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

Model.prototype.save = function () {
    
    
    
};

Model.find = function (options, callback) {
    
    
    
};

Model.findOne = function (options, callback) {
    
    
    
};

Model.findById = function (id, callback) {
    
    
    
};

module.exports = exports = Model;