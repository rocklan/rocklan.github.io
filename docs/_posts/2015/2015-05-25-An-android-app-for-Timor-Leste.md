---
date: 2015-05-25
category: technical
readtime: true
---
For the past couple of weeks I have been developing a mobile app for <a target="_blank"  href="http://www.livrutimor.org/">Livru Timor</a> in association with <a target="_blank"  href="http://www.rhokaustralia.org">Rhok Australia</a>.  
<br /><br />
The basic problem that we are trying to solve is translating some <a target="_blank"  href="http://www.livrutimor.org/books/">childrens books</a> into a bunch of <a href="http://www.livrutimor.org/languages/" target="_blank"> different languages</a>. Sounds simple right? Well the main issue is that <b>we don't really know what these languages are</b>! We don't know what a lot of their words are, and we don't really know where they are spoken. In 2015.
<br /><br />
So why don't we have a simple android app where you can go to a local village and ask a bunch of people what their words are for things? We could even record them saying their words. Then we could collate the data and send it back to a server in Melbourne and figure it all out... and translate a bunch of these childrens books to their native languages and the kids will have a <b>much higher</b> chance of learning how to read and write! Cool huh?
<br /><br />
Oh and BTW, the android phones that they have in Timor Leste are basic. <b>Very</b> basic. Most of them don't even have data. You need to be able to store all of that information offline, and then at some stage be able to upload it to a server once we've on a (somewhat) more reliable wifi network :)
<br /><br />
So here's the prototype that I've been working on. When the app starts up you are taken to the home screen:
<br /><br />
<img src="/pics/1.home.png" class="img-responsive" />
<br /><br /><br />
Adding a person looks like this:
<br /><br /><br />
<img src="/pics/2.addperson.png" class="img-responsive" />
<br /><br /><br />
Once you've done that, you can start asking them "So what do you call this?"
<br /><br /><br />
<img src="/pics/3.capture.png" class="img-responsive" />
<br /><br /><br />
And then you can upload your data:
<br /><br /><br />
<img src="/pics/4.upload.png" class="img-responsive" />
<br /><br /><br />

The data is uploaded to a server where it can be analysed by the linguistic geeks. Pretty cool huh!
<br /><br />
The android app is written in Java - the code is public and available <a href="https://github.com/clockwisemusic/LanguageRecorder">on github</a>. It uses the phone's microphone to record audio, an SQLite database to store all of the data, and uses HTTP POST's to send the data (JSON) to the server. 
<br /><br />
I've been using Android Studio to develop the app, and let me say, I'm impressed. The Android documentation is <b>superb</b>, with mountains of tutorials and sample code. It's <b>really, really good</b>. I hadn't written an android app before and I've got something super useful up and running very quickly. True, the emulator is pretty slow, but hey, you can't have everything. <br /><br />
In a few weeks time we plan to trial it out on the ground, so stay tuned :)
<p><b>Update</b> - the application has <a href="/2015/12/update-for-android-app-for-east-timor">had a reskin</a>. It looks great now! Thank goodness for designers :)</p>