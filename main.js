'use strict';

var kafka = require('kafka-node');
var couchbase = require("couchbase");
var config = require("./config");
var HighLevelConsumer = kafka.HighLevelConsumer;
var Client = kafka.Client;
var client = new Client(config.kafka.server);
var topics = [ { topic: config.kafka.topic }];
var options = {
    groupId: 'group1'
};

var consumer = new HighLevelConsumer(client, topics, options);
var bucket = (new couchbase.Cluster(config.couchbase.server)).openBucket(config.couchbase.bucket);

console.log("*************************************************************************************")
console.log("* Source : kafka                                                                     ")
console.log("* Source : server :" + config.kafka.server)
console.log("* Source : topic  :" + config.kafka.topic)
console.log("* Cible  : couchbase                                                                 ")
console.log("* Cible  : server :" + config.couchbase.server)
console.log("* Cible  : bucket :" + config.couchbase.bucket)
console.log("*************************************************************************************")
console.log("* LISTENING                                                                         *")
console.log("*************************************************************************************")

consumer.on('message', function (message) {
    console.log(message)
    var buffer = JSON.parse(message.value)
    console.log(" test buffer -> "+ buffer )
    console.log(" test buffer.key  -> "+ buffer.key )
     bucket.insert(buffer.key, buffer, function(error, result) {
        if (error) {
          console.log('Failed to save to Couchbase', error);
        } else {
          console.log(buffer.key);
        }
    });
});

consumer.on('error', function (err) {
    console.log('error', err);
});
