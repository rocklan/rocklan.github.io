---
date: 2017-10-15
category: technical
readtime: true
cover-img: /pics/catlight.png
tags: ci deployments devops craftsmanship popular
title: Setting Up CI To Setup Your Success
---
<p>Does your build save you time and effort? Or does everyone emit a collective groan whenever you hear the dreaded <b>"Someone broke the build"</b> ? A great build setup you will love, a bad setup you will hate. How do you get started and where do you want to end up?</p>
<img data-src="/pics/BuildServers.png" alt="Build servers" class="img-responsive lazyload" />

<h2>Fundamentals</h2>


<h3>Which one? </h3>


<p>Well, a lot of it depends on your circumstances. If you're a Microsoft shop, you might already have TFS. If you're using Github you've got access to Travis. If you want to set up your own, Jenkins is free and fully featured. If you have a budget you can buy Team City. Or you could check out <a href="https://buildbot.net/">BuildBot</a>. My recommendation is not to agonise over the decision, just pick one and get stuck in. If you don't have a server and you're not using a hosted source control solution, you could always install Jenkins on your local box in a VM. Remember, <a href="http://reverentgeek.com/reflecting-on-the-past-five-years/">you don't need permission to be awesome</a>.</p>  

<p>So, what are the basics that your build server should do and in what order should you set them up?</p>
                                                               
                                                                                                                                                            
<h3>Check out your code</h3>


<p>Get this working!</p>

<img data-src="/pics/checkoutdiagram.png" alt="diagram of source code checkouts" class="img-responsive lazyload" />
                       
<p>Whenever you check in some code (or push it to your source control) your build server needs to be able to check out the same source code onto the build server. While this sounds like a simple step often it isn't! First off you need to be <a href="https://softwareengineering.stackexchange.com/questions/112270/is-it-unusual-for-a-small-company-15-developers-not-to-use-managed-source-vers">actually <b>using</b> source control</a>, and second off you need to get the credentials sorted out. What user will check out the code? Is network access established between your build server and your source code server? Is the source code too large to completely check out? Once you've sorted out these issues you should be able to check in some code and your build server should start checking it out as soon as it can. Ideally it would use a hook to be notified whenever code is checked in but sometimes (or initially) polling is the easiest way to get started.</p>

<p>An important point to note is make sure you're checking it out securely. Use HTTPS. On top of that, use an account that has read-only access to your repository.</p> 

<h3>Compile your code</h3>


<p>The next step after your code check out is to compile the code. You might need to install your language's SDK onto the build server, and you'll also need to install the right one. Do you need Msbuild 14 or 15? Or JDK 1.7 or 1.8? Can the user that your CI software is running as access the SDK? These are small but annoying things to work out. More importantly, does your code actually compile upon clean checkout? This is often the biggest problem that I run into. You might need to spend a few days (or most likely weeks) getting the code to compile upon clean checkout. After all, if the developers have only done this once they probably haven't bothered to make it a nice and simple process. </p>

<p>When it actually comes to compiling the code, consider using a DSL like <a href="https://cakebuild.net/">Cake</a> for c# or <a href="https://martinfowler.com/articles/rake.html">Rake</a> for Ruby. This way the script to compile your code can be moved to a different CI tool in the future if needs be. Personally I use a lot of powershell and have my own modules to take care of my needs. </p>

<h3>Package Restore</h3>


<p>Do you have packages that your app depends on? If so, there's a good chance your app won't compile, unless someone has already checked in all of the dependencies, further clogging up your SCM.  They should be <b>removed</b> from source control, otherwise you'll be clogging up your source code repository, especially when you start branching your code. This is <a href="https://softwareengineering.stackexchange.com/questions/301547/should-we-include-nuget-package-folder-in-version-control">debatable</a> <a href="https://stackoverflow.com/questions/1710027/can-should-i-put-3rd-party-libraries-in-version-control">though</a>. If you're working on a .NET app you'll need to get NuGet package restore working before you compile. If you're working on a node app you'll need to be able to restore your NPM packages. Oh and I beg of you, <b>please</b> use <a href="https://yarnpkg.com/en/">Yarn instead of npm</a>.</p>

