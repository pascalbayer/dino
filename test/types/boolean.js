var should = require('should'),
    dino = require('../../');

describe('boolean', function(){
    
    var type;
    
    beforeEach(function(){
        type = Object.create(dino.types.boolean);
    });
    
    describe('parseValue', function(){
        it('parses the value', function(){
            type.deserialize().should.equal(false);
            type.deserialize(null).should.equal(false);
            type.deserialize(0).should.equal(false);
            type.deserialize(-1).should.equal(false);
            type.deserialize(false).should.equal(false);
            type.deserialize('1').should.equal(true);
        });
    });
    
    describe('parse', function(){
        it('parses', function(){
            type.deserializeObject({ N: '0' }).should.equal(false);
            type.deserializeObject({ N: '1' }).should.equal(true);
            type.deserializeObject({ NN: ['1', '0'] }).should.eql([true, false]);
        });
    });
    
    describe('transformValue', function(){
        it('transforms the value', function(){
            type.serialize(true).should.equal('1');
            type.serialize(false).should.equal('0');
        });
    });
    
    describe('transform', function(){
        it('transforms the value', function(){
            type.serializeObject(true).should.eql({ N: '1' });
            type.serializeObject([true, false]).should.eql({ NN: ['1', '0'] });
        });
    });
});