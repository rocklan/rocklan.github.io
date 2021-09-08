---
layout: workshop
title: Porting your ASP.NET app from framework to core
subtitle: Dotnet workshops
cover-img: /images/workshop.webp
---

## Summary

After moving a bunch of my own applications to dotnet core, I realised that there was an easy road to take, and a hard road to take. Moving your framework application to dotnet core doesn’t have to be a dangerous experiment. By slowly moving your application across, one class at a time, you can make life easy for yourself and your users.

<div class='embed-container'><iframe src='https://www.youtube.com/embed/ectRj0SBJsw' frameborder='0' allowfullscreen></iframe></div>

In this workshop we will cover:

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
* Moving parts of your ASPNET application to dotnet core
* Avoiding the most common pitfalls and traps

By the end of this workshop you'll be able to profile your code and work out where the bottlenecks are and know how to fix them.

<hr />

## Register your interest

<div id="submitform">
    <p>If you're interested in attending this workshop please let me know, and I can get back to you with some possible dates.</p>
    <div class="row">
        <div class="col-sm-9">
            <form>
                <div class="form-group">
                    <label for="name" class="text-input-label">Your name:</label> <br>
                    <input type="text" class="text-input-control" id="name" maxlength="50" placeholder="Jane Doe">
                </div>
                <div class="form-group">
                    <label for="email" class="text-input-label">Email:</label> <br>
                    <input type="email" class="text-input-control" id="email" maxlength="100" placeholder="jane.doe@example.com">
                </div>
                <input type="hidden" id="workshopname" value="Porting your ASP.NET app from framework to core" />
                <button type="button" class="btn btn-success" id="submitbutton">Submit</button>
            </form>
        </div>
    </div>
</div>
