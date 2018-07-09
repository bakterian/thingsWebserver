var AWS = require("aws-sdk");
var config = require('../CONFIG/thingsWebserverConfig'); 
AWS.config.loadFromPath('../CONFIG/awsCredentials.json'); 

var dynamodb = new AWS.DynamoDB();

function getDeviceId(topic)
{
    var did;
    config.deviceIdMap.forEach(mapElement => 
    {
        if(mapElement.mqttTopic == topic)
        {
            did = mapElement.deviceId;
        }     
    });

    return did;
}

function runQuery(queryParams,callback)
{
    dynamodb.query(queryParams,function(err,data)
    {
        callback(err,data);
    });
}

exports.getAllDataFromDb = function(topic, callback)
{
    var queryParams = 
    {
        ExpressionAttributeValues: 
        {
            ':dId' : {S: getDeviceId(topic)}
        },
        KeyConditionExpression: 'deviceId = :dId',
        TableName: config.dynamoTableName
    };

    runQuery(queryParams,callback);
}

exports.getDataNotAlderThan = function(topic,timestamp,callback)
{
    var retrievedDiD = getDeviceId(topic);
    var queryParams = 
    {
        ExpressionAttributeNames: 
        {
            "#t":"time"
        },
        ExpressionAttributeValues: 
        {
            ':dId' : {S: retrievedDiD},
            ':timestamp' : {S: timestamp},
        },
        KeyConditionExpression: 'deviceId = :dId and #t >= :timestamp',
        TableName: config.dynamoTableName
    };

    runQuery(queryParams,callback);
}

