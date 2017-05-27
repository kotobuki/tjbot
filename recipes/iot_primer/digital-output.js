var five = require('johnny-five');
var board = new five.Board();

board.on('ready', function() {
  var inputPin = new five.Pin({
    pin: 2,
    mode: five.Pin.INPUT
  });

  var outputPin = new five.Pin({
    pin: 3,
    mode: five.Pin.OUTPUT
  });

  inputPin.on('high', function() {
    outputPin.high();
  });

  inputPin.on('low', function() {
    outputPin.low();
  });
});