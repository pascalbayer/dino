var should = require('should'),
    dino = require('../');

describe('type', function(){
    
    var type;
    
    beforeEach(function(){
        type = dino.type();
    });
    
    describe('parseValue', function(){
        it('returns the value', function(){
            var s = 'a';
            type.deserialize(s).should.equal(s);
        });
    });
    
    describe('parse', function(){
        it('parses strings', function(){
            var s = 'a';
            type.deserializeObject({ S: s }).should.equal(s);
        });
        it('parses arrays', function(){
            var ss = ['a', 'b'];
            type.deserializeObject({ SS: ss }).should.eql(ss);
        });
    });
    
    describe('transformValue', function(){
        it('returns the value', function(){
            var s = 'a';
            type.serialize(s).should.equal(s);
        });
    });
    
    describe('transform', function(){
        it('transforms strings', function(){
            var s = 'a';
            type.serializeObject(s).should.eql({ S: s });
        });
        it('transforms arrays', function(){
            var ss = ['a', 'b'];
            type.serializeObject(ss).should.eql({ SS: ss });
        });
    });
    
    describe('toJSON', function(){
        it('returns the value', function(){
            var s = 'a';
            type.toJSON(s).should.equal(s);
        });
    });
    
    describe('getDefaultValue', function(){
        it('returns null', function(){
            should.not.exist(type.getDefaultValue());
        });
    });
    
});