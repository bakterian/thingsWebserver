// ============================ RESOURCES ================================
var mqtt = require('mqtt');
var config = require('../../CONFIG/thingsWebserverConfig'); //Needs adjustting
var gaugePrinter = require('./gaugePrinter');
// =======================================================================

// ============================ GLOBALS ==================================
var mqttClient = mqtt.connect(config.thingsBroker.url,config.thingsBroker.options);
var subscribed = false;
// =======================================================================

gaugePrinter.DrawGauges(); 

function updateGauge(topic,mqttData)
{
    const msgJson = JSON.parse(mqttData.toString());
    if(typeof(msgJson.counter) !== "undefined")
    {
        tempGauge.update({value: msgJson.temp});
    }
}

function subsribeToTopics()
{
	for (var i in config.thingTopics)
	{
		mqttClient.subscribe(config.thingTopics[i]);
	};
}

mqttClient.on('connect', function()
{
	console.log("Connected to Mqtt Broker");
	if(subscribed != true)
	{
		subsribeToTopics();
		subscribed = true;
		console.log("Subsriptions are done");
	}
});

mqttClient.on('message', function (topic, message)
{
    var receivedData = topic.toString() + ": " + message.toString();
    console.log(receivedData);
    gaugePrinter.updateGauges(topic,message);
});