<p>Restoring package dependencies over the internet is another headache to consider. Personally I really hate pulling down packages from the internet whenever I do a build - I just don't like the dependency, the performance and pointlessness of it all. A better solution is to cache your packages so that each build isn't pulling them down from an external repository over the internet. There's many different products that do this, <a href="http://inedo.com/proget">ProGet</a> or <a href="https://www.jfrog.com/artifactory/">Artifactory</a> as an example. Yarn does it by default.</p>

<h3>Notifications</h3>


<img data-src="/pics/catlight.png" alt="catlight screenshot" class="img-responsive lazyload" />

<p>There's no point in having an automated build going that compiles your code upon check in if nobody knows when the build is failing. Classically people setup email notifications but they are generally a pain in the neck. A better approach would be to use an app that everybody installs onto their machine that pops up a notification whenever the build fails, or perhaps your IDE has way of doing this. There might be an extension for your IDE that provide this functionality like <a href="https://marketplace.visualstudio.com/items?itemName=AlonAmsalem.AnyStatus">AnyStatus for Visual Studio</a> or <a href="https://www.eclipse.org/hudson/the-hudson-book/book-hudson.chunked/ch10.html">Sonatype for Eclipse</a>.</p>

<p>An even better approach is for your build server to automatically post something in your collaboration software like Slack or Hipchat. If you setup a dedicated channel for your app and send notifications there, they won't clog up people's inbox, and people can subscribe to that channel whenever they are working on the build. It should look something like this:</p>

<img data-src="/pics/channelnotifications.png" alt="channel notifications" class="img-responsive lazyload" />

<p>A closer look at this screenshot shows a couple of useful details. First off, as soon as the build is completed a message is posted to the channel. This is great so that everybody in the team gets immediate feedback. If the build fails, it's shown in red. You can see which unit tests passed and which failed.</p>

<p>A separate notification is posted once deployment is complete and provides a link to the deploy. For this particular build, the code coverage calculation takes seven minutes to run. This is too long to expect developers to wait! So as a result the code coverage calculation is run as a separate job, and once that's complete another post is sent to the channel. It's very important to strike a good balance between enough information and not-too-much, so get feedback from your team about what's useful and what isn't!</p> 

<h3>Celebration time!</h3>


<p>Hopefully by now you have the smallest amount of work possible to provide a good return on investment. Being notified whenever someone accidentally breaks the compile will be super-useful to your team. Developers will now know not to do a get-latest of the source code whenever the build is broken, saving them hours and hours of frustration and headaches. Cool!</p>

<h2>The useful stuff</h2>


<p>Now that you've got a basic build going, there are many features you can add to save everyone a lot more time. What areas should you be concentrating on?</p>

<h3>Unit Tests</h3>


<img data-src="/pics/unittests.png" alt="Unit test results" class="img-responsive lazyload" />

<p>Your next step is to be running your unit tests upon each checkin. This step also isn't as simple as it may sound. Do you actually have any unit tests? You'll probably need to write some and start training up your team in the art to writing unit tests. They also need to run pretty quickly and not depend on external services or databases. They also need to be able to run concurrently and not take up a mountain of CPU. What I have found is that if the unit test takes longer than 200ms you're probably doing it wrong. Unit tests need to test your code, and nothing else. Just one function. This is a huge hurdle for many and requires a large shift in thinking. People who were used to writing spaghetti code with many dependencies need to learn how to simplify their code and write stuff that can actually be tested. <b>This is difficult and is not easy</b>, and deserves a separate post.</p>

<h3>Deployment</h3>


