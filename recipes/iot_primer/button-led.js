var five = require('johnny-five');
var board = new five.Board();

board.on('ready', function() {
  var button = new five.Button(2);
  var led = new five.Led(3);

  button.on('press', function() {
    led.on();
  });

  button.on('release', function() {
    led.off();
  });
});