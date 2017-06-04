var TJBot = require('tjbot');
var config = require('./config');

// obtain our credentials from config.js
var credentials = config.credentials;

// obtain user-specific config
var WORKSPACEID = config.conversationWorkspaceId;

// these are the hardware capabilities that TJ needs for this recipe
var hardware = ['microphone', 'speaker'];

// set up TJBot's configuration
var tjConfig = {
  log: {
    level: 'verbose'
  },
  listen: {
    microphoneDeviceId: 'plughw:1,0',
    inactivityTimeout: -1, // -1 to never timeout or break the connection. Set this to a value in seconds
    language: 'en-US' // see TJBot.prototype.languages.listen 
  },
  robot: {
    gender: 'male',
    name: ''
  }, 
  speak:{
    language: 'en-US'
  }
};

var five = require('johnny-five');
var board = new five.Board();

var buttonState = 0;
var led;

board.on('ready', function() {
  var button = new five.Button(2);
  led = new five.Led(3);

  button.on('press', function() {
    console.log('pressed');
    buttonState = 1;
  });

  button.on('release', function() {
    console.log('released');
    buttonState = 0;
  });
});

// instantiate our TJBot!
var tj = new TJBot(hardware, tjConfig, credentials);

// create a conext variable to remember where we are in the conversation tree
var context = {};
// listen for utterances with our attentionWord and send the result to
// the Conversation service
tj.listen(function(msg) {
  // check to see if they are talking to TJBot
  if (msg.startsWith(tj.configuration.robot.name)) {
    // remove our name from the message
    var turn = {
      workspace_id: WORKSPACEID,
      input: {
        'text': msg.toLowerCase().replace(tj.configuration.robot.name.toLowerCase(), ''),
        'button': buttonState
      }, 
      context: context
    };

    // send to the conversation service
    tj._conversation.message(turn, function(err, response) {
      console.log(response.output);
      context = response.context;
      tj.speak(response.output.text.join(' ').trim());

      // Control according to the 'action' specified in the Dialog editor
      if (response.output.action === 'light_on') {
        led.fadeIn();
      } else if (response.output.action === 'light_off') {
        led.fadeOut();
      }
    });
  }
});
