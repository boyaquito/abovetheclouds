var P360D = P360D || {};

var touchSupport = 'ontouchstart' in window.document ? true : false;
var prefixes = [ 'webkit', 'moz', 'ms', 'o', '' ];

P360D.Stage = function()
{
	this.fullscreenSupport = null,
	this.webglSupport = null,
	this.clickEvent = null,
	this.startEvent = null,
	this.moveEvent = null,
	this.endEvent = null,
	this.windowHiddenEvent = null,
	this.inFullscreen = false;

	this.mobile = function()
	{
		return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
	};

	this.init = function()
	{
		this.clickEvent = touchSupport ? 'touchstart' : 'click';
		this.startEvent = touchSupport ? 'touchstart' : 'mousedown';
		this.moveEvent = touchSupport ? 'touchmove' : 'mousemove';
		this.endEvent = touchSupport ? 'touchend' : 'mouseup';
		this.windowHiddenEvent = this.getHiddenProperty().replace(/[H|h]idden/,'') + 'visibilitychange';

		this.getWebglSupport();
	};

	this.getWebglSupport = function()
	{
		try 
		{ 
			this.webglSupport = !! window.WebGLRenderingContext && !! document.createElement( 'canvas' ).getContext( 'experimental-webgl' );
		} 
		catch( error ) 
		{ 
			return false; 
		};
	};

	this.toggleFullscreen = function( domElement )
	{
		this.domElement = domElement === undefined ? document.body : domElement;

		if( document.fullscreenEnabled || 
			document.webkitFullscreenEnabled || 
			document.msFullscreenEnabled || 
			document.mozFullScreenEnabled) 
		{
			if( !document.fullscreenElement && 
				!document.webkitFullscreenElement && 
				!document.msFullscreenElement && 
				!document.mozFullScreenElement)
			{
				if( this.domElement.requestFullscreen )
				{
					this.domElement.requestFullscreen();
				}
				else if( this.domElement.webkitRequestFullscreen )
				{
					this.domElement.webkitRequestFullscreen();
				}
				else if( this.domElement.msRequestFullscreen )
				{
					this.domElement.msRequestFullscreen();
				}
				else if( this.domElement.mozRequestFullScreen )
				{
					this.domElement.mozRequestFullScreen();
				}
				this.inFullscreen = true;
				return;
			} else {
				if( document.exitFullscreen )
				{
					document.exitFullscreen();
				}
				else if( document.webkitExitFullscreen )
				{
					document.webkitExitFullscreen();
				}
				else if( document.msExitFullscreen )
				{
					document.msExitFullscreen();
				}
				else if( document.mozCancelFullScreen )
				{
					document.mozCancelFullScreen();
				}
				this.inFullscreen = false;
				return;
			}
			
		} 
		else 
		{
			alert( "Your browser doesn’t support the Fullscreen API" );
		}
	};

	this.enabledFullscreen = function( domElement )
	{
		this.domElement = domElement === undefined ? document.body : domElement;

		if( domElement.requestFullscreen )
		{
			domElement.requestFullscreen();
		}
		else if( domElement.webkitRequestFullscreen )
		{
			domElement.webkitRequestFullscreen();
		}
		else if( domElement.msRequestFullscreen )
		{
			domElement.msRequestFullscreen();
		}
		else if( domElement.mozRequestFullScreen )
		{
			domElement.mozRequestFullScreen();
		}
		this.inFullscreen = true;
		return;
	};

	this.exitFullscreen = function()
	{
		if( document.exitFullscreen )
		{
			document.exitFullscreen();
		}
		else if( document.webkitExitFullscreen )
		{
			document.webkitExitFullscreen();
		}
		else if( document.msExitFullscreen )
		{
			document.msExitFullscreen();
		}
		else if( document.mozCancelFullScreen )
		{
			document.mozCancelFullScreen();
		}
		this.inFullscreen = false;
		return;
	};

	this.windowHidden = function()
	{
		return document[ this.getHiddenProperty() ] || false;
	};

	this.disabledTouch = function( domElement )
	{
		var _domElement = domElement === undefined ? window.document : domElement;
		_domElement.addEventListener('touchstart', function( event ){ event.preventDefault(); }, false );
		_domElement.addEventListener('touchmove', function( event ){ event.preventDefault(); }, false );
		_domElement.addEventListener('touchend', function( event ){ event.preventDefault(); }, false );
	};

	this.enabledTouch = function( domElement )
	{
		var _domElement = domElement === undefined ? window.document : domElement;
		_domElement.addEventListener('touchstart', function( event ){ return true; }, true );
		_domElement.addEventListener('touchmove', function( event ){ return true; }, true );
		_domElement.addEventListener('touchend', function( event ){ return true; }, true );
	};

	this.disabledScroll = function( domElement )
	{
		var _domElement = domElement === undefined ? window.document : domElement;
		_domElement.addEventListener( MouseEvent.MOUSE_WHEEL, function( event ){ event.preventDefault(); }, false );
		_domElement.addEventListener( MouseEvent.DOM_MOUSE_SCROLL, function( event ){ event.preventDefault(); }, false );
	};

	this.addEventListener = function( event, callback, useCapture )
	{
		if ( event === 'fullscreenchange' ) {

			document.addEventListener( 'fullscreenchange', callback, useCapture );
			document.addEventListener( 'mozfullscreenchange', callback, useCapture );
			document.addEventListener( 'webkitfullscreenchange', callback, useCapture );
			document.addEventListener( 'msfullscreenchange', callback, useCapture );

		} else {

			document.addEventListener( event, callback, useCapture );

		};
	};

	this.removeEventListener = function( event, callback, useCapture )
	{
		if ( event === 'fullscreenchange' ) {

			document.removeEventListener( 'fullscreenchange', callback, useCapture );
			document.removeEventListener( 'mozfullscreenchange', callback, useCapture );
			document.removeEventListener( 'webkitfullscreenchange', callback, useCapture );
			document.removeEventListener( 'msfullscreenchange', callback, useCapture );

		} else {

			document.removeEventListener( event, callback, useCapture );

		};
	};

	this.getHiddenProperty = function()
	{
		if( 'hidden' in document ) return 'hidden';
    
		for( var i = 0; i < prefixes.length; i++ )
		{
			if( ( prefixes[i] + 'Hidden' ) in document ) 
				return prefixes[i] + 'Hidden';
		}
		return null;
	};

	this.getScreenType = function()
	{
		var mediaScreen = "desktop";

		if ( screen.availWidth > 640 && screen.availWidth <= 1024 ) {

			mediaScreen = "tablet";

		} else if ( screen.availWidth <= 640 || screen.availHeight <= 362 ) {

			mediaScreen = "phone";

		} else if ( screen.availWidth > 1014 ) {

			mediaScreen = "desktop";

		}

		return mediaScreen;
	};

	this.init();
};

