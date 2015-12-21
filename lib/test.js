/// <reference path="../typings/tsd.d.ts"/>
var Dino = require('./index');
var client = new Dino.Client({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'eu-central-1'
});
var eventSchema = new Dino.Schema({
    name: 'Event',
    attributes: {
        id: Dino.Type.Guid,
        name: Dino.Type.String
    },
    key: {
        hash: 'id'
    }
});
var event = new Dino.Model(eventSchema);
event.create({
    name: 'Test'
}).save(function (err, data) {
    console.log(err, data);
});
