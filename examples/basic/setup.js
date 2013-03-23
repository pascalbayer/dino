var fs = require('fs'),
    AWS = require('aws-sdk'),
    config = JSON.parse(fs.readFileSync('./aws-config.json')),
    client = new AWS.DynamoDB({
        credentials: config,
        region: config.region
    }).client;

client.createTable({
    TableName: 'dino_example_users',
    KeySchema: {
        HashKeyElement: {
            AttributeName: 'id',
            AttributeType: 'S'
        }
    },
    ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1
    }
}, function(err){
    if (err) return console.log(err);
    console.log('Success!');
});