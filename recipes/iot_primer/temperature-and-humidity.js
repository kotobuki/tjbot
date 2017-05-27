var five = require('johnny-five');
var board = new five.Board();

board.on('ready', function() {
  var sensor = new five.Multi({
    controller: 'TH02'
  });

  sensor.on('change', function() {
      console.log([this.thermometer.celsius + ' ºC', this.hygrometer.relativeHumidity + ' %');
      });
  });
});