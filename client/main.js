// ============================ RESOURCES ================================
var mqtt = require('mqtt');
var config = require('../../CONFIG/thingsWebserverConfig'); //Needs adjustting
var configUtil = require('./configUtil');
var gaugePrinter = require('./gaugePrinter');
// =======================================================================

// ============================ GLOBALS ==================================
var mqttClient = mqtt.connect(config.thingsBroker.url,config.thingsBroker.options);
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
    var mqttTopics = configUtil.getTopics(config);

    mqttTopics.forEach(topicName => {
        mqttClient.subscribe(topicName, function(error,granted)
        {
            var errorRet = true;
            granted.forEach(grantedElement => {
                errorRet = false;
                console.log("Subscription granted for topic: " + grantedElement.topic);
            });
            if(errorRet) console.log("Subscription error: " + error.toString());
        });
    });
}

mqttClient.on('connect', function()
{
	console.log("Connected to Mqtt Broker");
	subsribeToTopics();
});

mqttClient.on('message', function (topic, message)
{
    var receivedData = topic.toString() + ": " + message.toString();
    console.log(receivedData);
    gaugePrinter.updateGauges(topic,message);
});