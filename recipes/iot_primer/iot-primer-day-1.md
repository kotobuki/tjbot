# IoT Primer: Day 1

## Materials

* Raspberry Pi 3 Model B: 1
* microSD card with [Raspbian Jessie with PIXEL (version: April 2017)](https://www.raspberrypi.org/downloads/raspbian/): 1
* USB power supply: 1
* USB cable (A to microB): 1
* USB microphone (e.g. [Mini USB Microphone](https://www.adafruit.com/product/3367)): 1
* Speaker: 1
* Arduino Uno: 1
* USB cable (A to B): 1
* [Grove - Base Shield V2](https://www.seeedstudio.com/Base-Shield-V2-p-1378.html): 1
* [Grove - Red LED](https://www.seeedstudio.com/Grove-Red-LED-p-1142.html): 1
* [Grove - Green LED](https://www.seeedstudio.com/Grove---Green-LED-p-1144.html): 1
* [Grove - Button (P)](https://www.seeedstudio.com/grove-buttonp-p-1243.html): 1
* [Grove - Touch Sensor](https://www.seeedstudio.com/grove-touch-sensor-p-747.html): 1
* [Grove - Rotary Angle Sensor (P)](https://www.seeedstudio.com/Grove-Rotary-Angle-Sensor%28P%29-p-1242.html): 1
* [Grove - PIR Motion Sensor](https://www.seeedstudio.com/grove-pir-motion-sensor-p-802.html): 1
* [Grove - Servo](https://www.seeedstudio.com/Grove-Servo-p-1241.html): 1
* [Grove - Temperature&Humidity Sensor (High-Accuracy & Mini)](https://www.seeedstudio.com/Grove-TemperatureHumidity-Sensor-HighAccuracy-Mini-p-1921.html): 1


## Preparations

### Examples

If you have not downloaded it yet, download the sample on Raspberry Pi as follows and install the necessary libraries (installation of the libraries takes several minutes).

```sh
$ cd ~/Desktop/
$ git clone -b scs2017 https://github.com/kotobuki/tjbot.git
$ cd tjbot/recipes/iot_primer/
$ npm install
```

If it has already been downloaded, you can update to the latest version by doing as follows.

```sh
$ cd ~/Desktop/tjbot/recipes/iot_primer/
$ git pull
```

### Upload Firmware to Your Arduino Board

First, connect an Arduino board to a Raspberry Pi with a USB cable, and run `interchange` in interactive mode on the Raspberry Pi.

```sh
$ interchange install --interactive
```

Next, choose `StandardFirmata` in response to `Choose a firmware` [^hc-sr04].

[^hc-sr04]: `StandardFirmata` is a firmware to be used with most sensors/actuators. Choose `hc-sr04` (a.k.a. PingFirmata) if you want to use a Ultrasonic Ranger

```sh
? Choose a firmware 
  node-pixel 
  hc-sr04 
❯ StandardFirmata
```

Next, choose `uno` (i.e. Arduino Uno) in response to `Choose a board`

```sh
? Choose a firmware StandardFirmata
? Choose a board 
❯ uno 
  nano 
  pro-mini
```

Next, choose a proper serial port (e.g. `/dev/ttyACM0`) in response to `Choose a port`

```sh
? Choose a firmware StandardFirmata
? Choose a board uno
? Choose a port (Use arrow keys)
❯ /dev/ttyACM0 
  /dev/ttyAMA0 
```

Finally, press enter to execute. After waiting for a while, the firmware writing is completed.

```sh
? Choose a firmware StandardFirmata
? Choose a board uno
? Choose a port /dev/ttyACM0
Retrieving manifest data from GitHub
Downloading hex file
connected
reset complete.
flashing, please wait...
flash complete.
```

Congratulations! You are now ready to use the Arduino board from the Raspberry Pi.


## Hands-On

### Digital Input

Digital input takes either 0 (low) or 1 (high) value.

#### Circuit

* D2: Grove - Button (P)

#### Code

The following code can capture the moment when the specified digital input changes.

`digital-input.js`

```js
var five = require('johnny-five');
var board = new five.Board();

board.on('ready', function() {
  var pin = new five.Pin({
    pin: 2,
    mode: five.Pin.INPUT
  });

  pin.on('high', function() {
    console.log('high (pressed)');
  });

  pin.on('low', function() {
    console.log('low (released)');
  });
});
```

By utilizing various [component classes](http://johnny-five.io/api/) provided by Johnny-Five, you can write more human-readable code (`button.js`). In this case, by using the [Button](http://johnny-five.io/api/button/) class, you can express it by `press` or `release`, not `high` or `low` representing the electrical condition.

`button.js`

```js
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
```

#### Note

When plugging / unplugging Grove modules, disconnect the USB cable of the Arduino board. After changing the circuit, insert the USB cable into the Arduino board again.


### Digital Output

Digital output takes either 0 (low) or 1 (high) value.

#### Circuit

* D2: Grove - Button (P)
* D3: Grove - Red LED

#### Code

`digital-output.js`

```js
var five = require('johnny-five');
var board = new five.Board();

board.on('ready', function() {
  var inputPin = new five.Pin({
    pin: 2,
    mode: five.Pin.INPUT
  });

  var outputPin = new five.Pin({
    pin: 3,
    mode: five.Pin.OUTPUT
  });

  inputPin.on('high', function() {
    outputPin.high();
  });

  inputPin.on('low', function() {
    outputPin.low();
  });
});
```

More specific classes are also available for digital output, as in Button for Pin in the case of digital input. In this case, you can write code that is more human readable by using LED instead of Pin.

`button-led.js`

```js
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
```

Since the LED class has more advanced functions, expressions accompanied with changes on the time axis, such as blinking, fading in and out repeatedly, can be described with extremely short codes.

`button-led-blink.js`

```js
var five = require('johnny-five');
var board = new five.Board();

board.on('ready', function() {
  var button = new five.Button(2);
  var led = new five.Led(3);

  button.on('press', function() {
    led.blink(500);
  });

  button.on('release', function() {
    led.stop().off();
  });
});
```

#### Try

* Replace `blink()` with [other methods](http://johnny-five.io/api/led/#api) of `Led` such as `pulse()`, `fadeIn()`, `fadeOut()` and so on.
* Replace the button with a [Grove - Touch Sensor](https://www.seeedstudio.com/grove-touch-sensor-p-747.html).

### Analog Input

Analog input takes values ​​of 1024 steps from 0 to 1023.

#### Circuit

* A0: Grove - Rotary Angle Sensor (P)

#### Code

This method is common to all sensors that output results due to voltage change, such as potentiometer, analog photosensor, analog temperature sensor.

`analog-input.js`

```js
var five = require('johnny-five');
var board = new five.Board();

board.on('ready', function() {
  var sensor = new five.Sensor('A0');

  sensor.on('change', function(value) {
    console.log(value);
  });
});
```

By combining with the LED in the following way, the brightness of the LED can be continuously changed. The reason why the `scaleTo` method is used here is that the range of the value of the analog input is 0 to 1023, whereas the range of the brightness of the LED is 0 to 255.

`sensor-led.js`

```js
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
```

With the idea of ​​threshold, you can capture the moment when the value of the sensor changes. For example, this can be used when measuring the brightness of ambient light with a light sensor (e.g. [Grove - Light Sensor (P) v1.1](https://www.seeedstudio.com/Grove-Light-Sensor-%28P%29-v1.1-p-2693.html)) and doing something according to the brightness. To implement this, set two thresholds (low and high), compare the current value with the two thresholds, determine the current state, and execute the process when it changes from the previous state .

`threshold.js`

```js
var five = require('johnny-five');
var board = new five.Board();

var lowThreshold = 200;
var highThreshold = 800;

// Constant representing states
var STATE = { 'UNKNOWN': -1, 'LOW': 0, 'HIGH': 1 };

// Initialize the variable representing the previous state of the sensor
var previousState = STATE.UNKNOWN;

board.on('ready', function() {
  var sensor = new five.Sensor('A0');

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

    // Detect edges
    if (previousState !== STATE.HIGH && state === STATE.HIGH) {
      console.log('on rising edge');
    } else if (previousState !== STATE.LOW && state === STATE.LOW) {
      console.log('on falling edge');
    }

    // Set the current state as the previous state
    previousState = state;
  });
});
```

#### Try

* Make a sample that turns on when the ambient light gets dark and turns off when it glows bright

### PIR Motion Sensor

#### Circuit

* D4: [Grove - PIR Motion Sensor](https://www.seeedstudio.com/grove-pir-motion-sensor-p-802.html)

#### Code

`pir-motion-sensor.js`

```js
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
```

Note: The module can also be set as retriggerable or un-retriggerable by changing the jumper hat. In this sample, it is assumed that the module is set to "retriggerable" which is the factory condition (it triggers again even if a certain period of time has not elapsed since last trigger).

### Servo

#### Circuit

* A0: [Grove - Rotary Angle Sensor (P)](https://www.seeedstudio.com/Grove-Rotary-Angle-Sensor%28P%29-p-1242.html)
* D5: [Grove - Servo](https://www.seeedstudio.com/Grove-Servo-p-1241.html)

#### Code

`sensor-servo.js`

```js
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
```

#### Try

* Try adding an animation to the servo with reference to [the API document](http://johnny-five.io/api/animation/)

### Ultrasonic Ranger Sensor

#### Circuit

* D6: [Grove - Ultrasonic Ranger](https://www.seeedstudio.com/grove-ultrasonic-ranger-p-960.html)

#### Firmware

To use an ultrasonic ranger sensor, write the dedicated firmware to the Arduino board using `interchange` as follows.

```sh
$ interchange install --interactive
? Choose a firmware hc-sr04
? Install firmata version? Yes
? Firmata name [optional] 
? Choose a board uno
? Choose a port /dev/ttyACM0
Installing hc-sr04 from npm
...
flashing, please wait...
flash complete.
```

#### Code

`ultrasonic-ranger.js`

```js
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
```

#### Note

To use other sensors and actuators, use `interchange` again to write normal firmware to the Arduino board.

```sh
$ interchange install --interactive
? Choose a firmware StandardFirmata
? Choose a board uno
? Choose a port /dev/ttyACM0
Retrieving manifest data from GitHub
Downloading hex file
connected
reset complete.
flashing, please wait...
flash complete.
```

### Combine with Watson Conversation

Here, let the sensor 'speak' on behalf of humans.

#### Circuit

* A0: Grove - Light Sensor (P)
* D2: Grove - Button (P)
* D3: Grove - Red LED

#### Watson Conversation

Open the Watson Conversation Editor and add phrases the sensor speaks to the two intents of `#Turn On LED` and `#Turn Off LED`. For example, if the sensor will speak "It got brighter" when it gets brighter, add this phrase to the `#Turn On LED` intent.

#### Code (Excerpt)

`conversation-with-light-sensor.js`

```js
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

board.on('ready', function() {
  var button = new five.Button(2);
  led = new five.Led(3);
  var sensor = new five.Sensor('A0');

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
      });
    }

    // Set the current state as the previous state
    previousState = state;
  });
});
```

## References

* [Johnny-Five](http://johnny-five.io/)
* [nodebots-interchange](https://github.com/johnny-five-io/nodebots-interchange)
* [Airbnb JavaScript Style Guide() {};](https://github.com/airbnb/javascript)