<p>Now that you've put the hard yards in to get your code compiling on a server, it <b>shouldn't be too difficult</b> to get it automatically deploying to a test server somewhere. After all, you're just copying a few files right?</p>

<p>Erm, no. Most languages and frameworks do not have a built in deployment methodology. In my opinion, <a href="https://www.troyhunt.com/you-deploying-it-wrong-teamcity_24/">Microsoft's WebDeploy is an absolute nightmare</a> and best to be avoided - use <a href="https://octopus.com/">awesome Octopus Deploy</a> instead, which is free for the first 5 projects. Maybe in your case you can just copy a few files up to another server, but that also requires setting up credentials and making sure you're not screwing things up. A super important and helpful task, but nevertheless a daunting one.</p>

<h3>Versioning</h3>


<p>Now that you've got your app deploying to a test server, how do you know which version of your code has been deployed? If two of your builds failed, and the third one succeeded, it can be difficult to work out exactly which version has been deployed to which servers. Setting up a task to tag (or label) a specific version whenever it's released will safe you a lot of trouble shooting in the future. This is one of those things that just make life so much easier. Set this up and you won't regret it.</p>

<h3>Code coverage</h3>


<p>How much of your actual code is covered by unit tests? There's no point in having 500 tests if you're only testing 5% of your actual code. Displaying what code is actually covered by your tests can be super useful. You can use <a href="https://github.com/OpenCover/opencover">Open Cover</a> for .NET and generate some fantastic reports like so:</p>

<img data-src="/pics/coverage.png" class="img-responsive lazyload" alt="code coverage results" />

