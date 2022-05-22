var usbVideoDeviceId = 'daa99cc1b6437c51e8c04a5331f985168b814f72b73eb8b571d71c163fd754ef';
var generalWebcamDeviceId = '2560e7510efe7972133bb05be1dbefdd18836a4f1cc8faeb605e3a63a651b843';
var scarletSoloDeviceId = '5d4b1081faa91684ea73cff0b3a90335a674278477ef3609ec2a93c1864f2503';
var c1 = document.getElementById("container1");
var c2 = document.getElementById("container2");
var dd = document.getElementById("datadiv");
var audioinputselect = $('#audioinputselect');
var videoinputselect = $('#videoinputselect');
var numberofVideos = 0;
var currentVideo = 1;

function init()
{
	listDevices();
	$("#addvideo").click(addVideo);
	$("#crossfadeButton").click(setupCrossFade);
}

function listDevices()
{
	
	navigator.mediaDevices.enumerateDevices()
		.then(function(devices) {
			for (var i=0;i<devices.length;i++)
			{
				var device = devices[i];
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
	console.log(selectedVideoDeviceId.text());

	videoContainer.append("<div id='videoContainer" + numberofVideos + "' class='video'>" + 
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
	
	//let track = stream.getAudioTracks()[0];
	//console.log(track.getCapabilities());
}

function setupCrossFade() {
	
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
	setInterval(crossFade, 3000);
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
	
}

//listDevices();
//setupWebcams();

//

$(document).ready(function(){
	init();
});