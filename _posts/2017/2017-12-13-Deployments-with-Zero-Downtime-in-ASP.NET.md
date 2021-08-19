---
date: 2017-12-13
category: technical
readtime: true
cover-img: https://static.lachlanbarclay.net/pics/bluegreen/8-antiforgery.png
tags: deployments iis 
---

Did you know that you can have zero downtime deployments with your ASP.NET application? 


You don't even need to be using AWS or Azure, or have a fancy load balancer or anything else clever and expensive! So how does this thing work?

<img data-src="https://static.lachlanbarclay.net/pics/bluegreen/0-general-idea2.png" class="img-responsive lazyload" />

   
The basic idea is that you have two instances of your app running in production. At any point in time your users are using only one of these instances, and when you do a deploy you update the instance that isn't being used. Then you switch the users over to the new instance. See that blue line? That's a <a href="https://blogs.msdn.microsoft.com/friis/2016/08/25/setup-iis-with-url-rewrite-as-a-reverse-proxy-for-real-world-apps/">reverse proxy</a>.

Martin Fowler (genius) calls this <a href="https://martinfowler.com/bliki/BlueGreenDeployment.html">Blue-green deployments</a>.


<h3>So how do I do this?</h3>


Well, before we can proceed, perhaps there should be a few pre-requisites listed:
                                                                                                                                             
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


Ok. First off, install <a href="https://www.iis.net/downloads/microsoft/application-request-routing">Application Request Routing</a>, or ARR for short.</a>

Great. Now, add two new sites within IIS and bind them to different ports:

<img data-src="https://static.lachlanbarclay.net/pics/bluegreen/1-iis.png" class="img-responsive lazyload" />

I suggest ports 8080 and 8081. If all has gone according to plan, you should be able to open them both up in your web browser like so:

<img data-src="https://static.lachlanbarclay.net/pics/bluegreen/2-Sites.png" class="img-responsive lazyload" />

Beautiful! Now for the fun part. Go to your application within IIS and open the "URL Rewrite" section:

<img data-src="https://static.lachlanbarclay.net/pics/bluegreen/3-UrlRewrite.png" class="img-responsive lazyload" />


Click "Add Rule(s)..." and select "Reverse Proxy". If you don't see Reverse Proxy, you need to go back and install ARR (and perhaps reboot).

Now you can enter the address of one of your new sites, like so:

<img data-src="https://static.lachlanbarclay.net/pics/bluegreen/4-ReverseProxy.png" class="img-responsive lazyload" />


Click save, and you should now be able to open your existing application within IIS and see that you're actually proxying all requests to one of your sites!

<img data-src="https://static.lachlanbarclay.net/pics/bluegreen/5-Proxied.png" class="img-responsive lazyload" />


You can now change your reverse proxy to point towards 8081, simulating a live switchover. Just edit the rule within the IIS GUI and change the port number. Or, you can modify the generated web.config file yourself, which I find much easier. You're looking for something like this:

```csharp
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <system.webServer>
        <rewrite>
            <rules>
                <rule name="ReverseProxyInboundRule1" stopProcessing="true">
                    <match url="(.*)" />
                    <action type="Rewrite" url="http://localhost:8080/testapp/{R:1}" />
                </rule>
            </rules>
        </rewrite>
    </system.webServer>
</configuration>
```

Just change that 8080 to 8081, hit reload in your browser, and marvel at the speed of the switchover!
An important thing to note is to make sure that all 3 apps are running within their own Application Pool. You don't want one of your apps to restart just because you've changed the reverse proxy rule.

<h3>Err... now what?</h3>

If you're manually doing your deployments, you can follow these steps:
<ol>
	<li>Open the web.config file and check which port is currently live</li>
	<li>Deploy your app to the <b>other</b> instance.</li>
	<li>Test your changes on the other instance</li>
	<li>Change the web.config file to point towards the other instance</li>
</ol>
But please... please don't manually do deployments!

<h2>Automate everything</h2>

Now that you've got it up and happening, you really, really want to automate the whole thing. It's just too easy for it to go wrong. For this you want powershell, here's a quick rough script that I've knocked up to work with the above example. I have tested this, and it's working ok, but if I was you, I'd probably double check it all myself :)

