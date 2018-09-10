//Import opencv
var cv = require('opencv4nodejs');

//Import cascade classifier xml file to detect faces
var classifier = new cv.CascadeClassifier(cv.HAAR_FRONTALFACE_ALT2);

//Create face recognizer
var lbph = new cv.LBPHFaceRecognizer();

//Throw error if face module doesn't load
if (!cv.xmodules.face) {
	throw new Error('Existing: opencv4nodejs compiled without face module')
}

//Import ar-drone
var arDrone = require('ar-drone');
var client = arDrone.createClient()

//Set max altitude of drone
client.config('control:altitude_max', 2500);

//Face Recognition function on button recogniser call
module.exports.detect = function(socket, recogName){

//Create arrays for training data and labels
var training_Data = [];
var labels = [];

//Declare count for array index
var count = 0;

//While loop, until arrays are fiiled
while (true){

	//increment count
	count += 1;

	//Declare path to image
	var data_path = './trainingPics/'  + recogName + count + '.jpg';

	//Load image from trainingPics file
	var img = cv.imread(data_path);

	//Convert image to greyscale
	var gray = img.bgrToGray();
	//Add images and labes to array

	training_Data.push(gray);
	labels.push(1);

	//When arrays are filled, exit loop
	if(count === 100){
		break;
	}

}

//Print arrays are full
console.log('Arrays filled');
		
//Train face recognizer using data from arrays
lbph.train(training_Data, labels);

//Print when training completed
console.log('Face training completed');

//Open drone camera with opencv
var cap = new cv.VideoCapture('tcp://192.168.1.1:5555');
//Open webcam with opencv
//var cap = new cv.VideoCapture(0);

//Declare framecount as 0
var frameCount = 0

//Print to console
console.log('Starting up ...');

//Create interval to loop through frames
var func = setInterval(function() {

	//Read frame from camera
	var frame = cap.read();

	//After 400 frames, Drone takeoff
	if(frameCount == 450){
		console.log('Starting shortly');
		// client.takeoff();
		// client
		// 	.after(5000, function(){
		// 		this.up(0.2);
		// 	})
		// 	.after(4700, function(){
		// 		this.stop();
		// 	})
	}

	//Skip first 550 frames to avoid lag at start of videocapture
	if(frameCount < 550) {
		frameCount +=1;
	}

	//When framecount hits 551
	else {

		//Convert frame to grayscale
		var grayImg = frame.bgrToGray();

		//Check if frame contains face 
		var faceDetect = classifier.detectMultiScale(grayImg).objects;

		//If no face detected in frame
		if(!faceDetect.length){

			//console.log(faceDetect);

			//Print to console
			console.log('No face found');

			//Rotate clockwise for 2 seconds at 30% of top speed
			// client
			// 	.after(100, function(){
			// 		this.clockwise(0.3);
			// 	})
			// 	.after(2000, function(){
			// 		this.stop();
			// 	})
		} 

		//If face is visible in frame
		else if (faceDetect.length) {

			//Print to console
			console.log('Face found');

			//Crop face in frame
			var face = grayImg.getRegion(faceDetect[0]);

			//Resize the cropped image to 200x200
			var crop = face.resize(200,200);

			//Pass cropped face to face recogniser
			var result = lbph.predict(crop);

			//Chance of it bieng trained face
			var conf = result.confidence;

			//Make confidence number more presentable for output
			if (conf < 500){

				//Original confidence value
				//console.log('Actual confidence value: ' + conf);

				console.log(faceDetect);

				var confidence = 100 * (1 - (conf/400)).toFixed(2);

				var display = confidence + '% Confident';
				
				//If confidence greater that 80
				if(confidence > 75){
					console.log(display + ', is likely ' + recogName);

					//Add confidence value to output frame
					frame.putText(display, 
					new cv.Point(faceDetect[0]['x'], faceDetect[0]['y'] + faceDetect[0]['height'] + 30 ), 
					1, 2,  new cv.Vec(0,220,0), 2);

					//Add text to output frame
					frame.putText('Is likely ' + recogName, 
					new cv.Point(faceDetect[0]['x'], faceDetect[0]['y'] + faceDetect[0]['height'] + 55 ), 
					1, 2,  new cv.Vec(0,220,0), 2);

					//If face in frame is smaller than 40
					if (faceDetect[0]['height'] < 40) {
						console.log('Moving forward');

							//If face is to far left
							if (faceDetect[0]['x'] > 400){
								//Print to console
								console.log('CLOOOOOOOOOCK');

								//Turn clockwise for 300ms at 30% top speed
								// client
								// 	.after(100, function(){
								// 		this.clockwise(0.3);
								// 	})
								// 	.after(300, function(){
								// 		this.stop();
								// 	})

							//If face is to far left
							} else if (faceDetect[0]['x'] < 150) {
								//Print to console
								console.log('COOOOUUUUUNNNNTERRRRRRRRRR');

								//Turn counter-clockwise for 300ms at 30% top speed
								// client
								// 	.after(100, function(){
								// 		this.counterClockwise(0.3);
								// 	})
								// 	.after(300, function(){
								// 		this.stop();
								// 	})
							}

							//Move forward for 2200ms at 10% of top speed
							// client
							// 	.after(100, function(){
							// 		this.front(0.1)
							// 	})
							// 	.after(3500, function(){
							// 		this.stop();
							// 	})
					}

					//If face size between 40 and 80
					else if (faceDetect[0]['height'] > 40 && faceDetect[0]['height'] < 70) {
						//Print to conole
						console.log('Moving forward');

							//If face to far right
							if (faceDetect[0]['x'] > 540){
								//Print to console
								console.log('CLOOOOOOOOOCK');

								//Move clockwise for 200ms at 30% of top speed
								// client
								// 	.after(100, function(){
								// 		this.clockwise(0.3);
								// 	})
								// 	.after(300, function(){
								// 		this.stop();
								// 	})
							}

							//If face to far left 
							else if (faceDetect[0]['x'] < 120) {
								//Print to console
								console.log('COOOOUUUUUNNNNTERRRRRRRRRR');

								//Turn counter-clockwise for 200ms at 30% top speed
								// client
								// 	.after(100, function(){
								// 		this.counterClockwise(0.3);
								// 	})
								// 	.after(300, function(){
								// 		this.stop();
								// 	})
							}

							//Move forward for 600ms at 10% of top speed
							// client
							// 	.after(100, function(){
							// 		this.front(0.1)
							// 	})
							// 	.after(1200, function(){
							// 		this.stop();
							// 	})
				} 

				//If face greater than 80
				// else if (faceDetect[0]['height'] > 70) {
				// 	//Print to console
				// 	console.log('Stopped to give your manno some');
				// 	console.log('Coffeeeeeeeeeeee')
				// 	console.log('Coffeeeeeeeeeeee')
				// 	console.log('Coffeeeeeeeeeeee')

					

				// 	client
				// 		.after(100, function(){
				// 			this.stop()
				// 		})
				// 		.after(100, function(){
				// 			this.down(0.3);
				// 		})
				// 		.after(3000, function(){
				// 			this.stop();
				// 		})
				// 		.after(10000, function(){
				// 			this.back(0.1)
				// 		})
				// 		.after(3000, function(){
				// 			this.stop()
				// 		})
				// 		.after(2000, function(){
				// 			this.land();
				// 		})
						
				// 	console.log('Doooooooooooooooonnnne');

				// 	//client.land();
					
				// 	//Stop the loop
				// 	clearInterval(func);
				// 	}

				}

				//If confidence less than 80
				else{

					//Print to console
					console.log(display + ' not likely ' + recogName);

					//Add text to frame
					frame.putText(display, 
					new cv.Point(faceDetect[0]['x'], faceDetect[0]['y'] + faceDetect[0]['height'] + 30 ), 
					1, 2,  new cv.Vec(0,220,0), 2);

					frame.putText('Not likely ' + recogName, 
					new cv.Point(faceDetect[0]['x'], faceDetect[0]['y'] + faceDetect[0]['height'] + 55 ), 
					1, 2,  new cv.Vec(0,220,0), 2);


				}

				//Add green rectangle around face for output frame
				frame.drawRectangle(
				new cv.Point(faceDetect[0]['x'], faceDetect[0]['y']), 
				new cv.Point (faceDetect[0]['x'] + faceDetect[0]['width'], faceDetect[0]['y'] + faceDetect[0]['height']), 
				new cv.Vec(0,220,0), 2);

			}
			
		}

		//Output frame to client
		var data = cv.imencode('.jpg', frame).toString('base64');
		socket.emit('frame', data);

		//Reset framecount to 500
		frameCount = 500;

	}

	//Print frame count number every 50 frames
	if (frameCount % 50 == 0){
		console.log('frame ' + frameCount);
	}

}, 100); // Set interval to 100 ms

}//Close function

