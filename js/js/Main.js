// @author ivanmoreno

window.addEventListener( 'load', init, false );

var browser;

var stats;
var path = "";
var guiPath = "";

var viewport, 
	camera, 
	cameraOrbit,
	scene,
	renderer, 
	controls,
	topControls;

var earthOrbit;

var animation = new THREE.Object3D();
var orbit = new THREE.Object3D();

var topCameraTake1 = new THREE.Object3D(),
	topCameraTake2 = new THREE.Object3D(),
	topCameraTake3 = new THREE.Object3D(),
	topCameraTake4 = new THREE.Object3D(),
	topCameraTake5 = new THREE.Object3D(),
	topCameraTake6 = new THREE.Object3D(),
	topCameraTake7 = new THREE.Object3D(),
	topCameraTake8 = new THREE.Object3D(),
	topCameraTake9 = new THREE.Object3D(),
	topCameraTake10 = new THREE.Object3D(),
	topCameraTake11 = new THREE.Object3D();

var speed = 0.00006;

var VIEW_HEIGHT = window.innerHeight;
var VIEW_WIDTH = window.innerWidth;

var postprocessing,  
	renderTarget, 
	renderTargetParameters;

var wrapper,
	toolBar;

var postEnabled = true;
var isOrbiting = false;
var isRendering = false;

var isMobile;

var scenes = [];
var phrases = [];

var timelineCamera;
var timelineText;
var sceneTake = SceneTypes.TAKE_1;

var audioAnimation,
	audioOrbit;

var isMoviePlaying = false;
var isAudioPlaying = false;

function init() 
{
	browser = new P360D.Stage();
	
	if ( browser.webglSupport === false ) {

		window.location.assign("http://earth.plus360degrees.com/nowebgl/");

	} else {

		lateInit();

	};

};

