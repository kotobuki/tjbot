/*
 * References
 * https://beebotte.com/docs/mqtt#example
 * https://github.com/mqttjs/MQTT.js/
 */
var TJBot = require('tjbot');
var config = require('./config');

// obtain our credentials from config.js
var credentials = config.credentials;

// obtain user-specific config
var WORKSPACEID = config.conversationWorkspaceId;

// these are the hardware capabilities that TJ needs for this recipe
var hardware = ['microphone', 'speaker'];

// set up TJBot's configuration
var tjConfig = {
  log: {
    level: 'verbose'
  },
  listen: {
    microphoneDeviceId: 'plughw:1,0',
    inactivityTimeout: -1, // -1 to never timeout or break the connection. Set this to a value in seconds
    language: 'en-US' // see TJBot.prototype.languages.listen 
  },
  robot: {
    gender: 'female',
    name: ''
  }
};

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

// Instantiate our TJBot!
var tj = new TJBot(hardware, tjConfig, credentials);

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

    // Let the TJBot speak the message received
    var parsedMessage = JSON.parse(message.toString());
    tj.speak(parsedMessage['data']);
  });

  // Subscribe to the topic (i.e. channel and resource)
  mqttClient.subscribe('ifttt/action');
});