var should = require('should'),
    dino = require('../../lib/');

describe('dino', function(){
    describe('Number', function(){
        var type;
        beforeEach(function(){
            type = new dino.types.Number();
        });
        describe('parse', function(){
            it('parses', function(){
                type.parse({ N: 0 }).should.equal(0);
                type.parse({ NN: [1, 0] }).should.eql([1, 0]);
            });
        });
        describe('transform', function(){
            it('transforms the value', function(){
                type.transform(1).should.eql({ N: 1 });
                type.transform([1, 0]).should.eql({ NN: [1, 0] });
            });
        });
    })
});