function lateInit() {

	isMobile = browser.mobile();

	if ( isMobile ) {

		path = "textures/mobile/";

	} else {

		path = "textures/desktop/";

	};

	if ( window.devicePixelRatio > 1 ) {

		guiPath = "gui/retina/";

	} else {

		guiPath = "gui/regular/";

	};

	var loadingScreen;

	var loadingImage = new Image();
	loadingImage.src = guiPath + "loadingScreen.jpg";
	loadingImage.addEventListener( 'load', onLoadingImageLoaded, false );

	function onLoadingImageLoaded( event ) {

		chromeExpImg = new Image();
		chromeExpImg.src = guiPath + "b4.png";
		chromeExpImg.addEventListener( 'load', onChromeExpIcon, false );

		function onChromeExpIcon( event ) {

			loadingScreen = new P360D.LoadingScreen( loadingImage, chromeExpImg, browser );
			document.body.appendChild( loadingScreen.domElement );
			TweenMax.to( loadingScreen.domElement, 0.4, { opacity: 1.0, onComplete: function() { imgLoader.start(); } } );

		};

	};



	var imagesURL = [ // Gallaxy skybox
					  path + "skybox/posX.jpg",
					  path + "skybox/negX.jpg",
					  path + "skybox/posY.jpg",
					  path + "skybox/negY.jpg",
					  path + "skybox/posZ.jpg",
					  path + "skybox/negZ.jpg",
					  // Flares
					  path + "flares/flare1.jpg",
					  path + "flares/flare2.jpg",
					  path + "flares/flare3.jpg",
					  path + "flares/flare4.jpg",
					  path + "flares/flare5.jpg",
					  // Earth Orbit textures
					  path + "earth/diffuse.jpg",
					  path + "earth/bump.jpg",
					  path + "earth/specular.jpg",
					  path + "earth/clouds.png",
					  path + "earth/night.jpg",
					  path + "earth/moon.jpg",
					  path + "earth/storm.png",
					  // top views diffuses
					  path + "diffuses/south_america_diffuse.jpg",
					  path + "diffuses/europe_diffuse.jpg",
					  path + "diffuses/north_america_diffuse.jpg",
					  path + "diffuses/africa_diffuse.jpg",
					  path + "diffuses/asia_diffuse.jpg",
					  path + "diffuses/australia_diffuse.jpg",
					  //sun
					  path + "flares/sun.png",
					  // GUI
					  guiPath + "fullscreen.png",
					  guiPath + "acceleration.png",
					  guiPath + "lights.png",
					  guiPath + "screenshot.png",
					  guiPath + "orbit.png",
					  guiPath + "play.png",
					  guiPath + "audio.png",
					  guiPath + "subtitles.png",
					  guiPath + "credits.png",
					  guiPath + "menu.png",
					  guiPath + "facebook.png",
					  guiPath + "twitter.png",
					  guiPath + "google.png",
					  guiPath + "pause.png",
					  guiPath + "audioOff.png",
					  guiPath + "movie.png" ];

	var englishText = [ "From this distant vantage point, the Earth might not seem of any particular interest. But for us, it's different. Consider again that dot. That's here.",
						"That's home. That's us. On it everyone you love, everyone you know, everyone you ever heard of, every human being who ever was, lived out their lives.",
						"The aggregate of our joy and suffering, thousands of confident religions, ideologies, and economic doctrines, every hunter and forager,",
						"every hero and coward, every creator and destroyer of civilization, every king and peasant, every young couple in love, every mother and father,",
						"hopeful child, inventor and explorer, every teacher of morals, every corrupt politician, every superstar, every supreme leader,",
						"every saint and sinner in the history of our species lived there on a mote of dust suspended in a sunbeam. The Earth is a very small stage in a vast cosmic arena.",
						"Think of the rivers of blood spilled by all those generals and emperors so that, in glory and triumph, they could become the momentary masters of a fraction of a dot.",
						"Think of the endless cruelties visited by the inhabitants of one corner of this pixel on the scarcely distinguishable inhabitants of some other corner,",
						"how frequent their misunderstandings, how eager they are to kill one another, how fervent their hatreds. Our posturings, our imagined self-importance, the delusion",
						"that we have some privileged position in the Universe, are challenged by this point of pale light. Our planet is a lonely speck in the great enveloping cosmic dark.",
						"In our obscurity, in all this vastness, there is no hint that help will come from elsewhere to save us from ourselves.",
						"The Earth is the only world known so far to harbor life. There is nowhere else, at least in the near future, to which our species could migrate.",
						"Visit, yes. Settle, not yet. Like it or not, for the moment the Earth is where we make our stand. It has been said that astronomy is a humbling",
						"and character-building experience. There is perhaps no better demonstration of the folly of human conceits than this distant image of our tiny world.",
						"To me, it underscores our responsibility to deal more kindly with one another, and to preserve and cherish the pale blue dot, the only home we've ever known." ];

	viewport = P360D.DOM.div( 'viewport' );
	viewport.style.position = 'absolute';

	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera( 40, VIEW_WIDTH / VIEW_HEIGHT, 1, 40000 );
	cameraOrbit = new THREE.PerspectiveCamera( 40, VIEW_WIDTH / VIEW_HEIGHT, 1, 40000 );

	renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
	renderer.setSize( VIEW_WIDTH, VIEW_HEIGHT );
	renderer.setClearColor( 0x000000, 1 );
	renderer.sortObjects = false;
	viewport.appendChild( renderer.domElement );

	controls = new THREE.OrbitControls( cameraOrbit, viewport );
	cameraOrbit.position.set( 841, -429, -500 );
	controls.zoomSpeed = 0.07;
	controls.distance = 900;
	controls.minDistance = 900;
	controls.maxDistance = 1120;
	controls.enabledAll( false );

	topControls = new P360D.TopCameraControls( camera, viewport );
	topControls.enabledAll( false );

	scene.add( animation );
	scene.add( orbit );

	var take1Cam = new THREE.Object3D();
	var take4Cam = new THREE.Object3D();
	var take7Cam = new THREE.Object3D();
	var take9Cam = new THREE.Object3D();
	var take11Cam = new THREE.Object3D();

	take11Cam.add( camera );
	topCameraTake11.add( take11Cam );
	scene.add( topCameraTake11 );

	take1Cam.rotation.y = THREE.Math.degToRad( 180 );
	take4Cam.rotation.y = THREE.Math.degToRad( 180 );
	take7Cam.rotation.y = THREE.Math.degToRad( 180 );
	take9Cam.rotation.y = THREE.Math.degToRad( 180 );
	take11Cam.rotation.y = THREE.Math.degToRad( 180 );

	var ambientLight = new THREE.AmbientLight( 0x07215c );
	ambientLight.color.setRGB( 0.02, 0.02, 0.07 );
	scene.add( ambientLight );

	var sunLight = new THREE.PointLight( 0xe8f7ff, 1.2 );
	var sunLight1 = new THREE.DirectionalLight( 0x000000, 0.0 );
	sunLight.position.set( 10000, 0, 0 );
	sunLight1.position.set( 1, 0, 0 ).normalize();
	scene.add( sunLight );
	scene.add( sunLight1 );

	wrapper = P360D.DOM.div( 'wrapper' );
	document.body.appendChild( wrapper );

	wrapper.appendChild( viewport );

	browser.disabledTouch();

	var endScreen = new P360D.EndAnimationScreen();
	wrapper.appendChild( endScreen.domElement );

	var imagesLoaded = [],
		diffuseTextures = [],
		flareTextures = [],
		earthTextures = [],
		cubeTextures = [],
		guiTextures = [];

	var imgLoader = new PxLoader();

	for ( var i = 0, il = imagesURL.length; i < il; i++ ) {

		var imageLoaded = imgLoader.addImage( imagesURL[ i ] );
		imagesLoaded.push( imageLoaded );

	};

	imgLoader.addEventListener( 'progress', imageLoaderProgress );
	imgLoader.addEventListener( 'complete', imageLoaderComplete );

	function imageLoaderProgress( event ) {

		var percentage = 200;

		if ( event.totalCount ) {

			percentage = Math.floor( percentage * event.completedCount / event.totalCount );
			loadingScreen.beginButton.style.width = percentage + 'px';

		};

	};

	var sunTexture;

	var audioAnimationURL = "";
	var audioOrbitURL = "";

	if ( buzz.isMP3Supported() ) {

		audioAnimationURL = "audio/360Music.mp3";
		audioOrbitURL = "audio/360Ambience.mp3";

	} else if ( buzz.isOGGSupported() ) {

		audioAnimationURL = "audio/360Music.ogg";
		audioOrbitURL = "audio/360Ambience.ogg";

	};

	function imageLoaderComplete( event ) {

		var cross = undefined;

		for ( var i = 0, il = imagesLoaded.length; i < il; i++ ) {

			imagesLoaded[ i ].crossOrigin = cross;

			if ( i >= 0 && i <= 5 ) {

				var cubeTexture = new THREE.Texture( imagesLoaded[ i ] );
				cubeTexture.anisotropy = 8;
				cubeTexture.needsUpdate = true;
				cubeTextures.push( cubeTexture );

			};

			if ( i >= 6 && i <= 10 ) {

				var flareTexture = new THREE.Texture( imagesLoaded[ i ] );
				flareTexture.anisotropy = 8;
				flareTexture.needsUpdate = true;
				flareTextures.push( flareTexture );

			};

			if ( i >= 11 && i <= 17 ) {

				var earthTexture = new THREE.Texture( imagesLoaded[ i ] );
				earthTexture.anisotropy = 8;
				earthTexture.needsUpdate = true;
				earthTextures.push( earthTexture );

			};

			if ( i >= 18 && i <= 23 ) {

				var diffuseTexture = new THREE.Texture( imagesLoaded[ i ] );
				diffuseTexture.anisotropy = 8;
				diffuseTexture.needsUpdate = true;
				diffuseTextures.push( diffuseTexture );

			};

			if ( i === 24 ) {

				sunTexture = new THREE.Texture( imagesLoaded[ i ] );
				sunTexture.anisotropy = 8;
				sunTexture.needsUpdate = true;

			};

			if ( i >= 25 && i <= 40 ) {

				guiTextures.push( imagesLoaded[ i ] );

			};

		};

		//LENS FLARES
		var lensFlare = new THREE.LensFlare( flareTextures[ 0 ], 400, 0.0, THREE.AdditiveBlending );

		lensFlare.add( flareTextures[ 4 ], 900, 0.0, THREE.AdditiveBlending );

		lensFlare.add( flareTextures[ 2 ], 70, 0.1, THREE.AdditiveBlending );
		lensFlare.add( flareTextures[ 1 ], 80, 0.2, THREE.AdditiveBlending );
		lensFlare.add( flareTextures[ 3 ], 220, 0.3, THREE.AdditiveBlending, new THREE.Color('#0033ff') );
		lensFlare.add( flareTextures[ 1 ], 100, 0.4, THREE.AdditiveBlending, new THREE.Color('#004422') );
		lensFlare.add( flareTextures[ 1 ], 310, 0.5, THREE.AdditiveBlending, new THREE.Color('#6600cc') );
		lensFlare.add( flareTextures[ 3 ], 490, 0.6, THREE.AdditiveBlending, new THREE.Color('#003300') );
		lensFlare.add( flareTextures[ 2 ], 150, 0.6, THREE.AdditiveBlending, new THREE.Color('#0033ff') );
		lensFlare.add( flareTextures[ 3 ], 700, 0.9, THREE.AdditiveBlending, new THREE.Color('#ffffff') );

		lensFlare.customUpdateCallback = lensFlareCallback;
		lensFlare.position.copy( sunLight.position );
		scene.add( lensFlare );

		var sunMaterial = new THREE.SpriteMaterial( {
			map: sunTexture,
			transparent: true,
			depthWrite: false

		} );

		var sunPlane = new THREE.Sprite( sunMaterial );
		sunPlane.position.copy( sunLight.position );
		sunPlane.scale.x = sunPlane.scale.y = 200;
		scene.add( sunPlane );

		scenes[ 0 ] = new P360D.OrbitScene( cubeTextures, earthTextures );
		animation.add( scenes[ 0 ] );

		earthOrbit = new P360D.OrbitScene( cubeTextures, earthTextures );
		orbit.add( earthOrbit );
		orbit.visible = false;

		var types = [ SceneTypes.PAN_HORIZONTAL_LEFT, SceneTypes.PAN_HORIZONTAL_RIGHT, SceneTypes.PAN_HORIZONTAL_RIGHT,
						SceneTypes.PAN_HORIZONTAL_LEFT, SceneTypes.PAN_HORIZONTAL_RIGHT, SceneTypes.PAN_HORIZONTAL_LEFT ];

		for ( var i = 0, il = diffuseTextures.length; i < il; i++ ) {

			var topScene = new P360D.TopScene( diffuseTextures[ i ], types[ i ] );
			scenes.push( topScene );
			animation.add( topScene );

		};

		toolBar = new P360D.ToolBar( guiTextures, wrapper, browser, accelerate, toggleLights, printscreen, toggleScenes, toggleMovie, toggleAudio, toggleCaption );
		wrapper.appendChild( toolBar.domElement );
		toolBar.enabledButtons( isOrbiting );

		for ( var i = 0, il = englishText.length; i < il; i++ ) {

			var phrase = new P360D.Phrase( englishText[ i ], "phrase" + i );
			phrases.push( phrase );
			toolBar.domElement.appendChild( phrase.phrase );

		};

		timelineCamera = new TimelineMax( { 

			onUpdate: function() { 

				TweenLite.set( toolBar.slider, { 

					scaleX: timelineCamera.progress(), 
					transformOrigin:"0px 0px" 

				} ) 

			},

			onStart: function() {

				toolBar.slider.style.opacity = '1.0';

			},

			onComplete: onAnimationEnd

		} );

		timelineText = new TimelineMax();
		
		resize();
		animateCamera();
		animateText();
		topControls.enabledAll( true );
		updateCameras();

		scenes[ 0 ].update( 0, topCameraTake1 );
		topCameraTake1.lookAt( scenes[ 0 ].position );

		renderer.render( scene, camera );
		renderer.clear();

		audioAnimation = new buzz.sound( audioAnimationURL, { 
				autoplay: true,
				volume: 100, 
				loop: true
			} );
		audioAnimation.pause();

		audioOrbit = new buzz.sound( audioOrbitURL, { 
				autoplay: true,
				volume: 100, 
				loop: true 
			} );
		audioOrbit.pause();

		if ( audioAnimation.sound != undefined ) {

			audioAnimation.sound.addEventListener( 'loadedmetadata', function( event ){ 

				console.log("Animation sound state: "+ audioAnimation.sound.readyState, "Orbit sound state: " + audioOrbit.sound.readyState);

				onLoadComplete();


			}, false );

		} else {

			onLoadComplete();

		};

	};

	function onLoadComplete() {

		if ( isMobile ) {

			loadingScreen.loadingText.innerHTML = "BEGIN";

			loadingScreen.beginButton.addEventListener( browser.endEvent, function( event ){

				event.preventDefault();

				backLoad();

				event.stopPropagation();

			}, false );

		} else {

			backLoad();

		};

	};

	function backLoad() {

		render();

		if ( isMobile ) {

			audioAnimation.play();
			audioAnimation.pause();
			
		};

		TweenMax.to( loadingScreen.domElement, 0.6, { 

			opacity: 0.0, 

			onComplete: function() {

				document.body.removeChild( loadingScreen.domElement );
				loadingScreen.domElement = null;
				loadingScreen = null;

				isRendering = true;

				TweenMax.to( [ hblur.uniforms[ "h" ], vblur.uniforms[ "v" ] ], 2.0, { 

					value: 0.0 / 512, 
					delay: 0.5, 
					ease: Linear.easeNone 

				} );

				TweenMax.to( vignettePass.uniforms[ "offset" ], 2.0, { 

					value: 0.0, 
					delay: 0.5, 
					ease: Cubic.easeOut, 
					onComplete: startExperience

				} );

			} 

		} );

	};

	function startExperience() {

		if ( postEnabled ) {

			postEnabled = false;

		};

		timelineCamera.restart();
		timelineText.restart();

		if ( audioAnimation.isEnded() ) {

			audioAnimation.play();
			audioAnimation.unmute();
			audioOrbit.play();
			audioOrbit.pause();

		} else {

			audioAnimation.play();
			audioOrbit.play();
			audioOrbit.pause();

		};

		isAudioPlaying = true;
		isMoviePlaying = true;

		console.log("Animation sound state: "+ audioAnimation.sound.readyState, "Orbit sound state: " + audioOrbit.sound.readyState);

	};

	var zPosition;

	function updateCameras() {

		if ( isMobile ) {

			zPosition = 1500;

		} else {

			zPosition = 1150;

		};

		topControls.resize();

		switch ( sceneTake ) {

			case SceneTypes.ORBIT: break;
			case SceneTypes.TAKE_1:

				take11Cam.add( camera );
				topCameraTake11.remove( take11Cam );
				scene.remove( topCameraTake11 );
				take1Cam.add( camera );
				topCameraTake1.position.set( 841, -429, -500 );
				topCameraTake1.add( take1Cam );
				scene.add( topCameraTake1 );

				break;

			case SceneTypes.TAKE_2:

				take1Cam.remove( camera );
				topCameraTake1.remove( take1Cam );
				scene.remove( topCameraTake1 );
				topCameraTake2.position.set( 0, 0, zPosition );
				topCameraTake2.add( camera );
				scene.add( topCameraTake2 );

				break;

			case SceneTypes.TAKE_3:

				topCameraTake2.remove( camera );
				scene.remove( topCameraTake2 );
				topCameraTake3.position.set( 0, 0, zPosition );
				topCameraTake3.add( camera );
				scene.add( topCameraTake3 );

				break;

			case SceneTypes.TAKE_4:

				topCameraTake3.remove( camera );
				scene.remove( topCameraTake3 );
				take4Cam.add( camera );
				topCameraTake4.position.set( 0, 840, 0 );
				topCameraTake4.add( take4Cam );
				scene.add( topCameraTake4 );

				break;

			case SceneTypes.TAKE_5:

				take4Cam.remove( camera );
				topCameraTake4.remove( take4Cam );
				scene.remove( topCameraTake4 );
				topCameraTake5.position.set( 0, 0, zPosition );
				topCameraTake5.add( camera );
				scene.add( topCameraTake5 );

				break;

			case SceneTypes.TAKE_6:

				topCameraTake5.remove( camera );
				scene.remove( topCameraTake5 );
				topCameraTake6.position.set( 0, 0, zPosition );
				topCameraTake6.add( camera );
				scene.add( topCameraTake6 );

				break;

			case SceneTypes.TAKE_7:

				topCameraTake6.remove( camera );
				scene.remove( topCameraTake6 );
				take7Cam.add( camera );
				topCameraTake7.position.set( 671, 0, 500 );
				topCameraTake7.add( take7Cam );
				scene.add( topCameraTake7 );

				break;

			case SceneTypes.TAKE_8:

				take7Cam.remove( camera );
				topCameraTake7.remove( take7Cam );
				scene.remove( topCameraTake7 );
				topCameraTake8.position.set( 0, 0, zPosition );
				topCameraTake8.add( camera );
				scene.add( topCameraTake8 );

				break;

			case SceneTypes.TAKE_9:

				topCameraTake8.remove( camera );
				scene.remove( topCameraTake8 );
				take9Cam.add( camera );
				topCameraTake9.position.set( 0, 542, -724 );
				topCameraTake9.add( take9Cam );
				scene.add( topCameraTake9 );

				break;

			case SceneTypes.TAKE_10:

				take9Cam.remove( camera );
				topCameraTake9.remove( take9Cam );
				scene.remove( topCameraTake9 );
				topCameraTake10.position.set( 0, 0, zPosition );
				topCameraTake10.add( camera );
				scene.add( topCameraTake10 );

				break;

			case SceneTypes.TAKE_11:

				topCameraTake10.remove( camera );
				scene.remove( topCameraTake10 );
				take11Cam.add( camera );
				topCameraTake11.position.set( -471, 695, 13 );
				topCameraTake11.add( take11Cam );
				scene.add( topCameraTake11 );

				break;

		};

	};

	function animateCamera() {

		timelineCamera.addCallback( function() {

			sceneTake = SceneTypes.TAKE_1;

			updateCameras();
			updateScreenSize();

		}, 0.0 );

		timelineCamera.add( TweenMax.to( topCameraTake1.position, 20.0, { 

			x: 661, 
			y: -337, 
			z: -393, 
			ease:Linear.easeNone

		} ) );

		timelineCamera.addCallback( function(){

			sceneTake = SceneTypes.TAKE_2;

			scenes[ 0 ].visible = false;
			scenes[ 1 ].visible = true;

			updateCameras();
			updateScreenSize();

		}, 20.0 );

		timelineCamera.addCallback( blurVignetteTransition, 19.0 );

		timelineCamera.add( TweenMax.to( topCameraTake2.position, 18.0, { x: 800, ease: Linear.easeNone } ) );

		timelineCamera.addCallback( function(){ 

			sceneTake = SceneTypes.TAKE_3;

			scenes[ 1 ].visible = false;
			scenes[ 2 ].visible = true;

			updateCameras();
			updateScreenSize();

		}, 38.0 );

		timelineCamera.add( TweenMax.to( topCameraTake3.position, 10.0, { x: -580, ease: Linear.easeNone } ) );

		timelineCamera.addCallback( function(){ 

			sceneTake = SceneTypes.TAKE_4;

			scenes[ 2 ].visible = false;
			scenes[ 0 ].visible = true;

			updateCameras();
			updateScreenSize();

		}, 48.0 );

		timelineCamera.add( TweenMax.to( topCameraTake4.position, 30.0, { 

			ease: Linear.easeNone, 
			bezier: { values: [ { x: -274, y: 779, z: -63 }, 
								{ x: -497, y: 648, z: -194 }, 
								{ x: -713, y: 275, z: -346 }, 
								{ x: -755, y: 34, z: -366 }, 
								{ x: -760, y: -209, z: -366 }, 
								{ x: -531, y: -632, z: -366 },
								{ x: -434, y: -763, z: -366 } ] }

		} ) );

		timelineCamera.addCallback( function(){ 

			sceneTake = SceneTypes.TAKE_5;

			scenes[ 0 ].visible = false;
			scenes[ 3 ].visible = true;

			updateCameras();
			updateScreenSize();

		}, 78.0 );

		timelineCamera.addCallback( blurVignetteTransition, 77.0 );

		timelineCamera.add( TweenMax.to( topCameraTake5.position, 15.0, { x: -780, ease: Linear.easeNone } ) );

		timelineCamera.addCallback( function(){ 

			sceneTake = SceneTypes.TAKE_6;

			scenes[ 3 ].visible = false;
			scenes[ 4 ].visible = true;

			updateCameras();
			updateScreenSize();

		}, 93.0 );

		timelineCamera.add( TweenMax.to( topCameraTake6.position, 22.0, { x: 810, ease: Linear.easeNone } ) );

		timelineCamera.addCallback( function(){ 

			sceneTake = SceneTypes.TAKE_7;

			scenes[ 4 ].visible = false;
			scenes[ 0 ].visible = true;

			updateCameras();
			updateScreenSize();

		}, 115.0 );

		timelineCamera.add( TweenMax.to( topCameraTake7.position, 16.0, { 

			ease: Linear.easeNone,
			bezier: { values: [ { x: 242, y: 0, z: 882 }, 
								{ x: 0, y: 0, z: 882 }, 
								{ x: -292, y: 0, z: 785 }, 
								{ x: -591, y: 0, z: 595 }, 
								{ x: -900, y: 0, z: 346 }, 
								{ x: -1100, y: 0, z: 280 } ] }


		} ) );

		timelineCamera.addCallback( function(){ 

			sceneTake = SceneTypes.TAKE_8;

			scenes[ 0 ].visible = false;
			scenes[ 5 ].visible = true;

			updateCameras();
			updateScreenSize();

		}, 131.0 );

		timelineCamera.addCallback( blurVignetteTransition, 130.0 );

		timelineCamera.add( TweenMax.to( topCameraTake8.position, 15.0, { x: -780, ease: Linear.easeNone } ) );

		timelineCamera.addCallback( function(){ 

			sceneTake = SceneTypes.TAKE_9;

			scenes[ 5 ].visible = false;
			scenes[ 0 ].visible = true;

			updateCameras();
			updateScreenSize();

		}, 146.0 );

		timelineCamera.add( TweenMax.to( topCameraTake9.position, 19.0, { 

			ease: Linear.easeNone,
			bezier: { values: [ { x: 523, y: 542, z: -520  }, 
								{ x: 729, y: 542, z: -148 }, 
								{ x: 757, y: 542, z: 0 }, 
								{ x: 573, y: 542, z: 485 }, 
								{ x: 269, y: 542, z: 694 }, 
								{ x: 0, y: 542, z: 710 } ] }

		} ) );

		timelineCamera.addCallback( function(){ 

			sceneTake = SceneTypes.TAKE_10;

			scenes[ 0 ].visible = false;
			scenes[ 6 ].visible = true;

			updateCameras();
			updateScreenSize();

		}, 165.0 );

		timelineCamera.addCallback( blurVignetteTransition, 164.0 );

		timelineCamera.add( TweenMax.to( topCameraTake10.position, 20.0, { x: 810, ease: Linear.easeNone } ) );

		timelineCamera.addCallback( function(){ 

			sceneTake = SceneTypes.TAKE_11;

			scenes[ 6 ].visible = false;
			scenes[ 0 ].visible = true;

			updateCameras();
			updateScreenSize();

		}, 185.0 );

		timelineCamera.add( TweenMax.to( topCameraTake11.position, 28.0, { 

			ease: Linear.easeNone,
			bezier: { values: [ { x: -551, y: 595, z: -216  }, 
								{ x: -494, y: 484, z: -475 }, 
								{ x: -377, y: 358, z: -659 }, 
								{ x: -8, y: 100, z: -900 }, 
								{ x: 407, y: -100, z: -727 }, 
								{ x: 841, y: -429, z: -500 } ] }

		} ) );

		timelineCamera.pause();

	};

	function animateText() {

		timelineText.add( phrases[ 0 ].animateIn( 2.0 ) );
		timelineText.add( phrases[ 0 ].animateOut( 8.0 ) );
		timelineText.add( phrases[ 1 ].animateIn() );
		timelineText.add( phrases[ 1 ].animateOut( 9.0 ) );
		timelineText.add( phrases[ 2 ].animateIn() );
		timelineText.add( phrases[ 2 ].animateOut( 6.0 ) );
		timelineText.add( phrases[ 3 ].animateIn() );
		timelineText.add( phrases[ 3 ].animateOut( 6.0 ) );
		timelineText.add( phrases[ 4 ].animateIn() );
		timelineText.add( phrases[ 4 ].animateOut( 8.0 ) );
		timelineText.add( phrases[ 5 ].animateIn() );
		timelineText.add( phrases[ 5 ].animateOut( 13.0 ) );
		timelineText.add( phrases[ 6 ].animateIn() );
		timelineText.add( phrases[ 6 ].animateOut( 8.0 ) );
		timelineText.add( phrases[ 7 ].animateIn() );
		timelineText.add( phrases[ 7 ].animateOut( 5.0 ) );
		timelineText.add( phrases[ 8 ].animateIn() );
		timelineText.add( phrases[ 8 ].animateOut( 12.0 ) );
		timelineText.add( phrases[ 9 ].animateIn() );
		timelineText.add( phrases[ 9 ].animateOut( 10.0 ) );
		timelineText.add( phrases[ 10 ].animateIn() );
		timelineText.add( phrases[ 10 ].animateOut( 6.0 ) );
		timelineText.add( phrases[ 11 ].animateIn() );
		timelineText.add( phrases[ 11 ].animateOut( 5.0 ) );
		timelineText.add( phrases[ 12 ].animateIn() );
		timelineText.add( phrases[ 12 ].animateOut( 9.0 ) );
		timelineText.add( phrases[ 13 ].animateIn() );
		timelineText.add( phrases[ 13 ].animateOut( 7.0 ) );
		timelineText.add( phrases[ 14 ].animateIn() );
		timelineText.add( phrases[ 14 ].animateOut( 9.0 ) );

		timelineText.pause();

	};

	var isNight = true;

	function toggleLights() {

		earthOrbit.earth.toggleLights( isNight = !isNight );

	};

	var isCaption = true;

	function toggleCaption() {

		if ( isCaption ) {

			for ( var i = 0, il = phrases.length; i < il; i++ ) {

				TweenMax.to( phrases[ i ].phrase, 0.3, { opacity: 0.0 } );

			};

			isCaption = false;

		} else {

			for ( var i = 0, il = phrases.length; i < il; i++ ) {

				TweenMax.to( phrases[ i ].phrase, 0.3, { opacity: 1.0 } );

			};

			isCaption = true;

		};

	};

	var lastAnimationTake;
	var fadeTime = 200;

	function toggleScenes() {

		toolBar.blockButtons( true );

		if ( isOrbiting ) {

			if ( isMoviePlaying ) {

				timelineCamera.resume();
				timelineText.resume();

			};

			if ( isAudioPlaying ) {

				if ( isMoviePlaying ) {

					audioOrbit.pause();
					audioAnimation.play();
					audioAnimation.unmute();

				} else {

					audioOrbit.pause();
					audioAnimation.pause();

				};

			} else {

				if ( isMoviePlaying ) {

					audioOrbit.pause();
					audioAnimation.mute();
					audioAnimation.play();

				} else {

					audioOrbit.pause();
					audioAnimation.pause();

				};

			};

			if ( isCaption ) {

				for ( var i = 0, il = phrases.length; i < il; i++ ) {

					TweenMax.to( phrases[ i ].phrase, 0.3, { opacity: 1.0 } );

				};

			};

			postEnabled = true;

			TweenMax.to( vignettePass.uniforms[ "offset" ] , 1.0, { 

				value: 100.0, 
				ease: Expo.easeIn,
				onComplete: function() {

					postprocessing.renderPass.camera = camera;
					
					animation.visible = true;
					orbit.visible = false;

					sceneTake = lastAnimationTake;

					isOrbiting = false;

					controls.enabledAll( false );
					topControls.enabledAll( true );

					updateScreenSize();

					toolBar.enabledButtons( isOrbiting );

				} 
			} );

			TweenMax.to( vignettePass.uniforms[ "offset" ], 1.0, { 

				value: 0.0, 
				delay: 1.0, 
				ease: Cubic.easeOut, 
				onComplete: function(){

					postEnabled = false;
					toolBar.blockButtons( false );
					_print();

				} 

			} );

			TweenMax.to( [ hblur.uniforms[ "h" ], vblur.uniforms[ "v" ] ], 1.0, { value: 2.0 / 512, ease: Linear.easeNone } );
			TweenMax.to( [ hblur.uniforms[ "h" ], vblur.uniforms[ "v" ] ], 1.0, { value: 0.0 / 512, delay: 1.0, ease: Linear.easeNone } );

		} else {

			if ( isAudioPlaying ) {

				audioOrbit.play();

			} else {

				if ( isMoviePlaying ) {

					audioOrbit.pause();
					audioAnimation.mute();
					audioAnimation.play();

				};

			};

			timelineCamera.pause();
			timelineText.pause();
			audioAnimation.pause();

			if ( isCaption ) {

				for ( var i = 0, il = phrases.length; i < il; i++ ) {

					TweenMax.to( phrases[ i ].phrase, 0.3, { opacity: 0.0 } );

				};

			};

			postEnabled = true;

			TweenMax.to( vignettePass.uniforms[ "offset" ] , 1.0, { 

				value: 100.0, 
				ease: Expo.easeIn,
				onComplete: function() {

					postprocessing.renderPass.camera = cameraOrbit;

					lastAnimationTake = sceneTake;

					animation.visible = false;
					orbit.visible = true;

					sceneTake = SceneTypes.ORBIT;
					isOrbiting = true;

					controls.enabledAll( true );
					topControls.enabledAll( false );

					updateScreenSize();

					toolBar.enabledButtons( isOrbiting );

				} 
			} );

			TweenMax.to( vignettePass.uniforms[ "offset" ], 1.0, { 

				value: 0.0, 
				delay: 1.0, 
				ease: Cubic.easeOut, 
				onComplete: function(){

					postEnabled = false;
					toolBar.blockButtons( false );
					_print();

				} 

			} );

			TweenMax.to( [ hblur.uniforms[ "h" ], vblur.uniforms[ "v" ] ], 1.0, { value: 2.0 / 512, ease: Linear.easeNone } );
			TweenMax.to( [ hblur.uniforms[ "h" ], vblur.uniforms[ "v" ] ], 1.0, { value: 0.0 / 512, delay: 1.0, ease: Linear.easeNone } );

		};

	};

	function toggleMovie() {

		if ( isMoviePlaying ) {

			if ( !isOrbiting ) {

				audioAnimation.pause();
				timelineCamera.pause();
				timelineText.pause();

			};
			
			isMoviePlaying = false;

		} else {

			if ( !isOrbiting ) {

				if ( isAudioPlaying ) {

					audioAnimation.play();
					audioAnimation.unmute();

				} else {

					audioAnimation.mute();
					audioAnimation.play();

				}

				timelineCamera.resume();
				timelineText.resume();

			};

			isMoviePlaying = true;		

		};

		_print();

	};

	//	TODO: add when movie ends to start audio animation again
	function toggleAudio() {

		if ( isAudioPlaying ) {

			if ( isOrbiting ) {

				audioOrbit.pause(); 	

			} else {

				if ( isMoviePlaying ) {

					audioAnimation.mute();

				} else {

					audioAnimation.pause();

				};

			};

			isAudioPlaying = false;

		} else {

			if ( isOrbiting ) {

				audioOrbit.play();

			} else {

				if ( isMoviePlaying ) {

					audioAnimation.play();
					audioAnimation.unmute();

				} else {

					audioAnimation.pause();
					audioAnimation.mute();

				};

			};

			isAudioPlaying = true;

		};

		_print();

	};

	function _print() {

//		console.log( "Orbiting is ON: "+ isOrbiting, ". Audio is ON: "+isAudioPlaying,". Animation is ON: "+ isMoviePlaying,". Music is muted: "+audioAnimation.isMuted(),". Music is paused: "+audioAnimation.isPaused(),". Ambient is muted: "+audioOrbit.isMuted(),". Ambient is paused: "+audioOrbit.isPaused(),". Camera timeline is paused: "+timelineCamera.paused() );
//		console.log( "isAudioPlaying: "+isAudioPlaying,". isMoviePlaying: "+ isMoviePlaying,". Is animation music muted: "+audioAnimation.isMuted(),". Is animation music paused: "+audioAnimation.isPaused(),". Is orbit music paused: "+audioOrbit.isPaused(),". Camera timeline is paused: "+timelineCamera.paused() );

	};

	var addSpeed = 0;

	function accelerate() {

		addSpeed++;

		if ( addSpeed === 5 ) addSpeed = 0;

		switch ( addSpeed ) {

			case 0:

				speed = 0.00006;

				break;

			case 1:

				speed = 0.0008;

				break;

			case 2:

				speed = 0.001;

				break;

			case 3:

				speed = 0.003;

				break;

			case 4:

				speed = 0.005;

				break;

		};

	};

	function printscreen( _width, _height ) {

		if ( _width === undefined ) _width = window.innerWidth;
		if ( _height === undefined ) _height = window.innerHeight;

		var image = new Image();

		var canvas = document.createElement("canvas");
		var context = canvas.getContext('2d');
		canvas.width = canvas.style.width = context.width = _width;
		canvas.height = canvas.style.height = context.height = _height;

		camera.aspect = _width / _height;
		camera.updateProjectionMatrix();
		renderer.clear();
		renderer.setClearColor( 0x111111, 1.0 );
		renderer.setSize( _width, _height );
		renderer.render( scene, camera );
		image.src = renderer.context.canvas.toDataURL( 'image/png;base64' );
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.clear();
		renderer.setClearColor( 0x111111, 1.0 );
		renderer.setSize( window.innerWidth, window.innerHeight );
		renderer.render( scene, camera );

		image.addEventListener( 'load', function( event ) {

			drawImage( { canvas: canvas, context: context, image: event.currentTarget, desw: canvas.width, desh: canvas.height } ); 

			canvas.toBlob( function( blob ) {
			        saveAs(
			            blob
			            , "ABOVE_THE_CLOUDS_" + _width + "x" + _height + ".png"
			        );
			    }, "image/png");

			canvas = context = image = null;

		}, false );

	};

	function drawImage( opts ) {

	    if ( !opts.canvas ) {

	        throw( "A canvas is required" );

	    }

	    if ( !opts.image ) {

	        throw( "Image is required" );

	    }

	    var canvas = opts.canvas,
	        context = opts.context || canvas.getContext('2d'),
	        image = opts.image,

	        srcx = opts.srcx || 0,
	        srcy = opts.srcy || 0,
	        srcw = opts.srcw || image.naturalWidth,
	        srch = opts.srch || image.naturalHeight,
	        desx = opts.desx || srcx,
	        desy = opts.desy || srcy,
	        desw = opts.desw || srcw,
	        desh = opts.desh || srch,
	        auto = opts.auto,

	        devicePixelRatio = window.devicePixelRatio || 1,
	        backingStoreRatio = context.webkitBackingStorePixelRatio ||
	                            context.mozBackingStorePixelRatio ||
	                            context.msBackingStorePixelRatio ||
	                            context.oBackingStorePixelRatio ||
	                            context.backingStorePixelRatio || 1,

	        ratio = devicePixelRatio / backingStoreRatio;
		
	    if ( typeof auto === 'undefined' ) {

	    	auto = true;

	    }

	    if ( auto && devicePixelRatio !== backingStoreRatio ) {

	    	var oldWidth = canvas.width;
	        var oldHeight = canvas.height;

	        canvas.width = oldWidth * ratio;
	        canvas.height = oldHeight * ratio;

	        canvas.style.width = oldWidth + 'px';
	      	canvas.style.height = oldHeight + 'px';

	        context.scale( ratio, ratio );

	    }

	    context.clearRect( srcx, srcy, srcw, srch );
	    context.drawImage( image, srcx, srcy, srcw, srch, desx, desy, desw, desh );
	};


	function blurTransition() {

		postEnabled = true;
		TweenMax.to( [ hblur.uniforms[ "h" ], vblur.uniforms[ "v" ] ], 0.5, { value: 2.0 / 512, ease: Linear.easeNone } );
		TweenMax.to( [ hblur.uniforms[ "h" ], vblur.uniforms[ "v" ] ], 0.5, { value: 0.0 / 512, delay: 0.5, ease: Linear.easeNone, onComplete: function(){ postEnabled = false;} } );

	};

	function blurVignetteTransition() {

		postEnabled = true;

		updateScreenSize();

		TweenMax.to( vignettePass.uniforms[ "offset" ] , 1.0, { 

			value: 100.0, 
			ease: Expo.easeIn

		} );

		TweenMax.to( vignettePass.uniforms[ "offset" ], 1.0, { 

			value: 0.0, 
			delay: 1.0, 
			ease: Cubic.easeOut, 
			onComplete: function(){ 

				postEnabled = false;

			} 
		} );

		TweenMax.to( [ hblur.uniforms[ "h" ], vblur.uniforms[ "v" ] ], 1.0, { value: 2.0 / 512, ease: Linear.easeNone } );
		TweenMax.to( [ hblur.uniforms[ "h" ], vblur.uniforms[ "v" ] ], 1.0, { value: 0.0 / 512, delay: 1.0, ease: Linear.easeNone } );

	};

	function lensFlareCallback( object ) {
	
		var flare;
		var vecX = -object.positionScreen.x * 2;
		var vecY = -object.positionScreen.y * 2;

		for ( var f = 0; f < object.lensFlares.length; f++ )  {

			flare = object.lensFlares[ f ];

			flare.x = object.positionScreen.x + vecX * flare.distance;
			flare.y = object.positionScreen.y + vecY * flare.distance;

			flare.rotation = 0;

		};

		object.lensFlares[ 4 ].rotation = THREE.Math.degToRad( 180 );
		object.lensFlares[ 8 ].rotation = THREE.Math.degToRad( 90 );

	};

	function onAnimationEnd() {

		postEnabled = true;

		if ( !isAudioPlaying ) {

			toolBar.resetAudioButton();

		};

		if ( !isMoviePlaying ) {

			toolBar.resetPlayButton();

		};

		isAudioPlaying = false;
		isMoviePlaying = false;
		audioAnimation.stop();
		toolBar.blockButtons( true );
		topControls.enabledAll( false );
		endScreen.domElement.style.visibility = 'visible';

		TweenMax.to( [ hblur.uniforms[ "h" ], vblur.uniforms[ "v" ] ], 1.0, { 

			value: 1.0 / 512, 
			ease: Linear.easeNone,
			onComplete: function() {

				isRendering = false;
				endScreen.replayButton.addEventListener( browser.endEvent, onReplayButton, false );
				sceneTake = SceneTypes.TAKE_1;

			}

		} );

		TweenMax.to( endScreen.domElement, 0.5, { opacity: 1.0, delay: 1.0 } );

	};

	function onReplayButton( event ) {

		event.preventDefault();

		if ( isMobile ) {

			audioAnimation.play();
			
		};

		TweenMax.to( endScreen.domElement, 0.5, { 

			opacity: 0.0, 
			onComplete: function() {

				isRendering = true;
				endScreen.domElement.style.visibility = 'hidden';

			}

		} );

		TweenMax.to( [ hblur.uniforms[ "h" ], vblur.uniforms[ "v" ] ], 1.0, { 

			value: 0.0 / 512, 
			ease: Linear.easeNone,
			delay: 0.5,
			onComplete: function() {

				toolBar.blockButtons( false );
				topControls.enabledAll( true );
				startExperience();
				isAudioPlaying = true;
				isMoviePlaying = true;

			}

		} );

		event.stopPropagation();

	};

	function updateScreenSize() {

		if ( !isMobile ) {

			if ( window.innerHeight <= 800 ) {

				resize();

			};

		};

	};

	//POSTPROCESSING
	var copyShader = new THREE.ShaderPass( THREE.CopyShader );
	copyShader.renderToScreen = true;

	renderTargetParameters = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBAFormat, stencilBufer: true };
	renderTarget = new THREE.WebGLRenderTarget( VIEW_WIDTH, VIEW_HEIGHT, renderTargetParameters );

	var vignettePass = new THREE.ShaderPass( THREE.VignetteShader );
	vignettePass.uniforms[ "darkness" ].value = 100.0;
	vignettePass.uniforms[ "offset" ].value = 100.0;

	var hblur = new THREE.ShaderPass( THREE.HorizontalBlurShader );
	hblur.uniforms[ "h" ].value = 2.0 / 512;
	var vblur = new THREE.ShaderPass( THREE.VerticalBlurShader );
	vblur.uniforms[ "v" ].value = 2.0 / 512;
	
	postprocessing = new P360D.Postprocessing( scene, camera, renderer, renderTarget );
	postprocessing.addFX( vignettePass );
	postprocessing.addFX( hblur);
	postprocessing.addFX( vblur);
	postprocessing.addFX( copyShader );

	window.addEventListener( 'resize', resize, false );
	document.addEventListener( browser.windowHiddenEvent, windowHidden, false );

	function windowHidden( event ) {

		if ( browser.windowHidden() ) {

			if ( isOrbiting ) {

				if ( isAudioPlaying ) {

					audioOrbit.pause();

				};

			} else {

				if ( isAudioPlaying ) {

					audioAnimation.pause();

				};

				if ( isMoviePlaying ) {

					timelineCamera.pause();
					timelineText.pause();

				};

			};

			isRendering = false;

		} else {

			if ( isOrbiting ) {

				if ( isAudioPlaying ) {

					audioOrbit.play();

				};

			} else {

				if ( isAudioPlaying && isMoviePlaying ) {

					audioAnimation.play();

				};

				if ( isMoviePlaying ) {

					timelineCamera.resume();
					timelineText.resume();

				};

			};

			isRendering = true;

		};

	};

};