<p>Here you can see that the getter for <b>Age</b> is being called as part of our unit tests. So is the setter, but if we try to set the age to be above the MAX_AGE (when the configuration isn't null), there's no unit test for that! And yes, this is a real-life bit of production code... hmm, better go add another test! Oh and as an aside, please don't aim for 100% coverage... just <a href="https://martinfowler.com/bliki/TestCoverage.html">test the stuff that worries you</a>.</p> 

<h3>Code quality</h3>


<p>A super helpful step that can give you great visibility on your code issues is to setup some kind of automated code quality step. You can just run a Linter (TSLink for javascript, Code Analysis for c#) and have the build results display the output, or you can go the whole hog and use a quality scanning tool. <a href="https://www.sonarqube.org/">SonarQube</a> is a great tool that provides heaps of great functionality for free, right out of the box.</p>

<h3>Branches</h3>


<img data-src="/pics/branching.png" alt="feature branch building" class="img-responsive lazyload" />

<p>Do you work in feature branches? Do you have release branches? Is your build server building your branches and not just the mainline? This can also be tricky to setup, but super useful. Jenkins has the new wonderful multibranch pipeline that is awesome once you wrap your head around it.</p>

<h3>Configuration in Source Control</h3>


<p>By now you've probably setup a bunch of stuff within your build server. If you have 10 projects you might have a lot of configuration by now. You're probably also changing it alot, and you've problem had a need to roll it back whenever you've screwed something up. Sounds like source control can solve this problem! Is your build configuration stored somewhere in source control? Jenkins has it's own <b>Jenkinsfile</b>. TeamCity has project-config.xml. This can save you a lot of time and provide a fail safe rollback method whenever you screw up your build configuration.</p>

<h2>Advanced awesome stuff for the legends</h2>


<p>If you're a legend, you'll set this stuff up too.</p>

<h3>Code security</h3>


<img data-src="/pics/owasp2.jpg" alt="owasp logo" class="img-responsive lazyload" />

<p>SonarQube provides a few security metrics and tells you if you're doing something silly like using a very old and broken encryption protocol. But what about finding other security holes in your app? Often they can't immediately be determined just by looking at the actual source code and need to scan the running application itself. <a href="https://www.owasp.org/index.php/OWASP_Zed_Attack_Proxy_Project">oWASP ZAP</a> is a great example of this and can be integrated into your build pipeline.</p>

<p>Oh and while I'm on the topic of security.. make sure your build isn't revealing passwords. If you need to supply a password say when running a deploy, make sure it's masked and stored securely somewhere. The last thing you want to do is <b>decrease</b> security :) Make sure it's running over HTTPS too, and also that users are authenticated before viewing the important stuff.</p>

<h3>Feature branch deployment</h3>


<p>If you're developing code within feature branches, you could be automatically deploying them to your build box too. That way you can divide up your work into branches and wait for each client to test or sign off without holding up your other jobs. This step can save you a <b>heap</b> of time.</p>

<h3>Automated UI tests</h3>


<p>It's all well and good having unit tests, which are there to see if someone has accidentally changed the output of a function. But what if someone messes up your HTML and breaks your entire app? You don't have a test for that, do you?</p>

<img data-src="/pics/phantomjs-logo.png" alt="phantomjs logo" class="img-responsive lazyload" />

<p>You can use <a href="http://www.seleniumhq.org/">selenium</a> to automate a browser and test your app upon checkin. This can be fiddly and difficult, but boy will it catch a lot of problems. Alternatively you can use a headless browser like <a href="http://phantomjs.org/">PhantomJS</a> and control it via a scripting language.  If you can setup a bunch of nice automated UI tests they can also save you in going over the top and writing too many unit tests. They don't replace unit tests, but can provide a wonderful safety net for your app.</p>


<h3>Integration Tests</h3>


<p>If you can test your code in isolation that's fantastic. But what if your app also depends on other web services? Does it play nicely with them? Does your code work properly when an external web service fails? I see integration tests as a nice in-between of unit test and UI tests. They take a bit longer to run but can also help narrow down a problem to a specific area of your code base. They also provide another level of comfort to the business that your app updates should deploy nicely.</p>

<h3>Database schema changes</h3>


<p>Does your release need database changes? Need a new table, or changing the data type of a column? Ideally your build would be restoring a copy of your production database, stripping out sensitive information, and automatically running in your upgrade scripts. If your scripts fail, so does the build. <a href="https://www.red-gate.com/simple-talk/sql/database-administration/using-migration-scripts-in-database-deployments/">Red Gate</a> seem to be the leaders in this area, or you could use something like <a href="https://dbup.github.io/">DbUp</a>.</p>

<h3>Breaking down your build to smaller steps</h3>


<p>Over the years I've found the most important thing is to keep your build <b>fast</b>. If it's taking longer than a few minutes people will get bored & frustrated with it. You need to break it down to many small tasks and have it fail as early and as quick as possible. Your CI software might even support breaking down your build into individual steps like so:</p>

<img data-src="/pics/buildsteps.png" class="img-responsive lazyload" alt="jenkins build steps" />

<p>If your build is taking more than a few minutes, you could then break down into separate jobs like so:</p>

<ol>
<li>Compile & unit tests</li>
<li>Deploy</li>
<li>Integration tests</li>
<li>UI tests</li>
</ol>


<h2>On the way to awesomeness!</h2>


<img data-src="/pics/you-dont-need-permission.jpg" class="img-responsive lazyload" alt="You don't need permission to be awesome!" />

<p>(Many thanks to <a href="http://reverentgeek.com">Reverent Geek</a> for the cool image)</p>

<p>One of the best things you can do as a software developer is to help your team succeed and be more productive. The main thing to keep in mind when setting up your build server is that you're trying to make everyone's life easier by making it easier and quicker to find bugs and fix them before they hit production. If your build is becoming onerous and a drag, it's time to get all the nerds in the room and work out how to improve things. Alternatively you can ask some nerds online like <a href="https://www.hasaltaiar.com.au">Has AlTaiar</a> who provided some wonderful feedback on this article :)</p>

<p>Now get out there and <b>kick some butt</b>! You don't need permission to be awesome!</p>

<br />
<p>PS - What have I missed?</p>
<br /><br /><br />