var should = require('should'),
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
                IndexName: 'id',
                ScanIndexForward: false,
                Select: 'ALL_ATTRIBUTES'
            });
        });
        
    });
    
});