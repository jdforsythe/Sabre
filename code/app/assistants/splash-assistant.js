function SplashAssistant() {
}

SplashAssistant.prototype.setup = function() {

	// test whether we're on Pixi (app is defaulted to Pre 320x480) and change div size
	if (Mojo.Environment.DeviceInfo.screenHeight < 480) {
		$("splashContainer").style.height = "372px"; // 400px - 28px for top bar
	}

	// bind screenTap
	this.splashTap = this.splashTap.bind(this);

	// listen for screen tap and continue
	Mojo.Event.listen($("splashContainer"), Mojo.Event.tap, this.splashTap);

	// create the drop-down menu
	this.appMenuModel = this.controller.setupWidget(Mojo.Menu.appMenu,
							{omitDefaultItems: true},

							{
								visible: true,
								items: [
							    		{ label: "Help", command: 'menu-help' },
							    		{ label: "About", command: 'menu-about' },
							    		{ label: "Support", command: 'menu-support' }
								]
							});


};

SplashAssistant.prototype.handleCommand = function (event) {

	// handle drop-down menu commands

	this.controller = Mojo.Controller.stageController.activeScene();

	if(event.type == Mojo.Event.command) {	

		switch (event.command) {

			case 'menu-help':
				this.controller.showAlertDialog({
					title: $L("Help"),
					message: $L("Tap the screen to continue. Tap the hilt (handle) to turn on the Sabre. Swing it around. Tap the icons at the bottom of the screen to change colors or hilts. Tap the hilt again to shut the Sabre off."),
					choices:[
	         				{label:$L('Ok'), value:"refresh", type:'affirmative'}
					]				    
				});
			break;

			case 'menu-about':
				this.controller.showAlertDialog({
					title: $L("About"),
					message: "Sabre v" + Mojo.Controller.appInfo.version + " Copyright 2010 JDF Software. Get the complete source code, released under the New BSD License, at http://www.jdf-software.com and be sure to follow me at http://twitter.com/jdfsoftware.",
					choices:[
	         				{label:$L('Ok'), value:"refresh", type:'affirmative'}
					]				    
				});
			break;

			case 'menu-support':
				this.launchSupport();
			break;
		}

	}

}

SplashAssistant.prototype.launchSupport = function() {
	this.controller.serviceRequest('palm://com.palm.applicationManager',
					{
						method:'open',
						parameters:{target: 'http://forums.precentral.net/jdf-software/248408-sabre-v0-4-1-a.html'}
					});
}

SplashAssistant.prototype.activate = function(event) {
};

SplashAssistant.prototype.deactivate = function(event) {
	Mojo.Event.stopListening($("splashContainer"), Mojo.Event.tap, this.splashTap);
};

SplashAssistant.prototype.cleanup = function(event) {
};

SplashAssistant.prototype.splashTap = function(event) {
	this.controller.stageController.swapScene({name: "sabre", disableSceneScroller: true});
}
