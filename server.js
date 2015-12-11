#!/usr/bin/env node

var net = require('net');
var WebSocketServer = require('ws').Server;
var spawn = require('child_process').spawn;


var WSS_PORT = 9292;

/*
 *
 * Websocket Server
 *
 */
var wss = null;

console.log("starting WSS server on %s", WSS_PORT);

wss = new WebSocketServer({
    port: WSS_PORT,
    host: "0.0.0.0"
});

console.log("started !");

wss.on('connection', function(wsClient) {

    console.log("ws client connected. count: ", wss.clients.length);

    wsClient.on('close', function(msg) {
    });

});

function processLine (line) {
    line = line.replace('INFO:root:','')
    
    //console.log(line);
    
    if (wss)  {
        for (var i = 0; i < wss.clients.length; i++) {
            wss.clients[i].send(line)
        }
    }
}

var proc = spawn('/usr/local/bin/python', ['/Users/jeroen/Sites/vpro/hackathon/PythonAPI.py']);

proc.stderr.pipe(require('split')()).on('data', processLine);
