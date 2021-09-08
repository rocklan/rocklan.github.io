---
layout: workshop
title: Optimising your code with Visual Studio's Profiler
subtitle: Dotnet workshops
cover-img: /images/workshop.webp
---

## Summary

When code is running slow, most people start guessing at what the problem is, based on their previous experience. The problem is it's so easy to be wrong, and you can waste a huge amount of time fixing the wrong stuff! So how do you take the guesswork out and start making measurable differences? Visual Studio's profiler is a killer tool for working out what's slow. This workshop will cover the profiler extensively and give you the tools to make huge performance improvements to your app. In this workshop we will cover:

* Running the performance profiler
* CPU Sampling vs instrumentation
* Optimising disk access
* The problem with exceptions
* Caching reference data to improve performance
* String concatenation (everyone's favourite!)
* The trouble with reflection
* Making the most of your CPU
* Reducing garbage collections and memory allocation
* Async and Await, how they can hinder and how it can help
* BenchmarkDotNet
* Scaling out vs Scaling up

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
                <div id="validationBox" class="redtext" style='display: none'>
                    Please fix the highlighted fields 
                </div>
                <input type="hidden" id="workshopid" value="1" />
                <button type="button" class="btn btn-success" id="submitbutton">Submit</button>
            </form>
        </div>
    </div>
</div>
