var should = require('should'),
    moment = require('moment'),
    dino = require('../../lib/');

describe('dino', function(){
    describe('Date', function(){
        var type;
        beforeEach(function(){
            type = new dino.types.Date();
        });
        describe('getDefaultValue', function(){
            it('gets the default value', function(){
                type.getDefaultValue().format('YYYY-MM-DD').should.equal(moment.utc().format('YYYY-MM-DD'));
            });
        });
        describe('parseValue', function(){
            it('parses the value', function(){
                var s = '2013-03-18T19:26:08+00:00';
                type.parseValue(s).format().should.equal(s);
            });
        });
        describe('parse', function(){
            it('parses', function(){
                var s = '2013-03-18T19:26:08+00:00'
                type.parse({ S: s }).format().should.equal(s);
                type.parse({ SS: [s, s] }).should.have.length(2);
                type.parse({ SS: [s, s] })[0].format().should.equal(s);
            });
        });
        describe('transformValue', function(){
            it('transforms the value', function(){
                var m = moment.utc();
                type.transformValue(m).should.equal(m.format());
            });
        });
        describe('transform', function(){
            it('transforms the value', function(){
                var m1 = moment.utc(),
                    m2 = moment.utc();
                type.transform(m1).should.eql({ S: m1.format() });
                type.transform([m1, m2]).should.eql({ SS: [m1.format(), m2.format()] });
            });
        });
        describe('toJSON', function(){
            it('converts moment to json', function(){
                var m = moment.utc();
                type.toJSON(m).should.equal(m.format());
            });
        });
    })
});