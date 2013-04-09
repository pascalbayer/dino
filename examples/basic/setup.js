var fs = require('fs'),
    config = JSON.parse(fs.readFileSync('./aws-config.json')),
    dino = require('../../'),
    User = require('./models/user'),
    Post = require('./models/post'),
    client = dino.connection.create(config);

Post.schema.createTable({
    client: client
}, function(err){
    if (err) return console.log(err);
    console.log('Created dino_example_posts table!');
});

User.schema.createTable({
    client: dino.connection.create(config)
}, function(err){
    if (err) return console.log(err);
    console.log('Created dino_example_users table!');
});