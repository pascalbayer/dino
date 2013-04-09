var fs = require('fs'),
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

user.save(function(err){
    
    if (err) return console.log(err);
    
    console.log('Saved user: ' + user.get('name'));
    
    var post = Post.create({
        user_id: user.get('id'),
        title: 'My First Post',
        body: 'etc...'
    });
    
    post.save(function(err){
        
        if (err) return console.log(err);
        
        console.log('Saved post: ' + post.get('title'));
        
        Post.find({
            hash: user.get('id')
        }, function(err, posts){
            
            if (err) return console.log(err);
            
            console.log('Found posts: ', posts.toJSON());
        });
        
    });
    
    User.findOne({
        hash: user.get('id')
    }, function(err, u){
        
        if (err) return console.log(err);
        
        console.log('Found user: ', u.get('name'));
    });
});