var should = require('should'),
    dino = require('../lib/'),
    moment = require('moment');

var table = 'forums',
    schemaAttrs = {
        name: dino.types.String,
        category: dino.types.String,
        thread_count: dino.types.Number,
        message_count: dino.types.Number,
        is_new: dino.types.Boolean,
        last_post_author: dino.types.String,
        last_post_date: dino.types.Date
    },
    key = {
        hash: 'name'
    },
    schema = new dino.Schema(table, schemaAttrs, key),
    now = moment.utc();

describe('Model', function(){
    var Forum, forum, attributes;
    beforeEach(function(){
        Forum = dino.Model.extend({
            schema: schema
        });
        attributes = {
            name: 'Amazon DynamoDB',
            category: 'Amazon Web Services',
            thread_count: 3,
            message_count: 4,
            is_new: true,
            last_post_author: 'Chris',
            last_post_date: moment(now)
        };
        forum = new Forum(attributes);
    });
    describe('static methods', function(){
        it('sets the schema', function(){
            Forum.schema.should.be.instanceOf(dino.Schema);
        });
    });
    describe('toDynamo', function(){
        it('omits null and empty values', function(){
            var f = new Forum({
                name: 'Test'
            });
            f.toDynamo().should.eql({
                name: { S: 'Test' },
                is_new: { N: '0' },
                last_post_date: { S: moment(now).format() }
            });
        });
        it('omits empty arrays', function(){
            var Cafe = dino.Model.extend({
                schema: new dino.Schema('cafes', {
                        name: dino.types.String,
                        drinks: dino.types.String,
                        snacks: dino.types.String
                    }, {
                        hash: 'name'
                    })
                }),
                c = new Cafe({
                    name: 'Lost Weekend NYC',
                    drinks: [],
                    snacks: []
                });
            
            c.toDynamo().should.eql({
                'name': { S: 'Lost Weekend NYC' }
            });
        });
        it('combines hash keys', function(){
            var Reply = dino.Model.extend({
                schema: new dino.Schema('replies', {
                        table_name: dino.types.String,
                        thread_name: dino.types.String
                    }, {
                        hash: ['table_name', 'thread_name']
                    })
                }),
                r = new Reply({
                    table_name: 'what',
                    thread_name: 'ever'
                });
            r.toDynamo().should.eql({
                'table_name#thread_name': { S: 'what#ever' }
            });
        });
        it('combines range keys', function(){
            var Artifact = dino.Model.extend({
                schema: new dino.Schema('artifacts', {
                        user_id: dino.types.String,
                        date_created: dino.types.Date,
                        id: dino.types.Id
                    }, {
                        hash: 'user_id',
                        range: ['date_created', 'id']
                    })
                }),
                a = new Artifact({
                    user_id: 'ctcliff',
                    id: '12345',
                    date_created: now
                });
            a.toDynamo().should.eql({
                user_id: { S: 'ctcliff' },
                'date_created#id': { S: moment(now).format() + '#12345' }
            });
        });
        it('parses combo keys', function(){
            var Artifact = dino.Model.extend({
                schema: new dino.Schema('artifacts', {
                        user_id: dino.types.String,
                        date_created: dino.types.Date,
                        id: dino.types.Id
                    }, {
                        hash: 'user_id',
                        range: ['date_created', 'id']
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
    describe('instance methods', function(){
        it('gets attributes', function(){
            forum.get('name').should.equal('Amazon DynamoDB');
        });
        it('sets attributes', function(){
            var name = 'Chris';
            forum.set({ name: name }).get('name').should.equal(name);
        });
        it('gets the hash value', function(){
            forum.getHash().should.eql(['Amazon DynamoDB']);
        });
        it('gets the range value', function(){
            forum.getRange().should.be.null;
        });
        it('converts the attributes to an object', function(){
            forum.toJSON().should.eql(attributes);
        });
        it('converts the attributes to a DynamoDB-compatible object', function(){
            forum.toDynamo().should.eql({
                name: { S: attributes.name },
                category: { S: attributes.category },
                thread_count: { N: '3' },
                message_count: { N: '4' },
                is_new: { N: '1' },
                last_post_author: { S: attributes.last_post_author },
                last_post_date: { S: moment(now).format() }
            });
        });
        it('sets the defaults', function(){
            var f = new Forum({
                last_post_date: now
            });
            f.toJSON().should.eql({
                name: '',
                category: '',
                thread_count: null,
                message_count: null,
                is_new: false,
                last_post_author: '',
                last_post_date: moment(now)
            });
        });
    });
});