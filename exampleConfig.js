var config = {};

config.connection = 
{
	port: 8080
};

config.thingsBroker =
{
	url: "broker URL",
	options: 
	{
		"port":3033,
		"username":"brokerLogin",
		"password":"brokerPassword",
		"protocolVersion":4
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

module.exports = config;