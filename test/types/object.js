var should = require('should'),
    dino = require('../../');

describe('object', function(){
    
    var type;
    
    beforeEach(function(){
        type = Object.create(dino.types.object);
    });
    
    describe('parseValue', function(){
        it('parses the value', function(){
            should.not.exist(type.deserialize());
            should.not.exist(type.deserialize(null));
            type.deserialize(1).should.equal(1);
            should.not.exist(type.deserialize('a'));
        });
    });
    
    describe('transformValue', function(){
        it('transforms the value', function(){
            should.not.exist(type.serialize());
            should.not.exist(type.serialize(null));
            type.serialize(1).should.eql('1');
            var obj = { test: 'test' };
            type.serialize(obj).should.eql(JSON.stringify(obj));
        });
    });
});