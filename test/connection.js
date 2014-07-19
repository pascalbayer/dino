var should = require('should'),
    dino = require('../');

describe('connection', function(){
    
    it('should create a default client', function(){
        
        dino.connection.client.should.have.property('config');
        
    });
    
    it('should update the default client', function(){
        
        dino.connect({
            accessKeyId: 'AAA',
            secretAccessKey: 'AAA',
            region: 'us-east-1'
        });
        
        dino.connection.client.config.credentials.accessKeyId.should.equal('AAA');
        
        dino.connect({
            accessKeyId: 'BBB',
            secretAccessKey: 'BBB',
            region: 'us-east-1'
        });
        
        dino.connection.client.config.credentials.accessKeyId.should.equal('BBB');
        
        dino.connect();
        
    });
    
    it('should create client instances', function(){
        
        var client = dino.connection.create({
            accessKeyId: 'AAA',
            secretAccessKey: 'AAA',
            region: 'us-east-1'
        });
        
        client.config.credentials.accessKeyId.should.equal('AAA');
        
    });

    it('should pass through the extra options', function() {

        var url = 'http://localhost:8000/',
            client;

        client = dino.connection.create({
            endpoint: url,
        });

        client.endpoint.href.should.equal(url);

        client = dino.connection.create({
            region: 'woof'
        });

        client.endpoint.href.should.equal('https://dynamodb.woof.amazonaws.com/');
    });
});
