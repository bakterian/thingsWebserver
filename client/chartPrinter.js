// ============================ RESOURCES ================================
var configFactory = require('./chartConfigFactory');
var servConfigUtil = require('./configUtil');
var Chart = require('chart.js');
var ChartZoom = require('chartjs-plugin-zoom');
var moment = require('moment-timezone');
var config = require('../../CONFIG/thingsWebserverConfig');
var $ = require('jquery');
// =======================================================================

// ============================ GLOBALS ==================================
var glastHourlyValues = [];
// =======================================================================

// ============================ FUNCITONS ================================

function replacer(key,value)
{
    if (key=="chart") return undefined;
    else return value;
}

var trimSecondsAndMinutes = function(timeStr)
{
    return moment(timeStr, config.time.format).startOf('hour');
}

var getAvgValue = function(accumulator,counter)
{
    return Math.round(parseFloat(accumulator/counter) * 100) / 100;
}

var updateTimeBase = function(lastHourlyVal)
{
    var timestampFormatedTrimmed = trimSecondsAndMinutes(moment().tz(config.time.zone).format(config.time.format));
    lastHourlyVal.baseTime = timestampFormatedTrimmed;  

    var timestamp = moment(config.time.format);
    lastHourlyVal.baseHour = parseInt(timestamp.format("HH"));
}

var getlastHourlyValIds = function(dId, sId, senGroup)
{
    var res = 
    {
        devArrayId: -1,
        sensorGroupArrayId: -1,
        sensorArrayId: -1
    }

    var i = 0;
    var ii = 0;
    var iii = 0;
    glastHourlyValues.forEach(hourlyValueItem => 
    {
        if(hourlyValueItem.deviceId === dId)
        {
            res.devArrayId = i;
            
            hourlyValueItem.sensorGroups.forEach(sensorGroup => 
                {
                    if(sensorGroup.group === senGroup) 
                    {
                        res.sensorGroupArrayId = ii;             
                        sensorGroup.sensors.forEach(sensor => 
                        {
                            if(sensor.id === sId) 
                            {
                                res.sensorArrayId = iii;
                            }
                            iii++;
                        });               
                    }
                ii++;
            });
        }
        i++;
    });

    return res;
}

var updadteLastHourlyValues = function(dId, sId, sJsonParam, senGroup, hourlyAvgDataPkg)
{
    ids = getlastHourlyValIds(dId, sId, senGroup);
    if(ids.devArrayId != -1)
    {
        glastHourlyValues[ids.devArrayId].baseTime = hourlyAvgDataPkg.hourlyBaseTime;
        glastHourlyValues[ids.devArrayId].baseHour = hourlyAvgDataPkg.hourlyBase;
        if(ids.sensorGroupArrayId != -1 && ids.sensorArrayId != -1)
        {
            glastHourlyValues[ids.devArrayId].sensorGroups[ids.sensorGroupArrayId].sensors[ids.sensorArrayId].avgData = hourlyAvgDataPkg.lastAvgValue;
        }
        else if(ids.sensorGroupArrayId != -1 &&  ids.sensorArrayId == -1)
        {
            glastHourlyValues[ids.devArrayId].sensorGroups[ids.sensorGroupArrayId].sensors.push({id: sId, jsonParam: sJsonParam, avgData: hourlyAvgDataPkg.lastAvgValue});
        }
        else
        {
            glastHourlyValues[ids.devArrayId].sensorGroups.push(
            {
                group: senGroup,
                chart: {},
                sensors: [ {id: sId, jsonParam: sJsonParam, avgData: hourlyAvgDataPkg.lastAvgValue}] 
            });
        }
    }
    else
    {
        var newEntry =         
        {
            deviceId: dId,
            baseTime: hourlyAvgDataPkg.hourlyBaseTime,
            baseHour: hourlyAvgDataPkg.hourlyBase,
            sensorGroups:
            [{
                group: senGroup,
                chart: {},
                sensors: [ {id: sId, jsonParam: sJsonParam, avgData: hourlyAvgDataPkg.lastAvgValue}] 
            }]
        };
        glastHourlyValues.push(newEntry);
    }
}

