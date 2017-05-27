var five = require('johnny-five');
var board = new five.Board();

board.on('ready', function() {
  var button = new five.Button(2);

  button.on('press', function() {
    console.log('pressed');
  });

  button.on('release', function() {
    console.log('released');
  });
});