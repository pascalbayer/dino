var should = require('should'),
    dino = require('../../lib/');

describe('Boolean', function(){
    var type;
    beforeEach(function(){
        type = new dino.types.Boolean();
    });
    describe('getDefaultValue', function(){
        it('gets the default value', function(){
            type.getDefaultValue().should.equal(false);
        });
    });
    describe('parseValue', function(){
        it('parses the value', function(){
            type.parseValue().should.equal(false);
            type.parseValue(null).should.equal(false);
            type.parseValue(0).should.equal(false);
            type.parseValue(-1).should.equal(false);
            type.parseValue(false).should.equal(false);
            type.parseValue('1').should.equal(true);
        });
    });
    describe('parse', function(){
        it('parses', function(){
            type.parse({ N: '0' }).should.equal(false);
            type.parse({ N: '1' }).should.equal(true);
            type.parse({ NN: ['1', '0'] }).should.eql([true, false]);
        });
    });
    describe('transformValue', function(){
        it('transforms the value', function(){
            type.transformValue(true).should.equal('1');
            type.transformValue(false).should.equal('0');
        });
    });
    describe('transform', function(){
        it('transforms the value', function(){
            type.transform(true).should.eql({ N: '1' });
            type.transform([true, false]).should.eql({ NN: ['1', '0'] });
        });
    });
});