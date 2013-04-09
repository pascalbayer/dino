var should = require('should'),
    dino = require('../');

describe('model', function(){
    
    var schema = dino.schema({
            table: 'forums',
            attributes: {
                name: dino.types.string
            },
            key: {
                hash: 'name'
            }
        }),
        model,
        m;
    
    beforeEach(function(){
        dino.connect();
        model = dino.model({
            schema: schema
        });
        m = model.create({
            name: 'chris'
        });
    });
    
    describe('findOne', function(){
        
        
        
    });
    
    describe('find', function(){
        
        
        
    });
    
    describe('create', function(){
        
        it('should create an instance of a model', function(){
            m.should.have.property('attributes');
            m.should.have.property('schema');
            m.schema.should.equal(schema);
            m.should.have.property('client');
            m.client.should.equal(dino.connection.client);
        });
        
         it('should use the correct client', function(){
                m.should.have.property('client');
                m.client.should.equal(dino.connection.client);
                dino.connect({
                    accessKeyId: 'AAA',
                    secretAccessKey: 'AAA',
                    region: 'us-east-1'
                });
                model = dino.model({
                    schema: schema
                });
                m = model.create({
                    name: 'chris'
                });
                m.client.should.eql(dino.connection.client);
                var client = dino.connection.create({
                    accessKeyId: 'BBB',
                    secretAccessKey: 'BBB',
                    region: 'us-east-1'
                });
                model = dino.model({
                    schema: schema,
                    client: client
                });
                m = model.create({
                    name: 'chris'
                });
                m.client.should.eql(client);
            });
        
        it('should set attribute values', function(){
            m.attributes.name.should.eql('chris');
        });
        
    });
    
    describe('set', function(){
        
        it('should set attribute values', function(){
            m = model.create();
            should.not.exist(m.attributes.name);
            m.set({
                name: 'chris'
            });
            m.attributes.name.should.equal('chris');
        });
        
    });
    
    describe('get', function(){
        
        it('should get attribute values', function(){
            var m = model.create({
                name: 'chris'
            });
            m.get('name').should.equal('chris');
            should.not.exist(m.get('asdf'));
        });
        
    });
    
    describe('save', function(){
        
        
        
    });
    
    describe('destroy', function(){
        
        
        
    });
    
    describe('toJSON', function(){
        
        
        
    });
    
});