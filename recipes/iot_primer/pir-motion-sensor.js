var five = require('johnny-five');
var board = new five.Board();

board.on('ready', function() {
  var motion = new five.Motion(4);

  motion.on('calibrated', function() {
    console.log('calibrated', Date.now());
  });

  motion.on('motionstart', function() {
    console.log('motion start', Date.now());
  });

  motion.on('motionend', function() {
    console.log('motion end', Date.now());
  });
});