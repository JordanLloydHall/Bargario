var http 			= require("http").Server(),
	io 				= require("socket.io")(http);

function World() {
	
	// Radius and the maximum number of nutrients are constants
	this.RADIUS = 100;
	this.MAX_NUTRIENTS = 100;

	// List of nutrient objects
	this.nutrients = [];

	this.newWorld = function() {

		// Reset nutrient list
		this.nutrients = [];

		for (var i=0; i<this.MAX_NUTRIENTS; i++) {

			// Using trigonometry, randomly select x and y values that exist within the world radius 
			angle = generateRandomNumber(-Math.PI, Math.PI);
			magnitude = generateRandomNumber(0, world.RADIUS - 10);
			position = [magnitude * Math.cos(angle), magnitude * Math.sin(angle)];

			// Color generated randomly, between #000000 and #FFFFFF in denery format
			color = Math.round(generateRandomNumber(0, 16777216));

			// Add the nutrient object to the nutrients list
			this.nutrients.push({"position": position, "color": color});
		}
	}
}

function Player(socket) {

	// Socket is stored to recognise the player/socket complex and to send information
	this.socket = socket;

	this.position = [0,0];
	this.speed = 0;
	this.angle = 0;

	// Mass is synonymous with 'area' used in geometry. Radius is calculated by rearranging
	this.mass = 50;
	this.radius = Math.sqrt(this.mass/Math.PI)

	// Color generated randomly, between #000000 and #FFFFFF in denery format
	this.color = Math.round(generateRandomNumber(0, 16777216));

	this.newPlayer = function(world) {

		// Using trigonometry, randomly select x and y values that exist within the world radius
		angle = generateRandomNumber(-Math.PI, Math.PI);
		magnitude = generateRandomNumber(0, world.RADIUS - 10);
		this.position = [magnitude * Math.cos(angle), magnitude * Math.sin(angle)];

		// Mass is set to 50 by default
		this.mass = 50;
	}
}

function generateRandomNumber(min, max) 
{
	// Makes use of JS Math.random() and some adjustments to give a float in between min and max
    return Math.random() * (max-min) + min;
}

function euclideanDistance(pos1, pos2) {

	// Pythagoras theorum to calculate euclidean distance between two points
	return Math.sqrt(Math.pow(pos2[0] - pos1[0], 2) + Math.pow(pos2[1] - pos1[1], 2))
}

function gameLoop() {

	// Loop through each active player
	for (var i in players) {
		var player = players[i];

		// Check if the player is out of the maximum world radius, reset them if so
		if (euclideanDistance(player.position, [0,0]) > world.RADIUS) {
			player.newPlayer();
		}

		// Create lists of nearby entities
		var nearbyNutrients = [];
		var nearbyPlayers = [];

		// Set player's new location using trigonometry
		player.position[0] += Math.cos(player.angle) * player.speed;
		player.position[1] += Math.sin(player.angle) * player.speed;

		// Loop through all nutrients in the world - faster solution needed
		for (var j = world.nutrients.length - 1; j >= 0; j--) {
			var nutrient = world.nutrients[j];

			// Calculate distance between current nutrient and player
			var distance = euclideanDistance(nutrient.position, player.position);

			
			// If the nutrient is within viewing range of the player, but not close enough to be eaten, send its data to be seen by the player
			if (distance <= MAX_VIEW_DISTANCE) {

				// If the center of the nutrient is inside the player, the player "eats" the nutrient
				if (distance < player.radius) {

					// Remove the nutrient from the list and generate a new one
					world.nutrients.splice(j,1);

					var angle = generateRandomNumber(-Math.PI, Math.PI);
					var magnitude = generateRandomNumber(0, world.RADIUS - 10);
					var position = [magnitude * Math.cos(angle), magnitude * Math.sin(angle)];
					var color = Math.round(generateRandomNumber(0, 16777216));
					world.nutrients.push({position: position, color: color});

					// Player's mass should increase by 10 units when eating a nutrient					
					player.mass += 10;

					// Recalculate player's radius as a result of a change in mass
					player.radius = Math.sqrt(player.mass/Math.PI);

				} else {

					// Add the information about the nutrient to the data to be sent
					nearbyNutrients.push({position: nutrient.position, color: nutrient.color});
				}
			}
		}

		// Loop through all players in the world - faster solution needed
		for (var l in players) {
			var otherPlayer = players[l];

			// Ensure that the player doesn't recieve information about themselves
			if (otherPlayer.socket.id !== player.socket.id) {

				// Calculate distance between current player being observed and player
				var distance = euclideanDistance(otherPlayer.position, player.position);

				// Check if the player should see the observed player
				if (distance <= MAX_VIEW_DISTANCE) {

					// Add the information about the observed player to the data to be sent
					nearbyPlayers.push({position: otherPlayer.position, mass: otherPlayer.mass, color: otherPlayer.color});
				}
			}
		}

		// Compile the current player's data
		var playerData = {position: player.position, mass: player.mass, color: player.color};

		// Send the data to the player
		player.socket.emit("serverData", {you: playerData, players: nearbyPlayers, nutrients: nearbyNutrients});
	}
}


// Handles socket functions
io.on("connection", function(socket) {

	// Announce that a player has connected with their ID
	console.log(socket.id + " Has connected.");

	// Add a new player object to an object with the socket ID as the key
	players[socket.id] = new Player(socket);

	// Initialize new player
	players[socket.id].newPlayer(world);

	// When client sends data, record the changed data
	socket.on("clientData", function(clientData) {
		player = players[socket.id];

		// Player sends angle and magnatude of the mouse/finger position in order to steer the player
		player.speed = clientData.magnitude;
		player.angle = clientData.angle;
	});

	// Removes player from players object upon disconnect to prevent 'ghosts'
	socket.on("disconnect", function() {
		delete players[socket.id];

		// Announce that a player has disconnected with their ID
		console.log(socket.id + " Has disconnected.");
	});
});


// Set global variables and constants
var TICK_RATE = 5,
	MAX_VIEW_DISTANCE = 50,
	world = new World(),
	players = {};

// Initialize world 
world.newWorld();

// Set non-blocking loop that is called TICK_RATE times per second
setInterval(gameLoop, Math.round(1000/TICK_RATE));

// Server starts accepting clients 
http.listen(process.env.PORT || 3000, "25.57.119.13", function(){
	console.log("Server online");
});