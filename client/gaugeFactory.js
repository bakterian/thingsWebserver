// ============================ RESOURCES ================================
var gauges = require('canvas-gauges');
// =======================================================================

var temperatureGauge = {
    renderTo: 'GaugeId',
    width: 150,
    height: 500,
    units: "°C",
    title: "Temperature",
    minValue: -100,
    maxValue: 100,
    majorTicks: [
        "-100",
        "80",
        "60",
        "40",
        "20",
        "0",
        "20",
        "40",
        "60",
        "80",
        "100"
    ],
    minorTicks: 2,
    strokeTicks: true,
    highlights: [
        {
            "from": -100,
            "to": 0,
            "color": "rgba(31, 178, 214, 0.75)"
        },
        {
            "from": 0,
            "to": 100,
            "color": "rgba(200, 50, 50, .75)"
        }
        
    ],
    colorPlate: "#fff",
    borderShadowWidth: 0,
    borders: false,
    needleType: "arrow",
    needleWidth: 4,
    animationDuration: 1500,
    animationRule: "linear",
    tickSide: "left",
    numberSide: "left",
    needleSide: "left",
    barStrokeWidth: 7,
    barBeginCircle: false,
    value: -100
};

var humidityGauge = {
    renderTo: 'GaugeId',
    width: 150,
    height: 500,
    units: "%",
    title: "Humidity",
    minValue: 0,
    maxValue: 100,
    majorTicks: [
        "0",
        "10",
        "20",
        "30",
        "40",
        "50",
        "60",
        "70",
        "80",
        "90",
        "100"
    ],
    minorTicks: 2,
    strokeTicks: true,
    highlights: [
        {
            "from": 0,
            "to": 100,
            "color": "rgba(31, 178, 214, 0.75)"
        }    
    ],
    colorPlate: "#fff",
    borderShadowWidth: 0,
    borders: false,
    needleType: "arrow",
    needleWidth: 4,
    animationDuration: 1500,
    animationRule: "linear",
    tickSide: "left",
    numberSide: "left",
    needleSide: "left",
    barStrokeWidth: 7,
    barBeginCircle: false,
    value: 0
};


var lightGauge = {
    renderTo: 'GaugeId',
    width: 150,
    height: 500,
    units: "lx",
    title: "Light",
    minValue: 0,
    maxValue: 60000,
    majorTicks: [
        "0",
        "6000",
        "12000",
        "18000",
        "24000",
        "30000",
        "36000",
        "42000",
        "48000",
        "54000",
        "60000"
    ],
    minorTicks: 2,
    strokeTicks: true,
    highlights: [
        {
            "from": 0,
            "to": 60000,
            "color": "rgba(164, 195, 26, 0.75)"
        }    
    ],
    colorPlate: "#fff",
    borderShadowWidth: 0,
    borders: false,
    needleType: "arrow",
    needleWidth: 4,
    animationDuration: 1500,
    animationRule: "linear",
    tickSide: "left",
    numberSide: "left",
    needleSide: "left",
    barStrokeWidth: 7,
    barBeginCircle: false,
    value: 0
};

var pressureGauge = {
    renderTo: 'GaugeId',
    width: 150,
    height: 500,
    units: "Pa",
    title: "Pressure",
    minValue: 92000,
    maxValue: 106000,
    majorTicks: [
        "92000",
        "93400",
        "94800",
        "96200",
        "97600",
        "99000",
        "100400",
        "101800",
        "103200",
        "104600",
        "106000"
    ],
    minorTicks: 2,
    strokeTicks: true,
    highlights: [
        {
            "from": 0,
            "to": 1000,
            "color": "rgba(46, 236, 236, 0.75)"
        }    
    ],
    colorPlate: "#fff",
    borderShadowWidth: 0,
    borders: false,
    needleType: "arrow",
    needleWidth: 4,
    animationDuration: 1500,
    animationRule: "linear",
    tickSide: "left",
    numberSide: "left",
    needleSide: "left",
    barStrokeWidth: 7,
    barBeginCircle: false,
    value: 0
};

var dust_2_5_gauge = {
    renderTo: 'GaugeId',
    width: 300,
    height: 300,
    units: "ug",
    title: "PM 2.5",
    minValue: 0,
    maxValue: 30,
    majorTicks: [
        "0",
        "3",
        "6",
        "9",
        "12",
        "15",
        "18",
        "21",
        "24",
        "27",
        "30"
    ],
    minorTicks: 2,
    strokeTicks: true,
    highlights: [
        {
            "from": 21,
            "to": 30,
            "color": "rgba(200, 50, 50, .75)"
        }
    ],
    colorPlate: "#fff",
    borderShadowWidth: 0,
    borders: false,
    needleType: "arrow",
    needleWidth: 2,
    needleCircleSize: 7,
    needleCircleOuter: true,
    needleCircleInner: false,
    animationDuration: 1500,
    animationRule: "linear"
};

var dust_10_gauge = {
    renderTo: 'GaugeId',
    width: 300,
    height: 300,
    units: "ug",
    title: "PM 10",
    minValue: 0,
    maxValue: 50,
    majorTicks: [
        "0",
        "5",
        "10",
        "15",
        "20",
        "25",
        "30",
        "35",
        "40",
        "45",
        "50"
    ],
    minorTicks: 2,
    strokeTicks: true,
    highlights: [
        {
            "from": 35,
            "to": 50,
            "color": "rgba(200, 50, 50, .75)"
        }
    ],
    colorPlate: "#fff",
    borderShadowWidth: 0,
    borders: false,
    needleType: "arrow",
    needleWidth: 2,
    needleCircleSize: 7,
    needleCircleOuter: true,
    needleCircleInner: false,
    animationDuration: 1500,
    animationRule: "linear"
};

var gaugeCollection =
[
    {gaugeType: "linear", dataType: "temperature", configuration : temperatureGauge},
    {gaugeType: "linear", dataType: "humidity", configuration : humidityGauge},
    {gaugeType: "linear", dataType : "light", configuration:  lightGauge},
    {gaugeType: "linear", dataType : "pressure", configuration:  pressureGauge},
    {gaugeType: "radial", dataType : "dust_2_5", configuration:  dust_2_5_gauge},
    {gaugeType: "radial", dataType : "dust_10", configuration:  dust_10_gauge},
];

function activateInstance(gaugeType,config)
{
    var newGauge = null;

    if(gaugeType == "linear")
    {
        newGauge = new gauges.LinearGauge(config);
    }
    else if(gaugeType == "radial")
    {
        newGauge = new gauges.RadialGauge(config);
    }

    return newGauge;
}

exports.create = function(dataType,canvasId)
{
    var createdGaguge = null;
    for( var i in gaugeCollection)
    {
        if(gaugeCollection[i].dataType === dataType)
        {
            gaugeCollection[i].configuration.renderTo = canvasId;
            createdGaguge = activateInstance(gaugeCollection[i].gaugeType, gaugeCollection[i].configuration);
            console.log("createdGauge: " + gaugeCollection[i].gaugeType + ", canvasId: " + canvasId );
        }      
    }
    return createdGaguge;
}

