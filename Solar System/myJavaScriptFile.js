// myJavaScriptFile.js
// Version: 3.0.
// Loading a 3D Model. Collada File Format and Play animation.

// Set the initialise function to be called when the page has loaded.
window.onload = init;

// set the size of our canvas / view onto the scene.
var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;

// set camera properties / attributes.
var VIEW_ANGLE = 45;
var ASPECT_RATIO = WIDTH / HEIGHT;
var NEAR_CLIPPING_PLANE = 0.1;
var FAR_CLIPPING_PLANE = 10000;

// Declare the variables we will need for three.js.
var renderer;
var scene;
var camera;

// Stats information for our scene.
var stats;

// Declare the variables for items in our scene.
var clock = new THREE.Clock();

// Handles the mouse events.
var mouseOverCanvas;
var mouseDown;

// Manages controls.
var controls;

// Stores graphical meshes.
var seaMesh;
var landMesh;

// Stores variables for Animation and 3D model.
// Stores the model loader.
var myColladaLoader;
// Store the model.
var myDaeFile;

// Stores the animations.
var myDaeAnimations;
// Stores the key frame animations.
var keyFrameAnimations = [];
// The length of the key frame animations array.
var keyFrameAnimationsLength = 0;
// Stores the time for the last frame. 
// Used to control animation looping.
var lastFrameCurrentTime = [];

// Initialise three.js.
function init() {
	// Renderer.
	// ---------

	// create a WebGL renderer.
	renderer = new THREE.WebGLRenderer();

	// Set the renderer size.
	renderer.setSize(WIDTH, HEIGHT);

	// Get element from the document (our div) 
	// and append the domElement (the canvas) to it.
	var docElement = document.getElementById('myDivContainer');
	docElement.appendChild(renderer.domElement);

	// Set the clear colour.
	renderer.setClearColor("rgb(0,0,0)");

	// Add an event to set if the mouse is over our canvas.
	renderer.domElement.onmouseover=function(e){ mouseOverCanvas = true; }
	renderer.domElement.onmousemove=function(e){ mouseovercanvas = true; }
	renderer.domElement.onmouseout=function(e){ mouseOverCanvas = false; }

	renderer.domElement.onmousedown=function(e){ mouseDown = true; }
	renderer.domElement.onmouseup=function(e){ mouseDown = false; }

	// Stats.
	// ------
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	stats.domElement.style.zIndex = 100;
	docElement.appendChild( stats.domElement );

	// Scene.
	// ------

	// Create a WebGl scene.
	scene = new THREE.Scene();

	// Camera.
	// -------

	// Create a WebGl camera.
	camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT_RATIO, 
								NEAR_CLIPPING_PLANE, FAR_CLIPPING_PLANE);

	// Set the position of the camera.
	// The camera starts at 0,0,0 ...so pull it back.
	camera.position.set(0, 3, 30);

	// Set up the camera controls.
	controls = new THREE.FirstPersonControls( camera, 
									document.getElementById('myDivContainer') );
	controls.movementSpeed = 200;
	controls.lookSpeed = 0.06;
	controls.activeLook = false;

	// Start the scene.
	// ----------------

	// Now lets initialise the scene. Put things in it, such as meshes and lights.
	initScene();

}

