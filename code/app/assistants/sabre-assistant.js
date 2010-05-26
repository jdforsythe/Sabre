function SabreAssistant() {
}

SabreAssistant.prototype.setup = function() {

	this.doUpdateCheck();

	// INITIALIZATIONS

	// variables to hold the "old" accelerometer data - to compare to see how much it has moved
	this.oldX = 0;
	this.oldY = 0;
	this.oldZ = 0;

	// blade colors css classes
	this.bladeBlue = "blueBld";
	this.bladeRed = "redBld";
	this.bladeYellow = "yellowBld";
	this.bladePurple = "purpleBld";
	this.bladeGreen = "greenBld";

	// hilt css classes
	this.hiltLuke = "luke";
	this.hiltQuiGon = "quiGon";
	this.hiltAnakin = "anakin";
	this.hiltVader = "vader";
	
	// flash color css classes
	this.flashBlue = "flash-blue";
	this.flashRed = "flash-red";
	this.flashGreen = "flash-green";
	this.flashYellow = "flash-yellow";
	this.flashPurple = "flash-purple";

	// DOM references
	this.sabreContainer = $("sabreContainer");
	
	this.flash = $("flash");

	this.blade = $("blade");
	this.hilt = $("hilt");

	this.bladeButton = $("bladeButton");
	this.hiltButton = $("hiltButton");

	this.choiceOverlay = $("choiceOverlay");

	this.bladeMenu = $("bladeMenu");
		this.choiceRed = $("choiceRed");
		this.choiceBlue = $("choiceBlue");
		this.choiceGreen = $("choiceGreen");
		this.choiceYellow = $("choiceYellow");
		this.choicePurple = $("choicePurple");

	this.hiltMenu = $("hiltMenu");
		this.choiceLuke = $("choiceLuke");
		this.choiceQuiGon = $("choiceQuiGon");
		this.choiceAnakin = $("choiceAnakin");
		this.choiceVader = $("choiceVader");


	// whether sabre is on (true) or off (false)
	this.sabreIsOn = false;

	// set the accelerometer to faster frequency
	this.controller.stageController.setWindowProperties({
		fastAccelerometer: true,
		blockScreenTimeout: true
	});

	// set scene to fullscreen (remove top bar and notifications)
	this.controller.enableFullScreenMode(true);

	// initialize the HTML5 audio object
	this.mediaSetup();

	// references so we can cleanup since stopListening can't accept bind(this)
	this.screenTap = this.screenTap.bind(this);

}

