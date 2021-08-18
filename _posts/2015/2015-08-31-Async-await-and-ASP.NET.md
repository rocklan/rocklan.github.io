---
date: 2015-08-31
category: technical
readtime: true
---
<p>Today I came across a <a href="http://stackoverflow.com/questions/20129933/sendmailasync-use-in-mvc">brilliant explanation of c#'s <b>await</b> keyword</a>. I've been trying to figure it out for a couple of weeks now and every time I read it the explanation gets too complicated too quickly. The essential problem is as follows:</p>
<br />
<h4>Marking a method as Async doesn't make it Asynchronous</h4>

<br />
<p>And therein lies the confusion.</p>

<p>(BTW I'm not sure which genius came up with this. Probably the same person who came up with "Visual Studio Online" -  because.. you know.. it's not actually an online version of visual studio.)</p>

<p>So anyway marking a method as async doesn't make it asynchronous. What the heck does it do?</p>
<br />
<h4>Async releases the thread from the server pool</h4>
 
<br />
<p>Huh? Well, normally each request in IIS takes up a thread. While IIS has a <a href="https://msdn.microsoft.com/en-us/library/ee377050%28v=bts.10%29.aspx">bewildering number of performance tuning options</a> it essentially has a fixed number of threads available to process simultaneous requests. Each request uses a thread. So normally, the maximum number of simultaneous requests possible comes down to the maximum number of threads. So, if suddenly 1000 users hit your app at the same time, the 1001st user's request is going to be put into a queue, and they will have to wait. Now if your queue size is say 5000, and you then suddenly get 5000 more users hitting the site, your 6001st user is going to get a 503 error. </p>

<p>Now if you're trying to squeeze more performance out of IIS, and your performance isn't being limited by the normal things (database, disk, memory), but by <b>number of threads</b>, you have a few options:
</p>
<ol>
<li> Increase the maximum number of threads </li>
<li> Increase the queue size </li>
<li> Add more CPU's, which will probably give you more threads </li>
<li> Use the <b>await</b> keyword </li>
</ol>
<br />
<h4>Aha!</h4>

<br />
<p> So if you're lucky enough to be able to call a method that is marked as async, <b>during that call</b>, an extra thread is going to be freed up. But only if the task is <b>not CPU bound</b>. Long running calculations? Forget it.</p>

<p>So what does this mean for us boring ASP.NET developers? Should we use <b>await</b>? In my opinion, nope. You are just needlessly engaging in good old premature optimisation. Just continue on as usual, nothing to see here.</p>