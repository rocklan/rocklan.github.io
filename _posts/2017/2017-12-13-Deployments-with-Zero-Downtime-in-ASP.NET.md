---
date: 2017-12-13
category: technical
readtime: true
cover-img: https://static.lachlanbarclay.net/pics/bluegreen/8-antiforgery.png
tags: deployments aspnet iis 
---

<p>Did you know that you can have zero downtime deployments with your ASP.NET application? 
</p>

<p>You don't even need to be using AWS or Azure, or have a fancy load balancer or anything else clever and expensive! So how does this thing work?</p><br />

<img data-src="https://static.lachlanbarclay.net/pics/bluegreen/0-general-idea2.png" class="img-responsive lazyload" />

   
<br /><br /><p>The basic idea is that you have two instances of your app running in production. At any point in time your users are using only one of these instances, and when you do a deploy you update the instance that isn't being used. Then you switch the users over to the new instance. See that blue line? That's a <a href="https://blogs.msdn.microsoft.com/friis/2016/08/25/setup-iis-with-url-rewrite-as-a-reverse-proxy-for-real-world-apps/">reverse proxy</a>.</p>

<p>Martin Fowler (genius) calls this <a href="https://martinfowler.com/bliki/BlueGreenDeployment.html">Blue-green deployments</a>.
</p>

<h3>So how do I do this?</h3>


<p>Well, before we can proceed, perhaps there should be a few pre-requisites listed:</p>
                                                                                                                                             
<ul>

<li> <a href="https://www.iis.net/downloads/microsoft/application-request-routing">ARR</a> needs to be installed on your server. This is what does the live switcher.</li>

<li>
Your app can't be using <a href="https://msdn.microsoft.com/en-us/library/ms178586.aspx">InProc for Session State</a>. You can use either StateServer, SQLServer or your own custom provider if you really want.
</li>

<li>All code written from now on must be backwards compatible with earlier versions. If you're calling a web service, that web service can't suddenly have a new mandatory field. It needs to be optional and it still needs to work if it's not set.
</li>

<li> All database schema changes must be separate from application releases. You don't want to tightly couple your database changes and your deploys, do you?</li>

</ul>

<h3>So... HOW DO I DO THIS?</h3>
<br />

<p>Ok. First off, install <a href="https://www.iis.net/downloads/microsoft/application-request-routing">Application Request Routing</a>, or ARR for short.</a></p>

<p>Great. Now, add two new sites within IIS and bind them to different ports:</p>

<img data-src="https://static.lachlanbarclay.net/pics/bluegreen/1-iis.png" class="img-responsive lazyload" />

<p>I suggest ports 8080 and 8081. If all has gone according to plan, you should be able to open them both up in your web browser like so:</p>

<img data-src="https://static.lachlanbarclay.net/pics/bluegreen/2-Sites.png" class="img-responsive lazyload" />

<p>Beautiful! Now for the fun part. Go to your application within IIS and open the "URL Rewrite" section:</p><br />

<img data-src="https://static.lachlanbarclay.net/pics/bluegreen/3-UrlRewrite.png" class="img-responsive lazyload" />

<br />
<p>Click "Add Rule(s)..." and select "Reverse Proxy". If you don't see Reverse Proxy, you need to go back and install ARR (and perhaps reboot).</p>

<p>Now you can enter the address of one of your new sites, like so:</p>

<img data-src="https://static.lachlanbarclay.net/pics/bluegreen/4-ReverseProxy.png" class="img-responsive lazyload" />

<br />
<p>Click save, and you should now be able to open your existing application within IIS and see that you're actually proxying all requests to one of your sites!</p>

<img data-src="https://static.lachlanbarclay.net/pics/bluegreen/5-Proxied.png" class="img-responsive lazyload" />

<br />
<p>You can now change your reverse proxy to point towards 8081, simulating a live switchover. Just edit the rule within the IIS GUI and change the port number. Or, you can modify the generated web.config file yourself, which I find much easier. You're looking for something like this:
</p>