SabreAssistant.prototype.screenTap = function(event) {

	// determine which div id triggered the tap event
	switch(event.target.id) {

		// if they tapped on the hilt
		case this.hilt.id:
			// if blade is off
			if (!this.bladeIsOn) {
				// turn blade on (show blade layer and play on sound)
				this.bladeIsOn = true;
				this.blade.style.zIndex = "3";

				this.playSnd(this.sabreOn);

				// reference for cleanup
				this.accelData = this.accelData.bind(this);

				// event listener for accelerometer
				Mojo.Event.listen(document, 'acceleration', this.accelData);
			}

			// if blade is on
			else {
				// turn blade off (hide blade layer and play off sound)
				this.bladeIsOn = false;
				this.blade.style.zIndex = "-1";

				this.playSnd(this.sabreOff);

				// remove event listener for accelerometer
				Mojo.Event.stopListening(document, 'acceleration', this.accelData);
				// reset accelerometer data
				this.oldX = 0;
				this.oldY = 0;
				this.oldZ = 0;
			}
		break;

		// if they tapped on the blade select button
		case this.bladeButton.id:
			// show overlay
			this.choiceOverlay.style.zIndex = "6";
			// show menu background and blade choices
			this.bladeMenu.style.zIndex = "7";

			// set event listeners for choices
			Mojo.Event.listen(this.choiceRed, Mojo.Event.tap, this.screenTap);
			Mojo.Event.listen(this.choiceBlue, Mojo.Event.tap, this.screenTap);
			Mojo.Event.listen(this.choiceGreen, Mojo.Event.tap, this.screenTap);
			Mojo.Event.listen(this.choiceYellow, Mojo.Event.tap, this.screenTap);
			Mojo.Event.listen(this.choicePurple, Mojo.Event.tap, this.screenTap);
		break;

			// blade choices

			case this.choiceRed.id:
				// remove event listeners and menu
				this.removeChoices(this.bladeMenu);
				// change blade class and flash color class
				this.blade.className = this.bladeRed;
				this.flash.className = this.flashRed;
			break;

			case this.choiceBlue.id:
				// remove event listeners and menu
				this.removeChoices(this.bladeMenu);
				// change blade class and flash color class
				this.blade.className = this.bladeBlue;
				this.flash.className = this.flashBlue;
			break;

			case this.choiceGreen.id:
				// remove event listeners and menu
				this.removeChoices(this.bladeMenu);
				// change blade class and flash color class
				this.blade.className = this.bladeGreen;
				this.flash.className = this.flashGreen;
			break;

			case this.choiceYellow.id:
				// remove event listeners and menu
				this.removeChoices(this.bladeMenu);
				// change blade class and flash color class
				this.blade.className = this.bladeYellow;
				this.flash.className = this.flashYellow;
			break;

			case this.choicePurple.id:
				// remove event listeners and menu
				this.removeChoices(this.bladeMenu);
				// change blade class and flash color class
				this.blade.className = this.bladePurple;
				this.flash.className = this.flashPurple;
			break;

		// if they tapped on the hilt select button
		case this.hiltButton.id:
			// show overlay
			this.choiceOverlay.style.zIndex = "6";
			// show menu background and hilt choices
			this.hiltMenu.style.zIndex = "7";

			// set event listeners for choices
			Mojo.Event.listen(this.choiceLuke, Mojo.Event.tap, this.screenTap);
			Mojo.Event.listen(this.choiceQuiGon, Mojo.Event.tap, this.screenTap);
			Mojo.Event.listen(this.choiceAnakin, Mojo.Event.tap, this.screenTap);
			Mojo.Event.listen(this.choiceVader, Mojo.Event.tap, this.screenTap);
		break;

			case this.choiceLuke.id:
				// remove event listeners and menu
				this.removeChoices(this.hiltMenu);
				// change hilt class
				this.hilt.className = this.hiltLuke;
			break;

			case this.choiceQuiGon.id:
				// remove event listeners and menu
				this.removeChoices(this.hiltMenu);
				// change hilt class
				this.hilt.className = this.hiltQuiGon;
			break;

			case this.choiceAnakin.id:
				// remove event listeners and menu
				this.removeChoices(this.hiltMenu);
				// change hilt class
				this.hilt.className = this.hiltAnakin;
			break;

			case this.choiceVader.id:
				// remove event listeners and menu
				this.removeChoices(this.hiltMenu);
				// change hilt class
				this.hilt.className = this.hiltVader;
			break;

	}
		
}

SabreAssistant.prototype.removeChoices = function(which) {

	// removing blade menu or hilt menu
	if (which == this.bladeMenu) {
		// remove event listeners
		Mojo.Event.stopListening(this.choiceRed, Mojo.Event.tap, this.screenTap);
		Mojo.Event.stopListening(this.choiceBlue, Mojo.Event.tap, this.screenTap);
		Mojo.Event.stopListening(this.choiceGreen, Mojo.Event.tap, this.screenTap);
		Mojo.Event.stopListening(this.choiceYellow, Mojo.Event.tap, this.screenTap);
		Mojo.Event.stopListening(this.choicePurple, Mojo.Event.tap, this.screenTap);

		// hide blade choices and menu background
		this.bladeMenu.style.zIndex = "-1";

	}

	else {
		// remove event listeners
		Mojo.Event.stopListening(this.choiceLuke, Mojo.Event.tap, this.screenTap);
		Mojo.Event.stopListening(this.choiceQuiGon, Mojo.Event.tap, this.screenTap);
		Mojo.Event.stopListening(this.choiceAnakin, Mojo.Event.tap, this.screenTap);
		Mojo.Event.stopListening(this.choiceVader, Mojo.Event.tap, this.screenTap);

		// hide hilt choices and menu background
		this.hiltMenu.style.zIndex = "-1";

	}

	// hide overlay
	this.choiceOverlay.style.zIndex = "-1";
}

