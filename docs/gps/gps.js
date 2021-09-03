(function () {

	var gpsData = [];
	var tracking = false;
	var showingBubble = true;
	var rows = "";
	var lastLoc = null;
	var dist = 0;
	var mymap;
	var mapBubble;
	var startLocation;

	startup();

	function startup() {

		setupEventHandlers();

		setupMap();

		trackStuff();

		setInterval(function () {
			trackStuff();
		}, 5000);
	}

	function setupMap() {
		navigator.geolocation.getCurrentPosition(function (location) {

			startLocation = location;

			mymap = L.map('mapid').setView([location.coords.latitude, location.coords.longitude], 12);

			L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
				attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
				maxZoom: 18,
				id: 'mapbox/streets-v11',
				tileSize: 512,
				zoomOffset: -1,
				accessToken: 'pk.eyJ1Ijoicm9ja2xhbiIsImEiOiJja2RmamNyeTM0eWlsMnVxeWZ0cHhiNHZ6In0.VFVX9RunPHmBt8_NeJ2Ppw'
			}).addTo(mymap);

			var marker = L.marker([location.coords.latitude, location.coords.longitude]).addTo(mymap);

			addBubble();
		});

	}

	function addBubble() {
		mapBubble = L.circle([startLocation.coords.latitude, startLocation.coords.longitude], {
			color: 'red',
			fillColor: '#f03',
			fillOpacity: 0.25,
			radius: 5000
		}).addTo(mymap);

    }

	function setupEventHandlers() {
		var startButton = document.getElementById('Start');
		var downloadButton = document.getElementById('Download');
		var clearButton = document.getElementById('Clear');
		var bubbleButton = document.getElementById('Bubble');
		

		startButton.addEventListener("click", function () {
			if (tracking) {
				startButton.innerHTML = "Start";
				tracking = false;
			} else {
				startButton.innerHTML = "Stop";
				tracking = true;
            }
		});

		bubbleButton.addEventListener("click", function () {
			if (showingBubble) {
				bubbleButton.innerHTML = "Show 5km";
				showingBubble = false;

				mymap.removeLayer(mapBubble);
				
			} else {
				bubbleButton.innerHTML = "Hide 5km";
				showingBubble = true;

				addBubble();
			}
		});
		downloadButton.addEventListener("click", function () {
			downloadData();
		});
		clearButton.addEventListener("click", function () {
			clear();
		});
	}

	function clear() {
		rows = "";
		document.getElementById("tabledetails").innerHTML = rows;
	}

	function trackStuff() {

		if (tracking) {
			navigator.geolocation.getCurrentPosition(function (location) {

				var tooClose = false;

				if (lastLoc) {
					dist = distanceInKm(
						lastLoc.coords.latitude,
						lastLoc.coords.longitude,
						location.coords.latitude,
						location.coords.longitude);

					if (dist < 0.010)
						tooClose = true;
				}

				if (!tooClose) {
					lastLoc = location;

					gpsData.push({
						lat: location.coords.latitude,
						lon: location.coords.longitude,
						ele: location.coords.altitude,
						tim: new Date(location.timestamp)
					});
				}

				var row = "<tr><td>" + new Date(location.timestamp).toLocaleTimeString() +
					"</td><td>" + location.coords.latitude +
					"</td><td>" + location.coords.longitude +
					"</td><td>" + location.coords.altitude +
					"</td><td>" + location.coords.accuracy +
					"</td><td>" + (dist * 1000);

				if (tooClose)
					row += " ignored (too close)";

				row += "</td></tr>";

				rows += row;

				document.getElementById("tabledetails").innerHTML = rows;

				drawRoute();

			});

		}
	}

	var routePolygon = null;

	function drawRoute() {

		var myRoute = [];

		for (var i = 0; i < gpsData.length; i++) {
			myRoute.push([gpsData[i].lat, gpsData[i].lon]);
        }

		if (routePolygon != null) {
			mymap.removeLayer(routePolygon);
		}

		routePolygon = L.polygon(myRoute).addTo(mymap);
	}

	function degreesToRadians(degrees) {
		return degrees * Math.PI / 180;
	}

	function distanceInKm(lat1, lon1, lat2, lon2) {
		var earthRadiusKm = 6371;

		var dLat = degreesToRadians(lat2 - lat1);
		var dLon = degreesToRadians(lon2 - lon1);

		lat1 = degreesToRadians(lat1);
		lat2 = degreesToRadians(lat2);

		var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		return earthRadiusKm * c;
	}

	function downloadData() {

		var fileContents = "";
		var trk;

		for (var i = 0; i < gpsData.length; i++) {
			trk = gpsData[i];

			fileContents += '<trkpt lat="' + trk.lat + '" lon="' + trk.lon + '">';

			if (trk.ele)
				fileContents += '<ele>' + trk.ele + '</ele>';

			fileContents += '<time>' + trk.tim.toISOString() + '</time></trkpt>';

		}

		var outputFile =
			'<gpx version="1.1" creator="lachlanbarclaynet">' +
			'<trk>' +
			'<name>lachs walk</name>' +
			'<trkseg>' + fileContents + '</trkseg>' +
			'</trk>' +
			'</gpx>';

		download('walk.gpx', outputFile);

	}

	function download(filename, text) {
		var element = document.createElement('a');
		element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
		element.setAttribute('download', filename);

		element.style.display = 'none';
		document.body.appendChild(element);

		element.click();

		document.body.removeChild(element);
	}

})();