<pre><code class="cs hljs">
&lt;?xml version="1.0" encoding="UTF-8"?&gt;
&lt;configuration&gt;
    &lt;system.webServer&gt;
        &lt;rewrite&gt;
            &lt;rules&gt;
                &lt;rule name="ReverseProxyInboundRule1" stopProcessing="true"&gt;
                    &lt;match url="(.*)" /&gt;
                    &lt;action type="Rewrite" url="http://localhost:8080/testapp/{R:1}" /&gt;
                &lt;/rule&gt;
            &lt;/rules&gt;
        &lt;/rewrite&gt;
    &lt;/system.webServer&gt;
&lt;/configuration&gt;
</code></pre>

<br /><p>Just change that 8080 to 8081, hit reload in your browser, and marvel at the speed of the switchover!</p>
<p>An important thing to note is to make sure that all 3 apps are running within their own Application Pool. You don't want one of your apps to restart just because you've changed the reverse proxy rule.</p>
<h3>Err... now what?</h3>

<p>If you're manually doing your deployments, you can follow these steps:</p>
<ol>
	<li>Open the web.config file and check which port is currently live</li>
	<li>Deploy your app to the <b>other</b> instance.</li>
	<li>Test your changes on the other instance</li>
	<li>Change the web.config file to point towards the other instance</li>
</ol>
But please... please don't manually do deployments!

<h2>Automate everything</h2>


<p>Now that you've got it up and happening, you really, really want to automate the whole thing. It's just too easy for it to go wrong. For this you want powershell, here's a quick rough script that I've knocked up to work with the above example. I have tested this, and it's working ok, but if I was you, I'd probably double check it all myself :)</p>

