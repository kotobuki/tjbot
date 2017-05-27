var five = require('johnny-five');
var board = new five.Board();

board.on('ready', function() {
  var sensor = new five.Sensor('A0');
  var servo = new five.Servo(5);

  sensor.on('change', function(value) {
    var angle = this.scaleTo(0, 180);
    console.log(value + ' => ' + angle);
    servo.to(angle);
  });
});