function resize(/* event */) 
{
	if ( !isMobile ) {

		if ( ~[ SceneTypes.ORBIT, SceneTypes.TAKE_1, SceneTypes.TAKE_4, SceneTypes.TAKE_7, SceneTypes.TAKE_9, SceneTypes.TAKE_11 ].indexOf( sceneTake ) ) {

			VIEW_WIDTH = window.innerWidth;
			VIEW_HEIGHT = window.innerHeight;

		} else {

			if ( window.innerHeight <= 800 ) {

				VIEW_HEIGHT = 800;

			} else {

				VIEW_HEIGHT = window.innerHeight;

			};

			if ( window.innerWidth <= 1280 ) {

				VIEW_WIDTH = 1280;

			} else {

				VIEW_WIDTH = window.innerWidth;

			};

		};

	} else {

		VIEW_WIDTH = window.innerWidth;
		VIEW_HEIGHT = window.innerHeight;

	};

	camera.aspect = VIEW_WIDTH / VIEW_HEIGHT;
	cameraOrbit.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	cameraOrbit.updateProjectionMatrix();
	renderer.setSize( VIEW_WIDTH, VIEW_HEIGHT );

	renderTarget.setSize( VIEW_WIDTH, VIEW_HEIGHT );
	postprocessing.composer.reset( renderTarget );
	postprocessing.composer.setSize( VIEW_WIDTH, VIEW_HEIGHT );

	if ( postEnabled ) {

		postprocessing.update();

	} else {

		if ( !isOrbiting ) {

			topControls.resize();
			renderer.render( scene, camera );

		} else {

			renderer.render( scene, cameraOrbit );

		};

	};

};

