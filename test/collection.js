var should = require('should'),
    dino = require('../');

describe('collection', function(){
    
    var schema = dino.schema({
            table: 'forums',
            attributes: {
                name: dino.types.string
            },
            key: {
                hash: 'name'
            }
        }),
        Forum = dino.model({
            schema: schema
        }),
        arr;
    
    beforeEach(function(){
        
        arr = [];
        
        arr.push(Forum.create({
            name: 'a'
        }));
        arr.push(Forum.create({
            name: 'b'
        }));
        arr.push(Forum.create({
            name: 'c'
        }));
        
    });
    
    describe('constructor', function(){
        
        it('should create a collection', function(){
            
            var c = dino.collection(arr);
            
            c.should.have.property('models');
            c.models.should.eql(arr);
            c.should.have.property('toJSON');
            
        });
        
    });
    
    describe('#toJSON()', function(){
        
        it('should convert the collection to JSON', function(){
            
            var c = dino.collection(arr),
                converted = c.toJSON();
            
            converted.should.be.an.instanceOf(Array);
            converted.should.have.lengthOf(3);
            converted[0].should.eql({ name: 'a' })
            
        });
        
    });
    
});