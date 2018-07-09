var getFloatValue = function(sensorId)
{
    var sensorReading = parseFloat(-100.0);
    if("S" in sensorId)
    {
        sensorReading = parseFloat(sensorId.S);
    }
    else if("N" in sensorId)
    {
        sensorReading = parseFloat(sensorId.N);
    }
    return sensorReading;
}

exports.getLastSensorValue = function(data,sensorId)
{
    var item = data.Items[data.Items.length -1];
    var reading = getFloatValue(item[sensorId]);
    return reading;
}