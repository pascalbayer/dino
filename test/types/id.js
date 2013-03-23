var should = require('should'),
    dino = require('../../lib/');

describe('Id', function(){
    var type;
    beforeEach(function(){
        type = new dino.types.Id();
    });
    describe('getDefaultValue', function(){
        it('gets the default value', function(){
            type.getDefaultValue().should.be.a('string')
                .and.have.length(32);
        });
    });
});