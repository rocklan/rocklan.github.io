---
date: 2006-09-14
category: technical
readtime: true
share-description: cvs for source control kind of sucks, perhaps we should move to subversion?
excerpt: I think that CVS is becoming a little bit too ragged around the edges. There's no support, there's no way of renaming files and keeping history, renaming a directory will make your life hell, there's no list of bugs, and there's no searchable forum for help.
---
Today I learnt something. Doing a:

```
cvs tag MyTag ../code
```

gives you a glorious error:

&nbsp;&nbsp;&nbsp;&nbsp;protocol error: `../data/src' has too many ..

Now the obvious workaround;

&nbsp;&nbsp;&nbsp;&nbsp;cd ..
&nbsp;&nbsp;&nbsp;&nbsp;cvs tag MyTag code/

which works fine!

Now typically this wouldn't be a problem, however I was running this job within ANT, and since I don't know a lot about ANT, I couldn't figure out how to change the current directory. I spend ages trying to figure out how to do this. Apparently, you can't. I think that it's not actually ant's fault, it's more of a java problem. But what would I know.

I think that CVS is becoming a little bit too ragged around the edges. There's no support, there's no way of renaming files and keeping history, renaming a directory will make your life hell, there's no list of bugs, and there's no searchable forum for help. Erguhgh. Plus there's no nicely integrated web front-ends. Yes I'm sure that you can install one.. but that's just another thing that you're going to have to hassle with.

I've used sourcesafe before and it worked ok. But trying to automate any of it was a bastard.

Methinks subversion is the way to go. Maybe next project.
