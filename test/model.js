var should = require('should'),
    moment = require('moment'),
    dino = require('../');

describe('model', function(){
    
    var schema = dino.schema({
            table: 'forums',
            attributes: {
                name: dino.types.string,
                category: dino.types.string,
                thread_count: dino.types.number,
                message_count: dino.types.number,
                is_new: dino.types.boolean,
                last_post_author: dino.types.string,
                last_post_date: dino.types.date
            },
            key: {
                hash: 'name'
            }
        }),
        now = moment.utc(),
        Forum,
        forum;
    
    beforeEach(function(){
        dino.connect();
        Forum = dino.model({
            schema: schema
        });
        forum = Forum.create({
            name: 'Amazon DynamoDB',
            category: 'Amazon Web Services',
            thread_count: 3,
            message_count: 4,
            is_new: true,
            last_post_author: 'Chris',
            last_post_date: moment(now)
            
        });
    });
    
    describe('Model', function(){
        
        describe('findOne', function(){
            
            
            
        });
        
        describe('find', function(){
            
            
            
        });
        
        describe('create', function(){
            
            it('should create an instance of a model', function(){
                forum.should.have.property('attributes');
                forum.should.have.property('schema');
                forum.schema.should.equal(schema);
                forum.should.have.property('client');
                forum.client.should.equal(dino.connection.client);
            });
            
            it('should use the correct client', function(){
                    forum.should.have.property('client');
                    forum.client.should.equal(dino.connection.client);
                    Forum = dino.model({
                        schema: schema
                    });
                    dino.connect({
                        accessKeyId: 'AAA',
                        secretAccessKey: 'AAA',
                        region: 'us-east-1'
                    });
                    forum = Forum.create({
                        name: 'chris'
                    });
                    forum.client.should.eql(dino.connection.client);
                    var client = dino.connection.create({
                        accessKeyId: 'BBB',
                        secretAccessKey: 'BBB',
                        region: 'us-east-1'
                    });
                    Forum = dino.model({
                        schema: schema,
                        client: client
                    });
                    forum = Forum.create({
                        name: 'chris'
                    });
                    forum.client.should.eql(client);
                });
            
            it('should set attribute values', function(){
                forum.attributes.name.should.eql('Amazon DynamoDB');
            });
            
        });
        
        describe('destroy', function(){
            
            
            
        });
        
        describe('parse', function(){
            
            it('parses combo keys', function(){
                
                var Artifact = dino.model({
                        schema: dino.schema({
                            table: 'artifacts',
                            attributes: {
                                user_id: dino.types.string,
                                date_created: dino.types.date,
                                id: dino.types.id
                            },
                            key: {
                                hash: 'user_id',
                                range: ['date_created', 'id']
                            }
                        })
                    }),
                    parsed = Artifact.parse({
                        'user_id': { S: 'ctcliff' },
                        'date_created#id': { S: '2013-03-27T19:21:54+00:00#12345' }
                    });
                
                parsed.get('user_id').should.equal('ctcliff');
                parsed.get('id').should.equal('12345');
                moment.isMoment(parsed.get('date_created')).should.be.true;
                parsed.get('date_created').format().should.equal('2013-03-27T19:21:54+00:00');
            });
            
        });
        
    });
    
    describe('set', function(){
        
        it('should set attribute values', function(){
            forum = Forum.create();
            should.not.exist(forum.attributes.name);
            forum.set({
                name: 'chris'
            });
            forum.attributes.name.should.equal('chris');
        });
        
    });
    
    describe('get', function(){
        
        it('should get attribute values', function(){
            forum = Forum.create({
                name: 'chris'
            });
            forum.get('name').should.equal('chris');
            should.not.exist(forum.get('asdf'));
        });
        
    });
    
    describe('getHash', function(){
        
        it('should get the hash value', function(){
            forum.getHash().should.eql(['Amazon DynamoDB']);
        });
        
    });
    
    describe('getRange', function(){
        
        it('should get the range value', function(){
            forum.getRange().should.be.null;
        });
        
    });
    
    describe('save', function(){
        
        
        
    });
    
    describe('destroy', function(){
        
        
        
    });
    
    describe('toJSON', function(){
        
        it('should convert attributes to JSON', function(){
            forum.toJSON().should.eql(forum.attributes);
        });
        
    });
    
    describe('serialize', function(){
        
        it('should serialize the model into DynamoDB format', function(){
            forum.serialize().should.eql({
                name: { S: forum.get('name') },
                category: { S: forum.get('category') },
                thread_count: { N: '3' },
                message_count: { N: '4' },
                is_new: { N: '1' },
                last_post_author: { S: forum.get('last_post_author') },
                last_post_date: { S: moment(now).format() }
            });
        });
        
        it('should omit null and empty values', function(){
            var f = Forum.create({
                name: 'Test'
            });
            f.serialize().should.eql({
                name: { S: 'Test' },
                is_new: { N: "0" },
                last_post_date: { S: moment(now).format() }
            });
        });
        
        it('should omit empty arrays', function(){
            var Cafe = dino.model({
                    schema: dino.schema({
                        table: 'cafes',
                        attributes: {
                            name: dino.types.string,
                            drinks: dino.types.string,
                            snacks: dino.types.string
                        },
                        key: {
                            hash: 'name'
                        }
                    })
                }),
                c = Cafe.create({
                    name: 'Lost Weekend NYC',
                    drinks: [],
                    snacks: []
                });
            
            c.serialize().should.eql({
                'name': { S: 'Lost Weekend NYC' }
            });
        });
        
        it('should combine hash keys', function(){
            
            var Reply = dino.model({
                    schema: dino.schema({
                        table: 'replies',
                        attributes: {
                            table_name: dino.types.string,
                            thread_name: dino.types.string
                        },
                        key: {
                            hash: ['table_name', 'thread_name']
                        }
                    })
                }),
                r = Reply.create({
                    table_name: 'what',
                    thread_name: 'ever'
                });
            
            r.serialize().should.eql({
                'table_name#thread_name': { S: 'what#ever' }
            });
        });
        
        it('should combine range keys', function(){
            
            var Artifact = dino.model({
                    schema: dino.schema({
                        table: 'artifacts',
                        attributes: {
                            user_id: dino.types.string,
                            date_created: dino.types.date,
                            id: dino.types.id
                        }, 
                        key: {
                            hash: 'user_id',
                            range: ['date_created', 'id']
                        }
                    })
                }),
                a = Artifact.create({
                    user_id: 'ctcliff',
                    id: '12345',
                    date_created: now
                });
            
            a.serialize().should.eql({
                user_id: { S: 'ctcliff' },
                'date_created#id': { S: moment(now).format() + '#12345' }
            });
        });
        
    });
    
});