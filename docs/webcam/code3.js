var audioinputselect = $('#audioinputselect');
var videoinputselect = $('#videoinputselect');

const fireworksContainer = document.querySelector('#fireworksContainer')
var fireworks = null;

var numberofVideos = 0;
var currentVideo = 1;
var showingFireworks = 0;

function init()
{
	listDevices();

	$("#addvideo").click(addVideo);
	$("#crossfadeButton").click(setupCrossFade);
    $("#insetButton").click(setupInset);
    

    document.onkeydown = function(evt) {
        evt = evt || window.event;
        if (evt.keyCode == 70) {
            toggleFireworks();
        }
    };
}

function toggleFireworks()
{
    if (fireworks == null) {
        fireworks  = new Fireworks(fireworksContainer, { 
            boundaries: { visible: false, 
                x: 50, y: 50, 
                width: 640, height: 480 },
            rocketsPoint: { min: 0, max: 10 }
        });
    }

    if (showingFireworks === 0)
    {
        fireworks.start()
        showingFireworks = 1;
        for (var i=1;i<=numberofVideos;i++) {
            $("#videoElement" +i).addClass('shrink');
        }
    } else {
        fireworks.stop()
        showingFireworks = 0;
        for (var i=1;i<=numberofVideos;i++) {
            $("#videoElement" +i).removeClass('shrink');
        }
    }

}

function listDevices()
{
	
	navigator.mediaDevices.enumerateDevices()
		.then(function(devices) {
			for (var i=0;i<devices.length;i++)
			{
				var device = devices[i];
				//console.log(device);
				if (device.kind === 'audioinput')
				{
					audioinputselect.append($('<option>', {
						value: device.deviceId,
						text: device.label
					}));
				}
				if (device.kind === 'videoinput')
				{
					videoinputselect.append($('<option>', {
						value: device.deviceId,
						text: device.label
					}));
				}
			}
		})
		.catch(function(err) {
			console.log(err.name + ": " + err.message);
		});
}


function addVideo()
{
	var selectedVideoDeviceId = $('#videoinputselect option:selected');
	var selectedAudioDeviceId = $('#audioinputselect option:selected');

	var videoContainer = $('#videoContainer');

	numberofVideos++;

	var videoClasses = 'fading';
	if (selectedVideoDeviceId.text().includes('USB Video (')) {
		videoClasses += ' widescreen';
	}

	videoContainer.prepend("<div id='videoContainer" + numberofVideos + "' class='video'>" + 
		"<video autoplay='true' id='videoElement" + numberofVideos + "' class='" + videoClasses + "'></video>" + 
		"</div>");

	setupWebcam(selectedVideoDeviceId.val(), numberofVideos, selectedAudioDeviceId.val());

	selectedVideoDeviceId.remove();

	if (selectedAudioDeviceId.val() !== '') {
		selectedAudioDeviceId.remove();
	}
}


function setupWebcam(videoDeviceId, videoNumber, audioDeviceId)
{
	var audioSetup = false;
	if (audioDeviceId !== '') {
		audioSetup = { 
			deviceId: audioDeviceId,
			channelCount: 2,
			sampleRate: 48000,
			sampleSize: 16,
			volume: 1,
			autoGainControl: false,
			echoCancellation: false,
			noiseSuppression: false
		}
	}
	navigator
		.mediaDevices
		.getUserMedia({ 
			video: { 
				deviceId: videoDeviceId ,
				width: { min: 320, ideal: 640, max: 1280 },
    			height: { min: 200, ideal: 480, max: 720 }
			}, 
			audio: audioSetup
		})
		.then(setupVideo);
}   

function setupVideo(stream) {
	var video = document.querySelector("#videoElement" + numberofVideos);
	video.srcObject = stream;
	
	setupAudio(stream);
}

async function setupAudio(stream)
{
	var tracks = stream.getAudioTracks();
	
	if (tracks.length == 0) {
		console.log("No audio tracks found...");
		return;
	}

	var audioContext = new AudioContext();
	await audioContext.audioWorklet.addModule('vumeter-processor.js')
	let microphone = audioContext.createMediaStreamSource(stream);
	const node = new AudioWorkletNode(audioContext, 'vumeter');

	node.port.onmessage  = event => {
		let _volume = 0
		let _sensibility = 5 // Just to add any sensibility to our ecuation
		if (event.data.volume)
			_volume = event.data.volume;
		leds((_volume * 100) / _sensibility)
	}

	microphone.connect(node).connect(audioContext.destination)

}

canvasContext = $("#audiobar")[0].getContext("2d");

function leds(vol) {
	
	var average = 13 * vol;
	canvasContext.clearRect(0, 0, 60, 130);
	canvasContext.fillStyle = '#00ff00';
	canvasContext.fillRect(0,130-average,25,130);
	
}

function setupInset() {
    $("#videoContainer").addClass('grid');
    $("#setup").hide();

    $("#videoContainer1").addClass('videobehindothers');

    for (var i=1;i<=numberofVideos;i++) {

        $("#videoContainer" +i).addClass('videoCrossFade');
        $("#videoElement"+i).addClass('showMe');
        $("#videoElement"+i).addClass('spot' + i);
		
    }
}

function setupCrossFade() {

    // put all the videos on top of each other
    $("#videoContainer").addClass('grid');

	// move audio bar to bottom right
	$("#audiobar").addClass('audiobarmove');

    // hide the controls
    $("#setup").hide();
	
	for (var i=1;i<=numberofVideos;i++) {

		// Move this video to the top left of screen:
		$("#videoContainer" +i).addClass('videoCrossFade');

		if (i==1) {
			$("#videoElement"+i).addClass('showMe');
		} else {
			$("#videoElement"+i).addClass('hideMe');
		}
	}

	currentVideo = 1;
	setTimeout(crossFade, 3000);
}

function crossFade()
{
	$("#videoElement"+currentVideo).addClass('hideMe');
	$("#videoElement"+currentVideo).removeClass('showMe');

	currentVideo++;
	
	if (currentVideo > numberofVideos) {
		currentVideo = 1;
	}

	$("#videoElement"+currentVideo).addClass('showMe');
	$("#videoElement"+currentVideo).removeClass('hideMe');
	
    setTimeout(crossFade, (Math.random() * 15000) + 2000);
}

$(document).ready(function(){
	let stream = null

	canvasContext = $("#audiobar")[0].getContext("2d");
	canvasContext.clearRect(0, 0, 60, 130);
	canvasContext.fillStyle = '#00ff00';
	canvasContext.fillRect(0,0,25,130);


	navigator.mediaDevices.getUserMedia({audio: true, video: false})
	.then(s => {
	  init();
	})
	.catch(error => {
	  console.log('Error :', error)
	})
	
	
});