This example is using <b>MsDeploy</b> for the deploy, just because it's the lowest common denominator. However, I have found MsDeploy to be extremely difficult to use, clunky, error prone and the most bewildering bit of software I've seen in a long time. Check out Octopus Deploy (no I'm not sponsored by them, I just love the product) and you'll never, ever, ever go back. 

This script is also <a href="https://github.com/rocklan/blue-green-deploy/blob/master/deploy.ps1">up on github</a> if you'd like to contribute.

```powershell
$msbuild = "C:\Program Files (x86)\MSBuild\14.0\Bin\MSBuild.exe"
$msDeploy = "C:\Program Files\IIS\Microsoft Web Deploy V3\msdeploy.exe"
$aspnetCompiler = "$env:windir\microsoft.net\framework64\v4.0.30319\aspnet_compiler.exe"

$mydir = (Get-Item -Path ".\" -Verbose).FullName
$outputPath = "$mydir\output"

$reverseProxyFile = "c:\testapp\web.config"
$testappUrl = "http://localhost/testapp"
$testapp1Url = "http://localhost:8080"
$testapp1Dir = "c:\testapp1"
$testapp2Url = "http://localhost:8081"
$testapp2Dir = "c:\testapp2"

# compile and build the package

Remove-Item $outputPath -Recurse -ErrorAction Ignore
&$msbuild /p:configuration=release /p:deployonBuild=true /p:DeployDefaultTarget=WebPublish /p:WebPublishMethod=FileSystem /p:publishurl="$outputPath" /verbosity:minimal
if ($LastExitCode -ne 0) { exit }


# check which instance is currently live by making a HTTP request to up.html

try 
{
    echo "`nChecking $testapp1Url for up.html"
    $webRequestResult = (New-Object System.Net.WebClient).DownloadString("$testapp1Url/up.html")
    $deployInternalUrl = $testapp2Url
    $deployInternalUrlOld = $testapp1Url
    $deployDir = $testapp2Dir
    $deployDirOld = $testapp1Dir
}
catch 
{
    $deployInternalUrl = $testapp1Url
    $deployInternalUrlOld = $testapp2Url
    $deployDir = $testapp1Dir
    $deployDirOld = $testapp2Dir
}

echo "`nDeploying to: $deployDir which is $deployInternalUrl"
echo "(Last deployed to: $deployDirOld which is $deployInternalUrlOld)`n"


# From here, deploy to $deployDir

&$msdeploy -verb:sync -source:contentPath="$outputPath" -dest:contentPath="$deployDir"

# Pre-compile our app to reduce application startup time:

echo "`nRunning the aspnet compiler in $deployDir`n"

try 
{
    &$aspnetCompiler -v /$iisPath -p $deployDir -errorstack | write-host
}
catch [System.AppDomainUnloadedException]
{
    &$aspnetCompiler -v /$iisPath -p $deployDir -errorstack | write-host
}

# Check that the newly deployed app is up and running:

