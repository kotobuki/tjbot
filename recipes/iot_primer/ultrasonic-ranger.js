var five = require('johnny-five');
var board = new five.Board();

board.on('ready', function() {
  var proximity = new five.Proximity({
    controller: 'HCSR04',
    pin: 6
  });

  proximity.on('data', function() {
    console.log([this.cm + ' cm', this.in + ' in']);
  });
});