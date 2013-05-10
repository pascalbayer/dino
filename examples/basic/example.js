var fs = require('fs'),
    async = require('async'),
    config = JSON.parse(fs.readFileSync('./aws-config.json')),
    dino = require('../../'),
    User = require('./models/user'),
    Post = require('./models/post');

dino.connect(config);

var user = User.create({
    name: 'Chris',
    age: 29,
    weight: 190.5,
    is_active: true,
    colors: ['red', 'green', 'blue'],
    documents: [{ id: 1, name: 'A' }, { id: 2, name: 'B' }]
});

var post = Post.create({
    user_id: user.get('id'),
    title: 'My First Post',
    body: 'etc...'
});

async.parallel([
    user.save,
    post.save
], function(err, res){
    if (err) return console.log(err);
    User.findOne({
        id: user.get('id')
    }, function(err, u){
        if (err) return console.log(err);
        console.log('Found user: ', u.get('name'));
    });
    Post.find({
        match: {
            user_id: user.get('id')
        }
    }, function(err, posts){
        if (err) return console.log(err);
        console.log('Found posts: ', posts.toJSON());
    });
});