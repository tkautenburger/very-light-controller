var Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO
var fs = require('fs');
var GPIO_ENV = process.env.GPIO_NO;
var ROOM = process.env.ROOM;
var PORT = process.env.VLC_PORT;
var CONFIG_PATH = process.env.CONFIG_PATH;
var LED = new Gpio(GPIO_ENV, 'out'); //use GPIO pin 23 (GPIO 23), and specify that it is output

var express = require('express');
var app = express();

app.get('/lightOn', function(req, res) {
  lightOn();
  var text = "Switched Light in " + ROOM + " ON\n";
  res.send(text);
})

app.get('/lightOff', function(req, res) {
  lightOff();
  var text = "Switched Light in " + ROOM + " OFF\n";
  res.send(text);
})

app.get('/lightStatus', function(req, res) {
  var answer = "Light in " + ROOM + " is " + lightStatus() + "\n";
  res.send(answer);
})

var server = app.listen(PORT, function(req, res) {
  var port = server.address().port;
  console.log("Light Controller for " + ROOM + " is listening at port %s", port);
  var status = readConfig();
  if (status == 0) {
    lightOff();
  } else if (status == 1) {
    lightOn();
  }  
})

function unexportOnClose() { //function to stop blinking
  console.log("Controller is going down. Turned the lights in %s off", ROOM);
  LED.writeSync(0); // Turn LED off
  LED.unexport(); // Unexport GPIO to free resources
}

function lightOn() {
  if (LED.readSync() == 0) {
    LED.writeSync(1);
    writeConfig(1);
  }
}

function lightOff() {
  if (LED.readSync() == 1) {
    LED.writeSync(0);
    writeConfig(0);
  }
}

function lightStatus() {
  var state;
  if (LED.readSync() == 0) {
    state = "OFF";
  } else {
    state = "ON";
  }
  return state;
}

function writeConfig(status) {
  var statusObj = new Object();
  statusObj.status = status;
  fs.writeFileSync(CONFIG_PATH + ROOM + ".txt", JSON.stringify(statusObj));
}

function readConfig() {
  var filename = CONFIG_PATH + ROOM + ".txt";
  if (fs.existsSync(filename)) {
    let rawdata = fs.readFileSync(filename);
    let config = JSON.parse(rawdata);
    return config.status;
  }
  return -1;
}

process.on('SIGINT', unexportOnClose); // function to run when user closes with ctrl+c
process.on('SIGTERM', unexportOnClose); // function to run when process gets TERM signal
