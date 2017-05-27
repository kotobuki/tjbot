var five = require('johnny-five');
var board = new five.Board();

// A simplified HTTP client library
var request = require('request');

// The configuration file
var config = require('./config');

// Your key of the Maker Webhooks service (https://ifttt.com/maker_webhooks)
var key = config.makerWebhooksKey;

// Event
var event = 'ping';

board.on('ready', function() {
  var button = new five.Button(2);

  // If the button was pressed, send a request to trigger an event
  button.on('press', function() {
    console.log('pressed');

    // Optional: You can pass value1, value2, and value3 as query parameters or form variables
    var values = {
      'value1': '1',
      'value2': '2',
      'value3': '3'
    };

    // Send a request to the IFTTT server
    request.post({
      url: 'http://maker.ifttt.com/trigger/' + event + '/with/key/' + key,
      'content-type': 'application/json',
      body: JSON.stringify(values)
    }, function(error, response, body) {
      console.log('Body response: ', body);
      console.log('Error: ', error);
    });
  });
});