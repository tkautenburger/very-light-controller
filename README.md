# very-light-controller

This is a sample node.js app to control a light switch per REST on the raspberry GPIO. Calls are:

````sh
$ curl http://<host>:<nodeport>/<room>/lightStatus
$ curl http://<host>:<nodeport>/<room>/lightOn
$ curl http://<host>:<nodeport>/<room>/lightOff

