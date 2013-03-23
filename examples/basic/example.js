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

new User().save(function(err, data){
    console.log(err, data);
});