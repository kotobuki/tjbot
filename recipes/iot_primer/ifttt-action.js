/*
 * References
 * https://beebotte.com/docs/mqtt#example
 * https://github.com/mqttjs/MQTT.js/
 */

var five = require('johnny-five');
var board = new five.Board();

// A simplified HTTP client library
var request = require('request');

// The configuration file
var config = require('./config');

// The channel token for the channel at Beebotte
var channelToken = config.beebotteChannelToken;

// A client library for the MQTT protocol
var mqtt = require('mqtt');

board.on('ready', function() {
  var led = new five.Led(3);

  // An MQTT client to connect to the Beebotte server
  var mqttClient = mqtt.connect('mqtt://mqtt.beebotte.com',
    // Authenticate with your channel token
    { username: 'token:' + channelToken, password: '' }
  );

  // Handle messages from the Beebotte server
  mqttClient.on('message', function(topic, message) {
    console.log('topic: ' + topic);
    console.log('message: ' + message);

    // If the message is ping, blink the LED 3 times
    var parsedMessage = JSON.parse(message.toString());
    if (parsedMessage['data'] === 'ping') {
      var count = 0;
      led.blink(250, function() {
        count = count + 1;

        // on - off - on - off - on - off
        if (count >= 6) {
          led.stop();
        }
      });
    }
  });

  // Subscribe to the topic (i.e. channel and resource)
  mqttClient.subscribe('ifttt/action');
});