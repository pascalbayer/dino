var _ = require('underscore');

exports.generateOwnProperties = function (options) {
    
    var ownProperties = {},
        key;
    
    for (key in options)
    {
        if (options.hasOwnProperty(key))
        {
            ownProperties[key] = { value: options[key], enumerable: true };
        }
    }
    
    return ownProperties;
};