// ============================ RESOURCES ================================
var mqtt = require('mqtt');
var config = require('../../CONFIG/thingsWebserverConfig'); //Needs adjustting
var configUtil = require('./configUtil');
var gaugePrinter = require('./gaugePrinter');
var chartPrinter = require('./chartPrinter');
var io = require('socket.io-client');
var moment = require('moment-timezone');
// =======================================================================

// ============================ GLOBALS ==================================
var mqttClient = mqtt.connect(config.thingsBroker.url,config.thingsBroker.options);
var subscribed = false;
var gMqttServFallbackActive = false;
var drawnDevices = [];
var topicUpdateTimestamps = [];
var momentDispFormat = "YYYY-MM-DD HH:mm";
// =======================================================================

var socket = io.connect(config.connection.url + ":" + config.connection.port);

function subsribeToTopics()
{
    var mqttTopics = configUtil.getTopics(config);

    mqttTopics.forEach(topicName => {

        topicUpdateTimestamps.push({time : moment().year(2010).tz(config.time.zone), mqttTopic: topicName});

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

function getLastUpdateTime(topic)
{   
    var timestamp = undefined;
    topicUpdateTimestamps.forEach(topicUpdateTimeItem => {
        
        if(topicUpdateTimeItem.mqttTopic === topic)
        {
            timestamp = topicUpdateTimeItem.time;
        }
    });
    return timestamp;
}

mqttClient.on('connect', function()
{
	console.log("Connected to Mqtt Broker");
	if(subscribed != true)
	{
		subsribeToTopics();
		subscribed = true;
	}
});

mqttClient.on('message', function (topic, message)
{
    var receivedData = topic.toString() + ": " + message.toString();
    console.log(receivedData);
    gaugePrinter.updateGauges(topic,message);

    var timestamp = moment().tz(config.time.zone);
    topicUpdateTimestamps.push({time : moment().tz(config.time.zone), mqttTopic: topic});
    gaugePrinter.updateGaugeTimestamp(topic,timestamp.format(momentDispFormat));
});

mqttClient.on('error', function(err) 
{
    console.log("Mqtt client connection issue, will use mqtt data from srv: " + err);
    gMqttServFallbackActive = true;
});

socket.on('chartDataBundleReady', function(data)
{
    console.log("received db data");

    if((data.Items.length > 0)) //TODO: no direct db data interpration logic should be here. Should be more like dbHanlder(data).GetDeviceId
    {
        var topic = configUtil.getTopic(config, data.Items[0].deviceId.S);
        var lastUpdateTime = getLastUpdateTime(topic);
        var lastItemTimestamp = moment(data.Items[data.Items.length -1].time.S);
        if(lastItemTimestamp.isAfter(lastUpdateTime))
        {
            gaugePrinter.updateGaugeTimestamp(topic,lastItemTimestamp.format(momentDispFormat));
            gaugePrinter.updateGaugesFromDb(topic, data);
        }
        if((drawnDevices.includes(data.Items[0].deviceId.S) === false))
        {
            drawnDevices.push(data.Items[0].deviceId.S);        
            chartPrinter.drawCharts(data);
        }
    }
});

socket.on('newMqttDataFromServer', function(topic,message)
{   
    var receivedData = topic.toString() + ": " + message;
    console.log("[newMqttDataFromServer] " + receivedData);
    //TASK: handle case when there was no updates for more than one hour (request read from db OR server notices a ping from socket io )
    if(gMqttServFallbackActive) gaugePrinter.updateGauges(topic,message);  
    chartPrinter.updateChartsLiveData(topic,message); //TODO unit/integration test this!
});

window.onload = function() {
    gaugePrinter.drawGauges(); 
};
