---
date: 2021-01-10
category: technical
tags: azure devops templates c#
readtime: true
---

<p>Over the past couple of days I have been investigating using <a href="https://docs.microsoft.com/en-us/azure/devops/pipelines/process/templates?view=azure-devops">Templates</a> for <a href="https://docs.microsoft.com/en-us/azure/devops/pipelines/?view=azure-devops">Azure Pipelines</a>. So far, I am not impressed. After some googling, it seems like there's not that many helpful blogs on the topic, so I'm writing this one to let you know you are not alone! </p>

<h3>UI bugs</h3>

<ul class="widerlists">
	<li> If the template is invalid, the pipeline will fail to run, which is great, however the "Run" button is then disabled - even after you fix the template. This is really confusing. But all you need to do is refresh the page and the button is enabled again. (Handy UI hint - if you're going to disable a button, you need to re-enable it again at some stage) </li>

	<li> The syntax highlighting for the "resources: repositories" says my syntax is wrong when referencing a template. Even though it works perfectly fine. </li> 

	<li> The Azure Devops UI changes the capitalisation of my step names. Even though I <b>explicity</b> set them in my yaml with "display name". (Handy UI hint - if I have the option to set it, don't override it for me) </li>

<li>If I edit the template from within the Azure Devops UI, and click the commit button, the comment message is not highlightable. It seems like it's automatically populated, however if I try to highlight it <b>all</b> to type over it, the highlight magically disappears and the focus is moved to somewhere else. This is really annoying.</li>  

	<li> When editing the YAML, if you highlight an open bracket and type an open curly brace, it <b>doesn't</b> replace it. Instead it <b>adds</b> a close curly bracket (??) and keeps the open bracket!!  This is infuriating. </li>

<li>When editing the YAML, if you add a single quote before a variable name, it works fine. If you add a single quote at the end of a line it <b>adds another one for you</b>. If you then hit delete, it deletes both, even though your cursor is in the middle of the two quotes! It's just inconsistent and annoying, and you have to keep second-guessing everything that the editor is doing.</li>
	
	<li> There is no link to any associated pipelines from the repository screen. Kind of annoying, especially now that they <b>are</b> linked. </li>

</ul>
<br />

<h3>Templating bugs:</h3>


<ul class="widerlists">
	<li>  $(packageid) is a <b>reserved</b> variable name - but no warning is given! If you attempt to set this variable yourself it will screw up your builds. </li>
	
	<li>  When you add the <b>"Dotnet build"</b> task - "WorkingDir" does not work! It works fine when using the UI and non-yaml builds.. but when using yaml, no deal. At least a warning should be given but it just continues on it's merry way, silently. This is really, really infuriating. </li>
	
	<li>  If using a template, the "repository" and "name" variables are the wrong way around. You specify the repository location in the name variable! </li>
	
	<li>  When using parameters in the YAML file, if you mis-type the parameters name (like ${{parameters.BuildOutputDirectoryz}}, no checking is done. It will just be blank.  </li>
	
	<li>  The syntax documented for parameters does not work on Azure Devops 2019 server. This is known but not explained anywhere in the <a href="https://developercommunity.visualstudio.com/content/problem/941173/facing-a-sequence-was-not-expected-when-applying-y.html">documentation</a>. </li>
	 
	<li>  No way of specifying mandatory parameters - I mean... seriously. You have to write some custom  nightmarish <b>bash</b> code.  I find this kind of ridiculous. Where's the "optional=false" or "mandatory=true" option? Haven't we moved beyond this?</li>

</ul>
<br />
	
<h4>Sigh.</h4>


<p>Templates for Azure devops pipelines <b>do</b> actually work, and when they work, it's all good. But it's all a bit too new. The experience isn't great, and I spent many days on the above when I was only expecting to take a few hours. Oh well, give it another year.</p>

<style>
.widerlists li { margin-top: 1em; }
</style>