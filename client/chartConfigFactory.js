// ============================ RESOURCES ================================
var config = require('../../CONFIG/thingsWebserverConfig');
var configUtil = require('./configUtil');
var moment = require('moment-timezone');
// =======================================================================

// ============================ GLOBALS ==================================

var bgColors = ["red", "blue", "green", "orange", "brown", "black"];
var bgSelCounter = 0;
// =======================================================================

// ============================ FUNCITONS ================================

function getDefConfig()
{
    var chartConfig = {
        type: 'line',
        data: {
            datasets : []
        },
        options: {
            responsive: true,
            tooltips: {
                mode: 'index',
                intersect: false,
            },
            hover: {
                mode: 'nearest',
                intersect: true
            },
            scales: {
                xAxes: [{
                    type: 'time',
                    time: {
                        parser: config.time.format,
                        unit: 'day',
                        unitStepSize: 1,
                        displayFormats: {
                            max: moment().startOf('year'),
                            min: moment().endOf('year'),
                            'millisecond': 'SSS [ms]',
                            'second': 'h:mm:ss a', // 11:20:01 AM
                            'minute': 'h:mm:ss a', // 11:20:01 AM
                            'hour': 'MMM D, hA', // Sept 4, 5PM
                            'day': 'MMM Do', // Sep 4 2015
                            'week': 'll', // Week 46, or maybe "[W]WW - YYYY" ?
                            'month': 'MMM YYYY', // Sept 2015
                            'quarter': '[Q]Q - YYYY', // Q3
                            'year': 'YYYY', // 2015
                        },
                    },
                    display: true
                }],
                yAxes: [{
                    ticks: {
                        beginAtZero:false
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'who knows []',
                        fontSize: 12
                    },
                    display: true
                }]
            },
            pan: {
                // Boolean to enable panning
                enabled: true,
    
                // Panning directions. Remove the appropriate direction to disable 
                // Eg. 'y' would only allow panning in the y direction
                mode: 'xy'
            },
    
            // Container for zoom options
            zoom: {
                // Boolean to enable zooming
                enabled: true,
    
                // Zooming directions. Remove the appropriate direction to disable 
                // Eg. 'y' would only allow zooming in the y direction
                mode: 'xy',
            }
        }
    };

    return chartConfig;
}


exports.createChartConfig = function(yAxisLabel)
{
    var newChartConfig = getDefConfig();
    newChartConfig.options.scales.yAxes[0].scaleLabel.labelString = yAxisLabel;
    return newChartConfig;
}

exports.addChartDataset = function(chartConfig, dynamoDataPairs, seriesLabel)
{
    var colorId = bgSelCounter % bgColors.length;
    var color = bgColors[colorId];
    bgSelCounter++;

    var newDataset = 
    {
        label: seriesLabel,
        fill: false,
        borderColor: color,
        data: dynamoDataPairs
    };

    chartConfig.data.datasets.push(newDataset);
}

// =======================================================================