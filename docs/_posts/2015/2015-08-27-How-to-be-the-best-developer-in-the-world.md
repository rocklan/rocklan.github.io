---
date: 2015-08-27
category: technical
readtime: true
tags: craftsmanship popular
---
<p>To kick off this blog, I think that I need to state the following:</p>

<b>I am not the best developer in the world</b>. 

<p>I <i>know</i> a lot of the things that you need to learn in order to become a great developer, but just knowing these things doesn’t make it happen. Head knowledge is good, but that’s the easy part. Putting it all into practice… that’s what’s difficult. I'm still a work in progress!</p>

<p>So in order to become the best developer in the world you're going to have to ask yourself a pretty serious question:</p>
<p><i>"what level am I at?"</i></p>
<p> To work this out, you might compare yourself to a couple of job ads. If you start poking around the internet for software developer jobs, you’ll find things like this:</p><br />
<img src="https://static.lachlanbarclay.net/pics/jobad1.png" class="img-responsive" />
<br /><br />
<p>Notice how they advertise "3 years XP"? Unlike other crafts, software development does not have a well-defined methodology for working out how good a programmer is. All we go by is “years of experience” which is a pretty bad methodology - you can sit on your bum for five years, not learn anything, and you're suddenly a mid-level developer. It doesn't really mean anything. Instead of years of experience, what we need to know is <b>competency</b>.</p>
<p>Have you seen the <a href="http://www.sijinjoseph.com/programmer-competency-matrix/">programmers competency matrix</a>? It's a great list, but I feel like it's missing a bunch of things.</p>

<p>As an alternative I'd like to propose that as an industry we adopt the <b>Guild</b> system for determining the level of someone's skillset: </p>
<br />
Apprentice -> Journeyman -> Master -> Grandmaster
<br /><br /><br />

<h3>Apprentice</h3>

<br />
<p>An apprentice's job is to learn from the master. They're trying to learn the basics and spending a few years getting some experience under their belt. At the bare minimum, I would expect them to learn how to:</p>

<ul>
<li>Write code that works</li>
<li>Use version control</li>
<li>Manually tests their code for invalid values</li>
<li>Write code that the customer needs, not what they ask for</li>
<li>Fix bugs in their own code and in other people's</li>
<li>Do <a href="http://www.amazon.com/Dont-Make-Me-Think-Usability/dp/0321344758">basic UI design</a>. Not graphic design, <b>UI</b> design</li>
<li>Implement global error handling across the application and have a consistent error handling approach</li>
<li>Logs info messages, warning messages, debug messages and errors consistently</li>
<li>Mitigate against all items in the <a href="https://www.owasp.org/index.php/Category:OWASP_Top_Ten_Project">Owasp Top Ten</a></li>
<li>Write code to unit test your other code</li>
<li>Follow coding standards so all code written is consistent</li>
<li>Do <a href="http://www.developer.com/tech/article.php/3579756/Effective-Code-Reviews-Without-the-Pain.htm">Effective Code Reviews Without the Pain</a> and have your code periodically reviewed</li>
<li>Write code that doesn’t repeat itself </li>
</ul>
<br />

<p>After being able to demonstrate those competencies to a certain level, the next steps would be...</p><br /><br />

<h3>Journeyman</h3>

<br />
<ul>
<li>Know the principles of <a href="http://www.amazon.com/Data-Modeling-Essentials-Third-Edition/dp/0126445516">data modelling</a> - data is the foundation for your application. Get it wrong and you’re in trouble</li>
<li>Practice separation of concerns - each class should concern itself with one thing and do it well</li>
<li>Performance - understands typical performance problems and mitigate against them</li>
<li>Keep up to date with newer frameworks and libraries and know why and when to use them</li>
<li>Write reusable code - code written should be reusable by other developers on the team</li>
<li>Follow the YAGNI principle - don't over design the solution but only code what is needed at that point in time</li>
<li>Clean As You Go - fix up code as you implement new features or when bugs are fixed</li>
<li>Read other code - check out some larger open source projects</li>
<li>Write and use automated UI tests</li>
<li>Organise code - logically group/name files and folders so that things are easily found</li>
<li>Setup a CI server to checkout, build and test your application</li>
<li>Automate deployment </li>
<li>Log issues, bugs &amp; features all in the one place</li>
<li>Writes down important documentation (algorithms, configuration) things that other people need to know </li>
<li>Mock up new features before coding them</li>
<li>Implement analytics so that you can see what’s going on in your app</li>
<li>Write applications that are accessible </li>
</ul>

<p>If you can do most of the above steps you're already doing very well. But will all of this knowledge help you deliver a project on time and in budget? Probably not. They'll make you a super efficient coder, but they won't make you an awesome employee.</p>
<p>What you need to learn is all the other things that "aren't your job". Were you hired to do these things? Probably not. Will you be an awesome programmer if you do them? Absolutely.
</p>
<br /><br />