SabreAssistant.prototype.mediaSetup = function() {

	// new 1.4.x HTML5 audio implementation setup
	this.libs = MojoLoader.require({ name: "mediaextension", version: "1.0"});

	// set the audio objects to the audio html tag ids
	this.myAudioSwing = this.controller.get('audio-swing');
	this.myAudioHit = this.controller.get('audio-hit');
	this.myAudioOnOff = this.controller.get('audio-onOff');
	this.myAudioPulse = this.controller.get('audio-pulse');

	// get the extension API for the audio objects in the scene.
	this.audioExtSwing = this.libs.mediaextension.MediaExtension.getInstance(this.myAudioSwing);
	this.audioExtHit = this.libs.mediaextension.MediaExtension.getInstance(this.myAudioHit);
	this.audioExtOnOff = this.libs.mediaextension.MediaExtension.getInstance(this.myAudioOnOff);
	this.audioExtPulse = this.libs.mediaextension.MediaExtension.getInstance(this.myAudioPulse);

	// locations of the wavs
	this.sabreOn = Mojo.appPath + "audio/on.wav";
	this.sabreOff = Mojo.appPath + "audio/off.wav";
	this.sabrePulse = Mojo.appPath + "audio/pulse.wav";
	this.sabreSwing = Mojo.appPath + "audio/swing.wav";
	this.sabreHit = Mojo.appPath + "audio/hit.wav";

	// pre-load the on, pulse, swing, and hit sounds (off gets pre-loaded when the sabre is turned on)
	this.myAudioOnOff.src = this.sabreOn;
	this.myAudioOnOff.load();

	this.myAudioPulse.src = this.sabrePulse;
	this.myAudioPulse.load();

	this.myAudioHit.src = this.sabreHit;
	this.myAudioHit.load();

	this.myAudioSwing.src = this.sabreSwing;
	this.myAudioSwing.load();

}

SabreAssistant.prototype.playSnd = function(file) {

	// if we're playing the sound to turn on the sabre,
	// play the sound then start the pulse after it ends
	if (file == this.sabreOn) {

		// handler for detecting when the sound ends
		this.playPulse = this.playPulse.bind(this);
		this.myAudioOnOff.addEventListener('ended', this.playPulse, false);

		// play the on sound (source has already been set and pre-loaded in mediaSetup or when playing the off sound)
		this.myAudioOnOff.play();

	}


	// if we're playing the swing sound
	else if (file == this.sabreSwing) {

		// play the swing sound
		this.myAudioSwing.play();

	}


	// if we're playing the hit sound
	else if (file == this.sabreHit) {

		// play the hit sound
		this.myAudioHit.play();
		
		// show the flash layer
		this.flash.style.zIndex = "3";		
		
		// set timeout to shut off flash layer
		var shutOffFlash = function() {
				this.flash.style.zIndex = "-1";
			     }.bind(this);
		this.controller.window.setTimeout(shutOffFlash, 200);

	}


	// if we're playing the shut off sound
	else {

		// when the off sound is done playing, reset the source to the on sound
		var resetToOnSound = 	function() {
						// reset the on/off source to the on sound and preload it
						this.myAudioOnOff.src = this.sabreOn;
						this.myAudioOnOff.load();
						this.myAudioOnOff.removeEventListener('ended', resetToOnSound, false);
					}.bind(this);

		this.myAudioOnOff.addEventListener('ended', resetToOnSound, false);

		// play the off sound (source has already been set and pre-loaded in the playPulse function)
		this.myAudioOnOff.play();

		// stop playing pulse sound and pre-load it for next time
		this.myAudioPulse.removeEventListener('ended', this.pulseReplay, false);
		this.myAudioPulse.load();
	}

}

