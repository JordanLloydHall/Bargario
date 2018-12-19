
var socket = io('http://25.57.119.13:3000');


// Waits for data to be sent from server:
socket.on("serverData", function(serverData) {
	console.log(serverData);

	// Send back data you have gathered:
	socket.emit("clientData", {magnitude: 0, angle: 0}); // Data goes within curly brackets.
});