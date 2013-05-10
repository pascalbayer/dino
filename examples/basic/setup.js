var fs = require('fs'),
    async = require('async'),
    config = JSON.parse(fs.readFileSync('./aws-config.json')),
    dino = require('../../'),
    User = require('./models/user'),
    Post = require('./models/post'),
    client = dino.connection.create(config);

var waitForTable = function (table, client, callback) {
    console.log('Creating ' + table + ' table...');
    var isReady = false;
    async.until(function(){
        return isReady;
    }, function(c){
        console.log('Waiting...');
        client.describeTable({
            TableName: table
        }, function(err, data){
            setTimeout(function(){
                if (err) return c();
                if (data.Table.TableStatus === 'ACTIVE')
                {
                    isReady = true;
                    clearTimeout(timeout);
                    console.log('Finished creating ' + table + ' table!');
                }
                c();
            }, 10*1000);
        });
    }, callback);
    var timeout = setTimeout(function(){
        console.log('Operation timed out.');
        isReady = true;
    }, 120*1000);
};

async.series([
    async.apply(Post.schema.createTable, { client: client }),
    async.apply(waitForTable, Post.schema.table, client),
    async.apply(User.schema.createTable, { client: client }),
    async.apply(waitForTable, User.schema.table, client)
], function(err){
    if (err) return console.error(err);
    return console.log('Finished!');
});