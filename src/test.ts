/// <reference path="../typings/tsd.d.ts"/>

import * as Dino from './index';

let client = new Dino.Client({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'eu-central-1'
});

let eventSchema = new Dino.Schema({
    name: 'Event',
    attributes: {
        id: Dino.Type.Guid,
        name: Dino.Type.String
    },
    key: {
        hash: 'id'
    }
});

let event = new Dino.Model(eventSchema);

event.create({
    name: 'Test'
}).save(function (err, data) {
    console.log(err, data);
});


