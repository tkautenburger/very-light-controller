var Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO
var express = require('express');
var app = express();

var PORT = process.env.GPC_PORT;
var GPIOs = [];


app.get('/gpioHigh', function(req, res) {
  let pin = req.query.pin;
  let obj = new Object();
  obj.pin = pin;
  if (pin > 1 && pin < 26) {
    const result = GPIOs.find(element => element.pin == pin);
    if (result == undefined) {
      obj.status = -1;
    } else {
      gpioHigh(result.gpio);
      obj.status = gpioStatus(result.gpio);
    }  
  } else {
    obj.status = -1;
  }
  let resp = JSON.stringify(obj);
  res.send(resp);
})


app.get('/gpioLow', function(req, res) {
  let pin = req.query.pin;
  let obj = new Object();
  obj.pin = pin;
  if (pin > 1 && pin < 26) {
    const result = GPIOs.find(element => element.pin == pin);
    if (result == undefined) {
      obj.status = -1;
    } else {
      gpioLow(result.gpio);
      obj.status = gpioStatus(result.gpio);
    }  
  } else {
    obj.status = -1;
  }
  let resp = JSON.stringify(obj);
  res.send(resp);
})


app.get('/gpioStatus', function(req, res) {
  let pin = req.query.pin;
  let obj = new Object();
  obj.pin = pin;
  if (pin > 1 && pin < 26) {
    const result = GPIOs.find(element => element.pin == pin);
    if (result == undefined) {
      obj.status = -1;
    } else {
      obj.status = gpioStatus(result.gpio);
    }  
  } else {
    obj.status = -1;
  }
  let resp = JSON.stringify(obj);
  res.send(resp);
})


app.get('/gpioInit', function(req, res) {
  let pin = req.query.pin;
  let direction = req.query.direction;
  let obj = new Object();
  obj.pin = pin;
  if (pin > 1 && pin < 26 && (direction == 'in' || direction == 'out')) {
    const index = GPIOs.findIndex(element => element.pin == pin);
    if (index != -1) {
      GPIOs.splice(index, 1);
    }
    let gpio = gpioInit(pin, direction);
    obj.status = gpioStatus(gpio);
    let gpioObj = new Object();
    gpioObj.pin = pin;
    gpioObj.gpio = gpio;
    GPIOs.push(gpioObj);
  } else {
    obj.status = -1;
  }
  let resp = JSON.stringify(obj);
  res.send(resp);
})


var server = app.listen(PORT, function(req, res) {
  var port = server.address().port;
  gpioAllInit();
  console.log("GPIO Controller is listening at port %s", port);
})


function unexportOnClose() { //function to stop blinking
  console.log("GPIO controller is going down. Turning down GPIOs");
  GPIOs.map(obj => {
    gpioLow(obj.gpio);
    console.log("Turning down PIN " + obj.pin);
    obj.gpio.unexport();
  });
  process.exit(0);
}


function gpioHigh(gpio) {
  if (gpio.readSync() == 0) {
    gpio.writeSync(1);
  }
}


function gpioLow(gpio) {
  if (gpio.readSync() == 1) {
    gpio.writeSync(0);
  }
}


function gpioStatus(gpio) {
  let state = gpio.readSync();
  return state;
}


function gpioInit(pin, direction) {
  return new Gpio(pin, direction);
}


function gpioAllInit() {
 let gpio1 = gpioInit(23, 'out');
 let gpioObj1 = new Object();
 gpioObj1.pin = 23;
 gpioObj1.gpio = gpio1;
 GPIOs.push(gpioObj1);

 let gpio2 = gpioInit(24, 'out');
 let gpioObj2 = new Object();
 gpioObj2.pin = 24;
 gpioObj2.gpio = gpio2;
 GPIOs.push(gpioObj2);

 let gpio3 = gpioInit(25, 'out');
 let gpioObj3 = new Object();
 gpioObj3.pin = 25;
 gpioObj3.gpio = gpio3;
 GPIOs.push(gpioObj3);
}


process.on('SIGINT', unexportOnClose); // function to run when user closes with ctrl+c
process.on('SIGTERM', unexportOnClose); // function to run when process gets TERM signal

