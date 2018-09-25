# very-light-controller

This is a sample node.js app to talk to the GPIO controller. Calls are:

```
$ curl http://<host>:<nodeport>/<room>/lightStatus
$ curl http://<host>:<nodeport>/<room>/lightOn
$ curl http://<host>:<nodeport>/<room>/lightOff
```

# gpio-controller

This is a sample node.js app to control a GPIO pin per REST on the raspberry GPIO. Calls are:

```
$ curl http://<host>:<port>/gpioInit?pin=<gpio number>&direction=<in|out>
$ curl http://<host>:<port>/gpioStatus?pin=<gpio number>
$ curl http://<host>:<port>/gpioHigh?pin=<gpio number>
$ curl http://<host>:<port>/gpioLow?pin=<gpio number>
```
