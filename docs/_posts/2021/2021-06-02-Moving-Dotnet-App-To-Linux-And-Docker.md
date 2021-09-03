---
date:   2021-06-02
category: technical
tags: dotnet docker linux c#
readtime: true
cover-img: /pics/moving-to-linux-7.png
---

<p>A few months back, I decided to convert an existing .NET core application to run on Linux. As part of this work, I decided to run it inside a Docker container, which meant I could have my application running on Linux without worrying about setting up all of the dependencies on the server like .NET runtime, Apache, etc.</p>

<p>Now I fully realise that Windows containers exist and that I could have tried to get them to work. But the aim for me wasn’t to run on Docker, it was to run on Linux. Docker just came in handy because it meant I didn’t need to install all dependencies onto my Linux server – I could just fire up Docker. </p>

<p>Now, much like communism, Docker is pretty great--in theory. Once the process begins, however, you quickly realise just how many worms are inside the can you’ve just opened. </p>

<p>But unlike communism, in the end, this worked! Here’s the output from my web application showing some server details. Notice any differences?</p>

<img data-src="/pics/moving-to-linux-0.png" alt="moving .NET application to linux 0" class="img-responsive lazyload" />

<p>So with that in mind, here's a list of issues that you should probably know about.</p>


<h3>Table Of Contents</h3>
<ul>
  <li><a href="#building-the-docker-image">Building the docker image</a>
    <ul>
      <li><a href="#image-layers-and-caching">Image Layers and caching</a></li>
    </ul>
  </li>
  <li><a href="#startup">Getting the app to start up</a>
    <ul><li><a href="#localhost">Localhost</a>	</li>
        <li><a href="#third-party-libs">Support for third party libraries</a></li>
        <li><a href="#windows-auth">Windows Authentication</a></li>
    </ul>
  </li>
  <li><a href="#runtime">Runtime Errors</a>
    <ul><li>
    <a href="#system-fonts">System fonts</a>	</li><li>
    <a href="#unspecified-culture">Unspecified Culture</a>	</li><li>
    <a href="#https-and-certs">HTTPS and Certificates</a>	</li><li>
    <a href="#timezones">Timezones</a></li><li>
    <a href="#network-share-paths">Network Share Paths</a>	</li><li>
    <a href="#case-sensitivity">Case sensitive URLs</a>	</li>
    </ul>
  </li>
  <li><a href="#misc">Other Things	</a>
    <ul><li>
    <a href="#disk-space">Disk Space</a>	</li><li>
    <a href="#automated-builds-and-deploys">Automated Builds and Deploys</a>	</li><li>
    <a href="#security">Security</a>	</li>
    </ul>
  </li>
  <li><a href="#the-aftermath">The Aftermath</a>	</li>
</ul>

<h2 id="building-the-docker-image">Building the Docker image</h2>

<h3 id="image-layers-and-caching">Image Layers and Caching</h3>

<p>The first step was to package my application up inside a Docker image. Microsoft has some great articles on how to do this, but they are the usual only-works-for-a-simple-demo examples. My application is a bit larger and has multiple project files--hardly novel and hardly new. Fortunately, a programmer named Tometchy has a great blog post on <a href="https://www.softwaredeveloper.blog/multi-project-dotnet-core-solution-in-docker-image">how to set this up</a>. After following his advice, I created my new Dockerfile and ran:</p>

<pre><code class="hljs">docker build src/myproject/Dockerfile</code></pre>

<p>... and it built! However... it was taking forever!</p>

<p>Unless you structure your Dockerfile in a very particular way, your NuGet package restores will always take forever to restore. Instead of using a local package cache, .NET will do a complete NuGet restore for every build. This means builds will take minutes instead of the usual seconds. So instead of doing this:</p>

<pre><code class="hljs">COPY . ./
Dotnet build
</code></pre>

<p>
You can take advantage of Docker’s layer caching like so:
</p>

<pre><code class="hljs">COPY src/myproject/myproject.csproj
COPY nuget.config ./nuget.config
RUN dotnet restore src/myproject/myproject.csproj \
    --configfile nuget.config \
    --packages packages
COPY . ./
RUN dotnet build
</code></pre>

<p>
This means that every new Docker build won’t do a full NuGet restore—that will only happen when you change your project file. This meant I could build my images in a few seconds. Now that it was working, it was time to run my application. </p>

