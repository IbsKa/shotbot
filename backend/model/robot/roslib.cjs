const ROSLIB = require('roslib')

exports.newRoslib = function (options) { return new ROSLIB.Ros(options) }
exports.newRoslibTopic = function (options) { return new ROSLIB.Topic(options) }
