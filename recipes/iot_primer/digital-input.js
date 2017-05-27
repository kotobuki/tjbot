var five = require('johnny-five');
var board = new five.Board();

board.on('ready', function() {
  var pin = new five.Pin({
    pin: 2,
    mode: five.Pin.INPUT
  });

  pin.on('high', function() {
    console.log('high (pressed)');
  });

  pin.on('low', function() {
    console.log('low (released)');
  });
});