SabreAssistant.prototype.playPulse = function(event) {


	// remove the ended listener on the audio object
	this.myAudioOnOff.removeEventListener('ended', this.playPulse, false);

	// once the on sound has finished playing, pre-load the off sound
	this.myAudioOnOff.src = this.sabreOff;
	this.myAudioOnOff.load();

	// handler for detecting when the sound ends to replay
	this.pulseReplay = this.pulseReplay.bind(this);
	this.myAudioPulse.addEventListener('ended', this.pulseReplay, false);

	// now begin playing the pulse sound
	this.myAudioPulse.play();

}

SabreAssistant.prototype.pulseReplay = function() {

//	if (this.sabreIsOn) {

		var replayCallback = 	function SabreAssistant_replay_callback(){
						this.isPending = null;
						this.myAudioPulse.play();
					}.bind(this);

		// if, for some reason, we've already called for a replay, just warn and don't do it again
		if (this.isPending) {
			Mojo.Log.warn("Playback is already pending");
		}

		// otherwise set the replay for 1 millisecond
		else {
			this.isPending = this.controller.window.setTimeout(replayCallback, 1);
		}

//	}

}

	

SabreAssistant.prototype.accelData = function(event) {

	// to prevent from registering a hit or swing when turning sabre on...
	// if this is the very first accel data retrieval, do nothing, otherwise...
	// (these should never ALL equal 0 under other circumstances, unless you drop the device off a building..)
	if (!((this.oldX == 0) && (this.oldY == 0) && (this.oldZ == 0))) {

		// set variables to the current accel data
		this.newX = event.accelX;
		this.newY = event.accelY;
		this.newZ = event.accelZ;

		// geometric difference is the square root of the sum of the squares of the differences in accel data
		// in other words, the square root of [ (x1-x2)^2 + (y1-y2)^2 + (z1-z2)^2 ]
		this.geomDiff = Math.sqrt(
					Math.pow( (this.newX - this.oldX), 2) +
					Math.pow( (this.newY - this.oldY), 2) +
					Math.pow( (this.newZ - this.oldZ), 2)
				);

		// if geometric difference is greater than 1 but less than 2.2, play a swinging sound
		// in my tests this seemed like a pretty good range, but feel free to experiment
		if ( (this.geomDiff > .7) && (this.geomDiff < 2.7) ) {
			this.playSnd(this.sabreSwing);
		}

		// or if it is greater or equal to than 1, play a "hit" sound
		else if (this.geomDiff >= 2.7) {
			this.playSnd(this.sabreHit);
		}

	}

	// set the new data as the old data for the next test
	this.oldX = this.newX;
	this.oldY = this.newY;
	this.oldZ = this.newZ;

}


/****************************************
 * begin puchk update checking framework
 * http://www.jdf-software.com/blog/puchk
 ****************************************/
SabreAssistant.prototype.doUpdateCheck = function() {

	Mojo.Log.info("puchk: Checking for updates...");

	// URL to the app details page for your app
	//var url = "http://developer.palm.com/webChannel/index.php?packageid=" + Mojo.Controller.appInfo.id;
	var url = "http://developer.palm.com/webChannel/index.php?packageid=com.jdfsoftware.tuneyourguitarpro";
	
	// do AJAX request
	var request = new Ajax.Request(url, {
		method: 'get',
		evalJSON: 'false',
		onSuccess: this.gotResults.bind(this), // if you get results, check to see if there's an update
		// we're only concerned with success
	});
	
}

