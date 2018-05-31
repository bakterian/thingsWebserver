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