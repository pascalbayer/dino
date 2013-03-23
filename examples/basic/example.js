var fs = require('fs'),
    dino = require('../../'),
    config = JSON.parse(fs.readFileSync('./aws-config.json'));

var User = dino.Model.extend({
    schema: new dino.Schema('dino_example_users', {
        id: dino.types.Id,
        name: dino.types.String,
        age: dino.types.Number,
        weight: dino.types.Number,
        date_created: dino.types.Date,
        is_active: dino.types.Boolean,
        colors: dino.types.String,
        documents: dino.types.Object
    }, {
        hash: 'id'
    })
});

dino.connect(config);

var user = new User({
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
    User.findOne({
        hash: user.get('id')
    }, function(err, u){
        if (err) return console.log(err);
        console.log('Found user: ', u.get('name'));
    });
});