<h3>Master</h3>

<br />
<ul>
<li>Know how to effectively push back on management and head off problems before they become major issues</li>
<li>Lead other programmers and organise a team to be more effective </li>
<li>Project planning - come up with a project plan and stick to it.</li>
<li>Negotiating - learn the art of negotiating and how to trade off features for time </li>
<li>ROI - understand return on investment and why you’re doing the project, and what affects it </li>
<li>Estimating - estimate (relative!) time taken to implement new features</li>
<li>Requirements - clarify and discover new user requirements</li>
<li>Meetings - run meetings to get a desired outcome</li>
<li>Testing - organise a full end to end test of the application to ensure it does what it should</li>
<li>Perform user demos of new features as they are implemented</li>
<li>SDLC’s - understands the pros and cons of different SDLC’s and can implement change to gain efficiencies</li>
<li>Big Picture - understands the big picture and can communicate it with anyone at their level</li>
</ul>

<br />
<p>Well, now we are getting somewhere. But the issue with the above list is that it's mostly technical. If you can't communicate with your boss and listen to your users then you are never going to be the best developer in the world. What other skills do you need to cultivate?</p>
<br />
<h3>Grandmaster</h3>

<br />
<ul>
<li>Adapt - are you able to learn new skills, new technology and adapt? Is your way the only right way of doing things? Are you stuck in your technology world and unwilling to consider or learn something else? If so then you haven't mastered the art of adapting yet.</li>
<li>Listening - can you actively listen to users and management? Can you repeat back to them what their issues and concerns are and have them confirm that you understand them?</li>
<li>Inception - can bring new ideas to management and get them up and running?</li>
<li>Arguing - do you know the pitfalls of arguing and instead know how to persuade?</li>
<li>Motivation - do you understand people’s motivations? </li>
<li>Respect - do you show people their due respect even before they have earnt it?</li>
<li>Admitting wrongs - able to admit when you're wrong?</li> 
<li>Friendly - are you rude, surly or unapproachable?</li>
<li>Caring - do you ask about other people are?</li>
<li>Psychology - do you understands different <a href="http://www.humanmetrics.com/cgi-win/jtypes2.asp">personality profiles</a> and know how to communicate with them?</li>
<li>Stereotype Fighter - do you know the “software developer” stereotype and how to work with it?</li>
<li>Communication - can you communicate with your boss, your users, and non technical staff effectively?</li>
</ul>
<br />
<p>Hopefully we can all agree that learning the above skills will make you a better developer :) 
</p>
<p>A resource that I strongly recommend is the masterful <a href="http://www.amazon.com/How-Win-Friends-Influence-People/dp/1508569754">How to win friends and influence people</a>.</p>
<br />
<h3>Lachlan’s handy hints</h3>


<p>While we're on the topic, here's a few bullet points that I wish someone had told me 15 years ago when I was starting out.</p>
<ul>
<li>Use deodorant. Deodorant is like a firewall. It needs to be on ALL THE TIME.</li>
<li>Don't be a "negative Nellie". When a customer asks you to do something, don't immediately say no. You could say "yes, but it'll take 6 weeks". If this isn't enough time, show the timeline, budget or manpower and explain what they can do to get it changed</li>
<li>Email - the first line of the email is the most important</li>
<li>Doesn’t look bored when bored (apparently this is a crime)</li>
<li>Dress good - don’t look like a slob</li>
<li>Don’t just talk about work</li>
<li>Don’t just talk about computer games</li>
<li>Go to lunch/coffee/beer with people and ask how they are</li>
</ul>
<br /><br />


<h2>ARGH</h2>

Yes, this is a pretty big list. Realistically you’re only going to be able to work on one or two things per month. If you're brave, ask your friends what your weaknesses are... and ask them to tell you nicely :) They are the ones you want to work on!


<h2>References</h2>

<ul>
<li>	
	<a href="http://sijinjoseph.com/programmer-competency-matrix/">Programmer Competency Matrix</a>
</li>
<li>
	<a href="https://www.owasp.org/index.php/Category:OWASP_Top_Ten_Project">Owasp Top Ten</a>
</li><li>	
	<a href="http://www.developer.com/tech/article.php/3579756/Effective-Code-Reviews-Without-the-Pain.htm	">Effective Code Reviews Without the Pain</a>
</li><li>	
	<a href="http://www.amazon.com/Data-Modeling-Essentials-Third-Edition/dp/0126445516">Data Modelling Essentials</a>
	</li><li>	
	<a href="http://www.amazon.com/Dont-Make-Me-Think-Usability/dp/0321344758">Don't make me think</a>
</li>
<li><a href="http://www.humanmetrics.com/cgi-win/jtypes2.asp">Myers Briggs test</a></li>
<li>		    
	<a href="http://www.amazon.com/How-Win-Friends-Influence-People/dp/1508569754">How to win friends and influence people</a>	
</li>
</ul>
<br /><br />