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
    });
});