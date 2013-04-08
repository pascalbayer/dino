var should = require('should'),
    moment = require('moment'),
    dino = require('../../');

describe('date', function(){
    
    var type;
    
    beforeEach(function(){
        type = Object.create(dino.types.date);
    });
    
    describe('getDefaultValue', function(){
        it('gets the default value', function(){
            type.getDefaultValue().format('YYYY-MM-DD').should.equal(moment.utc().format('YYYY-MM-DD'));
        });
    });
    
    describe('parseValue', function(){
        it('parses the value', function(){
            var s = '2013-03-18T19:26:08+00:00';
            type.deserialize(s).format().should.equal(s);
        });
    });
    
    describe('parse', function(){
        it('parses', function(){
            var s = '2013-03-18T19:26:08+00:00'
            type.deserializeObject({ S: s }).format().should.equal(s);
            type.deserializeObject({ SS: [s, s] }).should.have.length(2);
            type.deserializeObject({ SS: [s, s] })[0].format().should.equal(s);
        });
    });
    
    describe('transformValue', function(){
        it('transforms the value', function(){
            var m = moment.utc();
            type.serialize(m).should.equal(m.format());
        });
    });
    
    describe('transform', function(){
        it('transforms the value', function(){
            var m1 = moment.utc(),
                m2 = moment.utc();
            type.serializeObject(m1).should.eql({ S: m1.format() });
            type.serializeObject([m1, m2]).should.eql({ SS: [m1.format(), m2.format()] });
        });
    });
    
    describe('toJSON', function(){
        it('converts moment to json', function(){
            var m = moment.utc();
            type.toJSON(m).should.equal(m.format());
        });
    });
});