<p>This example is using <b>MsDeploy</b> for the deploy, just because it's the lowest common denominator. However, I have found MsDeploy to be extremely difficult to use, clunky, error prone and the most bewildering bit of software I've seen in a long time. Check out Octopus Deploy (no I'm not sponsored by them, I just love the product) and you'll never, ever, ever go back.</p> 

<p>This script is also <a href="https://github.com/rocklan/blue-green-deploy/blob/master/deploy.ps1">up on github</a> if you'd like to contribute.</p><br />

<!-- HTML generated using hilite.me --><div style="background: #ffffff; overflow:auto;width:auto;border:solid gray;border-width:.5em .1em .1em .8em;padding:.2em .6em;"><table><tr><td><pre class="prenoborder" style="margin: 0; line-height: 125%">  1
  2
  3
  4
  5
  6
  7
  8
  9
 10
 11
 12
 13
 14
 15
 16
 17
 18
 19
 20
 21
 22
 23
 24
 25
 26
 27
 28
 29
 30
 31
 32
 33
 34
 35
 36
 37
 38
 39
 40
 41
 42
 43
 44
 45
 46
 47
 48
 49
 50
 51
 52
 53
 54
 55
 56
 57
 58
 59
 60
 61
 62
 63
 64
 65
 66
 67
 68
 69
 70
 71
 72
 73
 74
 75
 76
 77
 78
 79
 80
 81
 82
 83
 84
 85
 86
 87
 88
 89
 90
 91
 92
 93
 94
 95
 96
 97
 98
 99
100</pre></td><td><pre class="prenoborder" style="margin: 0; line-height: 125%">$msbuild = <span style="color: #0000FF">&quot;C:\Program Files (x86)\MSBuild\14.0\Bin\MSBuild.exe&quot;</span>
$msDeploy = <span style="color: #0000FF">&quot;C:\Program Files\IIS\Microsoft Web Deploy V3\msdeploy.exe&quot;</span>
$aspnetCompiler = <span style="color: #0000FF">&quot;$env:windir\microsoft.net\framework64\v4.0.30319\aspnet_compiler.exe&quot;</span>

$mydir = (Get-Item -Path <span style="color: #0000FF">&quot;.\&quot;</span> -Verbose).FullName
$outputPath = <span style="color: #0000FF">&quot;$mydir\output&quot;</span>

$reverseProxyFile = <span style="color: #0000FF">&quot;c:\testapp\web.config&quot;</span>
$testappUrl = <span style="color: #0000FF">&quot;http://localhost/testapp&quot;</span>
$testapp1Url = <span style="color: #0000FF">&quot;http://localhost:8080&quot;</span>
$testapp1Dir = <span style="color: #0000FF">&quot;c:\testapp1&quot;</span>
$testapp2Url = <span style="color: #0000FF">&quot;http://localhost:8081&quot;</span>
$testapp2Dir = <span style="color: #0000FF">&quot;c:\testapp2&quot;</span>

<span style="color: #008800; font-style: italic"># compile and build the package</span>

Remove-Item $outputPath -Recurse -ErrorAction Ignore
&amp;$msbuild /p<span style="color: #a61717; background-color: #e3d2d2">:</span>configuration=release /p<span style="color: #a61717; background-color: #e3d2d2">:</span>deployonBuild=true /p<span style="color: #a61717; background-color: #e3d2d2">:</span>DeployDefaultTarget=WebPublish /p<span style="color: #a61717; background-color: #e3d2d2">:</span>WebPublishMethod=FileSystem /p<span style="color: #a61717; background-color: #e3d2d2">:</span>publishurl=<span style="color: #0000FF">&quot;$outputPath&quot;</span> /verbosity<span style="color: #a61717; background-color: #e3d2d2">:</span>minimal
<span style="color: #000080; font-weight: bold">if</span> ($LastExitCode -ne 0) { exit }


<span style="color: #008800; font-style: italic"># check which instance is currently live by making a HTTP request to up.html</span>

<span style="color: #000080; font-weight: bold">try</span> 
{
    echo <span style="color: #0000FF">&quot;`nChecking $testapp1Url for up.html&quot;</span>
    $webRequestResult = (New-Object System.Net.WebClient).DownloadString(<span style="color: #0000FF">&quot;$testapp1Url/up.html&quot;</span>)
    $deployInternalUrl = $testapp2Url
    $deployInternalUrlOld = $testapp1Url
    $deployDir = $testapp2Dir
    $deployDirOld = $testapp1Dir
}
<span style="color: #000080; font-weight: bold">catch</span> 
{
    $deployInternalUrl = $testapp1Url
    $deployInternalUrlOld = $testapp2Url
    $deployDir = $testapp1Dir
    $deployDirOld = $testapp2Dir
}

echo <span style="color: #0000FF">&quot;`nDeploying to: $deployDir which is $deployInternalUrl&quot;</span>
echo <span style="color: #0000FF">&quot;(Last deployed to: $deployDirOld which is $deployInternalUrlOld)`n&quot;</span>


<span style="color: #008800; font-style: italic"># From here, deploy to $deployDir</span>

&amp;$msdeploy -verb<span style="color: #a61717; background-color: #e3d2d2">:</span>sync -source<span style="color: #a61717; background-color: #e3d2d2">:</span>contentPath=<span style="color: #0000FF">&quot;$outputPath&quot;</span> -dest<span style="color: #a61717; background-color: #e3d2d2">:</span>contentPath=<span style="color: #0000FF">&quot;$deployDir&quot;</span>

<span style="color: #008800; font-style: italic"># Pre-compile our app to reduce application startup time:</span>

echo <span style="color: #0000FF">&quot;`nRunning the aspnet compiler in $deployDir`n&quot;</span>

<span style="color: #000080; font-weight: bold">try</span> 
{
    &amp;$aspnetCompiler -v /$iisPath -p $deployDir -errorstack | write-host
}
<span style="color: #000080; font-weight: bold">catch</span> [System.AppDomainUnloadedException]
{
    &amp;$aspnetCompiler -v /$iisPath -p $deployDir -errorstack | write-host
}

<span style="color: #008800; font-style: italic"># Check that the newly deployed app is up and running:</span>

<span style="color: #000080; font-weight: bold">try</span> 
{
    echo <span style="color: #0000FF">&quot;`nChecking $deployInternalUrl is responding ok`n&quot;</span>
    $webRequestResult = ` 
        (New-Object System.Net.WebClient).DownloadString($deployInternalUrl)
}
<span style="color: #000080; font-weight: bold">catch</span> 
{
    echo <span style="color: #0000FF">&quot;Newly deployed app failed to startup properly, cancelling switchover&quot;</span>
    exit
}




<span style="color: #008800; font-style: italic"># Modify reverse proxy file</span>

echo <span style="color: #0000FF">&quot;Updating reverse proxy config file $reverseProxyFile to point towards $deployInternalUrl`n&quot;</span>

$content = [Io.File]<span style="color: #a61717; background-color: #e3d2d2">::</span>ReadAllText($reverseProxyFile) 
$updatedContent = $content -ireplace <span style="color: #0000FF">&#39;action type=&quot;Rewrite&quot; url=&quot;.*&quot;&#39;</span>, `
    <span style="color: #0000FF">&quot;action type=&quot;&quot;Rewrite&quot;&quot; url=&quot;&quot;$deployInternalUrl/{R:1}&quot;&quot;&quot;</span>
		
Out-File -FilePath $reverseProxyFile -InputObject $updatedContent -Encoding UTF8

<span style="color: #008800; font-style: italic"># Move the up file so that the next deploy works ok</span>

echo <span style="color: #0000FF">&quot;Moving uptime file from $deployDirOld\up.html to $deployDir\up.html&quot;</span>
move <span style="color: #0000FF">&quot;$deployDirOld\up.html&quot;</span> <span style="color: #0000FF">&quot;$deployDir\up.html&quot;</span>


<span style="color: #008800; font-style: italic"># Make a request to the live URL just to make sure everything is ok:</span>

echo <span style="color: #0000FF">&quot;Making a request to $testappUrl to make sure everything is ok&quot;</span>
$webRequestResult = (New-Object System.Net.WebClient).DownloadString($testappUrl)

echo <span style="color: #0000FF">&quot;`nDone!&quot;</span>
</pre></td></tr></table></div>




<h3>Gotcha!</h3>


<h4>Precompilation</h4>


<p>Whenever an ASP.NET application is first accessed, the initial response will be sloooow. This is because ASP.NET needs to compile your views. You can work around this problem by <a href="https://msdn.microsoft.com/en-us/library/ms229863.aspx">pre-compiling your app</a>! If you look at my above script you should be able to see this line:

<pre>
$aspnetCompiler = <span style="color: #0000FF">&quot;$env:windir\microsoft.net\framework64\v4.0.30319\aspnet_compiler.exe&quot;</span>
&amp;$aspnetCompiler -v /$iisPath -p $deployDir -errorstack | write-host
</pre>

<br /><p>So what's the gotcha?</p>
<p>The problem that I had was sometimes the precompile step would throw a <b>[System.AppDomainUnloadedException]</b> exception. I think this is because IIS hadn't finished restarting my application pool. My solution? Catch the exception and try it again :) So far it's been working ok!</p>

<p>I believe you can also get MsBuild/MsDeploy to precompile your application as part of the build, so perhaps that's another option to check out. There's an obscure flag named <b>PrecompileBeforePublish</b> that <a href="https://stackoverflow.com/questions/19786309/precompilebeforepublish-using-msbuild">doesn't really seem to be documented anywhere</a> but perhaps that's an option.</p>

<p>There is also the <a href="https://msdn.microsoft.com/en-us/library/bb397866.aspx">aspnet_merge</a> tool. This can be used to compile the output of a precompiled site to reduce the number of assemblies. I haven't found it neccesary, but maybe it's worth checking out.</p>

<br /><h4>WCF</h4>


<p>If you're using WCF (I know, I know), you need to remove the handler for the <b>svc</b> extension in your URLs in the reverse proxy config. Just add this <b>handlers</b> section to your web.config:</p>

<pre><code class="cs hljs">&lt;?xml version="1.0" encoding="UTF-8"?&gt;
&lt;configuration&gt;
    &lt;system.webServer&gt;
        &lt;rewrite&gt;
            &lt;rules&gt;
                &lt;rule name="ReverseProxyInboundRule1" stopProcessing="true"&gt;
                    &lt;match url="(.*)" /&gt;
                    &lt;action type="Rewrite" url="http://localhost:8080/testapp/{R:1}" /&gt;
                &lt;/rule&gt;
            &lt;/rules&gt;
        &lt;/rewrite&gt;
        &lt;handlers&gt;
            &lt;remove name="svc-ISAPI-4.0_64bit" /&gt;
            &lt;remove name="svc-ISAPI-4.0_32bit" /&gt;
            &lt;remove name="svc-Integrated-4.0" /&gt;
        &lt;/handlers&gt;
    &lt;/system.webServer&gt;
&lt;/configuration&gt;
</code></pre>
		
<br /><p>So what's the gotcha? You might need to also double check your binding configuration. If your internal site(s) are running under HTTP instead of HTTPS (or vice versa), you might need to re-examine the transport security config. Ergh, WCF.</p>		

<br /><h4>Anti Forgery (ahem, Tokens)</h4>


<img data-src="https://static.lachlanbarclay.net/pics/bluegreen/8-antiforgery.png" class="img-responsive lazyload" />
<br />
<p>If you're using <a href="https://docs.microsoft.com/en-us/aspnet/web-api/overview/security/preventing-cross-site-request-forgery-csrf-attacks">AntiForgery Tokens to protect against CSRF attacks</a> you might come across another problem. </p>

<p>When you change your reverse proxy to point towards your other application instance, any existing users will be passing through the antiforgery token <b>from the wrong app</b>. This means that your requests will fail validation! So how do you work around this? You need to make sure that both applications use the same <b>encryptionKey</b> and <b>validationKey</b>. </p>

<p>These two keys are confusingly hidden inside a section within IIS named "Machine Keys". However these keys are <b>application level scoped</b>, so they are nothing to do with your machine! So fire up IIS, and within the ASP.NET section find the machine keys icon:</p>

<img data-src="https://static.lachlanbarclay.net/pics/bluegreen/6-machinekey.png" class="img-responsive lazyload" />

<p>Disable the <b>automatically generate at runtime</b> and <b>Generate a unique key for each application</b>, and go ahead and click the "Generate Keys" link:</p>

<img data-src="https://static.lachlanbarclay.net/pics/bluegreen/7-machinekey2.png" class="img-responsive lazyload" />

<p>This should generate the following for your application's web.config:</p>

<pre><code class="cs hljs">&lt;?xml version="1.0" encoding="UTF-8"?&gt;
  &lt;system.web&gt;
	  ...
    &lt;machineKey decryptionKey="MyRandomlyGeneratedDecryptionKey" validationKey="ValidationKey" /&gt;
  &lt;/system.web&gt;
</code></pre>

<p>Copy and paste this line to the other instance of your app. Done!</p>

<br /><h4>Database changes</h4>


<p>Ever notice how articles expounding the virtues of automated deploy hardly ever talk about database schema changes? </p>

<p>This is a much bigger topic and deserves it's own post, but I think we can narrow down our options to:</p>
<ol>
<li>Script all of your database changes and run them in as part of your deploy, using something like <a href="https://dbup.github.io/">DbUp</a></li>
<li>Use something like <a href="https://msdn.microsoft.com/en-us/library/jj591621(v=vs.113).aspx">Entity Framework Migrations</a> and have your application upgrade your DB</li>
<li>Make all of your database changes backwards compatible with your new code, and run them separate to your deploy</li>
</ol>

<p>I'll be writing another article on this topic soon.</p>

<h3>All done!</h3>


<p>Do you think it's worth moving to blue-green deployments? I'd love to hear from you and what problems you had. Hit me up below!</p>

<style type="text/css">
	.hljs { background: #F5F5F5; color: #555555 }
	.hljs-string { color: #A31515; }
	.hljs-keyword { color: #0000FF;font-weight:normal; }
	.hljs-title { color: #2B91AF; }
	.prenoborder { border: none !important; background-color: white }
</style>