// Initialise the scene.
function initScene() {

	// Basic lights.
	// --------------

	var light = new THREE.DirectionalLight( 0xffffff, 1.5 );
	light.position.set( 1, 1, 1 );
	scene.add( light );

	var light = new THREE.DirectionalLight( 0xffffff, 0.75 );
	light.position.set( -1, - 0.5, -1 );
	scene.add( light );

	// Add a model to the scene.
	// -------------------------
	myColladaLoader = new THREE.ColladaLoader();
	myColladaLoader.options.convertUpAxis = true;

	myColladaLoader.load( 'test.dae', function ( collada ) {
			// Here we store the dae in a global variable.
			myDaeFile = collada.scene;
			
			// Store the animations.
			myDaeAnimations = collada.animations;
			// Store the number of animations.
			keyFrameAnimationsLength = myDaeAnimations.length;

		    // Initialise last frame current time.
		    for ( var i = 0; i < keyFrameAnimationsLength; i++ ) {
		    	lastFrameCurrentTime[i] = 0;
		    }

			// Get all the key frame animations.
			for ( var i = 0; i < keyFrameAnimationsLength; i++ ) {
				var animation = myDaeAnimations[ i ];

				var keyFrameAnimation = new THREE.KeyFrameAnimation( animation );
				keyFrameAnimation.timeScale = 1;
				keyFrameAnimation.loop = false;
				// Add the key frame animation to the keyFrameAnimations array.
				keyFrameAnimations.push( keyFrameAnimation );
			}

			// Scale your model to the correct size.
			myDaeFile.position.x = 100;
			myDaeFile.position.y = 3;
			myDaeFile.position.z = 30;

			myDaeFile.scale.x = myDaeFile.scale.y = myDaeFile.scale.z = 0.1;
			myDaeFile.updateMatrix();

			// Add the model to the scene.
			scene.add( myDaeFile );

			// Start the animations.
			startAnimations();

			// Start rendering the scene.
			render();
		} );
}

// Start the animations.
function startAnimations(){
	// Loop through all the animations.
	for ( var i = 0; i < keyFrameAnimationsLength; i++ ) {
		// Get a key frame animation.
		var animation = keyFrameAnimations[i];
		animation.play();
	}
}

// Manually loop the animations.
function loopAnimations(){
	// Loop through all the animations.
	for ( var i = 0; i < keyFrameAnimationsLength; i++ ) {
		// Check if the animation is player and not paused.
		if(keyFrameAnimations[i].isPlaying && !keyFrameAnimations[i].isPaused){
			if(keyFrameAnimations[i].currentTime == lastFrameCurrentTime[i]) {
				keyFrameAnimations[i].stop();
				keyFrameAnimations[i].play();
				lastFrameCurrentTime[i] = 0;
			}
		}

	}
}
 
// The game timer (aka game loop). Called x times per second.
function render(){
	// Here we control how the camera looks around the scene.
	controls.activeLook = false;
	if(mouseOverCanvas){
		if(mouseDown){
			controls.activeLook = true;
		}
	}

	// Get the time since this method was called.
	var deltaTime = clock.getDelta();

	// Update the controls.
	controls.update( deltaTime );

	//Debug information. This requires a div in your HTML. E.g. where id=debugInfo.
	document.getElementById("debugInfo").innerHTML = "Debug info: <br>" + 
		"<br>keyFrameAnimationsLength = " + keyFrameAnimationsLength + ".<br>" +
		"<br>keyFrameAnimations[0] = " + keyFrameAnimations[0].currentTime + ".<br>" +
		"<br>lastCurrentTime[0] = " + lastFrameCurrentTime[0] + ".<br>";
	//Debug information. END.

	// Update the model animations.
	for ( var i = 0; i < keyFrameAnimationsLength; i++ ) {
		// Get a key frame animation.
		var animation = keyFrameAnimations[i];
		animation.update( deltaTime );
	}

	// Check if need to loop animations. Call loopAnimations() after the
	// animation handler update.
	loopAnimations();
	
	// Render the scene.
	renderer.render(scene, camera);

	// Update the stats.s
	stats.update();

	// Request the next frame.
	/* The "requestAnimationFrame()" method tells the browser that you 
	   wish to perform an animation and requests that the browser call a specified 
	   function to update an animation before the next repaint. The method takes 
	   as an argument a callback to be invoked before the repaint. */
    requestAnimationFrame(render);

    // Update last frame current time.
    for ( var i = 0; i < keyFrameAnimationsLength; i++ ) {
    	lastFrameCurrentTime[i] = keyFrameAnimations[i].currentTime;
    }
}
