---
date: 2006-11-30
category: technical
readtime: true
excerpt: Today I stumbled across a bit of VB.NET code that used the andalso keyword. If you're anything like me (unlikely, but possibly likely), you'll probably take a second glance.
share-description: Using the andalso keyword in vb.net will stop your code crashing! It's called "short circuit evaluation" and it's pretty cool. 
---
![Johnny 5](/pics/johnny5.png){:class="fa-pull-right"}

Today I stumbled across a bit of VB.NET code:


```if not (dataset is nothing) <b>andalso</b> (dataset.rows > 0) then```

Now if you're anything like me (which is unlikely) you'll probably take a second glance at the "andalso" reserved word. So what the heck is it? What's the difference between "andalso" and just a plain good old "and"?

Well the answer is something called "Short Circuit Evaluation". Java does it, perl does it, and now VB.NET can too!

Previously, in VB6 land, if you wrote a bit of code that looked like this:

```vb
if (1 = 2) AND (testFunction("hi")) then

	print "hello"

end if

function testFunction(s)
	print s
	testFunction = true
end sub
```

Your program would print out "hi", but not "hello". Now this makes sense, you've written some code to check to see if 1 equals 2 (which is unlikely), AND if testFunction returns true it will then print out "hello". 

It turns out that some clever boffins realised that they could optimise (which is the root of all evil when it comes to programming) your code by not bothering to even call your lovely <i>testFunction</i>. Because 1 does not equal 2, there's just no point in even calling testFunction. 

This can be quite handy, particularly in pointer land (a mystical place where goblins and goblins live peacefully together), as you can check to see if an object is null, and you can also check a property of it ON THE SAME LINE!

Wow, cool huh?

Now if you tried to do the same thing in VB6, it would crash horribly.

So in order to preserve backwards compatibility (Microsoft's mantra, and quite a good one if you ask me, which no-one ever does), the guys decided that VB.NET should do the same thing as VB6, but that if you wanted to get all clever and cool you could use the <b>ANDALSO</b> keyword. So if I changed my code to VB.NET and wrote:

```vb
if (1 = 2) ANDALSO (testFunction("hi")) then

	print "hello"

end if

function testFunction(s)
	print s
	testFunction = true
end sub
```

My program would print out NOTHING ! That's absolutely nothing! Cool!

Of course this can lead to horrible things where programmers will start to use ANDALSO without understanding what it means. Oh that'll be fun the day I come across that bug. And I bet I will.

So the question remains, are you fan of short circuit evaluation or not?