

document.addEventListener("DOMContentLoaded", function() {
    Reveal.initialize().then( () => {
        initStuff();
    } )

    Reveal.initialize({
        hash: true,

        width: 1200,
        height: 800,
        // Learn about plugins: https://revealjs.com/plugins/
        plugins: [ RevealMarkdown ]
    });

});

var timers = [];

function initStuff() {

    var mytimers = document.getElementsByClassName("mytimer");

    for (var i=0;i<mytimers.length;i++) {
        addTimerToControl(mytimers[i]);
    }
}

function addTimerToControl(timerButton)
{
    var timerData = {
        isTiming: 0,
        timer: timerButton.dataset.time,
        interval: 0
    }

    timerButton.innerHTML = "Start Timer (" + timerData.timer + " seconds)";

    timerButton.onclick = function () {

        if (timerData.isTiming == 0) {

            timerData.timer = timerButton.dataset.time;

            timerButton.innerHTML = timerData.timer;

            timerData.interval = setInterval(function() {
                timerData.timer--;
                if (timerData.timer == 0) {
                    clearInterval(timerData.interval);
                    timerButton.innerHTML = 'Time is up!';
                    timerData.isTiming = 0;
                    var snd = new Audio("/assets/alarm.wav"); // buffers automatically when created
                    snd.play();
                }
                else {
                    timerButton.innerHTML = timerData.timer;
                }
            }, 1000);

            timerData.isTiming = 1;
        } else {
            clearInterval(timerData.interval);
            timerData.isTiming = 0;
            timerButton.innerHTML = 'Timer stopped!';
        }
    }
}