P360D.DOM = function(){}

P360D.DOM.div = function( id )
{
	if( document.getElementById( id ) == null )
	{
		var _div = document.createElement( 'div' );
		_div.id = id;
		return _div;
	} else {
		return document.getElementById( id );
	};
};

P360D.DOM.canvas = function( id )
{
	if( document.getElementById( id ) == null )
	{
		var _canvas = document.createElement( 'canvas' );
		_canvas.id = id;
		return _canvas;
	} else {
		return document.getElementById( id );
	};
};

P360D.DOM.element = function( domElementName, id )
{
	var _element = document.createElement( domElementName );
	_element.id = id;
	return _element;
};

P360D.Utils = function(){};

P360D.Utils.randomNumber = function( from, to )
{
	return Math.floor( Math.random() * ( to - from + 1 ) + from );
};

P360D.GeometryUtils = function(){}
P360D.SceneUtils = function(){}

P360D.SceneUtils.geopositionToVector3 = function( lat, lon, radius )
{
	var phi = ( lat ) * Math.PI/180;
	var theta = ( lon - 180 ) * Math.PI/180;

	var x = -( radius ) * Math.cos( phi ) * Math.cos( theta );
	var y = ( radius ) * Math.sin( phi );
	var z = ( radius ) * Math.cos( phi ) * Math.sin( theta );

	return new THREE.Vector3( x, y, z );
};

// https://stemkoski.github.io/Three.js/ 
P360D.TextureAnimator = function( texture, tilesHoriz, tilesVert, numTiles, tileDuration ) 
{		
	this.tilesHorizontal = tilesHoriz;
	this.tilesVertical = tilesVert;
	this.numberOfTiles = numTiles;

	this.tileDisplayDuration = tileDuration;

	this.init = function()
	{
		texture.wrapS = texture.wrapT = THREE.RepeatWrapping; 
		texture.repeat.set( 1 / this.tilesHorizontal, 1 / this.tilesVertical );
		texture.anisotropy = 0;

		this.currentDisplayTime = 0;
		this.currentTile = 0;
	};

	this.update = function( milliSec )
	{
		this.currentDisplayTime += milliSec;

		while ( this.currentDisplayTime > this.tileDisplayDuration ) {

			this.currentDisplayTime -= this.tileDisplayDuration;
			this.currentTile++;

			if( this.currentTile == this.numberOfTiles ) {

				this.currentTile = 0;

			};
				
			var currentColumn = this.currentTile % this.tilesHorizontal;
			texture.offset.x = currentColumn / this.tilesHorizontal;
			var currentRow = Math.floor( this.currentTile / this.tilesHorizontal );
			texture.offset.y = currentRow / this.tilesVertical;

		};
	};

	this.init();
};

P360D.Postprocessing = function( scene, camera, renderer, renderTarget )
{
	this.renderPass;
	this.composer;

	this.scene = scene;
	this.camera = camera;
	this.renderer = renderer;
	this.renderTarget = renderTarget;

	this.init = function()
	{
		this.renderPass = new THREE.RenderPass( this.scene, this.camera );
		this.composer = new THREE.EffectComposer( this.renderer, this.renderTarget );
		this.composer.addPass( this.renderPass );
	};

	this.update = function( delta )
	{
		this.composer.render( delta );
	};

	this.addFX = function( pass )
	{
		this.composer.passes.push( pass );
	};

	this.removeFX = function( pass, index )
	{
		this.composer.passes.slice( pass, index );
	};

	this.init();
};


// rights here
P360D.InsideGlowMaterial = function( color, aperture, scale, useLight, opacity ) {

	THREE.ShaderMaterial.call( this );

	var scope = this;
	var _color = ( color === undefined ) ? new THREE.Color( '#95D3F4' ) : new THREE.Color( color );
	var _aperture = ( aperture === undefined ) ? 0.9999999999 : aperture;
	var _scale = ( scale === undefined ) ? 0.5555555555 : scale;
	var _useLight = ( useLight === undefined ) ? true : useLight;

	var vector = new THREE.Vector4( _color.r, _color.g, _color.b, 0.1 );

	scope.uniforms = THREE.UniformsUtils.merge( [

		THREE.UniformsLib[ "lights" ], {

			"uColor": { type: "v4", value: vector },
			"viewVector": { type: "v3", value: new THREE.Vector4( 1.0, 1.0, 1.0, 1.0 ) },
			"uTop":  { type: "f", value: _aperture },//0.94 },
			"uPower":  { type: "f", value: _scale },//0.65555555555 },
			"usingDirectionalLighting": { type: "i", value: _useLight }

		} ] );

	scope.vertexShader = [

		'uniform vec3 viewVector;',
		'attribute vec4 tangent;',
		'varying vec3 vNormal; ',
		'varying float intensity;',
		'uniform float uTop;',
		'uniform float uPower;',
		
		'void main() {',

			'vNormal = normalize( normalMatrix * normal );',
			'vec3 vNormel = normalize( normalMatrix * viewVector );',
			'intensity = pow( uTop - dot(vNormal, vNormel), uPower );',
			'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',

		'}'

	].join('\n');

	scope.fragmentShader = [

		'uniform vec4 uColor;',
		'varying vec3 vNormal;',
		'varying float intensity;',
		'uniform bool usingDirectionalLighting;',
		
		'#if MAX_DIR_LIGHTS > 0',

			'uniform vec3 directionalLightColor[ MAX_DIR_LIGHTS ];',
			'uniform vec3 directionalLightDirection[ MAX_DIR_LIGHTS ];',

		'#endif',
		
		'void main() {',

			'vec3 dirDiffuse = vec3( 0.0 );',
			'vec3 dirSpecular = vec3( 0.0 );',
		
		'#if MAX_DIR_LIGHTS > 0',

			'if ( usingDirectionalLighting ) {',

				'for ( int i = 0; i < MAX_DIR_LIGHTS; i++ ) {',

					'vec4 lDirection = viewMatrix * vec4( directionalLightDirection[ i ], 0.0 );',
					'vec3 dirVector = normalize( lDirection.xyz );',
					
					'float directionalLightWeightingFull = max( dot( vNormal, dirVector ), 0.0 );',
					'float directionalLightWeightingHalf = max( 10.0 * dot( vNormal, dirVector ) + 0.5, 0.0 );',
					'vec3 dirDiffuseWeight = mix( vec3( directionalLightWeightingFull ), vec3( directionalLightWeightingHalf ), uColor.xyz );',

					'dirDiffuse += dirDiffuseWeight;',

				'}',

			'} else {',

				'dirDiffuse = vec3( 1.0 );',

			'}',

		'#else',

			 'dirDiffuse = vec3( 1.0 );',

		'#endif',

			'gl_FragColor = intensity * intensity * vec4( dirDiffuse, 1.0 );',

		'}'

	].join('\n');

	scope.transparent = true;
	scope.blending = THREE.AdditiveBlending;
	scope.depthWrite = false;
//	scope.alphaTest = 0.9;
	scope.depthTest = true;
	scope.needsUpdate = true;
	scope.lights = true;

};

