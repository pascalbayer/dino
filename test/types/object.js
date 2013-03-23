var should = require('should'),
    dino = require('../../lib/');

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
    describe('transformValue', function(){
        it('transforms the value', function(){
            should.not.exist(type.transformValue());
            should.not.exist(type.transformValue(null));
            type.transformValue(1).should.eql('1');
            var obj = { test: 'test' };
            type.transformValue(obj).should.eql(JSON.stringify(obj));
        });
    });
});