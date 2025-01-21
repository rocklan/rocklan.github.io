---
date: 2025-01-21
category: technical
tags: c# monolith dotnet framework microservices
title: Splitting up the monolith
cover-img: /images/monolith.png
thumbnail-img: /images/monolith-small.png
readtime: true
hidden: false
share-description: How to split apart your monolithic code base
excerpt: A few years back, my team took on the challenge of breaking down the Rome2Rio monolith. The goal was to make it easier for separate teams to work on different parts of the codebase. In this three-part series, I've written hopefully useful stuff like detailing our approach to dismantling the code and converting it to .NET Core, refactoring techniques that made a difference and implications of HTTP and other insights.
---

A few years back my team took on the challenge of breaking down the [Rome2Rio](https://www.rome2rio.com) Monolith. This was an epic project, and broadly speaking the main goal was to make it easier for separate teams to work on different parts of the codebase. So just today I've written up our findings in a three part article and published it here: 

[Splitting Up Rome2rio's Monolith](https://www.rome2rio.com/blog/2025/01/10/splitting-up-the-monolith/)

A few of the things that I've covered are:

* Our approach to dismantling the code and converting it to .NET Core
* Refactoring techniques that made a difference
* Implications of HTTP and other insights

Hopefully this helps out some other people who are embarking on a similar journey. All feedback appreciated!