# THINGS-WEBSERVER
**A server for providing live and historical things data**

This a http server. The project is making use of the mqtt websocket connection possibilites.
All of the mqtt managment and data presentation is done on the client side.
This is possible thanks to the browserify node module.

## Release 1.0.0
Initial release of code and configuration examples.

## How to Install
Clone or unzip repository.
Open shell or the windows cmd, cd inside and type:
```js
npm install
```

## Configuration
All of the broker specific data and message formating are to be kept in a seperate js file.
A "exampleonfig.js" config file was attached for reference.
Update the config file location in:
* client/main.js
* client/gaugePrinter.js
* thingsWebserver.js

For buidlidng the client side code run the following command
```js
npm run build
```

## How to run
Open shell or the windows cmd, cd inside and type the follwoing to start the server:
```js
node mqttForwarder.js
```
The following command is useful during development as the script is automaticly restarted if file changes were detected:
```js
npm start
```
The next command comes in handy when making a lot of client side code changes, the client side gets automaticaky rebuild if client side code changes are detected:
```js
npm watch
```