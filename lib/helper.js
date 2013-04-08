var _ = require('underscore');

exports.generateOwnProperties = function (options) {
    
    if (!options)
    {
        return;
    }
    
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