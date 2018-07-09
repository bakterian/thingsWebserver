function getDistinctTopics(config)
{
    var topics = [];

    config.readings.forEach(reading => 
    {
        var foundEntry = false;
        topics.forEach(topic => { 
        if((topic  === reading.mqttTopic)) foundEntry=true;
        });

        if(!foundEntry)
        {
            topics.push(reading.mqttTopic);
        }
    });

    return topics;
}

exports.getTopics = getDistinctTopics;


exports.getDeviceId = function(config, topic)
{
    var deviceId = "notFound";
    config.deviceIdMap.forEach(deviceIdMapItem => 
    {
        if(deviceIdMapItem.mqttTopic === topic)
        {
            deviceId = deviceIdMapItem.deviceId;
        }
    });
    return deviceId;
}


exports.getTopic = function(config, device)
{
    var topic = "notFound";
    config.deviceIdMap.forEach(deviceIdMapItem => 
    {
        if(deviceIdMapItem.deviceId === device)
        {
            topic = deviceIdMapItem.mqttTopic;
        }
    });
    return topic;
}

exports.getSensorId = function(config, device, jsonParam)
{
    var sensorId = undefined;
    config.SensorMap.forEach(sensorMapItem => 
    {
        if(sensorMapItem.deviceId === device)
        {
            sensorMapItem.sensorGroups.forEach(sensorGroup => {
                sensorGroup.sensors.forEach(sensor => {
                    if(sensor.jsonParam === jsonParam)
                    {
                        sensorId = sensor.id;
                    }
                });
            });
        }
    });

    return sensorId;
}