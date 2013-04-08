var should = require('should'),
    dino = require('../../');

describe('id', function(){
    
    var type;
    
    beforeEach(function(){
        type = Object.create(dino.types.id);
    });
    
    describe('getDefaultValue', function(){
        it('gets the default value', function(){
            type.getDefaultValue().should.be.a('string')
                .and.have.length(32);
        });
    });
});