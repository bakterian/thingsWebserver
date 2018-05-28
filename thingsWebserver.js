// ============================ RESOURCES ================================
var mqtt = require('mqtt');
var express = require('express');
var config = require('../CONFIG/thingsWebserverConfig'); //Adjust to loc
var app = express();
// =======================================================================

app.use(express.static(__dirname + '/public'));

app.get('/',function(request,response)
{
  response.sendFile(__dirname + '/index.html');  
});

app.listen(config.connection.port);