var persistChartRef = function(dId,senGroup, chartToPersist)
{
    ids = getlastHourlyValIds(dId, "none", senGroup);
    if((ids.devArrayId != -1) && (ids.sensorGroupArrayId != -1))
    {
            glastHourlyValues[ids.devArrayId].sensorGroups[ids.sensorGroupArrayId].chart = chartToPersist;
    }
    else
    {
        console.log('[persistChartRef] The sensor group was not found');
    }
}


var getLastHourValue = function(did)
{
    var foundItem = null;
    glastHourlyValues.forEach(item => 
    {
        if(item.deviceId == did) 
        {
            foundItem = item;
        }
    });

    return foundItem;
}

var getSensorValue = function(sensorId)
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

var getChartCountForDevice = function(device)
{
    var chartCount = -1;
    config.SensorMap.forEach(mapElement => 
    {
        if(mapElement.deviceId == device)
        {
            chartCount = mapElement.sensorGroups.length;
        }
    });

    return chartCount;
}

var getTimeValueMap = function(data)
{
    var timeValueMap = [];

    data.Items.forEach(dataItem => 
        {
            var timestamp = dataItem.time.S;
            var mapElement = {t: timestamp, y: dataItem.temperature.S};
            timeValueMap.push(mapElement);
        });

    return timeValueMap;
}

var getHourlyAvg = function(data, sensorId)
{
    var result = 
    {
        avgValueMap: [],
        hourlyBase: -1,
        hourlyBaseTime: moment(),
        lastAvgValue : {}
    }

    if(data.Items.length > 0)
    {
        var hourlyBase = parseInt(moment(data.Items[0].time.S, config.time.format).format("HH"));
        var hourlyBaseTime = trimSecondsAndMinutes(data.Items[0].time.S);
        var valueAccumulator = 0.0;
        var avgValCounter = 0.0;
        for(var i = 0; i < data.Items.length; i++)
        {
            var item = data.Items[i];
            var readVal = getSensorValue(item[sensorId]);
            valueAccumulator += readVal;
            avgValCounter++;
            if((parseInt(moment(item.time.S, config.time.format).format("HH")) != hourlyBase) || (i == data.Items.length-1))
            {
                var avgValue = getAvgValue(valueAccumulator,avgValCounter);
                var avgValueMapItem = {t: hourlyBaseTime, y: avgValue};
                hourlyBase = parseInt(moment(item.time.S,config.time.format).format("HH"));
                hourlyBaseTime = trimSecondsAndMinutes(item.time.S);
                result.avgValueMap.push(avgValueMapItem);
                result.hourlyBase = hourlyBase;
                result.hourlyBaseTime = hourlyBaseTime;
                result.lastAvgValue = {yAcc: valueAccumulator, yCount: avgValCounter};
                valueAccumulator = 0.0;
                avgValCounter= 0.0;
            }
        };
    }

    return result;
} 

var prependCanvasData = function(data)
{
    var chartCount = getChartCountForDevice(data.Items[0].deviceId.S);

    $(".HistoricData").prepend("<h1>Averaged " + data.Items[0].deviceId.S + " measurements - last 7 days</h1><div id=\"" + data.Items[0].deviceId.S +"Hist\"></div><br><br>");

    for(var i =0; i< chartCount; i++)
    {
        $("#" + data.Items[0].deviceId.S +"Hist")
        .append("<canvas id=\"chart" + data.Items[0].deviceId.S + i + "\" class=\"chartjs-render-monitor\"></canvas>");
    }
}

var getChartCanvasIds = function(data)
{
    var charCanvasIds = [];
    var reqChartCount = getChartCountForDevice(data.Items[0].deviceId.S);
    if( reqChartCount != -1)
    {
        var ids = []
        $("#" + data.Items[0].deviceId.S + "Hist").children('canvas').each(function () 
        {  
            ids[ids.length] = $(this).attr('id');
        });

        if(ids.length != reqChartCount)
        {
            console.log("The canvas ids count (" + ids.length +  ") does not match config senor group count(" + reqChartCount + ")")
        }
        else
        {
            charCanvasIds = ids;
        }
    }
    else
    {
        Console.log("Was Unable to retrieve chart count for device " + data.Items[0].deviceId.S);
    } 
    
    return charCanvasIds;
}

