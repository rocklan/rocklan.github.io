---
date:   2021-08-29
category: trivia
published: true
title: Trivia Night
layout: trivia
---

## Lach's Trivia
# Cartoon Theme Song Languages
@@@

We have ten languages:

* Serbian
* Swedish
* Chinese
* Korean
* Greek
* Spanish
* Japanese
* French
* Hebrew
* Russian
 
Name the language sung in the song
@@@

{% for i in (1..10) %}

## Question {{ i }} 

<video data-src="/videos/{{ i }}.mp4" controls></video>

@@@

{% endfor %}

# Answers 

{% assign languages = "Bah!, Japanese, French, Russian, Chinese, Spanish, Swedish, Serbian, Korean, Hebrew, Greek" | split: ", " %}

@@@

{% for i in (1..10) %}

## Question {{i}}

{{ languages[i] }} <!-- .element: class="answer" --> 

<video data-src="/videos/{{ i }}.mp4" controls></video>

@@@

{% endfor %}
