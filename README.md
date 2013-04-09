# Dino

A simple [Amazon DynamoDB](http://aws.amazon.com/dynamodb/) object modeler for Node.js.

[![Build Status](https://secure.travis-ci.org/christophercliff/dino.png?branch=master)](https://travis-ci.org/christophercliff/dino)

## Usage

```js
var dino = require('dino');

dino.connect({
    accessKeyId: 'MY_KEY',
    secretAccessKey: 'MY_SECRET',
    region: 'us-east-1'
});

var forumModel = dino.model({
    schema: dino.schema({
        table: 'forums',
        attributes: {
            name: dino.types.string,
            category: dino.types.string
        },
        key: {
            hash: 'name'
        }
    })
});

var forum = forumModel.create({
    name: 'Amazon DynamoDB',
    category: 'Amazon Web Services'
});

forum.save();
```

## Installation

```
$ npm install dino
```

## API

- [connect()](#connectoptions)
- [connection.client](#connectoptions)
- [connection.create()](#connectoptions)
- [schema()](#connectoptions)
- [schema.createTable()](#connectoptions)
- [type()](#connectoptions)
- [model()](#connectoptions)
- [Model.create()](#connectoptions)
- [Model.findOne()](#connectoptions)
- [Model.find()](#connectoptions)
- [model.set()](#connectoptions)
- [model.get()](#connectoptions)
- [model.save()](#connectoptions)
- [model.destroy()](#connectoptions)
- [model.toJSON()](#connectoptions)
- [collection.toJSON()](#connectoptions)
- [collection.models](#connectoptions)

### `connect(options)`

Sets the default [DynamoDB client](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/Client.html). Alternatively, omit this and [use environment variables](http://docs.aws.amazon.com/nodejs/latest/dg/configuration-guide.html#nodejs-dg-credentials-from-environment-variables).

```js
dino.connect({
    accessKeyId: 'MY_KEY',
    secretAccessKey: 'MY_SECRET',
    region: 'us-east-1'
});
```

#### options

- `accessKeyId` (required)
- `secretAccessKey` (required)
- `region` (required)

### `connection.client`

The default DynamoDB client.

### `connection.create(options)`

Creates a DynamoDB client.

```js
var client = dino.connection.create({
    accessKeyId: 'MY_OTHER_KEY',
    secretAccessKey: 'MY_OTHER_SECRET',
    region: 'us-east-1'
});
```

#### options

- `accessKeyId` (required)
- `secretAccessKey` (required)
- `region` (required)

### `schema(options)`

Creates a schema.

```js
var forumSchema = dino.schema({
    table: 'forums',
    attributes: {
        name: dino.types.string,
        category: dino.types.string
    },
    key: {
        hash: 'name'
    }
});
```

#### options

- `table` (required)
- `attributes` (required)
- `key` (required)
- `keyDelimiter`

#### types

- `boolean`
- `date`
- `id`
- `number`
- `object`
- `string`

### schema.createTable();

Creates a table in DynamoDB.

```js
forumSchema.createTable(function(err, units){  });
```

### type()

Creates a schema type.

```js
var myType = dino.type({
    defaultValue: null,
    serialize: function (val) { return val; },
    deserialize: function (val) { return val; },
    toJSON: function (val) { return val; }
});
```

#### options

- `defaultValue`
- `serialize`
- `deserialize`
- `toJSON`

### `model(options)`

Creates a Model definition. Use this object to create and query models.

```js
var Forum = dino.model({
    schema: forumSchema
});
```

#### options

- `schema` (required)
- `client`

### `Model.create(attributes)`

Creates an instance of a model.

```js
var forum = Forum.create({
    name: 'Amazon DynamoDB',
    category: 'Amazon Web Services'
});
```

### `Model.findOne(options[, callback])`

Queries DynamoDB for a single model.

```js
Forum.findOne({
    hash: 'Amazon DynamoDB'
}, function(err, forum, units){  });
```

#### options

- `hash` (required)
- `range`

### `Model.find(options[, callback])`

Queries DynamoDB for a collection of models.

```js
Reply.find({
    hash: ['Amazon DynamoDB', 'DynamoDB Thread 1'],
    take: 10
}, function(err, replies, units){  });
```

#### options

- `hash` (required)
- `range`
- `skip`
- `take`

### `model.set(attributes)`

Sets the model attributes.

```js
forum.set({
    name: 'Amazon S3'
});
```

### `model.get(attribute)`

Gets the model attributes.

```js
forum.get('name'); // 'Amazon S3'
```

### `model.save([callback])`

Saves the instance to DynamoDB.

```js
forum.save(function(err, units){  });
```

### `model.destroy([callback])`

Deletes the instance from DynamoDB.

```js
forum.destroy(function(err, units){  });
```

### `model.toJSON()`

Returns the JSON serialized attributes of the instance.

```js
forum.toJSON();
```

### `collection.toJSON()`

Returns an array of JSON serialized models.

```js
replies.toJSON();
```

### `collection.models`

The raw array of models in the collection.

```js
replies.models;
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