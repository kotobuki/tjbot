var five = require('johnny-five');
var board = new five.Board();

var lowThreshold = 200;
var highThreshold = 800;

// Constant representing states
var STATE = { 'UNKNOWN': -1, 'LOW': 0, 'HIGH': 1 };

// Initialize the variable representing the previous state of the sensor
var previousState = STATE.UNKNOWN;

board.on('ready', function() {
  var sensor = new five.Sensor('A0');

  sensor.on('change', function(value) {
    console.log(value);

    // Take over the previous state
    var state = previousState;

    // Compare the sensor value with two threshold values
    if (value < lowThreshold) {
      // If smaller than the lower threshold value, update the state
      state = STATE.LOW;
    } else if (value > highThreshold) {
      // If larger than the lower threshold value, update the state
      state = STATE.HIGH;
    }

    // Detect edges
    if (previousState !== STATE.HIGH && state === STATE.HIGH) {
      console.log('on rising edge');
    } else if (previousState !== STATE.LOW && state === STATE.LOW) {
      console.log('on falling edge');
    }

    // Set the current state as the previous state
    previousState = state;
  });
});