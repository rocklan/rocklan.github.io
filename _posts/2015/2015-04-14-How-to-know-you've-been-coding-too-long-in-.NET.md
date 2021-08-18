---
date: 2015-04-14
category: technical
readtime: true
---
<ol>

<li> Ever called .First() instead of FirstOrDefaut() and had it throw an exception instead of what any sane person would expect and return null?<br /><br /></li>

<li> Ever expected  For Each on a null collection to work the same as an empty collection... (I HATE, HATE THIS)<br /><br /></li>

<li> Ever called  .Hours() instead of  .TotalHours() on a TimeSpan object? <br /><br /></li>

<li> Ever called .Append() or .Sort or .AddHours() or .Replace() .. and it didn't do anything? But then you realise that it RETURNS the value?<br /><br /></li>

<li> Have you ever forgotten to specify the correct app pool in IIS and accidently run against the incorrect framework?<br /><br /></li>

<li> Have you ever developed against IIS Express and discovered the world of difference with your production IIS server?<br /><br /></li>

<li> Stupid, stupid American <b>mm/dd/yyyy</b> format!! Have you ever entered a date of 1/12/2015 and it worked great, then you try 1/13/2015 and it FAILS? (Every single developer in Australia and in the UK hates datetime parsing, because no matter what you do, your server, or your code, or your database server, or your model binding in MVC, or who knows what else... will sometimes decide for no apparent reason that it's going to parse your dates in the (stupid) US format.)<br /><br /></li>

<li> Talking about MVC, did you know that a json object that has a property set to 0 or 1, when bound to a .NET object with a boolean property, using the standard model binding won't set the boolean property to true? I do.<br /><br /></li>

<li> Talking about MVC, when you declare your ViewModel at the top of the page, is it @Model or @model?<br /><br /></li>

<li> Talking about razor, do you remember having to go @Url.Action("index", "home", "") to make it work propertly? I sure do.<br /><br /></li>

<li> Have you ever deleted or renamed a column in your database and then refreshed your Entity framework edmx model and had it all go to hell? I sure have. <br /><br /></li>

<li> Have you ever compiled when only a cshtml change was done?<br /><br /></li>

<li> Have you ever not compiled when a .cs code change was done? <br /><br /></li>

<li> Have you ever typed (throw Exception) instead of (throw) and lost the stack trace? <br /><br /></li>

<li> Have you ever added a new constructor to your lovely object that has parameters, thus DELETING your default constructor... thus killing serialisation?<br /><br /></li>

<li> Have you ever tried to manually set the HTTP Response code in web api? Wow. <br /><br /></li>

<li> Have you ever tried custom routing rules for web api v1? Double wow. <br /><br /></li>

<li> Have you ever tried to do error handling in asp.net and return the correct 404 and 500 error codes with custom error pages? Seriously, it's just ridiculous.<br /><br /></li>

<li> Have you ever tried to configure Elmah and read the "documentation"? EISH.<br /><br /></li>

<li> Have you ever had VS "cache" a property value and show you the INCORRECT VALUE IN THE DEBUGGER? I have.<br /><br /></li>

<li> Have you ever tried to configure WCF? Like with all the XML? And discovered HELL ON EARTH?<br /><br /></li>

<li> Have you ever tried to use the xaml designer for... like... anything? Yeah I thought you'd enjoy that one.<br /><br /></li>

<li> Have you ever tried to include a foreign table in entity framework.. like .Include("ForeignTable") and then realised that it's not strongly typed anymore?<br /><br /></li>

<li> Have you ever edited a razor page, and typed @{ and then at runtime it tells you that you're already in a code bracket?? <br /><br /></li>

<li> Ever added a NuGet package and then all of a sudden it pulls in 17 new packages and destroys your web.config? (SignalR, I'm looking at you)<br /><br /></li>

<li> Have you ever come across a NullReferenceException page and thought "Boy, it would be really handy if they told the VARIABLE NAME THAT THREW THE EXCEPTION". <br /><br /></li>

</ol>