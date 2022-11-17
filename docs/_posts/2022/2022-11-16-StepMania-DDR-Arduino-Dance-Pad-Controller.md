---
date:   2022-11-16
category: technical
tags: ddr wii stepmania arduino dance pad mat
title: StepMania/DDR Arduino Dance Pad Controller
cover-img: /images/ddr-pad-2.jpg
thumbnail-img: /images/ddr-pad-2-small.jpg
readtime: false
hidden: false
share-description: How I built an arduino based controller for my DDR dance pad
excerpt: Building an Arduino based USB controller for a DDR/StepMania dance pad. How hard can it be?
---

So for the past few months I've been getting into DDR on the Wii. It's great fun and I'm getting pretty good, and what I really need now is to be able to slow down the game to practice some of the faster, trickier sections. But... the game doesn't support that.

Fortunately [StepMania](https://www.stepmania.com/) does, but it only runs on a PC, so to be able to play it there, I need a dance pad that I can plug in via USB.

Unfortunately in Australia they are crazy expensive. **The** one to get is the [L-TEK hard pad](https://www.maty-taneczne.pl/shop/dance-mat-ltek-ex-pro-2/) from Poland. However that will cost me like $550. 

Luckily, I found the [DDR A Game](https://www.ddrgame.com/dance-dance-revolution-pc-energy-metal-stepmania.html) pad on marketplace:

![Stepmania dance pad](/images/ddr-pad-2.jpg){:class="img-responsive"}

While it looks cool - these particular pads don't have the best reviews. Apparently they aren't made particularly well.. but hey, how hard can it be to improve? I also had no idea if it worked, but really... it's just a bunch of buttons. So I bought it.

The connector at the top of the pad is a "VGA" port (technically a [DE-15 d-sub](https://en.wikipedia.org/wiki/D-subminiature), and it seems like you can buy different connectors for it so that you can plug your pad into a PC, or a PS-2, or a wii, etc. So yeah, I could just [buy the right one online](https://www.ddrgame.com/dance-dance-revolution-control-box-4-in-1-blue.html), but where's the fun in that? Maybe I can build one myself using an Arduino and have lots of fun in the process? 

After a bit of poking around the VGA connector with a multimeter, I found that the middle pin is the ground, and the pads are just simple switches hooked up to individual pins. So all I needed was to connect it up to an Arduino and make it simulate a keyboard. 

Here's my first attempt, I bought a male VGA plug, soldered up the connectors and plugged them into an Arduino Uno:

![Arduino Uno dance pad controller](/images/ddr-pad-1.jpg){:class="img-responsive"}

And then I programmed it to light up the onboard LED whenever a button is pressed:

<div class='embed-container'><iframe src='https://www.youtube.com/embed/cRqkQR6YpxA' frameborder='0' allowfullscreen></iframe></div>

Woo! All the pads/buttons seem to work ok! 

All I need now is to emulate a USB keyboard from the Arduino... but it turns out that an Arduino Uno can't emulate a USB device, what I needed was an [Arduino Leonardo](https://docs.arduino.cc/hardware/leonardo). So I bought one of them, wired it up:

![Arduino Leonardo dance pad controller](/images/ddr-pad-3.jpg){:class="img-responsive"}

And wrote some code to emulate keyboard presses:

```c++
#include "Keyboard.h"

// the number of the onboard LED pin
const int ledPin = 13;    

// these are the inputs on the arduino that we expect the pads to be wired into
int buttonPin[6]        = {2, 4, 6, 8, 10, 12};

// current button states
int buttonState[6]      = {1, 1, 1, 1, 1, 1};

// previous button states
int prevButtonState[6]  = {1, 1, 1, 1, 1, 1};

// these are the keys that are simulated by the keypad
int keyboardButtons[6]  = {KEY_RIGHT_ARROW, KEY_DOWN_ARROW, KEY_UP_ARROW, KEY_PAGE_DOWN, KEY_PAGE_UP, KEY_LEFT_ARROW};

// flag indicating that at least one button is pressed, if true, we light up the onboard LED
bool buttonPressed;

void setup() {

  // initialize the onboard LED pin as an output  
  pinMode(ledPin, OUTPUT);                  
  
  // initialize the 6 inputs as pullup inputs
  for (int i=0;i<6;i++) {
    pinMode(buttonPin[i], INPUT_PULLUP); 
  }

  // Initialise keyboard
  Keyboard.begin();
}

void loop() {

  buttonPressed = false;

  // read the state of the input buttons
  for (int i=0;i<6;i++) {

    buttonState[i] = digitalRead(buttonPin[i]);

    if (buttonState[i] == LOW)
    {
      digitalWrite(ledPin, HIGH);  // turn led on
      buttonPressed = true;
    }

    // If a button has changed state and it's pressed
    if (buttonState[i] != prevButtonState[i] && buttonState[i] == LOW)
    {
        Keyboard.press(keyboardButtons[i]);
        prevButtonState[i] = buttonState[i];
    }

    // If a button has changed state and it's released
    if (buttonState[i] != prevButtonState[i] && buttonState[i] == HIGH)
    {
        Keyboard.release(keyboardButtons[i]);
        prevButtonState[i] = buttonState[i];
    }
  }

  // If none of the buttons are pressed, turn off the LED
  if (!buttonPressed)
  {
    digitalWrite(ledPin, LOW);
  }
}

```

And it worked! 

<div class='embed-container'><iframe src='https://www.youtube.com/embed/IZYFiDaa7q4' frameborder='0' allowfullscreen></iframe></div>

Here's a link to the code in github if anyone needs it: [https://github.com/rocklan/ddr-dance-pad](https://github.com/rocklan/ddr-dance-pad).

So what's the moral of the story? Building stuff yourself is fun. Don't be afraid to try!