P360D.InsideGlowMaterial.prototype = Object.create( THREE.ShaderMaterial.prototype );

P360D.OutsideGlowMaterial = function( color, aperture, scale, opacity )
{
	THREE.ShaderMaterial.call( this );

	var scope = this;

	scope.uniforms = { 

			aperture: { type : "f", value: aperture },
			scale: { type : "f", value : scale },
			color : { type: "c", value: new THREE.Color( color ) },
			opacity: { type: "f", value: opacity }

	};

	scope.vertexShader = [

		'varying vec3 vVertexWorldPosition;',
		'varying vec3 vVertexNormal;',

		'void main(){',

			'vVertexNormal = normalize( normalMatrix * normal );',
			'vVertexWorldPosition = ( modelMatrix * vec4( position, 1.0 ) ).xyz;',
			'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',

		'}'

	].join('\n');

	scope.fragmentShader = [

		'uniform vec3 color;',
		'uniform float aperture;',
		'uniform float scale;',
		'uniform float opacity;',

		'varying vec3 vVertexNormal;',
		'varying vec3 vVertexWorldPosition;',

		'void main() {',

			'vec3 worldCameraToVertex = vVertexWorldPosition - cameraPosition;',
			'vec3 viewCameraToVertex = ( viewMatrix * vec4( worldCameraToVertex, 0.0 ) ).xyz;',
			'viewCameraToVertex	= normalize( viewCameraToVertex );',
			'float intensity = pow( aperture + dot( vVertexNormal, viewCameraToVertex ), scale );',
			'gl_FragColor = vec4( color, intensity ) * opacity;',

		'}'
		
	].join('\n');
	
	scope.transparent = true;
//	scope.alphaTest = 0.9;
	scope.depthWrite = false;
	scope.needsUpdate = true;
	scope.side = THREE.BackSide;
};

P360D.OutsideGlowMaterial.prototype = Object.create( THREE.ShaderMaterial.prototype );

P360D.EarthMaterial = function( diffuse, bumpMap, specularMap )
{
	THREE.MeshPhongMaterial.call( this );

	var scope = this;

	scope.map = diffuse || null;
	scope.bumpMap = bumpMap || null;
	scope.specularMap = specularMap || null;
	scope.shininess = 40;
	scope.bumpScale = 2.0;
	scope.specular.setStyle( '#141310' );
};

P360D.EarthMaterial.prototype = Object.create( THREE.MeshPhongMaterial.prototype );

P360D.CloudsMaterial = function( diffuse )
{
	THREE.MeshLambertMaterial.call( this );

	var scope = this;

	scope.map = diffuse || null;
	scope.transparent = true;
//	scope.alphaTest = 0.1;
//	scope.blending = THREE.AdditiveBlending;
//	scope.blendDst = THREE.OneFactor;
//	scope.blendSrc = THREE.OneFactor;
	scope.depthWrite = false;
};

P360D.CloudsMaterial.prototype = Object.create( THREE.MeshLambertMaterial.prototype );

P360D.NightLightsMaterial = function( diffuse )
{
	THREE.MeshLambertMaterial.call( this );

	var scope = this;

	scope.map = diffuse || null;
	scope.color.setStyle( '#f1ba3c' );
	scope.opacity = 0.8;
	scope.side = THREE.BackSide;
	scope.transparent = true;
//	scope.alphaTest = 0.1;
	scope.depthWrite = false;
	scope.blending = THREE.AdditiveBlending;
	scope.blendDst = THREE.OneFactor;
	scope.blendSrc = THREE.OneFactor;
};

P360D.NightLightsMaterial.prototype = Object.create( THREE.MeshLambertMaterial.prototype );

P360D.StormsMaterial = function( diffuse )
{
	THREE.MeshLambertMaterial.call( this );

	var scope = this;

	scope.map = diffuse || null;
	scope.side = THREE.BackSide;
	scope.transparent = true;
//	scope.alphaTest = 0.1;
	scope.depthWrite = false;
	scope.blending = THREE.AdditiveBlending;
	scope.blendDst = THREE.OneFactor;
	scope.blendSrc = THREE.OneFactor;
};

P360D.StormsMaterial.prototype = Object.create( THREE.MeshLambertMaterial.prototype );

P360D.MoonMaterial = function( diffuse )
{
	THREE.MeshLambertMaterial.call( this );

	var scope = this;

	scope.map = diffuse || null;
};

P360D.MoonMaterial.prototype = Object.create( THREE.MeshLambertMaterial.prototype );

P360D.TopEarthMaterial = function( diffuse, bumpMap, specularMap )
{
	THREE.MeshBasicMaterial.call( this );

	var scope = this;

	scope.map = diffuse;
};

P360D.TopEarthMaterial.prototype = Object.create( THREE.MeshBasicMaterial.prototype );

// @ivanmoreno
P360D.Phrase = function( text, id )
{
	var scope = this;

	var _text = ( text === undefined ) ? "Required text content" : text;

	scope.phrase = P360D.DOM.div( id ).cloneNode();
	scope.phrase.classList.add( 'phrases' );

	scope.phrase.addEventListener( MouseEvent.MOUSE_DOWN, function( event ){ event.preventDefault(); return false; } );
	scope.phrase.addEventListener( MouseEvent.MOUSE_MOVE, function( event ){ event.preventDefault(); return false; } );

	scope.words = [];

	var _words = _text.split(/\s+/);

	for ( var i = 0, il = _words.length; i < il; i++ ) {

		var word = P360D.DOM.div( 'word' + i ).cloneNode();
		word.classList.add( 'words' );
		word.innerHTML += _words[ i ] + "&nbsp;";
		scope.words.push( word );
		scope.phrase.appendChild( word );

	};

	this.animateIn = function( delay )
	{
		var delay = ( delay === undefined ) ? 0.0 : delay;
		return TweenMax.staggerTo( scope.words, 1.0, { opacity: 1.0, delay: delay }, 0.1 );
	};

	this.animateOut = function( delay )
	{
		var delay = ( delay === undefined ) ? 0.0 : delay;
		return TweenMax.staggerTo( scope.words, 0.5, { opacity: 0.0, delay: delay }, 0.05 );
	};

};

