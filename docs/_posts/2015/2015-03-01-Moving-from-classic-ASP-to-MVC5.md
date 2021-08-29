---
date: 2015-03-01
category: technical
readtime: true
---
So the past few weeks I've been re-writing my website. Previously it was written in Classic ASP (yes, you read that right) and it was running off a Microsoft <b>Access</b> database. Yes, you read that right too.
Nice URLs in classic ASP weren't impossible, but they weren't exactly easy. Nice URLs in Webforms was possibly even harder! But in MVC... URLs can be super, super friendly. The routing options are many and super variable, and it's all pretty cool. It's quite fiddly to setup, but it's pretty powerful and very nice. You'll see that each blog entry URL on this site has the format /year/month/title. Easy to setup and makes a lot of sense.
I love the entity framework. For basic CRUD operations it's a life saver. Super easy to setup and use, it's amazing. If you've never had to go down the whole "1 stored proc for each database query" you have <b>no idea</b> just how much time you're saving. For anything more complicated than simple queries I'll be using stored procs (stored procs are ace) but for the basics, Entity Framework is awesome.
I love bundling and minifying my javascript and CSS. Your site loads quicker, it uses less bandwidth, it's a win-win. The new <a href="http://www.asp.net/mvc/overview/performance/bundling-and-minification">bundling and minifying</a> libraries are awesome. Easy to setup and use and do the job perfectly. Great job microsoft.
Haven't we learnt enough from the horror that is Java??? I was super happy to move away from Java 10 years ago. It had become XML configuration file hell. The web.config file is great, but boy can it be over-complicated. On top of that a typical MVC project can have <b>multiple</b> web.config files (mine has 3). As far as I know there's no nice easy to read reference for the web.config file format, and I'm <b>always</b> discovering more undocumented "features" that need to be set. (<b><a style="word-wrap: break-word;" href="http://stackoverflow.com/questions/2880383/strange-error-occurring-when-using-wcf-to-run-query-against-sql-server/11531518">minFreeMemoryPercentageToActivateService</a></b> I'm looking at you). Please, Microsoft, continue simplifying the web.config file, not complicating it.
MVC straightjackets you into a particular project layout. You basically <b>have</b> to put your Controllers into /Controllers, your Views into /Views, your javascript into /Scripts, etc etc etc. Now I'm <b>well aware</b> that technically you don't have to, but if you want NuGet to play properly and if you want Visual Studio to play properly, you're going to have to meet it halfway. This is not a lot of fun, especially when the standard layout is pretty, erm, weird. Adding <a href="https://msdn.microsoft.com/en-us/library/ee671793%28v=vs.100%29.aspx?f=255&MSPPError=-2147217396">areas</a> to your project just makes it more confusing. Not cool.
Ok I'm going out on a limb here. I'm not crazy about NuGet. It does weird things to your project without telling you what it's done. Trying to find the "official" or "right" version of a library is difficult. Trying to figure out dependencies (and dependencies of dependencies) is even more difficult. 