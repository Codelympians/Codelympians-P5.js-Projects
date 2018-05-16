// Constants

var canvasHeight = 600
var canvasRatio = 3 / 4
var canvasWidth = canvasHeight * canvasRatio

var gravity = -0.98 * 2
var frameTime = 0
var oldTime = 0
var spawnInterval = 2000
var flapInterval = 250

var survivalWindowSize = 0.33
var pillarWidth = 0.18
var heroX = 0.25
var heroSideLength = 0.1
var heroRadius = heroSideLength / 2

// Variables

var yPosition = 0.5
var yVelocity = 0
var zRotation = 0

var flapCooldown = flapInterval
var spawnCooldown = spawnInterval * 2.5
var fpsCooldown = 0
var scoreCooldown = spawnCooldown - spawnInterval * heroX

var fps = 0
var displayFPS = 0
var currentSurvivalWindowLocation = (0.5 - survivalWindowSize / 2)

var score = 0
var gameOver = false

// Start main game logic

function pillarRefresh() {

    if(spawnCooldown <= 0) {       

        spawnCooldown = spawnInterval
        currentSurvivalWindowLocation = Math.random() * (0.8 - survivalWindowSize)

    }

    noStroke()
    fill(255, 255, 255)
    rect(canvasWidth * (1 + pillarWidth) * spawnCooldown / spawnInterval - canvasWidth * pillarWidth, 
            currentSurvivalWindowLocation * canvasHeight - canvasHeight, 
            canvasWidth * pillarWidth, 
            canvasHeight)
    rect(canvasWidth * (1 + pillarWidth) * spawnCooldown / spawnInterval - canvasWidth * pillarWidth, 
            currentSurvivalWindowLocation * canvasHeight + canvasHeight * survivalWindowSize, 
            canvasWidth * pillarWidth, 
            canvasHeight)

}

function heroRefresh() {

    yVelocity += gravity / fps

    yPosition -= yVelocity / fps

    fill(0, 0, 0)
    rect(canvasWidth * (heroX - heroRadius), 
            canvasHeight * yPosition - canvasWidth * heroRadius, 
            heroSideLength * canvasWidth, 
            heroSideLength * canvasWidth)
    //console.log(`x: ${canvasWidth * (heroX - heroRadius)}, y: ${canvasHeight * yPosition - canvasWidth * heroRadius}, width: ${heroSideLength * canvasWidth}, height: ${heroSideLength * canvasWidth}`)

}

function testForCollision() {

    if (yPosition - heroRadius * canvasRatio <= 0 || yPosition + heroRadius * canvasRatio >= 1) {

        gameOver = true
        return

    }

    var pillarXVisual = canvasWidth * (1 + pillarWidth) * spawnCooldown / spawnInterval - canvasWidth * pillarWidth
    var heroXVisual = canvasWidth * (heroX - heroRadius)
    var heroWidthVisual = heroSideLength * canvasWidth

    if (pillarXVisual <= heroXVisual + heroWidthVisual && pillarXVisual >= heroXVisual - heroWidthVisual) {
        if (yPosition - heroRadius * canvasRatio <= currentSurvivalWindowLocation|| yPosition + heroRadius * canvasRatio >= currentSurvivalWindowLocation + survivalWindowSize) {
            
            console.log(`yPosition: ${yPosition}, cSWL: ${currentSurvivalWindowLocation}`)
            gameOver = true
            return
    
        }
    }
    
}

/*
function restartGame() {

    yPosition = canvasHeight * 0.5 - canvasWidth * heroRadius
    yVelocity = 0
    zRotation = 0
    
    flapCooldown = flapInterval
    spawnCooldown = spawnInterval * 2
    fpsCooldown = 0

    displayFPS = 0
    currentSurvivalWindowLocations = -100

    score = 0

    gameOver = false

}
*/

function keyPressed() {
    if (gameOver) {

    } else {

        if(keyCode == 32 && flapCooldown <= 0) {

            yVelocity = -0.5 * gravity
            flapCooldown = flapInterval

        } 

    }
}

function setup() {
    createCanvas(canvasWidth, canvasHeight)
}

function draw() {

    if (gameOver) {

        var deathPositionY = 

        fill(200, 0, 0)
        rect(canvasWidth * (heroX - heroRadius), 
                canvasHeight * yPosition - canvasWidth * heroRadius, 
                heroSideLength * canvasWidth, 
                heroSideLength * canvasWidth)

        
        fill(100, 0, 0)
        textAlign(CENTER, TOP)
        textSize(64)
        text("Game Over", canvasWidth / 2, canvasHeight * 0.25)

        fill(0, 0, 0)
        textAlign(CENTER, TOP)
        textSize(24)
        text("Refresh to restart.", canvasWidth / 2, canvasHeight * 0.75)

    } else {

        // Update

        background(200)
        frameTime = millis()
        var timeDiff = frameTime - oldTime
        fps = 1000 / (timeDiff)
        textSize(32)
    
        flapCooldown -= timeDiff
        spawnCooldown -= timeDiff
        fpsCooldown -= timeDiff
        scoreCooldown -= timeDiff
    
        pillarRefresh()
        heroRefresh()
        testForCollision()

        // UI Elements 

        if(fpsCooldown <= 0) {

            displayFPS = fps
            fpsCooldown = 1000

        }

        if(scoreCooldown <= 0) {
            scoreCooldown = spawnInterval
            score += 1
        }

        fill(0, 0, 0)
        textAlign(LEFT, TOP)
        textSize(24)
        text(`${Math.floor(displayFPS)} fps`, 10, 10)
        fill(100, 0, 0)
        textAlign(CENTER, TOP)
        textSize(32)
        text(`${score}`, canvasWidth / 2, 10)

        // Finalizing Frame
    
        oldTime = millis()

    }

}