exports.drawCharts = function(data) 
{
    prependCanvasData(data);
    var chartCanvasIds = getChartCanvasIds(data);
    var i = 0;
    if(chartCanvasIds.length > 0)
    {
        config.SensorMap.forEach(device => {
            if(device.deviceId == data.Items[0].deviceId.S)
            {
                device.sensorGroups.forEach(sensorGroup => 
                {
                    var chartConfig = configFactory.createChartConfig(sensorGroup.unit);
                    sensorGroup.sensors.forEach(sensor => 
                    {
                        var hourlyAvgDataPkg = getHourlyAvg(data,sensor.id);
                        updadteLastHourlyValues(data.Items[0].deviceId.S, sensor.id, sensor.jsonParam, sensorGroup.group, hourlyAvgDataPkg);
                        configFactory.addChartDataset(chartConfig,hourlyAvgDataPkg.avgValueMap,sensor.label);
                    });  
                    var chartCanvas = document.getElementById(chartCanvasIds[i]).getContext('2d');
                    var newChart = new Chart(chartCanvas, chartConfig);
                    window.myLine = newChart;
                    persistChartRef(data.Items[0].deviceId.S, sensorGroup.group, newChart);
                    i++;
                });
            }
        });
    }
};

exports.updateChartsLiveData = function(topic,message)
{
    var msgJson = JSON.parse(message);
    var deviceId = servConfigUtil.getDeviceId(config, topic);
    if(deviceId != "notFound")
    {
        var lastHourlyVal = getLastHourValue(deviceId);
        if(lastHourlyVal != null)
        {
            var currentHour = parseInt(moment().format("HH"));
            if(currentHour == lastHourlyVal.baseHour)
            { 
                lastHourlyVal.sensorGroups.forEach(sensorGroup => 
                {            
                    sensorGroup.sensors.forEach(sensor => 
                    {
                        sensor.avgData.yAcc += parseFloat(msgJson[sensor.jsonParam]);
                        sensor.avgData.yCount++;                   
                    });
                });
                //console.log("[chartPrinter.updateChartsLiveData] device: " + deviceId + ", lastHourlyVal: " + JSON.stringify(lastHourlyVal,replacer));
            }
            else
            {   //next hour is starting, calculate average here and update the apropriate dataSet  
                var currBaseTime = trimSecondsAndMinutes(moment().tz(config.time.zone).format(config.time.format));
                lastHourlyVal.sensorGroups.forEach(sensorGroup => 
                {                          
                    var chart = sensorGroup.chart;
                    var i = 0; 
                    sensorGroup.sensors.forEach(sensor => 
                    {
                        console.log("Chart updates of device: " + lastHourlyVal.deviceId  + ", of group: " + sensorGroup.group + ", i: " + i + ",sensor id: " + sensor.id);
                        var lastPointId = chart.data.datasets[i].data.length - 1;
                        var lastChartDatasetVal = chart.data.datasets[i].data[lastPointId];
                        var avgValue = getAvgValue(sensor.avgData.yAcc, sensor.avgData.yCount);
 
                        var newHourValue = parseFloat(msgJson[sensor.jsonParam]);
                        var avgCalcPoint = {t: lastHourlyVal.baseTime, y: avgValue};
                        var newHourPoint = {t: currBaseTime, y: newHourValue};

                        console.log("changing old value: " + JSON.stringify(lastChartDatasetVal) + ", with new one: " + JSON.stringify(avgCalcPoint));
                        chart.data.datasets[i].data[lastPointId] = avgCalcPoint;
                        console.log("adding new non-avg value: " + JSON.stringify(newHourPoint));
                        chart.data.datasets[i].data.push(newHourPoint);

                        chart.update();
         
                        sensor.avgData.yAcc = parseFloat(msgJson[sensor.jsonParam]);
                        sensor.avgData.yCount = 1;  
                        i++;              
                    });
                });

                updateTimeBase(lastHourlyVal);
            }
        }
        else
        {
            console.log("[io|updateChartsLiveData] Device id was not found in glastHourlyValues.");
        }
    }
    else
    {
        console.log("[io|updateChartsLiveData] Mqtt topic is unkown.");
    }
    
};