---
date: 2015-04-19
category: technical
readtime: true
tags: craftsmanship
---
So you’ve been working as a programmer for a couple of years, and you want to become a good programmer. But not just a good programmer, you want to be a GREAT programmer. You want to paint with ALL the colors. Hell, you want to paint with all the dimensions. You want to be the GURU of programming – not just some nerd that’s stuck in corner that knows every namespace in the .NET API and can punch out a website in a day – you want to be a Michelangelo. A Picasso. Programming isn’t a science, it’s an art. You want to be respected.
<br /><br />
Boy that’s a big ask.
<br /><br />
So how do you get started?
<br /><br />
By now you’ve hopefully realized that what makes good programmers great isn’t necessarily their technical skills. Your technical skills can be <b><i>AWESOME</i></b>, but if you don’t know what your customer wants, they amount to diddly squat. Of course if you know what your customer wants but don’t have the technical skills to back it up, you’re also up the creek. So what are the technical things you want to learn?
<br /><br />
* <b>How to write “DRY” code.</b> DRY stands for “Don’t Repeat Yourself”. Copy and paste coders are not real coders. If you find yourself writing the same (or similar enough) lines of code more than once, it needs to be cleaned up so that you don’t have duplicate code all over the place. This will actually keep your codebase smaller, easier to maintain and reduce your bug count. People call this refactoring and it’s a daily part of our job. It’s not an optional extra for the end of a project.
<br /><br />
* <b>How to keep it simple.</b> Once you’ve got the hang of refactoring and cleaning up your code as you go, you’re going to have to learn the next principle of keeping it simple. Too often once programmers have got it into their head that they need to not repeat themselves, EVER, and so many code bases grow to be an abstracted monstrosity. I’ve seen huge heaving code bases that take minutes to compile, but the application itself hardly does anything. Keeping things simple above all else is your goal.
<br /><br />
* <b>Learn the principle of YAGNI. </b> You Ain’t Gonna Need It. All too often as programmers we want to make sure that we cover all our bases. The customer has asked that the application is to do X. If that’s the case, then they’ll probably want it to do Y and Z too. We might as well spend another 3 days putting that in, after all they’re going to ask for it anyway. Once again, you end up with a much bigger codebase and app than you need, and half of the code in there isn’t being used. Keep it simple!
<br /><br />
This can be a very difficult concept to master. Making your solution flexible, customisable and forseeing future requirements is a very important part of our job. This is where I think that programming can be shown to be an art – there’s no hard and fast rule here. Ultimately it’s up to the programmer(s) discretion over how flexible a solution is – it involves constant judgement calls and a weighing up of the pros and cons. Normally the questions that you want to ask yourself are:
<br /><br />
“How much extra work will it be to make this more flexible?” vs
<br /><br />
“How much time do we have?” vs
<br /><br />
“Will they <i>really</i> need it?” vs
<br /><br />
“is this making the code worse or better?”
<br /><br />
These kind of questions are very difficult to answer on your own. Two heads are so much better than one! Often just talking through the problem and the solution with another guy can help you work out the right approach yourself. Even picking up the phone to call another programmer to see what they think can save you a lot of pain.
<br /><br />
<b>* How to constructively review other people’s code. </b>Code reviews can send a shiver down the spine of the most experienced programmer. They can be harrowing, aggravating and an ultimate waste of time. They can also be a delight, an opportunity to learn from others and to improve your skills! The most important aspect of code reviews is not what technical details you are looking out for, but the attitude and expectations that people approach the review with. If you’re dying to bag out someone’s code and make them feel bad, if you’re on the witch-hunt to see how many bugs you can find, then you’re going to be in trouble. People will resent these code reviews, nobody will want to help anybody else and most importantly, your code will not get any better!
<br /><br />
The approach that you want is for everybody to go in with the mentality that “we’re here to learn from everybody else and to improve the code”.
<br /><br />
<b>* Design patterns.</b> Reading the classic book on design patterns can give you a lightbulk moment – “oh, THAT’S how I solve that messy coding problem”. The danger that most people have is overapplying design patterns and you end up with a bigger mess than you started. Once you’ve learnt how to use a hammer everything starts looking like a nail. So don’t overzealously use them for the sake of it.
<br /><br />
<b>* Keep up to date with frameworks & libraries. </b>You don’t have to use them, but you need to know what they do and their pro’s & con’s. A great example of this is SignalR - before this came along I would have been adamant that there is just no way that you can easily do realtime notifications within your web application. Turns out that before signalr there were libraries like pubnub who do this kind of thing with ease – but I had no idea! If I hadn’t kept up to date I could have been the one spouting rubbish (well, more often than usual, anyway). Keeping up to date with libraries and frameworks will also show you how if something seems way too hard to do then there’s probably (hopefully) a much easier way of doing things. Don’t write your own service bus layer when there’s MSMQ.
<br /><br />
<b>* How to comment your code. </b>If you’re not commenting code then you’re making your life more difficult. When you come back to that function you wrote 6 months ago you’re not going to have a clue why you wrote it in such a convoluted way. Hey, it turns out that you did it that way for a reason! And BTW you shouldn’t simplify this mess because you’ll actually break it!
<br /><br />
You also want to learn how to write down that complicated algorithm in a flowchart or just write it out in english. Don’t expect that someone will spend 2 days trying to reverse engineer your code. Don’t expect that people in the business will learn/remember/understand that complicated logic that they asked you to do. You’re going to end up pulling out this flowchart in at least 3 meetings in the future whenever people say “So what happens when x happens and then y?”
<br /><br />
<b>* How to write unit tests. </b>Writing tests is a great way to ensure that your code will continue to work, even when some dufus comes along and modifies the database schema without telling you. Okay, well your code definitely won’t work, but now you can catch it the very day that someone renames a column. Instead of catching it three weeks later and finding out that your application hasn’t been calculating numbers properly. You’ll also want to learn what TDD is and see if it’s a good fit for you.
<br /><br />
<b>* What dependency injection / IOC is. </b>A contentious argument for sure, but one you want to be well informed of. It’ll also give you a massive leg-up on when you see your first project that uses DI. If you don’t know what’s going on, you’d swear the code is backwards and insideout.
<br /><br />
<b>* How continuous integration is your saviour. </b>I can’t imagine working on a project these days without CI. If I didn’t have a build running everytime someone checked in some code I would be quite terrified. It’s your safety net, your progress indicator and your one-click deploy solution all in one.
<br /><br />
<b>* Know what’s going on under the hood.</b> For example, calling a web service – what’s it actually doing? If it’s WCF it’s creating a SOAP service call – you should check out the actual data that is sent over the wire sometime. It’s massive. If I hadn’t peeked under the hood I would have had no idea just how much bandwidth it needs. When it comes to programming, nothing just happens magically.
<br /><br />
<b>* Learn the gist of quite a few programming languages. </b>You’d be surprised what you can learn from other areas. If you don’t know how simple python is nor how easy a web application is in ruby on rails, then you’re only seeing one side of the coin. If you’re coming in from strictly typed languages then javascript is a bizarre world in itself! I’m a c# developer and I’ve found that java guys think very differently. So do PHP people.
<br /><br />
<b>* How to debug. </b>I agree with everything he says – real programmers don’t guess, they debug. If you think or hope something is working, you’re probably wrong. You need to SEE it working and prove that it’s working. I can’t tell you the number of times I’ve looked at code and said “there, that will work” only to run it and see that it doesn’t. Actually while you’re at it, read his other answers. There’s a voice of experience.
<br /><br />
<b>* Make fun of the losers. </b>You also need to learn which programming languages you can successfully make fun of without someone actually punching you in the face.
<br /><br />
So what about the non technical stuff? These are the <b>hard</b> ones.
<br /><br />
<b>* How to justify your project to management. </b>Management will continually conveniently forget what the point of your project is. You need to be able to explain it in 30 seconds, and then if given the opportunity explain it in 360 seconds. How it benefits the business and why. If you can’t articulate it, nobody else will be able to, and pretty soon people will be asking “why is that guy here?”
<br /><br />
<b>* How to explain to management what you’re doing and why. </b>This is different to justifying your project. Some bosses like to know what you’re doing every day – when s/he does, you better have a good answer. “Working on code” is not a good answer. “Adding feature X that will solve problem Y” is a much better answer.
<br /><br />
<b>* How to clarify and write down what the customers wants (“requirements”).</b> This is an art in and of itself. If you can do this, your programming job will be A BREEZE. You know all those arguments and problems that you had with people outside of IT? They can be resolved by writing down what people say. Write it down in front of them, during the meeting. Learn from technical BA’s – they are a Godsend.
<br /><br />
<b>* How to estimate. </b>People will ask you for an estimate, be prepared. If you don’t know what you’re doing, multiply your estimate by three.  This is not to pad it out – this is to make it more accurate.
<br /><br />
<b>* How to plan your project. </b>Remember, only 30% of your time on a project should be coding. That’s thirty percent.
<br /><br />
<b>* How to differentiate between a bug, an issue and a feature request. </b>They are all different.
<br /><br />
<b>* How to direct other programmers without getting up their nose. </b>You also want to know how to motivate them.
<br /><br />
<b>* How to get along with other programmers. </b>We’re a strange breed. Getting along with us can be a challenge – you’re going to have to learn some ninja skills. I can recommend “how to make friends and influence people” by Dale Carnegie. A classic.
<br /><br />
<b>* How to work with maniacs, psychopaths and just plain crazy people. </b>There’s a lot of them out there. You’re probably one of them yourself.
<br /><br />
<br /><br />
Phew.
<br /><br />
So where do you start? What do you learn first?
<br /><br />
How to <b>GET STUFF DONE.</b> All the theory in the world won’t help you if you can’t get stuff done. Everything above is a waste of time if you’re not getting stuff done. Can this be taught? There’s an interesting question.