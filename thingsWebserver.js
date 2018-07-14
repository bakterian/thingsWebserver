// ============================ RESOURCES ================================
var mqtt = require('mqtt');
var express = require('express');
var config = require('../CONFIG/thingsWebserverConfig'); //Adjust to loc
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var moment = require('moment-timezone');
var dynamoDbFetcher = require('./dynamoDataFetcher');
var configUtil = require('./client/configUtil');
var timeKeeper = require('./client/timeKeeper');
// =======================================================================

// ============================ GLOBALS ==================================
var mqttClient = mqtt.connect(config.thingsBroker.url,config.thingsBroker.options);
var subscribed = false;
var subscribedRooms = require('./socketIoHelper').roomArray;
// =======================================================================

function subsribeToTopics()
{
    var mqttTopics = configUtil.getTopics(config);

    mqttTopics.forEach(topicName => {
        mqttClient.subscribe(topicName, function(error,granted)
        {
            var errorRet = true;
            granted.forEach(grantedElement => {
                errorRet = false;
                console.log("[Server] Subscription granted for topic: " + grantedElement.topic);
            });
            if(errorRet) console.log("[Server] Subscription error: " + error);
        });
    });
}

mqttClient.on('connect', function()
{
	console.log("[Server] Connected to Mqtt Broker");
	if(subscribed != true)
	{
		subsribeToTopics();
		subscribed = true;
	}
});

mqttClient.on('message', function (topic, message)
{
    console.log("got mqtt data " + message.toString())
    subscribedRooms.forEach(room => {
        console.log("will emit it to room: " + room)
        io.to(room).emit("newMqttDataFromServer", topic, message.toString()); 
    });
    
});

app.use(express.static(__dirname + '/public'));

app.get('/',function(request,response)
{
  response.sendFile(__dirname + '/index.html');  
});

io.on('connection',function(client)
{    
  subscribedRooms.add = client.id;
  client.on('disconnect', function(){ subscribedRooms.remove = client.id });
  client.on('unsubscribeFromServMqttUpdates', function(){ subscribedRooms.remove = client.id });
  client.on('subscribeForServMqttUpdates', function(){ subscribedRooms.add = client.id });
  
  var timestamp = timeKeeper.getOldDateTime(7); 
  console.log("Fetching db data not older than: " + timestamp);
  var mqttTopics = configUtil.getTopics(config);
  mqttTopics.forEach(topicName => {
    dynamoDbFetcher.getDataNotAlderThan(topicName, timestamp, function(err,data){
        if (err) 
        {
          console.log("[Server] Unable to querry table. Error JSON:" + JSON.stringify(err, null, 2));
        }
        else
        {
            console.log("[Server] DyanmoDb Querry was succesfull, retrieved a total of " + data.Items.length + " elements.");
            io.emit("chartDataBundleReady", data);
        }
      });  
  });
});


server.listen(config.connection.port);