P360D.ToolBar = function( textures, container, browser, accelerate, toggleLights, screenshot, toggleScenes, toggleMovie, toggleAudio, toggleCaption )
{
	var scope = this;

	scope.textures = textures;
	scope.buttons = [];
	scope.shareTextures = [ textures[ 10 ], textures[ 11 ], textures[ 12 ] ];
	scope.shareButtons = [];

	var container = ( container === undefined ) ? console.log("Error: P360D.ToolBar required a <div> container in it's arguments") : container;

	var isMenu = false;
	var isOrbiting = false;
	var isAudioOff = false;
	var isPause = false;

	// MAIN CONTAINER
	scope.domElement = P360D.DOM.div( 'toolBar' );
	container.appendChild( scope.domElement );

	// OTHER GUI TOOLBAR ELEMENTS
	scope.seekBar = P360D.DOM.div( 'seekBar' );
	scope.slider = P360D.DOM.div( 'slider' );
	scope.seekBar.appendChild( scope.slider );
	scope.domElement.appendChild( scope.seekBar );

	var buttonsContainer = P360D.DOM.div( 'buttonsContainer' );
	scope.domElement.appendChild( buttonsContainer );

	var toolBarBG = P360D.DOM.div( 'toolBarBG' );
	scope.domElement.appendChild( toolBarBG );

	var shareToolBar = P360D.DOM.div( 'shareToolBar' );
	document.body.appendChild( shareToolBar );

	for ( var i = 0, il = scope.shareTextures.length; i < il; i++ ) {

		var _shareButton = P360D.DOM.div( '_shareButton' + i );
		_shareButton.style.left = ( i * 24 )+'px';
		_shareButton.classList.add( 'shareButton' );
		
		_shareButton.appendChild( scope.shareTextures[ i ] );
		shareToolBar.appendChild( _shareButton );
		scope.shareButtons.push( _shareButton );

		scope.shareButtons[ i ].addEventListener( browser.endEvent, function( event ){

			switch ( scope.shareButtons.indexOf( event.currentTarget )) {

				case 0:
					window.open('http://www.facebook.com/sharer/sharer.php?t=Above+the+Clouds,+an+interactive+experience+celebrating+Earth+made+by+Plus+360+Degrees.+Music+by+Sean+Beeson.&u=http://earth.plus360degrees.com/','PopUpWindow','width=570, height=600');
					return false;
					break;
				case 1:
					window.open('https://twitter.com/intent/tweet?source=webclient&text=Above+the+Clouds+made+by+@plus360degrees+music+by+@SeanBeeson+http://earth.plus360degrees.com/+%23EarthDay2016','PopUpWindow','width=600, height=600');
					return false;
					break;
				case 2:
					window.open('https://plus.google.com/share?url=http://earth.plus360degrees.com/','PopUpWindow','width=600, height=600');
					return false;
					break;

			};

		} );

	};

	for ( var i = 0, il = scope.textures.length - 6; i < il; i++ ) {

		var buttonToolBar = P360D.DOM.div( 'buttonToolBar' + i );
		buttonToolBar.classList.add( 'buttonToolBar' );
		buttonToolBar.style.left = ( 50 * i ) +'px';
		buttonToolBar.appendChild( scope.textures[ i ] );
		buttonsContainer.appendChild( buttonToolBar );
		scope.buttons.push( buttonToolBar );

		scope.buttons[ i ].addEventListener( browser.endEvent, onButtonsDown, false );
		scope.buttons[ i ].addEventListener( 'mouseover', onMouseOver, false );
		scope.buttons[ i ].addEventListener( 'mouseout', onMouseOut, false );

	};

	if ( browser.mobile() ) {

		scope.buttons[ 3 ].style.opacity = '0.3';
		scope.buttons[ 3 ].removeEventListener( browser.endEvent, onButtonsDown, false );

	};

	function onButtonsDown( event ) {

		event.preventDefault();

		var index = scope.buttons.indexOf( event.currentTarget );

		switch ( index ) {

			case 0:

				browser.toggleFullscreen();

				break;

			case 1:

				if ( isOrbiting ) {

					if ( accelerate && typeof ( accelerate ) === "function" ) { accelerate(); };

				} else {

					return;

				};

				break;

			case 2:

				if ( isOrbiting ) {

					if ( toggleLights && typeof ( toggleLights ) === "function" ) { toggleLights(); };

				} else {

					return;

				};				

				break;

			case 3:

				if ( isOrbiting ) {

					if ( !browser.mobile() ) {

						if ( screenshot && typeof ( screenshot ) === "function" ) { screenshot(); };

					};		

				} else {

					return;

				};
				
				break;

			case 4:

				if ( toggleScenes && typeof ( toggleScenes ) === "function" ) { toggleScenes(); };

				break;

			case 5:

				if ( isOrbiting ) {

					return;

				} else {

					if ( toggleMovie && typeof ( toggleMovie ) === "function" ) { toggleMovie(); };

				};

				if ( !isPause ) {

					scope.buttons[ 5 ].removeChild( textures[ 5 ] );
					scope.buttons[ 5 ].appendChild( textures[ 13 ] );
					isPause = true;

				} else {

					scope.buttons[ 5 ].removeChild( textures[ 13 ] );
					scope.buttons[ 5 ].appendChild( textures[ 5 ] );
					isPause = false;

				};
				
				break;

			case 6:

				if ( toggleAudio && typeof ( toggleAudio ) === "function" ) { toggleAudio(); };

				if ( !isAudioOff ) {

					scope.buttons[ 6 ].removeChild( textures[ 6 ] );
					scope.buttons[ 6 ].appendChild( textures[ 14 ] );
					isAudioOff = true;

				} else {

					scope.buttons[ 6 ].removeChild( textures[ 14 ] );
					scope.buttons[ 6 ].appendChild( textures[ 6 ] );
					isAudioOff = false;

				};

				break;

			case 7:

				if ( isOrbiting ) {

					return;

				} else {

					if ( toggleCaption && typeof ( toggleCaption ) === "function" ) { toggleCaption(); };

				};
				
				break;

			case 8:

				window.open('http://earth.plus360degrees.com/credits/');
				return false;

				break;

		};

		event.stopPropagation();

	};

	function onMouseOver( event ) {

		event.preventDefault();

		event.currentTarget.style.cursor = 'pointer';

		event.stopPropagation();

	};

	function onMouseOut( event ) {

		event.preventDefault();

		event.currentTarget.style.cursor = 'default';

		event.stopPropagation();

	};

	this.resetAudioButton = function()
	{
		scope.buttons[ 6 ].removeChild( textures[ 14 ] );
		scope.buttons[ 6 ].appendChild( textures[ 6 ] );
		isAudioOff = false;
	};

	this.resetPlayButton = function()
	{
		scope.buttons[ 5 ].removeChild( textures[ 13 ] );
		scope.buttons[ 5 ].appendChild( textures[ 5 ] );
		isPause = false;
	};

	this.enabledButtons = function( value )
	{
		isOrbiting = value;

		if ( !value ) {

			scope.buttons[ 0 ].addEventListener( browser.endEvent, onButtonsDown, false );
			scope.buttons[ 4 ].addEventListener( browser.endEvent, onButtonsDown, false );
			scope.buttons[ 5 ].addEventListener( browser.endEvent, onButtonsDown, false );
			scope.buttons[ 6 ].addEventListener( browser.endEvent, onButtonsDown, false );
			scope.buttons[ 7 ].addEventListener( browser.endEvent, onButtonsDown, false );
			scope.buttons[ 8 ].addEventListener( browser.endEvent, onButtonsDown, false );

			scope.buttons[ 1 ].style.opacity = '0.3';
			scope.buttons[ 2 ].style.opacity = '0.3';
			scope.buttons[ 3 ].style.opacity = '0.3';
			scope.buttons[ 5 ].style.opacity = '1.0';
			scope.buttons[ 7 ].style.opacity = '1.0';

			scope.buttons[ 1 ].removeEventListener( 'mouseover', onMouseOver, false );
			scope.buttons[ 1 ].removeEventListener( 'mouseout', onMouseOut, false );
			scope.buttons[ 2 ].removeEventListener( 'mouseover', onMouseOver, false );
			scope.buttons[ 2 ].removeEventListener( 'mouseout', onMouseOut, false );
			scope.buttons[ 3 ].removeEventListener( 'mouseover', onMouseOver, false );
			scope.buttons[ 3 ].removeEventListener( 'mouseout', onMouseOut, false );
			scope.buttons[ 5 ].addEventListener( 'mouseover', onMouseOver, false );
			scope.buttons[ 5 ].addEventListener( 'mouseout', onMouseOut, false );
			scope.buttons[ 7 ].addEventListener( 'mouseover', onMouseOver, false );
			scope.buttons[ 7 ].addEventListener( 'mouseout', onMouseOut, false );

			scope.buttons[ 4 ].removeChild( textures[ 4 ] );
			scope.buttons[ 4 ].appendChild( textures[ 15 ] );

		} else {

			scope.buttons[ 0 ].addEventListener( browser.endEvent, onButtonsDown, false );
			scope.buttons[ 1 ].addEventListener( browser.endEvent, onButtonsDown, false );
			scope.buttons[ 2 ].addEventListener( browser.endEvent, onButtonsDown, false );
			
			scope.buttons[ 4 ].addEventListener( browser.endEvent, onButtonsDown, false );
			scope.buttons[ 6 ].addEventListener( browser.endEvent, onButtonsDown, false );
			scope.buttons[ 8 ].addEventListener( browser.endEvent, onButtonsDown, false );

			if ( !browser.mobile() ) {

				scope.buttons[ 3 ].addEventListener( browser.endEvent, onButtonsDown, false );
				scope.buttons[ 3 ].style.opacity = '1.0';

			} else {

				scope.buttons[ 3 ].removeEventListener( browser.endEvent, onButtonsDown, false );
				scope.buttons[ 3 ].style.opacity = '0.3';

			};

			scope.buttons[ 1 ].style.opacity = '1.0';
			scope.buttons[ 2 ].style.opacity = '1.0';
			scope.buttons[ 5 ].style.opacity = '0.3';
			scope.buttons[ 7 ].style.opacity = '0.3';

			scope.buttons[ 1 ].addEventListener( 'mouseover', onMouseOver, false );
			scope.buttons[ 1 ].addEventListener( 'mouseout', onMouseOut, false );
			scope.buttons[ 2 ].addEventListener( 'mouseover', onMouseOver, false );
			scope.buttons[ 2 ].addEventListener( 'mouseout', onMouseOut, false );
			scope.buttons[ 3 ].addEventListener( 'mouseover', onMouseOver, false );
			scope.buttons[ 3 ].addEventListener( 'mouseout', onMouseOut, false );
			scope.buttons[ 5 ].removeEventListener( 'mouseover', onMouseOver, false );
			scope.buttons[ 5 ].removeEventListener( 'mouseout', onMouseOut, false );
			scope.buttons[ 7 ].removeEventListener( 'mouseover', onMouseOver, false );
			scope.buttons[ 7 ].removeEventListener( 'mouseout', onMouseOut, false );

			scope.buttons[ 4 ].removeChild( textures[ 15 ] );
			scope.buttons[ 4 ].appendChild( textures[ 4 ] );

		};

	};

	this.blockButtons = function( value )
	{
		if ( value ) {

			for ( var i = 0, il = scope.buttons.length; i < il; i++ ) {

				scope.buttons[ i ].removeEventListener( browser.endEvent, onButtonsDown, false );

			};

		} else {

			for ( var i = 0, il = scope.buttons.length; i < il; i++ ) {

				scope.buttons[ i ].addEventListener( browser.endEvent, onButtonsDown, false );

				if ( browser.mobile() ) {

					scope.buttons[ 3 ].removeEventListener( browser.endEvent, onButtonsDown, false );

				};

			};

		};

	};

	scope.toggleMenu = P360D.DOM.div( 'toggleMenu' );
	scope.toggleMenu.appendChild( scope.textures[ 9 ] );
	scope.domElement.appendChild( scope.toggleMenu );

	var _bottomOut = 0;
	var _bottomIn = -50;

	if ( browser.mobile() ) {

		_bottomOut = -2;
		_bottomIn = -52;
		scope.domElement.style.bottom = _bottomIn + 'px';

	};

	scope.toggleMenu.addEventListener( browser.endEvent, onToggleMenu, false );

	function onToggleMenu( event ) {

		event.preventDefault();

		if ( !isMenu ) {

			TweenLite.to( scope.domElement, 0.4, { 

				bottom: _bottomOut+'px', 
				ease: Expo.easeOut,

				onComplete: function() { 
					isMenu = true 
				}

			} );

		} else {

			TweenLite.to( scope.domElement, 0.4, { 

				bottom: _bottomIn+'px', 
				ease: Expo.easeOut,

				onComplete: function(){ 
					isMenu = false 
				} 
			} );

		};

		event.stopPropagation();

	};

};

