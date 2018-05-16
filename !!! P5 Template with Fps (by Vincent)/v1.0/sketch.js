// P5 Template with fps Display

// Variables used for fps
let frameTime = 0 // Time at which the current frame is updated
let oldTime = 0 // Time at which the previous frame is updated
let fpsCooldown = 0 // When fpsCooldown <= 0, set displayFPS = fps
let fps = 0 // Ratio of (1000ms) to (difference between frameTime and oldTime)
let displayFPS = 0 // fps displayed on screen, updated every second

function setup() {
    // setup() runs once. Put your setup code here.

    createCanvas(windowWidth, windowHeight)
}

function draw() {
    // draw() runs every time before a new frame is rendered. 

    // Time updates

    frameTime = millis()
    const timeDiff = frameTime - oldTime
    fps = 1000 / (timeDiff)
    textSize(32)
    fpsCooldown -= timeDiff

    // Update

    background(200)

    /* 
    * PUT YOUR DRAWING CODE HERE
    * PUT YOUR DRAWING CODE HERE
    * PUT YOUR DRAWING CODE HERE
    */

    // Display FPS

    if (fpsCooldown <= 0) {
        displayFPS = fps
        fpsCooldown = 1000
    }

    fill(0, 0, 0)
    textAlign(RIGHT, TOP) // Text alignment of the fps label
    textSize(24)
    text(`${Math.floor(displayFPS)} fps`, width - 16, 16) // Position of the fps label

    // Finalizing frame

    oldTime = millis()
}