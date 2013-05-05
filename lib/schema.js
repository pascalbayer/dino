var _ = require('underscore'),
    connection = require('./connection'),
    helper = require('./helper');

var methods = {
    
    createTable: function (options, callback) {
        
        options = options || {};
        
        if (!_.isFunction(callback))
        {
            callback = function () {};
        }
        
        var self = this,
            params = {
                TableName: self.table,
                ProvisionedThroughput: {
                    ReadCapacityUnits: options.readUnits || 1,
                    WriteCapacityUnits: options.writeUnits || 1
                },
                AttributeDefinitions: [
                    { AttributeName: 'user_id', AttributeType: 'S' },
                    { AttributeName: 'id', AttributeType: 'S' }
                ],
                KeySchema:[
                    { AttributeName: 'user_id', KeyType: 'HASH' }
                ]
            },
            client = options.client || connection.client;
        
        if (self.hasRangeAttributes())
        {
            params.AttributeDefinitions.push({ AttributeName: 'date_created', AttributeType: 'S' });
            params.KeySchema.push({ AttributeName: 'date_created', KeyType: 'RANGE' });
        }
        
        if (self.hasSecondaryAttributes())
        {
            params.LocalSecondaryIndexes = _.map(self.secondaryKeyAttributes, function(attr){
                return {
                    IndexName: self.table + '.' + attr,
                    KeySchema:[
                        { AttributeName: 'user_id', KeyType: 'HASH' },
                        { AttributeName: 'id', KeyType: 'RANGE' }
                    ],
                    Projection: { ProjectionType: 'KEYS_ONLY' }
                };
            });
        }
        
        client.createTable(params, function(err, units){
            if (err) return callback(err);
            callback(null, units);
        });
    },
    
    add: function (key, val) {
        
        var self = this,
            attr,
            attrs;
        
        if (key === null
            || key === undefined)
        {
            return self;
        }
        
        if (typeof key === 'object')
        {
            attrs = key;
        }
        else
        {
            (attrs = {})[key] = val;
        }
        
        for (attr in attrs)
        {
            self.attributes[attr] = Object.create(attrs[attr]);
        }
        
        return self;
        
    },
    
    get: function (attr) {
        return this.attributes[attr];
    },
    
    serializeKeyAttribute: function (val, attrs) {
        
        var self = this,
            isArr = _.isArray(val);
        
        if (!isArr)
        {
            return self.get(attrs[0]).serializeObject(val);
        }
        
        return {
            S: _.map(attrs, function(attr, i){
                return self.get(attr).serialize(val[i]);
            }).join(self.keyDelimiter)
        };
    },
    
    serializeHashAttribute: function (val) {
        return this.serializeKeyAttribute(val, this.hashKeyAttributes);
    },
    
    serializeRangeAttribute: function (val) {
        return this.serializeKeyAttribute(val, this.rangeKeyAttributes);
    },
    
    deserializeKeyAttribute: function (val, attrs) {
        
        var self = this,
            obj = {};
        
        val = (attrs.length > 1) ? val.S.split(self.keyDelimiter) : [val.S];
        
        _.each(attrs, function(attr, i){
            obj[attr] = self.get(attr).deserialize(val[i]);
        });
        
        return obj;
    },
    
    deserializeHashAttribute: function (val) {
        return this.deserializeKeyAttribute(val, this.hashKeyAttributes);
    },
    
    deserializeRangeAttribute: function (val) {
        return this.deserializeKeyAttribute(val, this.rangeKeyAttributes);
    },
    
    getSerializedAttributes: function () {
        
        var self = this,
            attrs = _.clone(self.attributes);
        
        if (self.hashKeyAttributes.length > 1)
        {
            _.each(self.hashKeyAttributes, function(attr){
                delete attrs[attr];
            });
            
            attrs[self.hashKey] = {};
        }
        
        if (_.isArray(self.rangeKeyAttributes)
            && self.rangeKeyAttributes.length > 1)
        {
            _.each(self.rangeKeyAttributes, function(attr){
                delete attrs[attr];
            });
            
            attrs[self.rangeKey] = {};
        }
        
        return attrs;
    },
    
    generateQueryParams: function (attrs) {
        
        if (_.isEmpty(attrs))
        {
            throw new Error('You must specify query attribute(s)');
        }
        
        var self = this,
            params = {
                TableName: self.table,
                ReturnConsumedCapacity: 'TOTAL',
                ScanIndexForward: false,
                KeyConditions: {}
            },
            hashAttrCount = 0,
            hashAttrs = {},
            rangeAttrCount = 0,
            rangeAttrs = {},
            secondaryAttr;
        
        _.each(attrs, function(val, attr){
            
            if (self.hashKeyAttributes.indexOf(attr) >= 0)
            {
                hashAttrCount++;
                
                return hashAttrs[attr] = val;
            }
            
            if (self.rangeKeyAttributes.indexOf(attr) >= 0)
            {
                rangeAttrCount++;
                
                return rangeAttrs[attr] = val;
            }
                
            if (self.secondaryKeyAttributes.indexOf(attr) >= 0)
            {
                return secondaryAttr = attr;
            }
            
        });
        
        if (hashAttrCount !== self.hashKeyAttributes.length)
        {
            throw new Error('You must specify attribute(s): ' + self.hashKeyAttributes.join(', '));
        }
        
        hashAttrs = _.map(hashAttrs, function(val){
            return val;
        });
        
        params.KeyConditions[self.hashKey] = {
            AttributeValueList: [
                self.serializeHashAttribute(hashAttrs.length > 1 ? hashAttrs : hashAttrs[0])
            ],
            ComparisonOperator: 'EQ'
        }
        
        if (rangeAttrCount > 0)
        {
            if (rangeAttrCount !== self.rangeKeyAttributes.length)
            {
                throw new Error('You must specify attribute(s): ' + self.rangeKeyAttributes.join(', '));
            }
            
            rangeAttrs = _.map(rangeAttrs, function(val){
                return val;
            });
            
            params.KeyConditions[self.rangeKey] = {
                AttributeValueList: [
                    self.serializeRangeAttribute(rangeAttrs.length > 1 ? rangeAttrs : rangeAttrs[0])
                ],
                ComparisonOperator: 'EQ'
            }
            
            return params;
        }
        
        if (secondaryAttr)
        {
            params.KeyConditions[secondaryAttr] = {
                AttributeValueList: [
                    self.serializeKeyAttribute(attrs[secondaryAttr], [secondaryAttr])
                ],
                ComparisonOperator: 'EQ'
            };
            params.IndexName = self.table + '.' + secondaryAttr;
            params.ScanIndexForward = false;
            params.Select = 'ALL_ATTRIBUTES';
        }
        
        return params;
    },
    
    validateKeyMatch: function (attrs, matchAgainst, allowSingleMatch) {
        
        if (_.isEmpty(attrs))
        {
            throw new Error('You must specify attributes');
        }
        
        var self = this,
            count = 0;
        
        for (attr in attrs)
        {
            if (matchAgainst.indexOf(attr) >= 0)
            {
                count++;
            }
        }
        
        if (allowSingleMatch && count > 0)
        {
            return;
        }
        
        if (count !== matchAgainst.length)
        {
            throw new Error('You must specify attribute(s): ' + matchAgainst.join(', '));
        }
    },
    
    validateHashMatch: function (attrs) {
        this.validateKeyMatch(attrs, this.hashKeyAttributes);
    },
    
    validateRangeMatch: function (attrs) {
        this.validateKeyMatch(attrs, this.rangeKeyAttributes);
    },
    
    validateSecondaryMatch: function (attrs) {
        this.validateKeyMatch(attrs, this.secondaryKeyAttributes, true);
    },
    
    isValidRangeMatch: function (attrs) {
        
        var self = this;
        
        try
        {
            self.validateRangeMatch(attrs);
        }
        catch (err)
        {
            return false;
        }
        
        return true;
    },
    
    isValidSecondaryMatch: function (attrs) {
        
        var self = this;
        
        try
        {
            self.validateSecondaryMatch(attrs);
        }
        catch (err)
        {
            return false;
        }
        
        return true;
    },
    
    getValFromMatch: function (attrs, matchAgainst) {
        
        var self = this,
            val = [];
        
        for (attr in attrs)
        {
            if (matchAgainst.indexOf(attr) >= 0)
            {
                val.push(attrs[attr]);
            }
        }
        
        return val;
    },
    
    getHashFromMatch: function (attrs) {
        return this.getValFromMatch(attrs, this.hashKeyAttributes);
    },
    
    getRangeFromMatch: function (attrs) {
        return this.getValFromMatch(attrs, this.rangeKeyAttributes);
    },
    
    hasRangeAttributes: function () {
        return _.isArray(this.rangeKeyAttributes) && this.rangeKeyAttributes.length > 0;
    },
    
    hasSecondaryAttributes: function () {
        return _.isArray(this.secondaryKeyAttributes) && this.secondaryKeyAttributes.length > 0;
    },
    
};

module.exports = exports = function (options) {
    
    options = options || {};
    options.key = options.key || { hash: '', range: null };
    
    var delimiter = options.keyDelimiter || '#',
        hashKeyAttributes = helper.normalizeKey(options.key.hash),
        rangeKeyAttributes = helper.normalizeKey(options.key.range),
        secondaryKeyAttributes = helper.normalizeKey(options.key.secondary),
        ownProperties = helper.ownProperties({
            attributes: {},
            table: options.table || '',
            hashKeyAttributes: hashKeyAttributes,
            rangeKeyAttributes: rangeKeyAttributes,
            secondaryKeyAttributes: secondaryKeyAttributes,
            hashKey: hashKeyAttributes.join(delimiter),
            rangeKey: rangeKeyAttributes ? rangeKeyAttributes.join(delimiter) : null,
            keyDelimiter: delimiter
        });
    
    return Object.create(methods, ownProperties).add(options.attributes);
};