P360D.EndAnimationScreen = function()
{
	var scope = this;

	scope.domElement = P360D.DOM.div( 'endScreen' );

	var title = P360D.DOM.div( 'titleEnd' );
	title.innerHTML = "ABOVE THE CLOUDS";
	scope.domElement.appendChild( title );

	var subtitle = P360D.DOM.div( 'subtitleEnd' );
	subtitle.innerHTML = "A mesmerizing journey around the Earth";
	scope.domElement.appendChild( subtitle );

	scope.replayButton = P360D.DOM.div( 'replayButton' );
	scope.replayButton.innerHTML = "REPLAY";
	scope.domElement.appendChild( scope.replayButton );

};

P360D.LoadingScreen = function( image, chromeExpImage, browser )
{
	var scope = this;

	scope.domElement = P360D.DOM.div( 'loadingScreen' );

	var imageContainer = P360D.DOM.div( 'imageContainer' );
	imageContainer.appendChild( image );
	scope.domElement.appendChild( imageContainer );

	var title = P360D.DOM.div( 'title' );
	title.innerHTML = "ABOVE THE CLOUDS";
	scope.domElement.appendChild( title );

	var subtitle = P360D.DOM.div( 'subtitle' );
	subtitle.innerHTML = "A mesmerizing journey around the Earth";
	scope.domElement.appendChild( subtitle );

	var creditsText = P360D.DOM.div( 'creditsText' );
	creditsText.innerHTML = "An interactive experience by <a href='http://www.plus360degrees.com/'>Plus 360 Degrees</a><br>Music by <a href='http://www.seanbeeson.com/'>Sean Beeson</a><br>Text by <a href='http://en.wikipedia.org/wiki/Carl_Sagan'>Carl Sagan</a> from <a href='http://en.wikipedia.org/wiki/Pale_Blue_Dot#Reflections_by_Sagan'>'Pale Blue Dot'</a><br>Beautiful capture of <a href='https://commons.wikimedia.org/wiki/File:Animation_of_Rotating_Earth_at_Night.webm'>Earth at night</a> by NASA";
	scope.domElement.appendChild( creditsText );

	var fakeLoading = P360D.DOM.div( 'fakeLoading' );
	scope.domElement.appendChild( fakeLoading );

	scope.beginButton = P360D.DOM.div( 'beginButton' );
	scope.domElement.appendChild( scope.beginButton );

	scope.loadingText = P360D.DOM.div( 'loadingText' );
	scope.loadingText.innerHTML = "LOADING";
	scope.domElement.appendChild( scope.loadingText );

	var instructions = P360D.DOM.div( 'instructions' );
	instructions.innerHTML = "Drag around and use the toolbar to explore";
	scope.domElement.appendChild( instructions );

	var chromeExp = P360D.DOM.div( 'chromeExp' );
	chromeExp.appendChild( chromeExpImage );
	chromeExp.addEventListener( browser.clickEvent, function( event ) {

		window.open('https://www.chromeexperiments.com/experiment/above-the-clouds');
		return false;

	}, false );
	scope.domElement.appendChild( chromeExp );

};



