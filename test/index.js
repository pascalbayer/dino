var should = require('should'),
    moment = require('moment'),
    dino = require('../lib/');

var table = 'forums',
    attributes = {
        name: String,
        category: String,
        thread_count: Number,
        messag_count: Number,
        view_count: Number,
        last_post_author: String,
        last_post_date: Date
    },
    key = {
        hash: 'name'
    },
    schema = new dino.Schema(table, attributes, key);

describe('dino', function(){
    describe('model', function(){
        var Forum, forum;
        beforeEach(function(){
            Forum = dino.Model.extend({
                schema: schema
            });
            forum = new Forum({
                name: 'Amazon DynamoDB',
                category: 'Amazon Web Services',
                thread_count: 3,
                message_count: 4,
                last_post_auther: 'Chris',
                last_post_date: new Date()
            });
        });
        describe('static methods', function(){
            it('sets the schema', function(){
                Forum.schema.should.be.instanceOf(dino.Schema);
            });
        });
    });
});