<h3 id="startup">
Getting the app to start up</h3>

<h4 id="localhost">Localhost</h4>
<p>When running an app inside Docker, <code>localhost</code> suddenly isn't <code>localhost</code>. The network has been virtualised! <code>localhost</code> doesn't mean what you think it means, it’s now referring to the Docker container itself, not the host. There is a simple fix for this - use <code>host.docker.internal</code> instead of <code>localhost</code>. This will work when developing locally, but when running on a server you’re probably better off specifying the full hostname and hope that DNS is set up correctly. Once I changed this, at least my application could connect to my Seq instance to start logging startup errors.</p>

<h4 id="third-party-libs">Support for third party libraries</h4>

<p>Once I fixed my references to <code>localhost</code>, the next problem that I had was not all of my DLL’s were loading properly. At startup I would get this error:</p>
 
<img data-src="/pics/moving-to-linux-2.png" alt="moving dotnet application to linux 2" class="img-responsive lazyload" />
 
 
<p>For PDF management I’m using a library named <a href="https://www.websupergoo.com/abcpdf-1.aspx">AbcPdf</a>. It’s a great library with heaps of functionality that I’ve been using for years. There’s just one problem. AbcPdf isn't supported on Linux. There are just no Linux binaries, full stop. Sure, this was hidden inside their documentation somewhere, but the only way to find this out was to actually launch my application and see if it crashed at startup.</p>

<p>
This was pretty confusing, because the code worked great on Windows. (I particularly like the stack trace with unreadable characters). But after a bit of googling on their website, I found <a href="https://www.websupergoo.com/helppdfnet/source/3-concepts/6-coreandstandard.htm">this gem</a>:</p>

<blockquote>Windows only – not Linux or Xamarin</blockquote>

<p>This was a problem. My only options were:</p>

<ol>
<li>Investigate other PDF libraries that have Linux support</li>
<li>	Refactor out all of the AbcPdf code and run it on Windows</li>
</ol>
<br />

<p>I chose Option 2. I refactored out all of the code to a separate application that I would run on Windows and slapped an API wrapper around it. This was a bit of work, but there wasn’t that much code there, and what was there could be pulled out pretty easily. After a day, I ended up with a nice API for creating and merging PDFs:</p>

<img data-src="/pics/moving-to-linux-3.png" alt="moving dotnet application to linux 3" class="img-responsive lazyload" />
 
<p>This was also quite nice as I knew there was another application that needed some PDF functionality, and now I had a nice and reusable API to call.</p>

<p>The next thing that I needed to do was to check that all of my other dependencies had Linux support. So here’s the full list of libraries that I’m using:</p>

<ol>
<li>	Hangfire - long running tasks </li>
<li>	Serilog + Seq - logging </li>
<li>	Swashbuckle - swagger API  </li>
<li>	AWS SDK - talking to S3 </li>
<li>	EPPlus - excel file manipulation </li>
<li>	MongoDB </li>
</ol>

<p>Fortunately, all of them have fantastic Linux support. Except for the one that didn’t.</p>

<h3 id="windows-auth">Windows Authentication</h3>

<p>The next problem was happening at startup:</p>

<pre><code class="hljs">System.InvalidOperationException: No authenticationScheme was specified, 
and there was no DefaultChallengeScheme found. 
The default schemes can be set using either AddAuthentication(string defaultScheme) or 
AddAuthentication(Action&lt;AuthenticationOptions&gt; configureOptions). 
</code></pre>

<p>This didn’t make any sense. It’s the same code from Windows… but the more I looked at it, I realised that this was probably the culprit:</p>
 
<img data-src="/pics/moving-to-linux-4.png" alt="moving dotnet application to linux 4" class="img-responsive lazyload" /> 
 
<p>First off, the app isn’t using IIS, so the chances are, IIS authentication probably isn’t going to work. So after much googling, I found that while it is possible to get windows authentication working on Linux,  to set it up you need to <a href="https://docs.microsoft.com/en-us/aspnet/core/security/authentication/windowsauth">have access to a domain controller</a> – something that I expect no developer would have--or should have! This is clearly not a practical solution. My solution was to move Windows auth out of the Linux server and move it to a different application (a topic for another post). But, to get you started, I found out I could have the application use IIS auth for when running under Windows, and a different auth for when running under Linux:</p>

