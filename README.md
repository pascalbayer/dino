# Dino

A simple ORM for DynamoDB.

## Installation

```
npm install dino
```

## Usage

Simple example using [Amazon's sample data](http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/SampleTablesAndData.html):

```js
var dino = require('dino');

dino.connect({
    accessKeyId: 'YOUR_KEY',
    secretAccessKey: 'YOUR_SECRET',
    region: 'us-east-1'
});

var table = 'forums',
    attributes = {
        name: String,
        threads: Number
    },
    key = {
        hash: 'name'
    },
    schema = new dino.Schema(),
    Forum = dino.Model.extend({
        schema: new dino.Schema(table, attributes, key)
    });

new Forum({
    name: 'Amazon DynamoDB'
}).save();
```

### Querying

```js

var thread = new Thread({
    forum_name: 'Amazon DynamoDB',
    subject: 'DynamoDB Thread 1'
});

Reply.find({
    hash: [thread.get('forum_name'), thread.get('subject')],
    skip: 0,
    take: 10
}, function(err, replies){
    console.log(replies);
});
```