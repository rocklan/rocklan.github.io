---
date: 2017-05-02
category: technical
readtime: true
---
<p>Like many other software developers I have a bunch of CI jobs that I need to monitor. If any of these jobs are failing I don't want to update my code and break everything. Recently I've been using an app named <a href="https://catlight.io/">Catlight</a>. It works great, it's simple, it looks nice:</p>

<img src-data="https://static.lachlanbarclay.net/pics/catlight1.png" class="img-responsive lazyload" />

<p>But the CPU and memory usage?? For just a simple app (all it does is poll a JSON service every minute and displays some basic stats) check out the memory usage:</p>

<img src-data="https://static.lachlanbarclay.net/pics/catlight2.png" class="img-responsive lazyload" />

<p>Yes, that's THREE processes running, and it's using, in total, 94 meg of memory!</p>

<p>Is this a problem? Perhaps not to you. Is it an affront to everything we believe in as software developers? Yes. </p>

<p>It's also worth noting that I'm running a <a href="http://www.dell.com/au/business/p/latitude-e6540-laptop/pd">Dell Latitude E6540</a>, which is a great laptop, but it has a <a href="http://en.community.dell.com/support-forums/laptop/f/3518/t/19523265">notorious fan problem</a>. If you tax the CPU a little bit for longer than a few seconds, the incredibly annoying fan kicks in, whirrs for a second and then stops. Then repeats. It drives you mental.</p>

<p>As a little exercise I wanted to see what would happen if I wrote the equivalent program in a boring Winforms c# app. I came up with this:</p>

<img src-data="https://static.lachlanbarclay.net/pics/jobmonitor1.png" class="img-responsive lazyload" />

<p>and the memory usage?</p>

<img src-data="https://static.lachlanbarclay.net/pics/jobmonitor2.png" class="img-responsive lazyload" />

<p>That's 8 meg of memory. Catlight uses literally more than 10 times this! And I wonder what's going on with the CPU?</p>

<img src-data="https://static.lachlanbarclay.net/pics/cpu1.png" class="img-responsive lazyload" />
<img src-data="https://static.lachlanbarclay.net/pics/cpu2.png" class="img-responsive lazyload" />

<p>Is this a fair comparison? It is surprising that a native app performs better than an electron app? Of course not. But TEN TIMES worse? Seriously? What the hell is it doing? It's literally displaying a few rows of text and doing a HTTP request every 60 seconds. It's doing nothing. This is ridiculous. </p> 

<p>What on earth is going on in Electron? It might be great for writing cross platform apps.. but does it completely suck in terms of performance? I'll let you figure that one out. Is there a better way? There must be. This is not good enough.</p>