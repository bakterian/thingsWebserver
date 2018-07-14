// ============================ RESOURCES ================================
var mqtt = require('mqtt');
var config = require('../../CONFIG/thingsWebserverConfig');
var configUtil = require('./configUtil');
var gaugePrinter = require('./gaugePrinter');
var chartPrinter = require('./chartPrinter');
var io = require('socket.io-client');
var moment = require('moment-timezone');
var timeKeeper = require('./timeKeeper');
var dbDataReader = require('./dbDataReader');
// =======================================================================

// ============================ GLOBALS ==================================
var mqttClient = mqtt.connect(config.thingsBroker.url,config.thingsBroker.options);
var socket = io.connect(config.connection.url + ":" + config.connection.port);
var subscribed = false;
var drawnDevices = [];
// =======================================================================

timeKeeper.Init(configUtil.getTopics(config));

function subsribeToTopics()
{
    var mqttTopics = configUtil.getTopics(config);

    mqttTopics.forEach(topicName => {

        mqttClient.subscribe(topicName, function(error,granted)
        {
            var errorRet = true;
            granted.forEach(grantedElement => {
                errorRet = false;
                console.log("Subscription granted for topic: " + grantedElement.topic);
            });
            if(errorRet) console.log("Subscription error: " + error);
        });
    });
}

mqttClient.on('connect', function()
{
    console.log("Connected to Mqtt Broker, will be using browser websocket for acquering mqtt data.");
    socket.emit('unsubscribeFromServMqttUpdates');
	if(subscribed != true)
	{
		subsribeToTopics();
		subscribed = true;
	}
});

socket.on("connect", function()
{
    console.log("socket connection established");

});

mqttClient.on('message', function (topic, message)
{
    var receivedData = topic.toString() + ": " + message.toString();
    console.log(receivedData);
    gaugePrinter.updateGauges(topic,message);
    var timestamp = moment().tz(config.time.zone);
    timeKeeper.updateLastTimestampList(topic, timestamp);
    gaugePrinter.updateGaugeTimestamp(topic,timestamp);
    chartPrinter.updateChartsLiveData(topic,message); //TODO unit/integration test this!
});

mqttClient.on('error', function(err) 
{
    console.log("Mqtt client connection issue, will use mqtt data from srv: " + err);
    socket.emit('subscribeForServMqttUpdates');
});

mqttClient.stream.on('error', () => {
    console.log("Mqtt stream error was captured, closing connection and will use mqtt data from srv.");
    socket.emit('subscribeForServMqttUpdates');
    mqttClient.end();});

socket.on('chartDataBundleReady', function(data)
{
    console.log("received db data");
    var sensorData = new dbDataReader.SensorDbData(data);
    console.log("sensorData.deviceId: " + sensorData.deviceId);
    if((sensorData.count > 0)) 
    {
        var deviceId = sensorData.deviceId; //TODO unit test the getDeviceId method
        var topic = configUtil.getTopic(config, deviceId); 
        var lastUpdateTime = timeKeeper.getLastUpdateTime(topic);
        var lastItemTimestamp = moment(sensorData.lastItemTimesamp);
        if(lastItemTimestamp.isAfter(lastUpdateTime))
        {
            timeKeeper.updateLastTimestampList(topic, lastItemTimestamp);
            gaugePrinter.updateGaugeTimestamp(topic,lastItemTimestamp);
            gaugePrinter.updateGaugesFromDb(topic, data);
        }
        if((drawnDevices.includes(deviceId) === false))
        {
            drawnDevices.push(deviceId);        
            chartPrinter.drawCharts(data);
        }
    }
});

socket.on('newMqttDataFromServer', function(topic,message)
{   
    var receivedData = topic.toString() + ": " + message;
    console.log("[newMqttDataFromServer] " + receivedData);
    //TASK: handle case when there was no updates for more than one hour (request read from db OR server notices a ping from socket io )
    var timestamp = moment().tz(config.time.zone);
    timeKeeper.updateLastTimestampList(topic, timestamp);
    gaugePrinter.updateGaugeTimestamp(topic,timestamp);
    gaugePrinter.updateGauges(topic,message); 
    chartPrinter.updateChartsLiveData(topic,message); //TODO unit/integration test this! 
});

window.onload = function() {
    gaugePrinter.drawGauges(); 

};