SabreAssistant.prototype.gotResults = function(transport) {

	Mojo.Log.info("puchk: got results, checking versions...");
	
	// the entire HTML source of the Palm app details web page into a string	
	var HTMLStr = transport.responseText;
	
	// look for Version: in the source and get the text between that and <br/>, this is the version string
	var start = HTMLStr.indexOf("Version: ");
	var end = HTMLStr.indexOf("<br/>", start);
	
	var version = HTMLStr.slice(start+9, end);	
		
	// if the returned version is greater than the current version
	if (this.verComp(version)) {

		Mojo.Log.info("puchk: update is available...");
				
		// show update dialog
		this.controller.showAlertDialog({                            
            		onChoose: function(value) {                                         
                		if (value === "update") {                                      
                			this.launchUpdate();                            
                		}                                                           
            		},                                                                  
            		title: $L("New Version Available"),                                 
            		message: Mojo.Controller.appInfo.title + " v" + version + " " + $L("is available. Would you like to update?"),
            		choices: [                                                          
            			{ label: $L("Download Update"), value: "update", type: "affirmative" },
            			{ label: $L("Cancel"), value: "cancel", type: "negative" }      
            		]                                                                   
        	});          	
	}
	
	else {		
		// if there's no update, do nothing
		Mojo.Log.info("puchk: no update available...");
	}
}

SabreAssistant.prototype.launchUpdate = function() {

	Mojo.Log.info("puchk: launching App Catalog...");

	// when the update button is tapped, send the user to the App Catalog for your app	
	var url = "http://developer.palm.com/appredirect/?packageid=" + Mojo.Controller.appInfo.id;

	this.controller.serviceRequest('palm://com.palm.applicationManager',
		{
		method:'open',
		parameters:{target: url}
		});
}

SabreAssistant.prototype.verComp = function(v) {

	Mojo.Log.info("puchk: comparing version numbers...");
	
	var upd = this.splitVer(v); // most up-to-date version, from the Palm app details page
	var cur = this.splitVer(Mojo.Controller.appInfo.version); // get current app version from appinfo.js
	
	// upd can't be lower than cur or it wouldn't be published
	if (	(upd.major > cur.major) // this is a new major version
			|| ( (upd.major == cur.major) && (upd.minor > cur.minor) ) // this is a new minor version
			|| ( (upd.major == cur.major) && (upd.minor == cur.minor) && (upd.build > cur.build) ) // this is a new build version
		) { return true;}
	
	// otherwise, return false, that there isn't an update
	else { return false; }
}

SabreAssistant.prototype.splitVer = function(v) {
	
	var x = v.split('.');
	
    // get the integers of the version parts, or 0 if it can't parse (i.e. 1.4.0 = 1, 4, 0) 
    var major = parseInt(x[0]) || 0;
    var minor = parseInt(x[1]) || 0;
    var build = parseInt(x[2]) || 0;
    return {
        major: major,
        minor: minor,
        build: build
    };
    	
}
/****************************************
 * end puchk update checking framework
 ****************************************/



SabreAssistant.prototype.activate = function(event) {
	// initial event listeners
	Mojo.Event.listen(this.hilt, Mojo.Event.tap, this.screenTap); // tapping on the hilt to turn it on or off
	Mojo.Event.listen(this.bladeButton, Mojo.Event.tap, this.screenTap); // tapping on the blade change button
	Mojo.Event.listen(this.hiltButton, Mojo.Event.tap, this.screenTap); // tapping on the hilt change button
}

SabreAssistant.prototype.deactiv
ate = function(event) {
	// remove event listeners
	Mojo.Event.stopListening(this.hilt, Mojo.Event.tap, this.screenTap);
	Mojo.Event.stopListening(this.bladeButton, Mojo.Event.tap, this.screenTap);
	Mojo.Event.stopListening(this.hiltButton, Mojo.Event.tap, this.screenTap);
}

SabreAssistant.prototype.cleanup = function(event) {


	// FINISH THIS!

	if (this.sabreIsOn) {
		Mojo.Event.stopListening(document, 'acceleration', this.accelHandle);
		this.myAudioPulse.removeEventListener('ended', this.pulseReplay, false);
	}

	this.screenTap = null;
	this.pulseReplay = null;
}
