/*
 * Circuit
 * A0: Light sensor
 * D2: Button
 * D3: LED
 * D5: Servo
 */

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
  }
};

var five = require('johnny-five');
var board = new five.Board();

var buttonState = 0;
var led;

var lowThreshold = 200;
var highThreshold = 800;

// Constant representing states
var STATE = { 'UNKNOWN': -1, 'LOW': 0, 'HIGH': 1 };

// Initialize the variable representing the previous state of the sensor
var previousState = STATE.UNKNOWN;

// instantiate our TJBot!
var tj = new TJBot(hardware, tjConfig, credentials);

// create a context variable to remember where we are in the conversation tree
var context = {};

board.on('ready', function() {
  var button = new five.Button(2);
  led = new five.Led(3);
  var sensor = new five.Sensor('A0');
  var servo = new five.Servo(5);

  // Create a new `animation` instance.
  var animation = new five.Animation(servo);

  button.on('press', function() {
    console.log('pressed');
    buttonState = 1;
  });

  button.on('release', function() {
    console.log('released');
    buttonState = 0;
  });

  sensor.on('change', function(value) {
    console.log(value);

    // Take over the previous state
    var state = previousState;

    // Compare the sensor value with two threshold values
    if (value < lowThreshold) {
      // If smaller than the lower threshold value, update the state
      state = STATE.LOW;
    } else if (value > highThreshold) {
      // If larger than the lower threshold value, update the state
      state = STATE.HIGH;
    }

    var message = '';

    // Detect edges
    if (previousState !== STATE.HIGH && state === STATE.HIGH) {
      console.log('on rising edge');
      message = 'It got brighter';
    } else if (previousState !== STATE.LOW && state === STATE.LOW) {
      console.log('on falling edge');
      message = 'It got dark';
    }

    if (message !== '') {
      // console.log('MESSAGE: ' + message);
      var context = {};

      var turn = {
        workspace_id: WORKSPACEID,
        input: {
          'text': message.toLowerCase(),
          'button': buttonState
        },
        context: context
      };
      console.log(turn);

      // send to the conversation service
      tj._conversation.message(turn, function(err, response) {
        console.log(response.output);
        tj.speak(response.output.text.join(' ').trim());

        // Control according to the 'action' specified in the Dialog editor
        if (response.output.action === 'led_on') {
          led.fadeIn();
        } else if (response.output.action === 'led_off') {
          led.fadeOut();
        }

        // Control according to the 'servoaction' specified in the Dialog editor
        if (response.output.servoaction === 'move_fast') {
          animation.enqueue({
            cuePoints: [0, 0.25, 0.75, 1],
            keyFrames: [{ value: 90 }, { value: 180 }, { value: 0 }, { value: 90 }],
            duration: 1000
          });
        } else if (response.output.servoaction === 'move_slow') {
          animation.enqueue({
            cuePoints: [0, 0.25, 0.75, 1],
            keyFrames: [{ value: 90 }, { value: 180, easing: 'inQuad' }, { value: 0, easing: 'outQuad' }, { value: 90 }],
            duration: 3000
          });
        }
      });
    }

    // Set the current state as the previous state
    previousState = state;
  });
});

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
      if (response.output.action === 'led_on') {
        led.fadeIn();
      } else if (response.output.action === 'led_off') {
        led.fadeOut();
      }
    });
  }
});