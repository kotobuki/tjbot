var five = require('johnny-five');
var board = new five.Board();

board.on('ready', function() {
  var sensor = new five.Sensor('A0');
  var led = new five.Led(3);

  sensor.on('change', function(value) {
    console.log(value + ' => ' + this.scaleTo(0, 255));
    led.brightness(this.scaleTo(0, 255));
  });
});