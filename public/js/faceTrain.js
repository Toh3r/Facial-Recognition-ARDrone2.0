//Import opencv4nodejs
var cv = require('opencv4nodejs');

//Import cascade classifier xml file to detect faces
var classifier = new cv.CascadeClassifier(cv.HAAR_FRONTALFACE_ALT2);

//Throw error if face module doesn't load
if (!cv.xmodules.face) {
	throw new Error('Existing: opencv4nodejs compiled without face module')
}

//Called from server on training button click
module.exports.train = function(socket, trainingName) {

	//Print training name to console
	console.log('training name: ' + trainingName);

	//Initialise picture count and frame count as 0
	var count = 0;
	var frameCount = 0;

	//Open drone camera with opencv
	var cap = new cv.VideoCapture('tcp://192.168.1.1:5555');

		//Create setInterval to loop through frames
		var func = setInterval(function() {

			//Read frame from stream
			var frame = cap.read();

			//Skip every 2nd frame, allows for better training data -- funnel frame into nothingness
			if(frameCount <= 1){
				//Increment frame count
				frameCount += 1;
				//Print to console
				console.log('Frame skipped')
			} 

			//Else process image
			else {

				//Convert frame to grayscale
				var grayImg = frame.bgrToGray();

				//Check if a face is present in image
				var faceDetect = classifier.detectMultiScale(grayImg).objects;

				//If face is detected in faceExtract funtion 
				if (faceDetect.length){

					//Increment count
					count += 1;

					//Print face has been found
					console.log('Face ' + count + ' found and saved to file...');

					//Crop only face in the image
					var crop = grayImg.getRegion(faceDetect[0]);

					//Resize frame containing only the face (all training data must be same size)
					var trainPic = crop.resize(200,200);

					//Declare path where image will be saved
					var trainingPath = './trainingPics/' + trainingName + count + '.jpg';

					//Save image to trainingPics folder
					cv.imwrite(trainingPath, trainPic);

					//Draw rectangle around face for out put frame
					frame.drawRectangle(
					new cv.Point(faceDetect[0]['x'], faceDetect[0]['y']), 
					new cv.Point (faceDetect[0]['x'] + faceDetect[0]['width'], faceDetect[0]['y'] + faceDetect[0]['height']), 
					new cv.Vec(0,220,0), 2);

					//Convert count to string so it can be used in .puttext
					var strcount = count.toString();

					//Display how many images have been captured in output frame
					frame.putText("Saved image " + strcount, 
						new cv.Point(faceDetect[0]['x'], faceDetect[0]['y'] + faceDetect[0]['height'] + 30 ), 
						1, 2,  new cv.Vec(0,220,0), 2);
				}

				//If no face found in frame, print to console
				else {
					console.log('No face detected');
				}

				//Send frame to client to be displayed
				var data = cv.imencode('.jpg', frame).toString('base64');
				socket.emit('frame', data);

				//When specified number of training pics taken
				if (count === 100){

					//Write image capture complete on last frame
					frame.putText("Image Capture Comlete!!", 
						new cv.Point(120, 350), 
						1, 2,  new cv.Vec(0,220,0), 2);

					//Send frame to client to be displayed to canvas
					var data = cv.imencode('.jpg', frame).toString('base64');
					socket.emit('frame', data);

					//Output image capturing complete to console
					console.log(count + ' training images captured and saved to file.')
					console.log('Capturing training data complete.')

					//Close capture feed
					cap.release();
					cv.destroyAllWindows();

					//Stop interval loop
					clearInterval(func);
				}

				//Set frame count to 0
				frameCount = 0;
			}			

		}, 100);//Set interval loop to 100 milliseconds

}; //Close module.exports
	
