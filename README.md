# very-light-controller

This is a sample node.js app to control a light switch per REST on the raspberry GPIO. Calls are:

````sh
$ curl http://<host>:<nodeport>/light/lightStatus
$ curl http://<host>:<nodeport>/light/lightOn
$ curl http://<host>:<nodeport>/light/lightOff

