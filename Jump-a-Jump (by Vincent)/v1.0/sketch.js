// Variables used for fps
var frameTimes = [] // Time recordings corresponding to each frame
let oldTime = 0 // Time at which the previous frame is updated
let fpsCooldown = 0 // When fpsCooldown <= 0, set displayFPS = fps
let displayFPS = 0 // fps displayed on screen, updated every second

// Other variables
var positionX = 0
var positionY = 0
var velocityX = 0
var velocityY = 0

var sideLength = 50

var previousBlockX = -400
var previousBlockWidth = 175

var currentBlockX = -200
var currentBlockWidth = 175

var nextBlockX = 100
var nextBlockWidth = 175

var score = 0

var isJumping = false
var isRewinding = false

var springDisplacement = 0

var gameHasEnded = false

function startNewCycle() {
    isJumping = false
    isRewinding = true
    previousBlockX = currentBlockX
    previousBlockWidth = currentBlockWidth
    currentBlockX = nextBlockX
    currentBlockWidth = nextBlockWidth
    nextBlockX = currentBlockX + currentBlockWidth + Math.random() * 400
    nextBlockWidth = 150 + Math.random() * 150

    positionY = windowHeight / 2
    velocityX = 0
    velocityY = 0
}

function jump() {
    isJumping = true
    velocityX = springDisplacement
    velocityY = -50
    springDisplacement = 0
}

function endGame() {
    gameHasEnded = true
}

function mouseReleased() {
    if (!isJumping && !isRewinding) {
        jump()
    }
}

function setup() {
    // setup() runs once. Put your setup code here.

    createCanvas(windowWidth, windowHeight)
    startNewCycle()
}

function draw() {
    // draw() runs every time before a new frame is rendered. 

    if (gameHasEnded) {
        fill(200, 0, 0)
        textAlign(LEFT, TOP)
        text("GAME OVER", 20, 20)
        return
    }

    background(200)

    if (isRewinding) {
        if (positionX <= 200) {
            positionX = 200
            isRewinding = false
        } else {
            var rewindFactor = (positionX - 175) / 20
            previousBlockX -= (previousBlockX + 400) / 20
            positionX -= rewindFactor
            currentBlockX -= rewindFactor
            nextBlockX -= rewindFactor
            positionY = windowHeight / 2
        }
    } else if (isJumping) {
        velocityY += 4
        positionX += velocityX
        positionY += velocityY

        if (positionY >= windowHeight / 2 && positionY < windowHeight / 2 + sideLength) {
            if (positionX >= nextBlockX && positionX <= nextBlockX + nextBlockWidth) {
                score += 1
                startNewCycle()
            } else if (positionX >= currentBlockX && positionX <= currentBlockX + currentBlockWidth) {
                isJumping = false
            }
        }
        if (positionY >= windowHeight) {
            endGame()
        }
    } else {
        positionY = windowHeight / 2
        if (mouseIsPressed) {
            springDisplacement += 32 / frameTimes.length
        }
    }

    fill(0)
    rect(previousBlockX, windowHeight / 2 + sideLength / 2, previousBlockWidth, windowHeight / 2)
    rect(currentBlockX, windowHeight / 2 + sideLength / 2 + springDisplacement, currentBlockWidth, windowHeight / 2)
    rect(nextBlockX, windowHeight / 2 + sideLength / 2, nextBlockWidth, windowHeight / 2)

    fill(0, 200, 200)
    ellipse(positionX, positionY + springDisplacement, sideLength, sideLength)

    fill(0)
    textSize(48)
    textAlign(CENTER, TOP)
    text(`${score}`, windowWidth / 2, 20)

    // Display FPS

    var currentTime = millis()
    frameTimes.push(currentTime)
    while (frameTimes.length > 0 && frameTimes[0] < currentTime - 1000) {
        frameTimes.splice(0, 1)
    }
    
    fpsCooldown -= currentTime - oldTime
    if (fpsCooldown <= 0) {
        displayFPS = frameTimes.length
        fpsCooldown = 1000
    }

    fill(0, 0, 0)
    textAlign(RIGHT, TOP) // Text alignment of the fps label
    textSize(24)
    text(`${Math.floor(displayFPS)} fps`, width - 16, 16) // Position of the fps label

    oldTime = currentTime
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight)
}