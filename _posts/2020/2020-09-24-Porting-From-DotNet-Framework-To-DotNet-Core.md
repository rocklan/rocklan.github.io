---
date:   2020-09-24
category: technical
tags: dotnet dotnetframework dotnetcore workshop popular
cover-img: /images/porting-talk.png
readtime: true
---

I recently gave a talk (over zoom) about moving your Asp.Net Framework application to .NET Core. After moving a bunch of my own applications, I realised that there was an easy road to take, and a hard road to take. Moving your application doesn’t have to be a dangerous experiment. By slowly moving your application across, one class at a time, you can make life easy for yourself and your users.

<div class='embed-container'><iframe src='https://www.youtube.com/embed/ectRj0SBJsw' frameborder='0' allowfullscreen></iframe></div>

If you're interested in this topic or need to do it yourself I run a workshop titled [Porting Your Framework App To Dotnet Core](https://dotnetworkshops.com/workshops/porting-your-aspnet-app-from-framework-to-core). It's pretty good fun, and in it I cover a bunch of stuff:

* The difference between Full-Framework, Core and Dotnet Standard
* Slowly migrating your code to dotnet standard
* Migrating from Entity Framework to EF Core
* Wrapping full-framework only libraries
* Bundling and minifying your javascript and css
* HtmlHelpers and TagHelpers
* Error handling
* Caching
* Antiforgery Tokens
* WebApi
* Moving parts of your web ASPNET application to dotnet core
* Avoiding the most common pitfalls and traps

