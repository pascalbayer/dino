# Dino

A simple DynamoDB object modeler for Node.js.

[![Build Status](https://secure.travis-ci.org/christophercliff/dino.png?branch=master)](https://travis-ci.org/christophercliff/dino)

## Installation

```
$ npm install dino
```

## Usage

Cross-ref with [Amazon's sample data](http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/SampleTablesAndData.html):

### connect

Creates a DynamoDB client using your credentials. Alternatively, you can omit this and [use environment variables](http://docs.aws.amazon.com/nodejs/latest/dg/configuration-guide.html#nodejs-dg-credentials-from-environment-variables) instead.

```js
dino.connect({
    accessKeyId: 'YOUR_KEY',
    secretAccessKey: 'YOUR_SECRET',
    region: 'us-east-1'
});
```

### Schema

Sets the table, property types and primary keys.

```js
var table = 'forums',
    attributes = {
        name: String,
        category: String,
        thread_count: Number,
        view_count: Number,
        last_post_author: String,
        last_post_date: Date
    },
    key = {
        hash: 'name'
    },
    schema = new dino.Schema(table, attributes, key);
```

### Model

Extend `dino.Model` to create a model definition. All models require an instance of `dino.Schema`.

```js
var Forum = dino.Model.extend({
    schema: new dino.Schema(table, attributes, key)
});

var forum = new Forum({
    name: 'Amazon DynamoDB',
    category: 'Amazon Web Services',
    thread_count: 3,
    view_count: 4,
    last_post_author: 'User A',
    last_post_date: moment.utc()
})
```

#### save

Saves the model.

```js
forum.save(function(err, units){
    
});
```

#### destroy

Deletes the model.

```js
forum.destroy(function(err, units){
    // (poof)
});
```

#### find

Returns an array of model instances.

```js
// Find the first page of replies for a thread
Reply.find({
    hash: ['Amazon DynamoDB', 'DynamoDB Thread 1'],
    skip: 0,
    take: 10
}, function(err, forums, units){
    
});
```

Query parameters:

- hash (required)
- range
- skip
- take

#### findOne

Returns a single model by hash and/or range key.

```js
Forum.findOne({
    hash: 'Amazon DynamoDB'
}, function(err, forum, units){
    
});

Reply.findOne({
    hash: ['Amazon DynamoDB', 'DynamoDB Thread 1'],
    range: '2011-12-11T00:40:57.165Z'
}, function(err, reply, units){
    
});
```

#### toJSON

Returns a JSON-like representation of the model's properties.

```js
forum.toJSON();

//  {
//    name: 'Amazon DynamoDB',
//    category: 'Amazon Web Services',
//    thread_count: 3,
//    view_count: 4,
//    last_post_author: 'User A',
//    last_post_date: [Object]
//  }
```

### Key Smushing

DynamoDB's [Query API](http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/API_Query.html) allows you to query by hash and range primary keys. To create more complex queries, you can combine multiple attributes into a single key. Dino accepts arrays as key definitions and will combine and parse these attributes automatically.

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