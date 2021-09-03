---
date:   2021-09-03
category: technical
tags: javascript
title: Introducing The New
readtime: true
js: /assets/js/productnamegenerator.js
---

<h2 id='productname'></h2>

<button class="btn btn-primary" id="generatename">Generate Another Product Name</button>

Code:

```javascript
var opinion = ['Tasty', 'Slick', 'Fast', 'Superb', 'Shiny', 'Tiny', 'Awesome', 'Fancy', 'Excellent',  ];
var adjectives = ['Revolving', 'Disrupting', 'Actioning', 'Leveraging', 'Innovating', 'Self Learning' ];
var buzzword = ['Blockchain', 'AI', 'Data Miner', 'Quantum', 'Unicorn', 'Startup', 'Retro', 'AAA']
var thing = ['Wearable', 'Console', 'Plugin', 'Extender', 'Transformer']

function generateName() {
    document.getElementById('productname').innerText = 
        pickOne(opinion) + ' ' + pickOne(adjectives) + ' ' + pickOne(buzzword) + ' ' + pickOne(thing);
}

function pickOne(items) {
    return items[Math.floor(Math.random() * (items.length))];
}

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('generatename').addEventListener("click", function() {
        generateName();
    });
    generateName();
});
```