var should = require('should'),
    dino = require('../../lib/');

describe('dino', function(){
    describe('Object', function(){
        var type;
        beforeEach(function(){
            type = new dino.types.Object();
        });
        describe('parseValue', function(){
            it('parses the value', function(){
                should.not.exist(type.parseValue());
                should.not.exist(type.parseValue(null));
                type.parseValue(1).should.equal(1);
                should.not.exist(type.parseValue('a'));
            });
        });
    })
});