// @author ivanmoreno 

var SceneTypes = {

	ORBIT: 0,
	PAN_HORIZONTAL_LEFT: 1,
	PAN_HORIZONTAL_RIGHT: 2,
	TAKE_1: 3,
	TAKE_2: 4,
	TAKE_3: 5,
	TAKE_4: 6,
	TAKE_5: 7,
	TAKE_6: 8,
	TAKE_7: 9,
	TAKE_8: 10,
	TAKE_9: 11,
	TAKE_10: 12,
	TAKE_11: 13

};

P360D.Earth = function( diffuse, bumpMap, specularMap, cloudsMap, nightMap, moonMap, stormMap )
{
	THREE.Object3D.call( this );

	var scope = this;

	var radius = 250;
	var segments = 5;

	var earth = new THREE.Object3D();
	earth.rotation.z = THREE.Math.degToRad( 23 );
	scope.add( earth );

	// EARTH
	var earthMaterial = new P360D.EarthMaterial( diffuse, bumpMap, specularMap );
	var earthGeometry = new THREE.OctahedronGeometry( radius, segments );
	var earthMesh = new THREE.Mesh( earthGeometry, earthMaterial );
	earth.rotation.y = THREE.Math.degToRad( 180 );
	earth.add( earthMesh );

	// Clouds
	var cloudsMaterial = new P360D.CloudsMaterial( cloudsMap );
	var cloudsGeometry = new THREE.OctahedronGeometry( radius + 0.3, segments );
	var clouds = new THREE.Mesh( cloudsGeometry, cloudsMaterial );
	clouds.rotation.y = THREE.Math.degToRad( 180 );
	scope.add( clouds );

	// Storms
	var vector = new THREE.Vector3();

	var stormsTextures = [];
	var stormsMaterials = [];
	var stormsAnimations = [];
	var storms = [];

	for ( var i = 0; i < 20; i++ ) {

		var _st = stormMap.clone();
		_st.needsUpdate = true;
		stormsTextures.push( _st );

		var stormAnimator = new P360D.TextureAnimator( stormsTextures[ i ], 8, 8, 64, 30 );
		stormsAnimations.push( stormAnimator );

		var stormsMaterial = new P360D.StormsMaterial( stormsTextures[ i ] );
		stormsMaterials.push( stormsMaterial );

//		var stormGeometry = new THREE.PlaneGeometry( P360D.Utils.randomNumber( 10, 30 ), P360D.Utils.randomNumber( 10, 30 ) );
		var stormGeometry = new THREE.PlaneBufferGeometry( P360D.Utils.randomNumber( 10, 30 ), P360D.Utils.randomNumber( 10, 30 ) );
		var stormMesh = new THREE.Mesh( stormGeometry, stormsMaterial );
		stormGeometry.applyMatrix( new THREE.Matrix4().makeScale( -1, 1, 1 ) );
		clouds.add( stormMesh );
		storms.push( stormMesh );

		var positions = P360D.SceneUtils.geopositionToVector3( P360D.Utils.randomNumber( -90, 90 ), P360D.Utils.randomNumber( -180, 180 ), radius+1 );
		storms[ i ].position.set( positions.x, positions.y, positions.z );

		vector.copy( storms[ i ].position ).multiplyScalar( 2 );
		storms[ i ].lookAt( vector );

	};
	
	// Night lights
	var nightMaterial = new P360D.NightLightsMaterial( nightMap );

	var nightGeometry = new THREE.OctahedronGeometry( radius, segments );
	nightGeometry.applyMatrix( new THREE.Matrix4().makeScale( -1, 1, 1 ) );
	var night = new THREE.Mesh( nightGeometry, nightMaterial );
	night.rotation.y = THREE.Math.degToRad( 180 );
	earth.add( night );

	// Atmosphere
	var atmosphere = new P360D.Atmosphere( radius, segments );
	scope.add( atmosphere );

	// Moon
	var moonMaterial = new P360D.MoonMaterial( moonMap );

	var moonGeometry = new THREE.OctahedronGeometry( 45, 2 );
	var moon = new THREE.Mesh( moonGeometry, moonMaterial );
	moon.position.set( 1000, 500, -5000 );
	moon.rotation.y = THREE.Math.degToRad( 90 );
	scope.add( moon );

	// Exports
	scope.earth = earthMesh;
	scope.night = night;
	scope.clouds = clouds;
	scope.nightMaterial = nightMaterial;
	scope.stormsAnimations = stormsAnimations;
	scope.stormsMaterials = stormsMaterials;
	scope.storms = storms;
	scope.atmosphere = atmosphere;
	scope.clock = new THREE.Clock();
};

