var should = require('should'),
    dino = require('../../lib/');

describe('Number', function(){
    var type;
    beforeEach(function(){
        type = new dino.types.Number();
    });
    describe('parse', function(){
        it('parses', function(){
            should.not.exist(type.parse({ N: 'asdf' }))
            should.not.exist(type.parse({ N: undefined }));
            should.not.exist(type.parse({ N: null }));
            type.parse({ N: '-1' }).should.equal(-1);
            type.parse({ N: '0' }).should.equal(0);
            type.parse({ N: '1' }).should.equal(1);
            type.parse({ N: '1.234' }).should.equal(1.234);
            type.parse({ NN: ['1', '0'] }).should.eql([1, 0]);
        });
    });
    describe('transform', function(){
        it('transforms the value', function(){
            type.transform(1).should.eql({ N: '1' });
            should.not.exist(type.transform('asdf'));
            type.transform([1, 0]).should.eql({ NN: ['1', '0'] });
        });
    });
});