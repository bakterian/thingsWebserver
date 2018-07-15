var config = {};

config.connection = 
{
	url: "http://localhost",
	port: 8080
};

config.thingsBroker =
{
	ws : 
	{
		url: "websocket broker URL",
		options: 
		{
			"port":3033,
			"username":"brokerLogin",
			"password":"brokerPassword",
			"protocolVersion":4,
			"reconnectPeriod":60000 
		}
	},
	http:
	{
		url: "http broker url",
		options: 
		{
			"port":1883,
			"username":"brokerLogin",
			"password":"brokerPassword",
			"protocolVersion":4,
			"reconnectPeriod":10000 
		}
	}
};

config.readings = 
[
	{
		mqttTopic: "topic1",
		jsonParam: "topic1Param1",
		dataType: "temperature",
	},
	{
		mqttTopic: "topic2",
		jsonParam: "topic2Param1",
		dataType: "humidity",
	},
		{
		mqttTopic: "topic2",
		jsonParam: "topic2Param2",
		dataType: "temperature",
	},
	
];

config.time = 
{
	zone: "TimeZoneMomentJs", 
	fotmat:"YYYY-MM-DD HH:mm:ss ZZ"
};

config.dynamoTableName = "MqttShadowData";

config.deviceIdMap =
[
	{
		mqttTopic: "topic1",
		deviceId: "device1"
	},
	{
		mqttTopic: "topic2",
		deviceId: "device2"
	}
];

config.SensorMap =
[
	{
		deviceId: "device1",
		sensorGroups : 
		[		
			{
				group: "temperatureGroup",
				unit: "degrees celsius [°C]",
				sensors: 
				[
					{label: "Temp sensor #1", id: "temperature", jsonParam: "temp" }
				]
			},		
			{
				group: "humidityGroup",
				unit: "relative humidity [%]",
				sensors: 
				[
					{label: "Humidity sensor", id: "humidity", jsonParam: "humid" }
				]
			}
		]		
	},
	{
		deviceId: "device2",
		sensorGroups : 
		[	
			{
				group: "temperature",
				unit: "degrees celsius [°C]",
				sensors: 
				[
					{label: "Temp sensor #1", id: "temperature", jsonParam: "temperature"},
					{label: "Temp sensor #2", id: "temperatureV2", jsonParam: "tempV2"}
				]
			}	
		]		
	}
];

module.exports = config;