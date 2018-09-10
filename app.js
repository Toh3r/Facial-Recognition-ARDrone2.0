//Import packages
var express = require('express');
var bodyParser = require('body-parser');
var arDrone = require('ar-drone');

//Listen for dronestream on port 3001
require("dronestream").listen(3001);

//Import js scripts
var trainer = require('./public/js/faceTrain');
var detector = require('./public/js/faceRec');

//Create drone client 
var client = arDrone.createClient();

// Set max height of drone altitude
client.config('control:altitude_max', 1500);

// //Import js scripts
// var trainer = require('./public/js/faceTrain');
// var detector = require('./public/js/faceRec');
// var data = require('./public/js/data');

//Create variable for express
var app = express();

var path = require('path');
var http = require('http');

//Create server
var server = http.createServer(app);

//Setup web sockets
var io = require('socket.io')(server);

//Create body parser for form data
app.use(bodyParser.urlencoded({
	extended: true
}));

app.use(bodyParser.json());

//Path to index/css files
app.use(express.static(__dirname + '/public'));

//Render the two webpages on link clicks
app.get('/index', function(req,res){
	res.sendFile(__dirname + '/public/index.html')
});

app.get('/flight', function(req,res){
	res.sendFile(__dirname + '/public/flight.html')
});


//Create connection to clients
io.on('connection', (socket) => {
	console.log('Client connected');

	//When buttons are clicked
	app.post('/', function(req, res) {

    //Stop socket timing out after two minutes
    req.setTimeout(1000 * 60 * 300);

		//Create variables for names bieng submitted
		var trainingName = req.body.trainName;
		var recogName = req.body.recName;

		//Runs if training name submitted
		if (trainingName != undefined){
			//Print name to console
      		console.log('Createing training data for ' + trainingName);
      		//Call function to collect training data
			trainer.train(socket, trainingName);
		};

		//Runs if recognize name is submitted
		if (recogName != undefined){
			//Print name to console
     		console.log('Going to look for ' + recogName);
     		//Call function to recognise faces
			detector.detect(socket, recogName);
		};
	});


	//Handle keydowns from flight.js (keyboard flight controls)
	socket.on('takeoff', function() {
        client.takeoff();
  	});

  	socket.on('land', function() {
        client.land();
  	});

  	 socket.on('stop', function() {
        client.stop();
  	});

  	socket.on('forward', function() {
        client.front(0.1);
  	});

  	socket.on('backward', function() {
        client.back(0.1);
  	});

  	socket.on('left', function() {
        client.left(0.1);
  	});

  	socket.on('right', function() {
        client.right(0.1);
  	});

  	socket.on('up', function(){
  		client.up(0.4);
  	});

  	socket.on('down', function(){
  		client.down(0.2);
  	});

    socket.on('counterclockwise', function() {
      	client.counterClockwise(0.3);
  	});

  	socket.on('clockwise', function() {
      	client.clockwise(0.3);
  	});

    socket.on('wave', function() {
        client.animate('wave', 50);
    });
});

//Server listen on port 3000
server.listen(3000);

 