P360D.Earth.prototype = Object.create( THREE.Object3D.prototype );

P360D.Earth.prototype.toggleLights = function( isNight )
{
	var tween = new TimelineMax();
	tween.add( TweenLite.to( this.nightMaterial, 0.2, { opacity: 0.3 } ) );
	tween.add( TweenLite.to( this.nightMaterial, 0.1, { opacity: 0.7 } ) );
	tween.add( TweenLite.to( this.nightMaterial, 0.1, { opacity: 0.4 } ) );
	tween.add( TweenLite.to( this.nightMaterial, 0.2, { opacity: 0.6 } ) );
	tween.add( TweenLite.to( this.nightMaterial, 0.2, { opacity: 0 } ) );
	tween.pause();

	if ( !isNight ) {

		tween.resume();

	} else {

		tween.pause();
		TweenLite.to( this.nightMaterial, 0.5, { opacity: 0.8 } );

	};
};

P360D.Earth.prototype.update = function( speed, camera ) 
{
	// Earth rotations
	if ( speed === 0 ) {

		this.clouds.rotation.x += 0.00005;

	} else if ( speed > 0 ) {

		this.earth.rotation.y += speed;
		this.night.rotation.y += speed;
		this.clouds.rotation.y += speed + 0.00005;
	};

	// Storms animations
	var delta = this.clock.getDelta();
	var t = Math.floor( this.clock.getElapsedTime() );
	var positions;

	if ( t < Infinity ) {

		var vector = new THREE.Vector3();

		for ( var i = 0; i < this.storms.length; i++ ) {

			positions = P360D.SceneUtils.geopositionToVector3( P360D.Utils.randomNumber( -90, 90 ), P360D.Utils.randomNumber( -180, 180 ), 250+1 );

			if ( i % 2 ) {

				if ( t % 11 == 0 ) {

					this.storms[ i ].position.set( positions.x, positions.y, positions.z );

					this.stormsMaterials[ i ].opacity = 0;

				} else {

					this.stormsMaterials[ i ].opacity = 0.7;

				};

			} else {

				if ( t % 7 == 0 ) {

					this.storms[ i ].position.set( positions.x, positions.y, positions.z );

					this.stormsMaterials[ i ].opacity = 0;

				} else {

					this.stormsMaterials[ i ].opacity = 0.7;

				};

			};

			vector.copy( this.storms[ i ].position ).multiplyScalar( 2 );
			this.storms[ i ].lookAt( vector );

			switch ( i ) {

				case 0: case 10:

					this.stormsAnimations[ i ].update( 350 * delta ); 

					break;

				case 1: case 11:

					this.stormsAnimations[ i ].update( 120 * delta ); 

					break;

				case 2: case 12:

					this.stormsAnimations[ i ].update( 150 * delta ); 

					break;

				case 3: case 13:

					this.stormsAnimations[ i ].update( 180 * delta );

					break;

				case 4: case 14:

					this.stormsAnimations[ i ].update( 200 * delta );

					break;

				case 5: case 15:

					this.stormsAnimations[ i ].update( 230 * delta ); 

					break;

				case 6: case 16:

					this.stormsAnimations[ i ].update( 250 * delta );

					break;

				case 7: case 17:

					this.stormsAnimations[ i ].update( 270 * delta );

					break;

				case 8: case 18:

					this.stormsAnimations[ i ].update( 300 * delta );

					break;

				case 9: case 19:

					this.stormsAnimations[ i ].update( 320 * delta );

					break;

			};
		};
	};

	this.atmosphere.update( camera );
	
};

P360D.Gallaxy = function( textures ) 
{
	THREE.Object3D.call( this );

	this.textures = textures;

	var scope = this;

	var d = 40000;

	var materials = [];
	var images = [];

	for ( var i = 0, il = scope.textures.length; i < il; i++ ) {

		var material = new THREE.MeshBasicMaterial( {

			side: THREE.BackSide,
			map: scope.textures[ i ],
			opacity: 0.5,
			transparent:true

		} );

		materials.push( material );
	};

	var geometry = new THREE.BoxGeometry( d, d, d );

	var material = new THREE.MeshFaceMaterial( materials );

	var mesh = new THREE.Mesh( geometry, material );
	mesh.rotation.z = THREE.Math.degToRad( 50 );
	scope.add( mesh );

};

P360D.Gallaxy.prototype = Object.create( THREE.Object3D.prototype );

P360D.Atmosphere = function( radius, segments ) 
{	
	THREE.Object3D.call( this );

	var scope = this;

	var inGeometry = new THREE.OctahedronGeometry( radius + 0.6, segments );
	inGeometry.computeTangents();

	var outGeometry = new THREE.OctahedronGeometry( radius + 6.0, segments );
	outGeometry.computeTangents();

	var inMaterial = new P360D.InsideGlowMaterial();
	var outMaterial = new P360D.OutsideGlowMaterial( '#95D3F4', 0.71, 28.0, 1.0 );
	
	var inMesh = new THREE.Mesh( inGeometry, inMaterial );
	inMesh.flipSided = true;
	inMesh.matrixAutoUpdate = false;
	inMesh.updateMatrix();

	var outMesh = new THREE.Mesh( outGeometry, outMaterial );
	outMesh.position.set( 7, 0, 0 );
	
	scope.add( inMesh );
	scope.add( outMesh );

	scope.material = inMaterial;
};

