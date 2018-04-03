/*jslint browser */
/*global THREE*/

// Set the initialise function to be called when the page has loaded.
window.onload = window.init;

// set the size of our canvas / view onto the scene.
var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;

// set camera properties / attributes.
var VIEW_ANGLE = 45;
var ASPECT_RATIO = WIDTH / HEIGHT;
var NEAR_CLIPPING_PLANE = 0.1;
var FAR_CLIPPING_PLANE = 50000;

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

var planet;

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
var descriptionText;

var i;

// Update descriptions of solar objects
function updateDescription(id, diameter, mass, moons, orbitDistance, orbitPeriod, temperature, type = "planet") {

    if (type === "planet") {
        document.getElementById(id).innerHTML =
                "Diameter: " + diameter
                + "<br> Mass: " + mass
                + "<br> Moons: " + moons
                + "<br> Orbit Distance: " + orbitDistance
                + "<br> Orbit Period: " + orbitPeriod
                + "<br> Temperature: " + temperature;
    } else if (type === "sun") {
        document.getElementById(id).innerHTML =
                "Age: 4.6 Billion Years"
                + "<br> Diameter: " + diameter
                + "<br> Mass: " + mass
                + "<br> Temperature: " + temperature;
    } else if (type === "moon") {
        document.getElementById(id).innerHTML =
                "Diameter: " + diameter
                + "<br> Mass: " + mass
                + "<br> Orbits: The Earth"
                + "<br> Orbit Distance: " + orbitDistance
                + "<br> Orbit Period: " + orbitPeriod
                + "<br> Temperature: " + temperature;
    }

}

// Define behaviour for focusing on solar object

function sunFocus() {
    "use strict";

    planet = scene.getObjectByName("Sun");

    planet.add(camera);
    camera.lookAt(planet);
    controls.autoRotate = false;
    camera.position.x = 5000;
    controls.update();

    updateDescription("sunText", "1,392,684 km", "1.99 × 10^30 kg", null, null, null, "5,500°C", "sun");

}

function mercuryFocus() {
    "use strict";

    planet = scene.getObjectByName("Mercury");

    planet.add(camera);
    camera.lookAt(planet);
    controls.autoRotate = true;
    camera.position.set(0, 0, 30);
    controls.update();

    updateDescription("mercuryText", "4,879 km", "3.30 x 10^23 kg", "0", "57,909,227 km (0.39 AU)", "88 days (0.24 years)", "-173 to 427°C");

}

function venusFocus() {
    "use strict";

    planet = scene.getObjectByName("Venus");

    planet.add(camera);
    camera.lookAt(planet);
    controls.autoRotate = true;
    camera.position.set(0, 0, 70);
    controls.update();

    updateDescription("venusText", "12,104 km", "4.87 x 10^24 kg", "0", "108,209,475 km (0.73 AU)", "225 days (0.62 years)", "462°C");

}

function earthFocus() {
    "use strict";

    planet = scene.getObjectByName("Earth");

    planet.add(camera);
    camera.lookAt(planet);
    controls.autoRotate = true;
    camera.position.set(60, 10, 60);
    controls.update();
    updateDescription("earthText", "12,756 km", "5.97 x 10^24 kg", "1", "149,598,262 km (1 AU)", "365.24 Days (1 year)", "-88 to 58°C");

}

function moonFocus() {
    "use strict";

    planet = scene.getObjectByName("Moon");

    planet.add(camera);
    camera.lookAt(planet);
    camera.position.set(0, 0, 20);
    controls.autoRotate = true;
    controls.update();

    updateDescription("moonText", "3,475 km", "7.35 × 10^22 kg", null, "384,400 km", "27.3 days", "-233 to 123°C", "moon");

}

function marsFocus() {
    "use strict";

    planet = scene.getObjectByName("Mars");

    planet.add(camera);
    camera.lookAt(planet);
    controls.autoRotate = true;
    camera.position.set(0, 0, 40);
    controls.update();
    updateDescription("marsText", "6792 km", "6.42 x 10^23 kg", "2", "227,943,824 km (1.52 AU)", "687 days (1.9 years)", "-153 to 20°C");

}

