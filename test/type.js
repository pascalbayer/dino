var should = require('should'),
    dino = require('../lib/');

describe('Type', function(){
    var type;
    beforeEach(function(){
        type = new dino.Type();
    });
    describe('parseValue', function(){
        it('returns the value', function(){
            var s = 'a';
            type.parseValue(s).should.equal(s);
        });
    });
    describe('parse', function(){
        it('parses strings', function(){
            var s = 'a';
            type.parse({ S: s }).should.equal(s);
        });
        it('parses arrays', function(){
            var ss = ['a', 'b'];
            type.parse({ SS: ss }).should.eql(ss);
        });
    });
    describe('transformValue', function(){
        it('returns the value', function(){
            var s = 'a';
            type.transformValue(s).should.equal(s);
        });
    });
    describe('transform', function(){
        it('transforms strings', function(){
            var s = 'a';
            type.transform(s).should.eql({ S: s });
        });
        it('transforms arrays', function(){
            var ss = ['a', 'b'];
            type.transform(ss).should.eql({ SS: ss });
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