var should = require('should'),
    dino = require('../');

describe('model', function(){
    
    var schema = dino.schema({
            table: 'forums',
            attributes: {
                name: dino.types.string
            },
            key: {
                hash: 'name'
            }
        }),
        model;
    
    beforeEach(function(){
        model = dino.model({
            schema: schema
        });
    });
    
    it('should do something', function(){
        
        var m = model.create({
            name: 'chris'
        });
        //console.log(m);
        //model.set();
        
    });
    
});