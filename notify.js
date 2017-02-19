/*
	This code listens for a push notification from Pushbullet. When message arrives, it checks if the message has an OTP and if that OTP matches
	the locally geneated OTP. 
*/

var deviceName = '<enter device name here>'; // This is the device name you will be sending push notification to.
var pushBulletToken = '<enter pushbullet auth token>'; // from your pushbullet console
var otpBase32Key = '<enter key for OTP>'; // enter base32 encode key for OTP generation. Make sure to have oathtool installed on your computer first

// do not modify below this line
var PushBullet = require('pushbullet'); //load pushbullet 
var pusher = new PushBullet(pushBulletToken); //create a new pushbullet object connected to your token, you must enter your token here
var stream = pusher.stream(); //create a new websocket stream object
var ret = undefined; //define the variable ret as "undefined"

var exec = require('child_process').exec;
var cmd = 'oathtool -b --totp ' + otpBase32Key;


// error handler
process.on('uncaughtException', function (err) {
  console.error((new Date).toUTCString() + ' uncaughtException:', err.message)
  console.error(err.stack)
  process.exit(1)
})

// list 10 devices
var options = {
    limit: 10
};

// find the device name. if not found create one 
pusher.devices(options, function(error, response) {
	//console.log(response);
	var shouldCreate = true;
	if (response.devices && response.devices.length > 0) {
		for (i = 0; i < response.devices.length; i++) {
			if(deviceName === response.devices[i].nickname) {
				shouldCreate = false;
				break;
			}
		}
	}
	if (shouldCreate) {
		var deviceOptions = {
    		nickname: deviceName
		};
		pusher.createDevice(deviceOptions, function(error, response) {
			console.log('Created device ' + deviceName);
		});
	} else {
		console.log(deviceName + ' already found');
	}

});

// when a message is received then do something
stream.on('message', function(message) { //on recieving a message from the stream do...
                //only if message type is tickle
                if (message.type == 'tickle') { //if the message is a 'tickle'...
                	getHistory(triggerExternalCmd); //run the getHistory function with triggerExternalCmd function as the callback 
                }
	});

// get actul message
function getHistory(callback){ //define the function getHistory with a callback function as input
	var options = { limit: 1 }; //set the limit of pushes to return to just the last 1
	pusher.history(options, function(error, response) { //send the GET request to the pushbullet server
	if (response.pushes[0] && response.pushes[0].body) {	
		ret = response.pushes[0].body; //set ret to the body of the returned JSON object
	    callback(); //run the callback function
	 }
    })
};

// log the error if something bad happens
stream.on('error', function(error) {
    console.log('error ' + error);
});


// external command to call. currently just verifying OTP and doing console log
function triggerExternalCmd() { //define dispLCD, the callback function
    exec(cmd, function(error, stdout, stderr) {
	  console.log ('totp is ' + stdout + ' and push message is ' + ret);
	  if (ret && stdout && parseInt(ret) == parseInt(stdout)) {
	  	console.log ('Both match !!!!');
	  	// enter your code here.
	  } else {
	  	console.log ('Code didn\'t match ! Anyone trying to get in ?');
	  	// enter your code here.
	  }
	});
}

// Print a message when successfully start listinging for push notifications
stream.on('connect', function() {
 	 console.log('Listing for Push notifications' ); 
});

// Log when stream is disconnected
stream.on('close', function() {
    // stream has disconnected
     console.log('closed' ); 
});

// connect to stream to listen for messages
stream.connect();