try 
{
    echo "`nChecking $deployInternalUrl is responding ok`n"
    $webRequestResult = ` 
        (New-Object System.Net.WebClient).DownloadString($deployInternalUrl)
}
catch 
{
    echo "Newly deployed app failed to startup properly, cancelling switchover"
    exit
}




# Modify reverse proxy file

echo "Updating reverse proxy config file $reverseProxyFile to point towards $deployInternalUrl`n"

$content = [Io.File]::ReadAllText($reverseProxyFile) 
$updatedContent = $content -ireplace 'action type="Rewrite" url=".*"', `
    "action type=""Rewrite"" url=""$deployInternalUrl/{R:1}"""
		
Out-File -FilePath $reverseProxyFile -InputObject $updatedContent -Encoding UTF8

# Move the up file so that the next deploy works ok

echo "Moving uptime file from $deployDirOld\up.html to $deployDir\up.html"
move "$deployDirOld\up.html" "$deployDir\up.html"


# Make a request to the live URL just to make sure everything is ok:

echo "Making a request to $testappUrl to make sure everything is ok"
$webRequestResult = (New-Object System.Net.WebClient).DownloadString($testappUrl)

echo "`nDone!"
```




<h3>Gotcha!</h3>


<h4>Precompilation</h4>


Whenever an ASP.NET application is first accessed, the initial response will be sloooow. This is because ASP.NET needs to compile your views. You can work around this problem by <a href="https://msdn.microsoft.com/en-us/library/ms229863.aspx">pre-compiling your app</a>! If you look at my above script you should be able to see this line:

```
$aspnetCompiler = <span style="color: #0000FF">&quot;$env:windir\microsoft.net\framework64\v4.0.30319\aspnet_compiler.exe&quot;</span>
&amp;$aspnetCompiler -v /$iisPath -p $deployDir -errorstack | write-host
```

So what's the gotcha?
The problem that I had was sometimes the precompile step would throw a <b>[System.AppDomainUnloadedException]</b> exception. I think this is because IIS hadn't finished restarting my application pool. My solution? Catch the exception and try it again :) So far it's been working ok!

I believe you can also get MsBuild/MsDeploy to precompile your application as part of the build, so perhaps that's another option to check out. There's an obscure flag named <b>PrecompileBeforePublish</b> that <a href="https://stackoverflow.com/questions/19786309/precompilebeforepublish-using-msbuild">doesn't really seem to be documented anywhere</a> but perhaps that's an option.

There is also the <a href="https://msdn.microsoft.com/en-us/library/bb397866.aspx">aspnet_merge</a> tool. This can be used to compile the output of a precompiled site to reduce the number of assemblies. I haven't found it neccesary, but maybe it's worth checking out.

<h4>WCF</h4>


If you're using WCF (I know, I know), you need to remove the handler for the <b>svc</b> extension in your URLs in the reverse proxy config. Just add this <b>handlers</b> section to your web.config:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <system.webServer>
        <rewrite>
            <rules>
                <rule name="ReverseProxyInboundRule1" stopProcessing="true">
                    <match url="(.*)" />
                    <action type="Rewrite" url="http://localhost:8080/testapp/{R:1}" />
                </rule>
            </rules>
        </rewrite>
        <handlers>
            <remove name="svc-ISAPI-4.0_64bit" />
            <remove name="svc-ISAPI-4.0_32bit" />
            <remove name="svc-Integrated-4.0" />
        </handlers>
    </system.webServer>
</configuration>
```
		
So what's the gotcha? You might need to also double check your binding configuration. If your internal site(s) are running under HTTP instead of HTTPS (or vice versa), you might need to re-examine the transport security config. Ergh, WCF.		

<h4>Anti Forgery (ahem, Tokens)</h4>

<img data-src="https://static.lachlanbarclay.net/pics/bluegreen/8-antiforgery.png" class="img-responsive lazyload" />

If you're using <a href="https://docs.microsoft.com/en-us/aspnet/web-api/overview/security/preventing-cross-site-request-forgery-csrf-attacks">AntiForgery Tokens to protect against CSRF attacks</a> you might come across another problem. 

When you change your reverse proxy to point towards your other application instance, any existing users will be passing through the antiforgery token <b>from the wrong app</b>. This means that your requests will fail validation! So how do you work around this? You need to make sure that both applications use the same <b>encryptionKey</b> and <b>validationKey</b>. 

These two keys are confusingly hidden inside a section within IIS named "Machine Keys". However these keys are <b>application level scoped</b>, so they are nothing to do with your machine! So fire up IIS, and within the ASP.NET section find the machine keys icon:

<img data-src="https://static.lachlanbarclay.net/pics/bluegreen/6-machinekey.png" class="img-responsive lazyload" />

Disable the <b>automatically generate at runtime</b> and <b>Generate a unique key for each application</b>, and go ahead and click the "Generate Keys" link:

<img data-src="https://static.lachlanbarclay.net/pics/bluegreen/7-machinekey2.png" class="img-responsive lazyload" />

This should generate the following for your application's web.config:

```xml
<?xml version="1.0" encoding="UTF-8"?>
  <system.web>
	  ...
    <machineKey decryptionKey="MyRandomlyGeneratedDecryptionKey" validationKey="ValidationKey" />
  </system.web>
```

Copy and paste this line to the other instance of your app. Done!

<h4>Database changes</h4>


Ever notice how articles expounding the virtues of automated deploy hardly ever talk about database schema changes? 

This is a much bigger topic and deserves it's own post, but I think we can narrow down our options to:
<ol>
<li>Script all of your database changes and run them in as part of your deploy, using something like <a href="https://dbup.github.io/">DbUp</a></li>
<li>Use something like <a href="https://msdn.microsoft.com/en-us/library/jj591621(v=vs.113).aspx">Entity Framework Migrations</a> and have your application upgrade your DB</li>
<li>Make all of your database changes backwards compatible with your new code, and run them separate to your deploy</li>
</ol>

I'll be writing another article on this topic soon.

<h3>All done!</h3>


Do you think it's worth moving to blue-green deployments? I'd love to hear from you and what problems you had. Hit me up below!
