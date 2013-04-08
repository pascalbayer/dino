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
        model = dino.model({
            schema: schema
        });
        m = model.create({
            name: 'chris'
        });
    });
    
    describe('create', function(){
        
        it('should create an instance of a model', function(){
            m.should.have.property('attributes');
            m.should.have.property('schema');
        });
        
        it('should set attribute values', function(){
            m.attributes.name.should.equal('chris');
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
    
});