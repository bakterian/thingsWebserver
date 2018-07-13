
// ============================ RESOURCES ================================
var moment = require('moment-timezone');

// =======================================================================

// ============================ GLOBALS ==================================
var topicUpdateTimestamps = [];
var momentDispFormat = "YYYY-MM-DD HH:mm";
// =======================================================================

exports.Init = function(aTopicNames) 
{
    aTopicNames.forEach(topicName => 
    {
        topicUpdateTimestamps.push({time : moment().year(2010), mqttTopic: topicName});
    });
}

exports.updateLastTimestampList = function(aTopic,aMomentTimestamp)
{
    var i = 0;
    var indexToUpdate = -1;
    topicUpdateTimestamps.forEach(topUpdTimeItem => 
    {
        if(topUpdTimeItem.mqttTopic === aTopic)
        {
            indexToUpdate = i;
        }
        i++;
    });

    if(indexToUpdate != -1)
    {
        topicUpdateTimestamps[indexToUpdate] = {time: aMomentTimestamp,mqttTopic: aTopic};
    }
}

exports.getLastUpdateTime = function(topic)
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