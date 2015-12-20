var Dino = require('./index');
var client = new Dino.Client({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'eu-central-1'
});
var event = new Dino.Schema({
    name: 'Event',
    attributes: {
        id: Dino.Type.Guid,
        name: Dino.Type.String
    },
    key: {
        hash: 'id'
    }
});
event = new Dino.Model(event);
event.create({
    name: 'Test'
}).save(function (err, data) {
    console.log(err, data);
});