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

exports.getLastItemTimestamp = function(data)
{
    return data.Items[data.Items.length -1].time.S;
}

exports.getDeviceId = function(data)
{
    return data.Items[0].deviceId.S;
}

exports.getItemCount = function(data)
{
    return data.Items.length;
}