P360D.Atmosphere.prototype = Object.create( THREE.Object3D.prototype );

P360D.Atmosphere.prototype.update = function( camera )
{
	this.material.uniforms.viewVector.value = camera.position;
};
	
P360D.TopCameraControls = function( camera, domElement ) 
{	
	this.object = camera;
	this.target = new THREE.Vector3();

	this.domElement = ( domElement === undefined ) ? document.body : domElement;

	this.speed = 0.01;//0.009;
	this.verticalAmplitude = 5.0;//90
	this.horizontalAmplitude = 5.0;//90
	this.deceleration = 0.97;//0.7
	this.acceleration = 0.09;//0.7

	this.startEvent = touchSupport ? TouchEvent.TOUCH_START : MouseEvent.MOUSE_DOWN;
	this.moveEvent = touchSupport ? TouchEvent.TOUCH_MOVE : MouseEvent.MOUSE_MOVE;
	this.endEvent = touchSupport ? TouchEvent.TOUCH_END : MouseEvent.MOUSE_UP;

	var mouseX = 0;
	var mouseY = 0;
	var lat = 0;
	var lon = 0;
	var phi = 0;
	var theta = 0;

	this.mouseDragOn = false;

	var viewHalfX = 0;
	var viewHalfY = 0;

	var scope = this;
	
	this.reset = function()
	{
		this.target.set( 0, 0, 0 );

		mouseX = 0;
		mouseY = 0;
		lat = 0;
		lon = 0;
		phi = 0;
		theta = 0;
	};

	function onMouseDown( event ) {

		event.preventDefault();

		if ( scope.domElement !== document ) {

			scope.domElement.focus();

		};

		scope.mouseDragOn = true;

		event.stopPropagation();

	};

	function onMouseMove( event ) {

		event.preventDefault();

		if ( scope.domElement === document ) {
	
			if ( !touchSupport ) {

				mouseX = event.pageX - viewHalfX;
				mouseY = event.pageY - viewHalfY;

			} else {

				mouseX = event.touches[ 0 ].pageX - viewHalfX;
				mouseY = event.touches[ 0 ].pageY - viewHalfY;

			};
	
		} else {

			if ( !touchSupport ) {

				mouseX = event.pageX - scope.domElement.offsetLeft - viewHalfX;
				mouseY = event.pageY - scope.domElement.offsetTop - viewHalfY;

			} else {

				mouseX = event.touches[ 0 ].pageX - scope.domElement.offsetLeft - viewHalfX;
				mouseY = event.touches[ 0 ].pageY - scope.domElement.offsetTop - viewHalfY;

			};

		};
		
		event.stopPropagation();

	};

	function onMouseUp( event ) {

		event.preventDefault();

		scope.mouseDragOn = false;

		event.stopPropagation();

	};

	this.resize = function()
	{
		if ( this.domElement === document ) {

			viewHalfX = window.innerWidth * 0.5;
			viewHalfY = window.innerHeight * 0.5;

		} else {

			viewHalfX = this.domElement.offsetWidth * 0.5;
			viewHalfY = this.domElement.offsetHeight * 0.5;

		};

	};

	this.update = function()
	{
		if ( scope.mouseDragOn ) {

			lon -= ( mouseX * scope.speed ) * scope.acceleration;												
			lat += ( mouseY * scope.speed ) * scope.acceleration;

		} else {

			lon *= scope.deceleration;
			lat *= scope.deceleration;

		};

		lon = Math.max( -scope.horizontalAmplitude, Math.min( scope.horizontalAmplitude, lon ) );
		theta = THREE.Math.degToRad( 90 - lon );

		lat = Math.max( -scope.verticalAmplitude, Math.min( scope.verticalAmplitude, lat ) );
		phi = THREE.Math.degToRad( -90 - lat );

		scope.target.x = scope.object.position.x + 200 * Math.sin( phi ) * Math.cos( theta );
		scope.target.y = scope.object.position.y + 200 * Math.cos( phi );
		scope.target.z = scope.object.position.z + 200 * Math.sin( phi ) * Math.sin( theta );

		scope.object.lookAt( scope.target );

	};

	this.enabledAll = function( value )
	{
		if ( value ) {

			this.domElement.addEventListener( this.startEvent, onMouseDown, false );
			this.domElement.addEventListener( this.moveEvent, onMouseMove, false );
			this.domElement.addEventListener( this.endEvent, onMouseUp, false );

		} else {

			this.domElement.removeEventListener( this.startEvent, onMouseDown, false );
			this.domElement.removeEventListener( this.moveEvent, onMouseMove, false );
			this.domElement.removeEventListener( this.endEvent, onMouseUp, false );

		};

	};

	this.domElement.addEventListener( 'contextmenu', function( event ) { event.preventDefault(); }, false );

	this.resize();
	this.enabledAll( true );
};

P360D.TopScene = function( diffuseMap, type )
{
	THREE.Object3D.call( this );

	var scope = this;

	var type = ( type === undefined ) ? SceneTypes.PAN_HORIZONTAL_LEFT : type;

	var geometry = new THREE.PlaneBufferGeometry( 3600, 1800 );
//	var geometry = new THREE.PlaneGeometry( 3600, 1800 );
	geometry.computeTangents();

	var earthMaterial = new P360D.TopEarthMaterial( diffuseMap );

	var earth = new THREE.Mesh( geometry, earthMaterial );

	switch ( type ) {

		case SceneTypes.PAN_HORIZONTAL_LEFT:

			earth.position.x = 240;

			break;

		case SceneTypes.PAN_HORIZONTAL_RIGHT:

			earth.position.x = -240;

			break;

	};

	scope.add( earth );

	scope.earth = earth;
	scope.visible = false;

};

P360D.TopScene.prototype = Object.create( THREE.Object3D.prototype );

P360D.OrbitScene = function( skyTextures, earthTextures )
{
	THREE.Object3D.call( this );

	this.skyTextures = skyTextures;
	this.earthTextures = earthTextures;

	var scope = this;

	scope.gallaxy = new P360D.Gallaxy( scope.skyTextures );
	scope.earth = new P360D.Earth( earthTextures[ 0 ], earthTextures[ 1 ], earthTextures[ 2 ], earthTextures[ 3 ], earthTextures[ 4 ], earthTextures[ 5 ], earthTextures[ 6 ] );
	
	scope.add( scope.gallaxy );
	scope.add( scope.earth );

};

P360D.OrbitScene.prototype = Object.create( THREE.Object3D.prototype );

P360D.OrbitScene.prototype.update = function( speed, camera )
{
	this.earth.update( speed, camera );
};
