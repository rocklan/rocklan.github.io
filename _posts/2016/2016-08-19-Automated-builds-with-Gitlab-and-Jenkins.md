---
date: 2016-08-19
category: technical
readtime: true
tags: ci devops gitlab jenkins
---
<p>With open source tools <a href="https://jenkins.io">Jenkins</a> and <a href="https://gitlab.com">Gitlab</a> you can automate your builds, track bugs, do code reviews and work in feature branches for .NET development. Here's how to get it all working.</p><br />



* Your first step is to download and install the (free) community edition of <a href="https://gitlab.com">Gitlab</a>. If you don't have a linux server available, you can always run one within <a href="https://www.virtualbox.org">Virtual Box</a> on your windows server. <br /><br />After installation, you should be able to log in and see the home page:
<img data-src="https://static.lachlanbarclay.net/pics/gitjenk/01.Gitlab.png" class="img-responsive lazyload" />
For this example we are going to assume that <b>Gitlab</b> is available at the following address:
<br /><pre>http://10.55.30.141:8888</pre>



* On your windows server, you need to install the following:

	* <a href="https://jenkins.io">Jenkins</a>. Make sure you install the following plugins:
		
	* Gitlab Plugin
		
	* Credentials Plugin
		
	* Git plugin
		
	* xUnit plugin
	
* <a href="https://www.microsoft.com/en-au/download/details.aspx?id=53344">.NET Framework 4.6.2</a>  
	
* <a href="https://www.microsoft.com/en-us/download/details.aspx?id=48159">MsBuild</a>  
	
* <a href="https://git-scm.com/download/win">Git for Windows</a></ul>
	
	<br />Once installed, your Jenkins server should look something like this:

	<img data-src="https://static.lachlanbarclay.net/pics/gitjenk/02.Jenkins.png" class="img-responsive lazyload" />
	
	For this example we are going to assume that <b>Jenkins</b> is available at the following address:
<br /><pre>http://10.55.30.100:8080</pre>


* Within Gitlab, go ahead and create a new project named "example":

<img data-src="https://static.lachlanbarclay.net/pics/gitjenk/03.a.GitlabNewProject.png" class="img-responsive lazyload" />

and then create a .gitignore file:

<img data-src="https://static.lachlanbarclay.net/pics/gitjenk/03.b.GitLabGitIgnore.png" class="img-responsive lazyload" />

Put the following contents into the file:
```
 *.suo
 [Dd]ebug/
 [Dd]ebugPublic/
 [Rr]elease/
 [Rr]eleases/
 x64/
 x86/
 bld/
 [Bb]in/
 [Oo]bj/
 [Ll]og/
  ```

 

* Now you can check out your project by running Git Gui and cloning your repository:

<img data-src="https://static.lachlanbarclay.net/pics/gitjenk/03.c.GitClone.png" class="img-responsive lazyload" />

When prompted, enter your Gitlab username + password.


* You can now create a project inside this directory. If VS complains that the folder isn't empty, create it in a different spot and then move it into your cloned git directory. In this example, we're just creating a boring console app:

<img data-src="https://static.lachlanbarclay.net/pics/gitjenk/04.VS-Example.png" class="img-responsive lazyload" />
<img data-src="https://static.lachlanbarclay.net/pics/gitjenk/05.VS-Example2.png" class="img-responsive lazyload" />


* Commit and Push your changes:

<img data-src="https://static.lachlanbarclay.net/pics/gitjenk/06.GitCommit.png" class="img-responsive lazyload" />


* You should now see your new application within Gitlab!

<img data-src="https://static.lachlanbarclay.net/pics/gitjenk/12.GitLabRepo.png" class="img-responsive lazyload" />


* Now we need to setup a user account in Gitlab for Jenkins to use. So, create a new user account in Gitlab:

<img data-src="https://static.lachlanbarclay.net/pics/gitjenk/13.NewJenkinsUser.png" class="img-responsive lazyload" />

Annoyingly you can't just enter a password for them. So hit save, then edit the user, and enter in a new password. Then... log out, and log in as this user. You will then be prompted to change your password:

<img data-src="https://static.lachlanbarclay.net/pics/gitjenk/14.JenkinsLogOutLogIn.png" class="img-responsive lazyload" />

You'll also need to go to "Profile Settings" -> "Access Tokens" and create a new token:

<img data-src="https://static.lachlanbarclay.net/pics/gitjenk/17.GitlabAccessToken.png" class="img-responsive lazyload" />