function jupiterFocus() {
    "use strict";

    planet = scene.getObjectByName("Jupiter");

    planet.add(camera);
    camera.lookAt(planet);
    controls.autoRotate = true;
    camera.position.set(0, 0, 700);
    controls.update();

    updateDescription("jupiterText", "142,984 km", "1.90 × 10^27 kg", "67", "778,340,821 km (5.20 AU)", "4,333 days (11.9 years)", "-148°C");

}

function saturnFocus() {
    "use strict";

    planet = scene.getObjectByName("Saturn");

    planet.add(camera);
    camera.lookAt(planet);
    controls.autoRotate = true;
    camera.position.set(0, 100, 600);
    controls.update();

    updateDescription("saturnText", "120,536 km", "5.68 × 10^26 kg", "62", "1,426,666,422 km (9.54 AU)", "10,756 days (29.5 years)", "-178°C");

}

function uranusFocus() {
    "use strict";

    planet = scene.getObjectByName("Uranus");

    planet.add(camera);
    camera.lookAt(planet);
    controls.autoRotate = true;
    camera.position.set(0, 0, 300);
    controls.update();

    updateDescription("uranusText", "51,118 km", "8.68 × 10^25 kg", "27", "2,870,658,186 km (19.19 AU)", "30,687 days (84.0 years)", "-216°C");

}

function neptuneFocus() {
    "use strict";

    planet = scene.getObjectByName("Neptune");

    planet.add(camera);
    camera.lookAt(planet);
    controls.autoRotate = true;
    camera.position.set(0, 0, 300);
    controls.update();

    updateDescription("neptuneText", "49,528 km", "1.02 × 10^26 kg", "14", "4,498,396,441 km (30.10 AU)", "60,190 days (164.8 years)", "-214°C");

}

// Allow window resizing
function onWindowResize() {
    "use strict";

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

}

// Manually loop the animations.
function loopAnimations() {
    "use strict";

    function output(item, index, array) {
        item = item;
        array = array;
        if (keyFrameAnimations[index].isPlaying && !keyFrameAnimations[index].isPaused) {
            if (keyFrameAnimations[index].currentTime === lastFrameCurrentTime[index]) {
                keyFrameAnimations[index].stop();
                keyFrameAnimations[index].play();
                lastFrameCurrentTime[index] = 0;
                //window.alert("LOOP");
            }
        }
    }

    myDaeAnimations.forEach(output);

}

// The game timer (aka game loop). Called x times per second.
function render() {
    "use strict";

    var animation;

    controls.update();

    // Get the time since this method was called.
    var deltaTime = clock.getDelta();

    //Debug information. This requires a div in your HTML. E.g. where id=debugInfo.
    /*document.getElementById("debugInfo").innerHTML = "Debug info: <br>" +
        "<br>keyFrameAnimationsLength = " + keyFrameAnimationsLength + ".<br>" +
        "<br>keyFrameAnimations[0] = " + keyFrameAnimations[0].currentTime + ".<br>" +
        "<br>lastCurrentTime[0] = " + lastFrameCurrentTime[0] + ".<br>";*/
    //Debug information. END.

    function updateAnimation(item, index, array) {
        item = item;
        array = array;
        animation = keyFrameAnimations[index];
        animation.update(deltaTime);
    }

    myDaeAnimations.forEach(updateAnimation);

    // Check if need to loop animations. Call loopAnimations() after the
    // animation handler update.
    loopAnimations();

    // Render the scene.
    renderer.render(scene, camera);

    window.addEventListener("resize", onWindowResize, false);

    // Request the next frame.
    /* The "requestAnimationFrame()" method tells the browser that you
     wish to perform an animation and requests that the browser call a specified
     function to update an animation before the next repaint. The method takes
     as an argument a callback to be invoked before the repaint. */
    window.requestAnimationFrame(render);

    function output(item, index, array) {
        item = item;
        array = array;
        lastFrameCurrentTime[index] = keyFrameAnimations[index].currentTime;
    }

    myDaeAnimations.forEach(output);
}

// Start the animations.
function startAnimations() {
    "use strict";

    var animation;

    // Loop through the animations
    function output(item, index, array) {
        item = item;
        array = array;
        animation = keyFrameAnimations[index];
        animation.timeScale = 0.25;
        animation.play();
    }

    myDaeAnimations.forEach(output);
}

