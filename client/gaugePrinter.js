// ============================ RESOURCES ================================
var config = require('../../CONFIG/thingsWebserverConfig'); //needs adjusting
var configUtil = require('./configUtil');
var gauges = require('./gaugeFactory');
var dbDataReader = require('./dbDataReader');
var $ = require('jquery');
// =======================================================================

// ============================ GLOBALS ==================================
var canvasIds = [];
var activeGauges = [];
// =======================================================================

// ============================ FUNCITONS ================================
function addDistinctCanvasIds(mqttTopic,newCanavasIds)
{
    newCanavasIds.forEach(newCanavasId => {

        var foundEntry = false;
        canvasIds.forEach(canvasId => { 
        if((canvasId.topic === mqttTopic) && (canvasId.Id  === newCanavasId))
        {
            foundEntry=true;
        }
        });

        if(!foundEntry)
        {
            canvasIds.push({topic: mqttTopic, Id: newCanavasId});
        }
    });
}

function addCanvasIds(mqttTopic)
{
    $("#" + mqttTopic).children('canvas').each(function () 
    {
        
        var newCanavasIds = [];
        newCanavasIds[newCanavasIds.length] = $(this).attr('id');

        addDistinctCanvasIds(mqttTopic,newCanavasIds);
    });
}

function resetCanvasIdIterators()
{
    canvasIds.forEach(canvasId => { canvasId.iterator = 0;});
}

var configTopics = configUtil.getTopics(config);
configTopics.forEach(topic => 
{ 
    console.log("adding canvas ids for topic: "+ topic);
    addCanvasIds(topic); 
});

exports.drawGauges = function()
{
    for(var i =0; i < config.readings.length; i++)
    {
        if(canvasIds[i].topic === config.readings[i].mqttTopic)
        {
            var activatedGauge = gauges.create(config.readings[i].dataType,canvasIds[i].Id);
            activeGauges.push({topic: config.readings[i].mqttTopic, jsonParam: config.readings[i].jsonParam, gauge: activatedGauge});
            activatedGauge.draw();
        }
    }

    resetCanvasIdIterators();
}

exports.updateGauges = function(topic,mqttData)
{
    const msgJson = JSON.parse(mqttData);

    config.readings.forEach(reading => 
    {
        if((reading.mqttTopic === topic) && (reading.jsonParam in msgJson))
        {
            activeGauges.forEach(activeGauge => {
            if((activeGauge.topic === reading.mqttTopic) &&
                (activeGauge.jsonParam === reading.jsonParam))
                {
                activeGauge.gauge.update({value: msgJson[reading.jsonParam]});
                }
            });
        }
    });
}

exports.updateGaugeTimestamp = function(topic,timestampStr)
{
    $("#" + topic + "Timestamp").html("Updated: " + timestampStr);
}

exports.updateGaugesFromDb = function(topic, dbData)
{
    
    var device =  configUtil.getDeviceId(config,topic);
    console.log("updating " + device + " gauges based on db data.")
    config.readings.forEach(reading => 
    {
        if(reading.mqttTopic === topic)
        {
            activeGauges.forEach(activeGauge => {
            if((activeGauge.topic === reading.mqttTopic) &&
                (activeGauge.jsonParam === reading.jsonParam))
                {
                    var sensorId = configUtil.getSensorId(config,device,reading.jsonParam);
                    var sensorReading = dbDataReader.getLastSensorValue(dbData,sensorId);
                    activeGauge.gauge.update({value: sensorReading});
                }
            });
        }
    });
}
// =======================================================================