* Log out of Gitlab and log back in as your account. Give the Jenkins account "developer" permissions to your new "example" project by opening the project, clicking on the "settings" icon to the top right and clicking "Members":

<img data-src="https://static.lachlanbarclay.net/pics/gitjenk/15.AddJenkinsToProject.png" class="img-responsive lazyload" />

Type "Jenkins", give them "Developer" permissions and hit "add users to project".



* Now we can start setting up Jenkins! Open up Jenkins and go to Manage -> Configure System, and scroll down to the "Gitlab" section. You'll need to enter your gitlab details into Jenkins:

<img data-src="https://static.lachlanbarclay.net/pics/gitjenk/19.JenkinsConfigureApi.png" class="img-responsive lazyload" />

Next to the Credentials dropdown, click Add, and choose "Gitlab Api Token" next to "Kind", and enter your jenkins accound with the corresponding access token:

<img data-src="https://static.lachlanbarclay.net/pics/gitjenk/18.JenkinsConfigureGitlab.png" class="img-responsive lazyload" />

Click ok and make sure that this credential is selected in the dropdown. If it doesn't appear, you need to add the "credentials" plugin - if that doesn't work, install the "Plain Credentials" plugin and <b>restart Jenkins</b>. After that it should be selectable. <br /><br />


* Now scroll down to the Git section and enter your install location for Git:

<img data-src="https://static.lachlanbarclay.net/pics/gitjenk/20.JenkinsConfigureGit.png" class="img-responsive lazyload" />

Jenkins is now configured.


* We can now setup a job to continously build our application. Back to the main screen of Jenkins, create a new "freestyle project" job:

<img data-src="https://static.lachlanbarclay.net/pics/gitjenk/16.JenkinsNewJob.png" class="img-responsive lazyload" />

Scroll down to Source Code management, select Git, and enter your repo details:

<img data-src="https://static.lachlanbarclay.net/pics/gitjenk/21.JenkinsConfigureGitCheckout.png" class="img-responsive lazyload" />

In the <b>"Branches to Build"</b> section, you can leave it as master or you can enter <b>origin/${gitlabSourceBranch}</b>, which will mean that this Jenkins job will automatically build <b>any branch you push to</b>. Very cool.
<br /><br />

Scroll down to "Build Trigger", and choose "build when a change is pushed to gitlab"

<img data-src="https://static.lachlanbarclay.net/pics/gitjenk/22.GitlabBuildTriggers.png" class="img-responsive lazyload" />
 

* Back within Gitlab, go to your project, click on the "settings" icon and choose "webhooks" and copy and paste the Jenkins URL:

<img data-src="https://static.lachlanbarclay.net/pics/gitjenk/23.GitlabWebHook.png" class="img-responsive lazyload" />

Now here's the gotcha. <b>ADD A FORWARD SLASH ONTO THE END OF THE URL</b>. That took me about a day to find.


* Back to Jenkins, scroll down to the "Build" section, click "add build step" and choose "execute windows batch command", and enter the following commands:
<br />
<pre>C:\Windows\Microsoft.NET\Framework\v4.0.30319\msbuild
@IF NOT %ERRORLEVEL% == 0 ( 
     echo ABORT: %ERRORLEVEL%
     exit /b %ERRORLEVEL%
)
</pre>

<img data-src="https://static.lachlanbarclay.net/pics/gitjenk/24.a.JenkinsBuildSetup.png" class="img-responsive lazyload" />
(An alternative to this approach is to use the "MSBuild" Jenkins plugin)
<br /><br />
Also, within the "Post build actions" add a "Publish build status to GitLab"

<img data-src="https://static.lachlanbarclay.net/pics/gitjenk/24.b.JenkinsBuildSetup.png" class="img-responsive lazyload" />



* Click Save and choose "Build Now". It should build ok! You can now setup email notifications so that whenever a build fails your team is notified, or you can use a <a href="https://wiki.jenkins-ci.org/display/JENKINS/Plugins#Plugins-Buildnotifiers">notification plugin</a>. Personally I am a fan of the <a href="https://github.com/aseigneurin/hudson-tray-tracker">Hudson Tray Tracker</a>. 


* Make a change to your code, commit and push it. Gitlab should automatically notify Jenkins to build your code:

<img data-src="https://static.lachlanbarclay.net/pics/gitjenk/25.JenkinsBuild.png" class="img-responsive lazyload" />


<br />
Phew! That's it for now. The next step is to include unit tests, DB upgrades... and then automate your deployments! Those items are outside of scope for this article as this is more than enough work for you to get started with :)