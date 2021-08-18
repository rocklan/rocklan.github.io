---
date: 2016-01-21
category: technical
readtime: true
---
This week I heard about the <a href="https://www.owasp.org/index.php/.NET_Security_Cheat_Sheet">.NET Security Cheat Sheet</a> written by the owasp guys. So I opened it up on my mobile and saw this: <br /><br />

<img src="https://static.lachlanbarclay.net/pics/owasp-mobile.jpg" class="img-responsive">

<br style="clear: both" /><br />
Eish. The text is tiny and you need to scroll around the screen to be able to read a sentence. Someone needs a mobile friendly CSS! So I tweeted them and got this response:<br /><br />

<blockquote class="twitter-tweet" lang="en"><p lang="en" dir="ltr"><a href="https://twitter.com/voiceofapollo">@voiceofapollo</a> Volunteer organization of security geeks. Not a lot of designers among us. Still, you are right.</p>&mdash; Bill Sempf (@sempf) <a href="https://twitter.com/sempf/status/689763659644416000">January 20, 2016</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

<br style="clear: both" /><br />

Fair enough. <br /><br />

So I fixed it... how's this?<br /><br /><br />

<img src="https://static.lachlanbarclay.net/pics/owasp-fixed.png" class="img-responsive">

<br style="clear: both" /><br />

The "main" culprit was the TABLE tag inside the HTML:<br /><br />

<img src="https://static.lachlanbarclay.net/pics/owasp-html.png" class="img-responsive">

<br style="clear: both" /><br />

Removing that got us 50% of the way there... then we just needed a bit more CSS to clean it up:<br /><br />

<pre>


/* For code examples, make any long text add a scrollbar to the code sample,
not the whole window */

pre { overflow-x: auto; }

/* For any text that isn't broken up by a space, force it to wrap if it's too long */

body { word-wrap: break-word; }

/* For smaller width screens (less than 768px) */

@media (max-width: 767px){

	/* Move the left navigation panel so it's below the content */
	#mw-panel { position: static !important; }
	
	/* Get rid of the margins for the content as there's no left nav now */
	#left-navigation,#footer,#content { margin-left: 0 !important; }
	
	/* Fix the navigation to that it fits properly on the screen */
	#left-navigation, #right-navigation  { float: none; }

	/* Move the search bar to float to the right */
	#p-search { float: right !important; }
	
	/* Make the search input box a bit smaller so it fits */
	div#simpleSearch { width: 8em; }

}

</pre>

<br style="clear: both" /><br />

And voila! Let's see how long it takes them to implement :)