<img data-src="/pics/moving-to-linux-5.png" alt="moving dotnet application to linux 5" class="img-responsive lazyload" /> 
 
<p>This is kind of cool, but really it probably should be a config that is set at startup, not determined by the code at runtime depending on the OS that it’s running on.</p>

<h2 id="runtime">Runtime Errors</h2>
<p>My application was now loading! I could click around and it was responding. It barely worked, but hey, it was loading. Now to start fixing all of the runtime errors.</p>

<h3 id="system-fonts">System fonts</h3>
<p>Inside my application I had a little bit of code that created a list of all of the system fonts installed on the server:</p>

<img data-src="/pics/moving-to-linux-6.png" alt="moving dotnet application to linux 6" class="img-responsive lazyload" /> 
 
<p>When this code ran, I got this error:</p>

<img data-src="/pics/moving-to-linux-7.png" alt="moving dotnet application to linux 7" class="img-responsive lazyload" /> 
 
<p>Not the most helpful error message I've ever seen, but needless to say, managing font files just doesn't work. I managed to find this <a href="https://github.com/dotnet/runtime/issues/27200">github issue</a> that had a few workarounds, but I never got around to trying them. I ended up moving the same code to the Pdf Api that I mentioned earlier. </p>

<p>This is the kind of thing that ended up being quite common when testing my application on Linux. Something causes the app to crash that normally works on Windows, you google it to find a couple of possible workarounds and try out a few. </p>

<h3 id="unspecified-culture">Unspecified Culture</h3>

<p>Notice anything weird going on here?</p>

<img data-src="/pics/moving-to-linux-8.png" alt="moving dotnet application to linux 8" class="img-responsive lazyload" /> 
 
<p>Ever seen the ¤ character before? Neither had I, but apparently it's the currency sign used to denote an <a href="https://en.wikipedia.org/wiki/Currency_sign_(typography)">unspecified currency</a>. This means you need to set the culture inside your code instead of relying on the server’s culture:</p>

<img data-src="/pics/moving-to-linux-9.png" alt="moving dotnet application to linux 9" class="img-responsive lazyload" />  

<p>Problem solved. That was a good one!</p>

<h3 id="https-and-certs">HTTPS and Certificates</h3>
<p>Linux and Windows handle certificate trusting differently. One of the API’s that I’m calling had a certificate that used older ciphers. Apparently, in windows this was fine, but inside Linux, this was not fine and the SSL connection was rejected. I ended up having to modify the runtime openssl configuration inside the Docker container:</p>

```
RUN sed 's/DEFAULT@SECLEVEL=2/DEFAULT@SECLEVEL=1/' \
      /etc/ssl/openssl.cnf > /etc/ssl/openssl.cnf.changed && \
    sed 's/TLSv1.2/TLSv1.1/' /etc/ssl/openssl.cnf.changed \ 
      /etc/ssl/openssl.cnf.changed2 && \
    mv /etc/ssl/openssl.cnf.changed2 /etc/ssl/openssl.cnf 
```
    
<p>Yikes. Isn't it great how docker simplifies things?</p>

<h3 id="timezones">Timezones</h3>
<p>When you make a call to fetch a list of Timezones, the list that is returned is completely different when running on Linux compared to Windows! Apparently this is because the list of time zones is returned by the OS... and of course the two do it completely differently. There is a library to <a href="https://devblogs.microsoft.com/dotnet/cross-platform-time-zones-with-net-core/">work around this</a>, but boy is it a doozy to catch during runtime.</p>

<h3 id="network-share-paths">Network Share Paths</h3>
<p>Writing to a Windows network share is suddenly much more difficult. My solution was to mount the network share on the host using samba (via smbclient), and then mapping this mounted share to a Docker volume, and then reading from that. It then finally works, after only adding two more levels of abstraction! But… can you change the permissions on the newly created file? Let’s try it:</p>
 
 <img data-src="/pics/moving-to-linux-10.png" alt="moving dotnet application to linux 10" class="img-responsive lazyload" /> 
 
<p>Oh well, I guess not. This was annoying as it meant I couldn't change basic file permissions like making it readonly, or do something more advanced like change the owner of the file. </p>

