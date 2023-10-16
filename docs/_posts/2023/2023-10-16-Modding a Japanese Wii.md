---
date: 2023-10-16
category: technical
tags: wii modding jailbreaking
title: Jailbreaking a Japanese wii
cover-img: /pics/amp/amp-1.jpg
thumbnail-img: /images/amp-1-small.jpg
readtime: true
hidden: true
share-description: How to mod a Japanese wii that is semi-bricked
---

So modding this Japanese wii has been an adventure.

    
Can't use the normal exploit that I've used in the past which is named "LetterBomb", because you need to know the MAC address of the wii, and I can't open the settings menu on the wii. Not sure exactly why but I am guessing someone modded it in the past and stuffed it up
Can't use the "str2hax" exploit because you have to change the DNS server, and I can't get into settings

I then tried using "BlueBomb", which exploits a vulnerability in the bluetooth driver, and you can only run it from linux, it would connect via bluetooth but the exploit would hang. No dice.

The only exploit left to run is an "old school" saved game exploit. You load a hacked saved game onto an SD card, copy it to your wii, run the game and load the saved game. They exist for a few games, none of which I own. 

One of the games is "Lego Batman", someone in Bayswater is selling it for $5. I buy it. Take it home, runs on the wii fine. Great. Copy the hacked save came onto an SD card, put it into the wii... and the wii doesn't recognise my SD card. It doesn't want to read ANY of my (5) SD cards. I find out it needs to be an original "SD Card", not a "sdxc" or a "sdhc" card.

Find out a friend has an ancient SD card that should work. Meet up with him, take it home, it doesn't work.

Find out my friend wiped it on a linux machine and didn't create a partition on it. Boot linux, re-format SD card, create a partition, I can read it!

Copy hacked saved game onto SD card, put into wii, it appears! Copied save game file onto the wii.

Run Batman Lego. Saved game doesn't appear.

After MUCH faffing and different attempts, it appears you need to do it in the following specific order:
Play the first stage of lego batman (I've done it 3 times now) and compete it until it creates a saved game on the wii
Copy this save game file onto your SD card (this sort of 'initialises' the SD card, not sure what it does)

Delete the save game file off the wii

Copy the hacked saved game onto the SD card

Copy the hacked saved game file from the SD card onto the wii

The save game now appears inside Lego Batman!!

Load the save game, do the exploit, and the exploit started up! Hooray! Here's how it looks:

<div class='embed-container'><iframe src='https://www.youtube.com/embed/2ggyx7_5wPc' frameborder='0' allowfullscreen></iframe></div>

But oh no! The Exploit then hung! It turns out it doesn't work on wii's that haven't been upgraded to the latest firmware!

So that's where I am right now. Apparently I can use a different program to upgrade the firmware to the latest version but there's a danger in bricking the wii. Oh well, I'm going to try it anyway.

Trying to fix the firmware installed on the wii manually, what could possibly go wrong

![Flashing firmware](/pics/wii/wii-fix-firmware.jpg){:class="img-responsive"}

Now let's see if I've bricked it:

![Maybe bricked?](/pics/wii/wii-maybe-bricked.jpg){:class="img-responsive"}

![Maybe bricked?](/pics/wii/hackmii.jpg){:class="img-responsive"}

![Menu version](/pics/wii/menu-version.jpg){:class="img-responsive"}



