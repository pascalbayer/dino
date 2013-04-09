var should = require('should'),
    dino = require('../../');

describe('number', function(){
    
    var type;
    
    beforeEach(function(){
        type = Object.create(dino.types.number);
    });
    
    describe('parse', function(){
        it('parses', function(){
            should.not.exist(type.deserializeObject({ N: 'asdf' }))
            should.not.exist(type.deserializeObject({ N: undefined }));
            should.not.exist(type.deserializeObject({ N: null }));
            type.deserializeObject({ N: '-1' }).should.equal(-1);
            type.deserializeObject({ N: '0' }).should.equal(0);
            type.deserializeObject({ N: '1' }).should.equal(1);
            type.deserializeObject({ N: '1.234' }).should.equal(1.234);
            type.deserializeObject({ NN: ['1', '0'] }).should.eql([1, 0]);
        });
    });
    
    describe('transform', function(){
        it('transforms the value', function(){
            type.serializeObject(1).should.eql({ N: '1' });
            should.not.exist(type.serializeObject('asdf'));
            type.serializeObject([1, 0]).should.eql({ NN: ['1', '0'] });
        });
    });
});