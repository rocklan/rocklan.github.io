---
date: 2016-04-19
category: technical
readtime: true
cover-img: /pics/amplifire.png
tags: arduino nerdy midi
---
<p>A few years ago I bought this wonderful amplifier emulator:</p>
<img src="/pics/amplifire.png" class="img-responsive" alt="amplifier box" />
<p>This is a great unit for plugging your guitar directly into a PA and emulating the sound of modern guitar amplifiers. There's just one problem... it only has 3 buttons on the front!</p>

<p>What I'd love is some more buttons. Fortunately this unit has a MIDI "in" plug. I could always buy a device like <a href="http://www.peak2005.com/j/index.php?id_product=8&controller=product">this one</a>... but where's the fun in that? I wonder if it would be possible to build my own?</p>

<p>So, I bought a <a href="http://www.ebay.com.au/itm/UNO-R3-Board-Ultimate-kit-MEGA328P-ATMEGA16U2-Arduino-Compatible-Melbourne-stock-/321904025393">simple arduino kit</a> and started trying to piece something together. What I wanted to build was a device that has two buttons, one for patch change "next" and one for patch change "previous", and another that displays the current patch number in a 7-segment display. Fortunately I've done a little bit of electronics in my life, so I managed to build a prototype: </p>

<img src="/pics/MidiPatchChangerSchematic.png" class="img-responsive" />

<p>The code is written in some <a href="https://en.wikipedia.org/wiki/Processing_(programming_language)">weird variant of c named 'processing'</a>, and I've put up my <a href="https://github.com/rocklan/arduino-midi">code on github</a>. So here's the first attempt at hooking it up to my old POD HD500 pedal:</p>
<br />
<div class="embed-responsive embed-responsive-4by3">
<iframe style="float: none" width="560" height="315" src="https://www.youtube.com/embed/vmITE4vUF9s" frameborder="0" allowfullscreen></iframe>
</div>
<br />
<p>Miracle of miracles, it works! The next step is to mount it in a box. After a bit of stuffing around I decided to not use the 7-segment display as it really wasn't necessary (and too difficult to mount inside the box given my primitive tooks :). Here it is hooked up to the amplifire:</p>
<br />
<div class="embed-responsive embed-responsive-4by3">
<iframe width="560" height="315" src="https://www.youtube.com/embed/bM6wImlt-rQ" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>
<br />
<p>I mounted a little on/off switch on top of the box so that the battery isn't wasted, and I added a red LED so you could tell when the device was turned on. I also forgot to add a resistor to the power-on LED so it shines a bit too brightly :) But apart from that, it works great! I've since used it for a few gigs.</p>

<p><b>Update</b> - A few years later I stumbled across Dylan Beattie's <a href="https://dylanbeattie.net/2020/05/17/turning-a-raspberry-pi-zero-into-a-usb-footpedal.html">Piedriot</a>, who tackled a related problem of wanting to build a footswitcher for his PC. He ended up going down the raspberry pi + USB route. His metal casing is awesome - I just stuck with a plastic box as I don't have the tools to work with steel.. but boy is that tempting! </p>