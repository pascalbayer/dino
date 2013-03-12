# Dino

A simple ORM for DynamoDB.

## Installation

```
npm install dino
```

## Usage

Using Amazon's [forum example](http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/SampleTablesAndData.html):

```js
var dino = require('dino');

dino.connect({
    accessKeyId: 'YOUR_KEY',
    secretAccessKey: 'YOUR_SECRET',
    region: 'us-east-1'
});

var Forum = dino.model('Forum', new dino.Schema({
        name: String,
        threads: Number
    }, {
        hash: 'name'
    })),
    Thread = dino.model('Thread', new dino.Schema({
        forum_name: String,
        subject: String,
        message: String
    }, {
        hash: 'forum_name',
        range: 'subject'
    })),
    Reply = dino.model('Reply', new dino.Schema({
        forum_name: String,
        thread_name: String,
        message: String,
        date_created: Date
    }, {
        hash: ['forum_name', 'thread_name'],
        range: date_created
    })),

new Forum({
    name: 'Amazon DynamoDB'
}).save();

Reply.find({
    hash: ['Amazon DynamoDB', 'DynamoDB Thread 1']
}, function(err, replies){
    console.log(replies);
});

```