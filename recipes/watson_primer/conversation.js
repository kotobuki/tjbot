/**
 * Copyright 2016 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
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

console.log("You can ask me to introduce myself or tell you a joke.");
console.log("Try saying, \"" + tj.configuration.robot.name + ", please introduce yourself\" or \"" + tj.configuration.robot.name + ", who are you?\"");
console.log("You can also say, \"" + tj.configuration.robot.name + ", tell me a joke!\"");

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
        }
      };

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
      });
    }
});
