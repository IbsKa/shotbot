var ROSLIB = require('roslib')

console.log('hello world')

let myROS = new ROSLIB.Ros({
    url: 'ws://192.168.55.238:9090'
});

myROS.on('connection', function() {
    console.log('connection established')
});
myROS.on('error', function(err) {
    console.log('error', err)
});

var listener = new ROSLIB.Topic({
  ros : myROS,
  name : '/shotbot_gotoTarget',
  messageType : 'std_msgs/String'
});
listener.subscribe(function(message) {
  console.log('Received message on ' + listener.name + ': ' + message.data);
});


console.log('good')

