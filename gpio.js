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
      let pinIn = crossCheck(pin);
      if (pinIn != -1) {
        const checkGpio = GPIOs.find(element => element.pin == pinIn);
        if (checkGpio == undefined) {
          obj.status = -1;
        } else {
          let checkState = gpioStatus(checkGpio.gpio);
          if (checkState == 0) {
            gpioHigh(result.gpio);
            obj.status = gpioStatus(result.gpio);
          } else {
            obj.status = 1;
          }
        }  
      } else {
        obj.status = -1;
      }    
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
      let pinIn = crossCheck(pin);
      if (pinIn != -1) {
        const checkGpio = GPIOs.find(element => element.pin == pinIn);
        if (checkGpio == undefined) {
          obj.status = -1;
        } else {
          let checkState = gpioStatus(checkGpio.gpio);
          if (checkState == 1) {
            gpioLow(result.gpio);
            obj.status = gpioStatus(result.gpio);
          } else {
            obj.status = 0;
          }  
        }  
      } else {
        obj.status = -1;
      }    
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
      let pinIn = crossCheck(pin);
      if (pinIn != -1) {
        const checkGpio = GPIOs.find(element => element.pin == pinIn);
        if (checkGpio == undefined) {
          obj.status = -1;
        } else {
          obj.status = gpioStatus(checkGpio.gpio);
        }  
      } else {
        obj.status = -1;
      }    
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


function crossCheck(pinOut) {
  if (pinOut = 23)
  	return 26;
  if (pinOut = 24)
  	return 19;
  if (pinOut = 25)
  	return 13;
  return -1;
}

function gpioAllInit() {
 let gpioObj1out = new Object();
 gpioObj1out.pin = 23;
 gpioObj1out.gpio = gpioInit(23, 'out');
 GPIOs.push(gpioObj1out);

 let gpioObj2out = new Object();
 gpioObj2out.pin = 24;
 gpioObj2out.gpio = gpioInit(24, 'out');
 GPIOs.push(gpioObj2out);

 let gpioObj3out = new Object();
 gpioObj3out.pin = 25;
 gpioObj3out.gpio = gpioInit(25, 'out');
 GPIOs.push(gpioObj3out);
 
 let gpioObj1in = new Object();
 gpioObj1in.pin = 26;
 gpioObj1in.gpio = gpioInit(26, 'in');
 GPIOs.push(gpioObj1in);

 let gpioObj2in = new Object();
 gpioObj2in.pin = 19;
 gpioObj2in.gpio = gpioInit(19, 'in');
 GPIOs.push(gpioObj2in);

 let gpioObj3in = new Object();
 gpioObj3in.pin = 13;
 gpioObj3in.gpio = gpioInit(13, 'in');
 GPIOs.push(gpioObj3in);
}


process.on('SIGINT', unexportOnClose); // function to run when user closes with ctrl+c
process.on('SIGTERM', unexportOnClose); // function to run when process gets TERM signal