function render() 
{
	requestAnimationFrame( render );

	if ( isRendering ) {

		if ( isOrbiting ) {

			switch ( sceneTake ) {

				case SceneTypes.ORBIT:

					if ( controls ) {

						controls.update();

					};

					earthOrbit.update( speed, cameraOrbit );

					break;

			};

			if ( postEnabled ) {

				postprocessing.update();

			} else {

				renderer.render( scene, cameraOrbit );

			};

		} else {

			switch ( sceneTake ) {

				case SceneTypes.TAKE_1:

					scenes[ 0 ].update( 0, topCameraTake1 );
					topCameraTake1.lookAt( scenes[ 0 ].position );

					break;

				case SceneTypes.TAKE_4:

					scenes[ 0 ].update( 0, topCameraTake4 );
					topCameraTake4.lookAt( scenes[ 0 ].position );

					break;

				case SceneTypes.TAKE_7:

					scenes[ 0 ].update( 0, topCameraTake7 );
					topCameraTake7.lookAt( scenes[ 0 ].position );

					break;

				case SceneTypes.TAKE_9:

					scenes[ 0 ].update( 0, topCameraTake9 );
					topCameraTake9.lookAt( scenes[ 0 ].position );

					break;

				case SceneTypes.TAKE_11:

					scenes[ 0 ].update( 0, topCameraTake11 );
					topCameraTake11.lookAt( scenes[ 0 ].position );

					break;
			};

			if ( topControls ) {

				topControls.update();

			};

			if ( postEnabled ) {

				postprocessing.update();

			} else {

				renderer.render( scene, camera );

			};

		};

	};

		
};
