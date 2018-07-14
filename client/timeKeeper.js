
// ============================ RESOURCES ================================
var moment = require('moment-timezone');
var config = require('../../CONFIG/thingsWebserverConfig');
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

exports.getCurrentDateTime = function() 
{
    return moment().tz(config.time.zone).format(config.time.format);
}

exports.getOldDateTime = function(noPassedDays) 
{
    return moment().subtract(noPassedDays, 'day').tz(config.time.zone).format(config.time.format);
}