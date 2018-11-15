// p5.js Template with FPS Display

function setup() {
    // setup() runs once. Put your setup code here.

    createCanvas(windowWidth, windowHeight)
}

function draw() {
    // draw() runs every time before a new frame is rendered. 

    background(200)

    /* 
    * PUT YOUR DRAWING CODE HERE
    * PUT YOUR DRAWING CODE HERE
    * PUT YOUR DRAWING CODE HERE
    */

    // Update and show FPS
    fpsEngine.updateFPS()
    fpsEngine.showFPS(0, 0, 0)
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight)
}