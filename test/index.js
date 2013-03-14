var should = require('should'),
    moment = require('moment'),
    dino = require('../lib/');

var table = 'forums',
    attributes = {
        name: String,
        category: String,
        thread_count: Number,
        message_count: Number,
        is_new: Boolean,
        view_count: Number,
        last_post_author: String,
        last_post_date: Date
    },
    key = {
        hash: 'name'
    },
    schema = new dino.Schema(table, attributes, key),
    now = moment.utc();

describe('dino', function(){
    describe('model', function(){
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
        describe('instance methods', function(){
            it('gets attributes', function(){
                forum.get('name').should.equal('Amazon DynamoDB');
            });
            it('sets attributes', function(){
                var name = 'Chris';
                forum.set({ name: name }).get('name').should.equal(name);
            });
            it('gets the hash attribute', function(){
                forum.getHashAttribute().should.equal('Amazon DynamoDB');
            });
            it('gets the range attribute', function(){
                forum.getRangeAttribute().should.be.null;
            });
            it('converts the attributes to an object', function(){
                forum.toJSON().should.eql(attributes);
            });
            it('converts the attributes to a DynamoDB-compatible object', function(){
                forum.toDynamo().should.eql({
                    name: { S: attributes.name },
                    category: { S: attributes.category },
                    thread_count: { N: attributes.thread_count },
                    message_count: { N: attributes.message_count },
                    is_new: { N: 1 },
                    last_post_author: { S: attributes.last_post_author },
                    last_post_date: { S: moment(now).format() }
                });
            });
        });
    });
});
