var should = require('should'),
    moment = require('moment'),
    dino = require('../');

describe('schema', function(){
    
    var schema,
        replySchema;
    
    beforeEach(function(){
        dino.connect();
        schema = dino.schema({
            table: 'forums',
            attributes: {
                name: dino.types.string,
                misc: dino.types.object
            },
            key: {
                hash: 'name'
            }
        });
        replySchema = dino.schema({
            table: 'replies',
            attributes: {
                forum_name: dino.types.string,
                subject: dino.types.string,
                date_created: dino.types.date,
                id: dino.types.id
            },
            key: {
                hash: ['forum_name', 'subject'],
                range: ['date_created', 'id']
            }
        });
    });
    
    describe('constructor', function(){
        
        it('should set the defaults', function(){
            schema.should.have.property('table', 'forums');
            schema.should.have.property('attributes');
            schema.should.have.property('hashKeyAttributes');
            schema.hashKeyAttributes.should.eql(['name']);
            schema.should.have.property('hashKey', 'name');
            schema.should.have.property('rangeKey', null);
            schema.should.have.property('keyDelimiter', '#');
        });
        
        it('should add the attributes', function(){
            dino.types.string.isPrototypeOf(schema.attributes.name).should.be.true;
            dino.types.object.isPrototypeOf(schema.attributes.misc).should.be.true;
        });
        
    });
    
    describe('createTable', function(){
        
        it('should create a table', function(){
            
            
            
        });
        
    });
    
    describe('add', function(){
        
        it('should add an attribute', function(){
            
            schema.add('newAttr', dino.types.boolean);
            dino.types.boolean.isPrototypeOf(schema.get('newAttr')).should.be.true;
        });
        
    });
    
    describe('get', function(){
        
        it('should get an attribute', function(){
            dino.types.string.isPrototypeOf(schema.get('name')).should.be.true;
            dino.types.object.isPrototypeOf(schema.get('misc')).should.be.true;
        });
        
    });
    
    describe('serializeHashAttribute', function(){
        
        it('should serialize the hash attribute', function(){
            schema.serializeHashAttribute('a').should.eql({ S: 'a' });
            replySchema.serializeHashAttribute(['a', 'b']).should.eql({ S: 'a#b' });
        });
        
    });
    
    describe('serializeRangeAttribute', function(){
        
        it('should serialize the range attribute', function(){
            var m = moment.utc(),
                id = '12345';
            replySchema.serializeRangeAttribute([m, id]).should.eql({ S: m.format() + '#' + id });
        });
        
    });
    
    describe('deserializeHashAttribute', function(){
        
        it('should deserialize the hash attribute', function(){
            var obj = schema.deserializeHashAttribute({ S: 'sometablename' });
            obj.name.should.equal('sometablename');
        });
        
        it('should deserialize combined hash attributes', function(){
            var obj = replySchema.deserializeHashAttribute({ S: 'what#ever' });
            obj.forum_name.should.equal('what');
            obj.subject.should.equal('ever');
        });
        
    });
    
    describe('deserializeRangeAttribute', function(){
        
        it('should deserialize the range attribute', function(){
            var obj = replySchema.deserializeRangeAttribute({ S: '2013-03-27T19:21:54+00:00#12345' });
            obj.id.should.equal('12345');
            moment.isMoment(obj.date_created).should.be.true;
            obj.date_created.format().should.equal('2013-03-27T19:21:54+00:00');
        });
        
    });
    
});