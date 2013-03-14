# Dino

A simple DynamoDB object modeler for node.js.

## Installation

```
$ npm install dino
```

## Usage

Example using [Amazon's sample data](http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/SampleTablesAndData.html):

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

### Key Smushing

DynamoDB's [Query API](http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/API_Query.html) can feel
rather limited because you can only query by hash and range attributes. To allow for slightly more complex queries, you
can combine multiple attributes into a single key.

Pass a string array to the `hash` or `range` key configs and Dino will combine or parse the attributes automatically:

```js
var table = 'threads',
    attributes = {
        forum_name: String,
        subject: Number
    },
    key = {
        hash: ['forum_name', 'subject'] // smush together
    },
    Thread = dino.Model.extend({
        schema: new dino.Schema(table, attributes, key)
    });

new Thread({
    forum_name: 'Amazon DynamoDB',
    subject: 'DynamoDB Thread 1'
}).save();

// "forum_name#subject": "Amazon DynamoDB#DynamoDB Thread 1"
```

## Tests

Install the dependencies and run.

```
$ npm install
$ npm test
```

## License

Copyright (C) 2013 Christopher Cliff

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.