<p>After a while you kind of get used to seeing messages that effectively say "this stuff works on Windows but not on Linux".</p>

<h3 id="case-sensitivity">Case sensitive URLs</h3>
<p>My URLs needed to be the correct case! Previously a url like <code>/content/MyFile.js</code> would load, even if the actual file on disk was stored as <code>/content/myfile.js</code>. However now that my app is running on Linux, case sensitivity is an issue. This wasn’t too much of a problem, but it caught me out a few times.</p>

<h2 id="misc">Other Things</h2>
<p>There were a few other things that I needed to keep in mind.</p>

<h3 id="disk-space">Disk Space</h3>

<p>When building Docker images, I would constantly run out of disk space. It’s really annoying and it's quite difficult to troubleshoot andwork out where all of the space is going and how to clean it up. Yes, you have the Docker prune command, but that wasn’t really working. I ended up having to impose some pretty strict “only use this much space” policies to my hyper-v image, which were really difficult to get right. </p>

<p>If you're not careful, the Docker images can become huge. One of the third-party libraries that I was using was putting 100 MBs of stuff in my application's bin directory. This meant every -Docker image push+pull would be using a lot more bandwidth than I expected. Easily done and difficult to spot. </p>

<h3 id="automated-builds-and-deploys">Automated Builds and Deploys</h3>
<p>My Automated build was suddenly very different. Instead of using the normal templated solution that I used for all of my other applications I suddenly need to have a custom build for Docker. The deploys are also completely different - better, MUCH better, but oh so different. Instead of pushing the package to the web server from your CI server, you pull it from the image hub directly from the web server. A very different way of thinking about it. Not something that I really thought through, and something that will need a bit of effort put in.</p>

<h3 id="security">Security</h3>
<p>You need to keep passwords and all other secrets out of your image. This means passing through all secrets as environment variables and making sure your application is loading them in at runtime. Nothing extraordinary here, but some more work that needed to be done to make sure it was working, and setting up an env.list file. </p>


<h2 id="the-aftermath">The Aftermath</h2>

<p>So after all of those woes, I managed to get my application fully up and running:</p>

 <img data-src="/pics/moving-to-linux-13.png" alt="moving dotnet application to linux 13" class="img-responsive lazyload" /> 


<p>I added a new page to dump out some runtime information, and it now displays the following: </p>

<img data-src="/pics/moving-to-linux-12.png" alt="moving dotnet application to linux 12" class="img-responsive lazyload" /> 
 

<p>This is pretty cool! This opens up a world of possibilities:</p>

<ul>
<li>	My application runs faster. </li>
<li> .NET on Linux performs better than on Windows. </li>
<li>  It uses less memory and is able to handle more traffic</li>
<li>	Deploys are vastly improved:

<ul>
<li>
	They are much simpler - just pull down the Docker image and run it</li>
<li>	A lot faster - practically zero downtime as it only takes a second to startup</li>
<li>	Instant roll-back – running a previous version only takes a second</li>
</ul></li>

<li>	Scaling out my application is much easier – just run the Docker image on another server </li>
<li>	My app can run easily on Azure or AWS</li>
<li>	My Docker image can be scanned for out-of-date dependencies or security problems</li>
<li>	Integration tests are now much easier to run.I can create a Docker compose file that sets up the entire environment (database, API’s, etc.) and runs my tests</li>
<li>	I can upgrade to a newer version of the Dotnet runtime without having to worry about what’s installed on the server</li>
<li>	I can run my app on a Kubernetes cluster</li>
</ul>

<p>
While moving to Docker wasn’t exactly a walk in the park, now that I have that knowledge moving my other applications won’t be nearly as difficult. 
</p>

<h2>Workshops!</h2>
<p>Great job on reading this far! If you're interested in this kind of stuff I'm currently running two different workshops on similar topics:
</p>

<ol>
<li><a href="https://dotnetworkshops.com/workshops/optimise-your-code-with-visual-studios-profiler">Optimising your code with Visual Studio's Profiler</a></li>
<li><a href="https://dotnetworkshops.com/workshops/porting-your-aspnet-app-from-framework-to-core">Porting your asp dotnet application from framework to core</a></li>
</ol>

<p>Thanks for reading and remember... <b>you don't need permission to be awesome</b>.</p>