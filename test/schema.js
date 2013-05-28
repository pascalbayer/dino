var should = require('should'),
    sinon = require('sinon'),
    moment = require('moment'),
    dino = require('../');

describe('schema', function(){
    
    var now = moment.utc(),
        schema,
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

        describe('arguments', function(){

            var stub,
                calledParams;

            beforeEach(function(){
                stub = sinon.stub(dino.connection.client, 'createTable', function(params, callback){
                    calledParams = params;
                    callback(null);
                });
            });

            afterEach(function(){
                dino.connection.client.createTable.restore();
            });

            it('should create a table with no arguments', function(){
                schema.createTable();
                stub.calledWith({
                    TableName: 'forums',
                    ProvisionedThroughput: {
                        ReadCapacityUnits: 1,
                        WriteCapacityUnits: 1
                    },
                    AttributeDefinitions: [
                        { AttributeName: 'name', AttributeType: 'S' }
                    ],
                    KeySchema: [
                        { AttributeName: 'name', KeyType: 'HASH' }
                    ]
                }).should.be.true;
            });

            it('should create a table with numeric hash key', function(done){
                schema = dino.schema({
                    table: 'forums',
                    attributes: {
                        numeric_id: dino.types.number
                    },
                    key: {
                        hash: 'numeric_id'
                    }
                });
                schema.createTable(function(){
                    calledParams.AttributeDefinitions.should.eql([
                        { AttributeName: 'numeric_id', AttributeType: 'N' }
                    ]);
                    calledParams.KeySchema.should.eql([
                        { AttributeName: 'numeric_id', KeyType: 'HASH' }
                    ]);
                    done();
                });
            });

            it('should create a table with string hash key', function(done){
                schema = dino.schema({
                    table: 'forums',
                    attributes: {
                        id: dino.types.id
                    },
                    key: {
                        hash: 'id'
                    }
                });
                schema.createTable(function(){
                    calledParams.AttributeDefinitions.should.eql([
                        { AttributeName: 'id', AttributeType: 'S' }
                    ]);
                    calledParams.KeySchema.should.eql([
                        { AttributeName: 'id', KeyType: 'HASH' }
                    ]);
                    done();
                });
            });

            it('should create a table with numeric range key', function(done){
                schema = dino.schema({
                    table: 'forums',
                    attributes: {
                        id: dino.types.id,
                        post_count: dino.types.number
                    },
                    key: {
                        hash: 'id',
                        range: 'post_count'
                    }
                });
                schema.createTable(function(){
                    calledParams.AttributeDefinitions.should.eql([
                        { AttributeName: 'id', AttributeType: 'S' },
                        { AttributeName: 'post_count', AttributeType: 'N' }
                    ]);
                    calledParams.KeySchema.should.eql([
                        { AttributeName: 'id', KeyType: 'HASH' },
                        { AttributeName: 'post_count', KeyType: 'RANGE' }
                    ]);
                    done();
                });
            });

            it('should create a table with string range key', function(done){
                schema = dino.schema({
                    table: 'forums',
                    attributes: {
                        id: dino.types.id,
                        created_by: dino.types.string
                    },
                    key: {
                        hash: 'id',
                        range: 'created_by'
                    }
                });
                schema.createTable(function(){
                    calledParams.AttributeDefinitions.should.eql([
                        { AttributeName: 'id', AttributeType: 'S' },
                        { AttributeName: 'created_by', AttributeType: 'S' }
                    ]);
                    calledParams.KeySchema.should.eql([
                        { AttributeName: 'id', KeyType: 'HASH' },
                        { AttributeName: 'created_by', KeyType: 'RANGE' }
                    ]);
                    done();
                });
            });

            it('should create a table with numeric secondary key', function(done){
                schema = dino.schema({
                    table: 'forums',
                    attributes: {
                        id: dino.types.id,
                        created_by: dino.types.string,
                        post_count: dino.types.number
                    },
                    key: {
                        hash: 'id',
                        range: 'created_by',
                        secondary: 'post_count'
                    }
                });
                schema.createTable(function(){
                    calledParams.AttributeDefinitions.should.eql([
                        { AttributeName: 'id', AttributeType: 'S' },
                        { AttributeName: 'created_by', AttributeType: 'S' },
                        { AttributeName: 'post_count', AttributeType: 'N' }
                    ]);
                    calledParams.LocalSecondaryIndexes.should.eql([
                        {
                            IndexName: 'forums.post_count',
                            KeySchema:[
                                { AttributeName: 'id', KeyType: 'HASH' },
                                { AttributeName: 'post_count', KeyType: 'RANGE' }
                            ],
                            Projection: { ProjectionType: 'KEYS_ONLY' }
                        }
                    ]);
                    done();
                });
            });

            it('should create a table with string secondary key', function(done){
                schema = dino.schema({
                    table: 'forums',
                    attributes: {
                        id: dino.types.id,
                        created_by: dino.types.string,
                        last_post_by: dino.types.string
                    },
                    key: {
                        hash: 'id',
                        range: 'created_by',
                        secondary: 'last_post_by'
                    }
                });
                schema.createTable(function(){
                    calledParams.AttributeDefinitions.should.eql([
                        { AttributeName: 'id', AttributeType: 'S' },
                        { AttributeName: 'created_by', AttributeType: 'S' },
                        { AttributeName: 'last_post_by', AttributeType: 'S' }
                    ]);
                    calledParams.LocalSecondaryIndexes.should.eql([
                        {
                            IndexName: 'forums.last_post_by',
                            KeySchema:[
                                { AttributeName: 'id', KeyType: 'HASH' },
                                { AttributeName: 'last_post_by', KeyType: 'RANGE' }
                            ],
                            Projection: { ProjectionType: 'KEYS_ONLY' }
                        }
                    ]);
                    done();
                });
            });

            it('should create a table with multiple secondary keys', function(done){
                schema = dino.schema({
                    table: 'forums',
                    attributes: {
                        id: dino.types.id,
                        created_by: dino.types.string,
                        last_post_by: dino.types.string,
                        post_count: dino.types.number
                    },
                    key: {
                        hash: 'id',
                        range: 'created_by',
                        secondary: ['last_post_by', 'post_count']
                    }
                });
                schema.createTable(function(){
                    calledParams.AttributeDefinitions.should.eql([
                        { AttributeName: 'id', AttributeType: 'S' },
                        { AttributeName: 'created_by', AttributeType: 'S' },
                        { AttributeName: 'last_post_by', AttributeType: 'S' },
                        { AttributeName: 'post_count', AttributeType: 'N' }
                    ]);
                    calledParams.LocalSecondaryIndexes.should.eql([
                        {
                            IndexName: 'forums.last_post_by',
                            KeySchema:[
                                { AttributeName: 'id', KeyType: 'HASH' },
                                { AttributeName: 'last_post_by', KeyType: 'RANGE' }
                            ],
                            Projection: { ProjectionType: 'KEYS_ONLY' }
                        },
                        {
                            IndexName: 'forums.post_count',
                            KeySchema:[
                                { AttributeName: 'id', KeyType: 'HASH' },
                                { AttributeName: 'post_count', KeyType: 'RANGE' }
                            ],
                            Projection: { ProjectionType: 'KEYS_ONLY' }
                        }
                    ]);
                    done();
                });
            });

            it('should create a table with specified read/write throughput', function(done){
                schema.createTable({
                    readUnits: 2,
                    writeUnits: 3
                }, function(){
                    calledParams.ProvisionedThroughput.should.eql({
                        ReadCapacityUnits: 2,
                        WriteCapacityUnits: 3
                    });
                    done();
                });
            });

        });
        
        describe('callback', function(){

            var cannedErr = new Error('Just a normal error');

            afterEach(function(){
                dino.connection.client.createTable.restore();
            });

            it('should callback errors', function(){
                var stub = sinon.stub(dino.connection.client, 'createTable', function(params, callback){
                        callback(cannedErr);
                    }),
                    spy = sinon.spy();
                schema.createTable(spy);
                spy.calledWithExactly(cannedErr).should.be.true;
            });

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
    
    describe('generateQueryParams', function(){
        
        it('should throw if undefined attributes', function(){
            (function(){
                schema.generateQueryParams();
            }).should.throw();
            (function(){
                schema.generateQueryParams({
                    asdf: 'asdf'
                });
            }).should.throw();
        });
        
        it('should generate params for a single hash attribute', function(){
            schema = dino.schema({
                table: 'forums',
                attributes: {
                    name: dino.types.string
                },
                key: {
                    hash: 'name'
                }
            });
            schema.generateQueryParams({
                name: 'Chris'
            }).should.eql({
                TableName: 'forums',
                ReturnConsumedCapacity: 'TOTAL',
                ScanIndexForward: false,
                KeyConditions: {
                    name: {
                        AttributeValueList: [
                            { S: 'Chris' }
                        ],
                        ComparisonOperator: 'EQ'
                    }
                }
            });
        });
        
        it('should generate params for multiple hash attributes', function(){
            schema = dino.schema({
                table: 'forums',
                attributes: {
                    table_name: dino.types.string,
                    thread_name: dino.types.string
                },
                key: {
                    hash: ['table_name', 'thread_name']
                }
            });
            (function(){
                schema.generateQueryParams({
                    table_name: 'Table 1'
                });
            }).should.throw();
            schema.generateQueryParams({
                table_name: 'Table 1',
                thread_name: 'Thread 1'
            }).should.eql({
                TableName: 'forums',
                ReturnConsumedCapacity: 'TOTAL',
                ScanIndexForward: false,
                KeyConditions: {
                    'table_name#thread_name': {
                        AttributeValueList: [
                            { S: 'Table 1#Thread 1' }
                        ],
                        ComparisonOperator: 'EQ'
                    }
                }
            });
        });
        
        it('should generate params for a single hash and a single range attribute', function(){
            schema = dino.schema({
                table: 'posts',
                attributes: {
                    user_id: dino.types.string,
                    date_created: dino.types.date
                },
                key: {
                    hash: 'user_id',
                    range: 'date_created'
                }
            });
            schema.generateQueryParams({
                user_id: 'ctcliff'
            }).should.eql({
                TableName: 'posts',
                ReturnConsumedCapacity: 'TOTAL',
                ScanIndexForward: false,
                KeyConditions: {
                    user_id: {
                        AttributeValueList: [
                            { S: 'ctcliff' }
                        ],
                        ComparisonOperator: 'EQ'
                    }
                }
            });
            schema.generateQueryParams({
                user_id: 'ctcliff',
                date_created: moment(now)
            }).should.eql({
                TableName: 'posts',
                ReturnConsumedCapacity: 'TOTAL',
                ScanIndexForward: false,
                KeyConditions: {
                    user_id: {
                        AttributeValueList: [
                            { S: 'ctcliff' }
                        ],
                        ComparisonOperator: 'EQ'
                    },
                    date_created: {
                        AttributeValueList: [
                            { S: now.format() }
                        ],
                        ComparisonOperator: 'EQ'
                    }
                }
            });
        });
        
        it('should generate params for a single hash and multiple range attributes', function(){
            schema = dino.schema({
                table: 'posts',
                attributes: {
                    user_id: dino.types.string,
                    date_created: dino.types.date,
                    id: dino.types.id
                },
                key: {
                    hash: 'user_id',
                    range: ['date_created', 'id']
                }
            });
            (function(){
                schema.generateQueryParams({
                    user_id: 'ctcliff',
                    date_created: moment(now)
                });
            }).should.throw();
            schema.generateQueryParams({
                user_id: 'ctcliff',
                date_created: moment(now),
                id: '123'
            }).should.eql({
                TableName: 'posts',
                ReturnConsumedCapacity: 'TOTAL',
                ScanIndexForward: false,
                KeyConditions: {
                    user_id: {
                        AttributeValueList: [
                            { S: 'ctcliff' }
                        ],
                        ComparisonOperator: 'EQ'
                    },
                    'date_created#id': {
                        AttributeValueList: [
                            { S: now.format() + '#123' }
                        ],
                        ComparisonOperator: 'EQ'
                    }
                }
            });
        });
        
        it('should generate params for hash and secondary attributes', function(){
            schema = dino.schema({
                table: 'posts',
                attributes: {
                    user_id: dino.types.string,
                    date_created: dino.types.date,
                    id: dino.types.id
                },
                key: {
                    hash: 'user_id',
                    range: 'date_created',
                    secondary: 'id'
                }
            });
            schema.generateQueryParams({
                user_id: 'ctcliff',
                date_created: moment(now)
            }).should.eql({
                TableName: 'posts',
                ReturnConsumedCapacity: 'TOTAL',
                ScanIndexForward: false,
                KeyConditions: {
                    user_id: {
                        AttributeValueList: [
                            { S: 'ctcliff' }
                        ],
                        ComparisonOperator: 'EQ'
                    },
                    date_created: {
                        AttributeValueList: [
                            { S: now.format() }
                        ],
                        ComparisonOperator: 'EQ'
                    }
                }
            });
            schema.generateQueryParams({
                user_id: 'ctcliff',
                id: '123'
            }).should.eql({
                TableName: 'posts',
                ReturnConsumedCapacity: 'TOTAL',
                KeyConditions: {
                    user_id: {
                        AttributeValueList: [
                            { S: 'ctcliff' }
                        ],
                        ComparisonOperator: 'EQ'
                    },
                    id: {
                        AttributeValueList: [
                            { S: '123' }
                        ],
                        ComparisonOperator: 'EQ'
                    }
                },
                IndexName: 'posts.id',
                ScanIndexForward: false,
                Select: 'ALL_ATTRIBUTES'
            });
        });
        
    });
    
});