// Initialise the scene.
function initScene() {
    "use strict";

    var animation;
    var keyFrameAnimation;

    // Basic lights.
    // --------------

    var light = new THREE.AmbientLight(0x404040, 3.25); // soft white light
    scene.add(light);

    // Add a model to the scene.
    // -------------------------
    myColladaLoader = new THREE.ColladaLoader();
    myColladaLoader.options.convertUpAxis = true;

    myColladaLoader.load("scene.dae", function (collada) {
        // Here we store the dae in a global variable.
        myDaeFile = collada.scene;

        // Store the animations.
        myDaeAnimations = collada.animations;
        // Store the number of animations.
        keyFrameAnimationsLength = myDaeAnimations.length;

        function resetCurrentTime(item, index, array) {
            item = item;
            array = array;
            lastFrameCurrentTime[index] = 0;
        }

        myDaeAnimations.forEach(resetCurrentTime);

            // Initialise last frame current time.
         /* for ( i = 0; i < keyFrameAnimationsLength; i+=1 ) {
                lastFrameCurrentTime[i] = 0;
            }*/

        // Get all the keyframe animations
        function getAnimations(item, index, array) {
            item = item;
            array = array;
            animation = myDaeAnimations[index];

            keyFrameAnimation = new THREE.KeyFrameAnimation(animation);
            keyFrameAnimation.timeScale = 10;
            keyFrameAnimation.loop = false;
            // Add the key frame animation to the keyFrameAnimations array.
            keyFrameAnimations.push(keyFrameAnimation);
        }

        myDaeAnimations.forEach(getAnimations);

        // Scale your model to the correct size.
        myDaeFile.position.x = 100;
        myDaeFile.position.y = 3;
        myDaeFile.position.z = 30;

        myDaeFile.scale.x = 0.1;
        myDaeFile.scale.y = 0.1;
        myDaeFile.scale.z = 0.1;
        myDaeFile.updateMatrix();

        // Add the model to the scene.
        scene.add(myDaeFile);

        // Add a starfield to the background of a scene
        var starsGeometry = new THREE.Geometry();
        var star;
        var starCount = 50000;

        while (starCount > 0) {
            star = new THREE.Vector3();
            star.x = THREE.Math.randFloatSpread(10000);
            star.y = THREE.Math.randFloatSpread(10000);
            star.z = THREE.Math.randFloatSpread(10000);

            starsGeometry.vertices.push(star);

            starCount -= 1;
        }

        var starsMaterial = new THREE.PointsMaterial({color: 0x888888});

        var starField = new THREE.Points(starsGeometry, starsMaterial);

        scene.add(starField);

        // Start the animations.
        startAnimations();

        // Start rendering the scene.
        render();

        sunFocus();
    });
}

// Initialise three.js.
function init() {
    "use strict";

    // Renderer.
    // ---------

    // create a WebGL renderer.
    renderer = new THREE.WebGLRenderer();

    // Set the renderer size.
    renderer.setSize(WIDTH, HEIGHT);

    // Get element from the document (our div)
    // and append the domElement (the canvas) to it.
    var docElement = document.getElementById("myDivContainer");
    docElement.appendChild(renderer.domElement);

    // Set the clear colour.
    renderer.setClearColor("rgb(0,0,0)");

    // Add an event to set if the mouse is over our canvas.
    /*renderer.domElement.onmouseover=function(e){ mouseOverCanvas = true; }
    renderer.domElement.onmousemove=function(e){ mouseovercanvas = true; }
    renderer.domElement.onmouseout=function(e){ mouseOverCanvas = false; }

    renderer.domElement.onmousedown=function(e){ mouseDown = true; }
    renderer.domElement.onmouseup=function(e){ mouseDown = false; }*/

    // Scene.
    // ------

    // Create a WebGl scene.
    scene = new THREE.Scene();

    // Camera.
    // -------

    // Create a WebGl camera.
    camera = new THREE.PerspectiveCamera(
        VIEW_ANGLE,
        ASPECT_RATIO,
        NEAR_CLIPPING_PLANE,
        FAR_CLIPPING_PLANE
    );

    controls = new THREE.OrbitControls(
        camera,
        document.getElementById("myDivContainer")
    );

    controls.enableZoom = true;
    controls.zoomSpeed = 3;
    controls.autoRotate = true;
    controls.maxDistance = 15000;

    controls.update();

    // Start the scene.
    // ----------------

    // Now lets initialise the scene. Put things in it, such as meshes and lights.
    initScene();

}
