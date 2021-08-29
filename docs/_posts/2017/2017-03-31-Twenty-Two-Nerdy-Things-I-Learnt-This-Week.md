---
date: 2017-03-31
category: technical
readtime: true
---
<p>You learn a lot when writing code. </p>

<ul>

<li>	You can <a href="https://docs.gitlab.com/ce/workflow/milestones.html">bundle issues into milestones</a> and tie them to releases in GitLab </li>

<li>	You can't quickly and easily send someone a link to a <a href="https://www.visualstudio.com/en-us/docs/work/backlogs/add-work-items">TFS work item</a>. ARGH. </li>

<li>	<a href="http://www.dell.com/en-us/shop/dell-e-port-plus-advanced-port-replicator-with-usb-3-0/apd/331-7947/pc-accessories">Dell docking stations</a> sometimes decide that the DVI port just won't work but the VGA port will continue to work. Also, sometimes they can't drive multiple screens. </li>

<li>	The Korean language has <a href="http://takelessons.com/blog/korean-speech-levels-z11">SEVEN different forms of speech levels</a>. Yes, seven. And no, they are not honorifics, they are different. </li>

<li>	You can write <a href="http://stackoverflow.com/questions/28921701/does-c-sharp-6-0-work-for-net-4-0">c# 6.0 code that runs against .NET framework 4.0, even 2.0</a> ! </li>

<li>	<a href="http://semver.org/">Semantic versioning</a> of your NuGet package is very, very important    </li>

<li>	<a href="http://stackoverflow.com/questions/1953164/why-do-the-division-operators-behave-differently-in-vb-net-and-c">Dividing numbers in c sharp works differently than VB.NET</a> </li></ul>
                                   
<ul>

<li>	& and | are <a href="http://stackoverflow.com/questions/5537607/usage-versus">non-short circuiting operators</a> of && and || </li>

<li>	You can convert vb.net code to csharp, offline, using <a href="http://www.icsharpcode.net/OpenSource/SD/Download/Default.aspx">SharpDevelop 4.4</a> (not version 5) </li>

<li>	If a Microsoft <a href="https://msdn.microsoft.com/en-us/library/ms252067.aspx">Client Report Definition file</a> (*.rdlc) has a data source with an invalid field, it  will fail silently and just not display anything in the report </li>

<li>	<a href="http://haacked.com/archive/2012/02/16/changing-a-strong-name-is-a-major-breaking-change.aspx/">log4net accidentally broke their backwards compatibility</a> from <a href="https://www.nuget.org/packages/log4net/">version 1.2.11 -> 1.2.15</a> by changing their strong key </li>

<li>	If you accidentally enable silverlight debugging you won't be able to debug your ASP.NET app because VS thinks that silverlight is 64bit and your ASP.NET IIS app is 32bit. (Can't find a link, take my word for it). </li>

<li>	Apparently, <a href="http://help.octopusdeploy.com/discussions/questions/2585-advantages-of-octopus-deploy-over-tfs-release-management">MSRelease manager isn't as good as Octopus Deploy</a> </li>

<li>	Interviewing people is hard. <a href="https://blog.codinghorror.com/why-cant-programmers-program/">Make them submit a programming test first.</a></li>

<li>	<a href="https://www.exceptionnotfound.net/dapper-vs-entity-framework-vs-ado-net-performance-benchmarking/">Dapper runs faster than Entity framework</a> for a lot of stuff</li>

<li>	<a href="https://en.wikipedia.org/wiki/Stet">Stet</a> means "cancel this edit" which is typesetting lingo</li>

<li>	If you're referencing a version of a DLL (say, log4net 1.2) , and you're referencing another DLL that also needs a different version of that DLL (eg, log4net 1.1), you can add an assembly mapping entry into your config file telling .NET to automatically use the newer version. This is called <a href="http://stackoverflow.com/questions/11126593/net-assembly-binding-can-i-map-an-assembly-to-a-version-in-another-assembly">assembly mapping</a> and the Microsoft <a href="https://msdn.microsoft.com/en-us/library/7wd6ex19(v=vs.110).aspx">explanation page</a> is unbelievably complicated and convoluted.</li>

<li>	When <a href="https://wiki.jenkins-ci.org/display/JENKINS/I%27m+getting+OutOfMemoryError">Jenkins runs out of memory</a> it really, really barfs and you need to manually restart the service</li>

<li>	<a href="http://stackoverflow.com/questions/1690351/how-to-undo-another-users-checkout-in-tfs-via-the-gui">TFS keeps track of people who have pending changes</a> - even if those people's accounts have been disabled. After many years this can build up to be a lot of pointless data in TFS that needs to be cleaned up</li>

<li>	TFS can do labelling but <a href="http://stackoverflow.com/questions/10016917/how-can-i-find-all-of-the-labels-for-a-particular-tfs-project-sub-folder">searching for labels sucks</a>. A label is “owned” by a user account. You also need to enable "recursive" for it to do what you think it will probably do.</li>

<li>You can't ask Twitter to have someone's <a href="https://support.twitter.com/articles/15362#">inactive account</a>. Even if they haven't <a href="http://twitter.com/rocklan">tweeted in three years</a>.</li>

</ul>

<p>Who ever said programming was boring? </p>