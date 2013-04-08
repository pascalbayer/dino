var should = require('should'),
    dino = require('../');

describe('schema', function(){
    
    it('should set the defaults', function(){
        
        var s = dino.schema();
        
        s.table.should.equal('');
        s.attributes.should.eql({});
        s.key.should.eql({ hash: '' });
        s.keyDelimiter.should.equal('#');
        
        s = dino.schema({
            table: 'aaa',
            key: {
                hash: 'a',
                range: 'b'
            },
            keyDelimiter: 'asdf'
        });
        
        s.table.should.equal('aaa');
        s.key.should.eql({ hash: 'a', range: 'b' });
        s.keyDelimiter.should.equal('asdf');
        
    });
    
    it('should add the attributes', function(){
        
        var s = dino.schema({
            attributes: {
                a: '',
                b: ''
            }
        });
        
        
        
    });
    
    it('should create a table', function(){
        
        var s = dino.schema();
        
        s.createTable.should.be.a.function;
        
        s.createTable();
        
    });
    
});