// Variables used for fps
var frameTimes = [] // Time recordings corresponding to each frame
let oldTime = 0 // Time at which the previous frame is updated
let fpsCooldown = 0 // When fpsCooldown <= 0, set displayFPS = fps
let displayFPS = 0 // fps displayed on screen, updated every second

// Other variables
var tileSets = []
var gamePlaying = false
var startTime = 0
var effectiveTime = 0

var tileSetCount = 20
var currentTileSet = 0

class TileSet {
    constructor(y) {
        this.y = y
        this.blackTile = Math.floor(Math.random() * 4)
        this.didPress = false
        this.redTile = null
    }
}

function mousePressed() {
    if (gamePlaying) {
        return
    }
    currentTileSet = 0
    startTime = millis()
    tileSets = []
    for (var i = 0; i < tileSetCount; i++) {
        tileSets.push(new TileSet(i))
    }
    gamePlaying = true
}

function keyPressed() {
    if (gamePlaying) {
        switch (key) {
            case ("D"):
                if (tileSets[currentTileSet].blackTile === 0) {
                    currentTileSet += 1
                } else {
                    tileSets[currentTileSet].redTile = 0
                    endGame()
                }
                break
            case ("F"):
                if (tileSets[currentTileSet].blackTile === 1) {
                    currentTileSet += 1
                } else {
                    tileSets[currentTileSet].redTile = 1
                    endGame()
                }
                break
            case ("J"):
                if (tileSets[currentTileSet].blackTile === 2) {
                    currentTileSet += 1
                } else {
                    tileSets[currentTileSet].redTile = 2
                    endGame()
                }
                break
            case ("K"):
                if (tileSets[currentTileSet].blackTile === 3) {
                    currentTileSet += 1
                } else {
                    tileSets[currentTileSet].redTile = 3
                    endGame()
                }
                break
        }
    }
}

function endGame() {
    gamePlaying = false
}

function setup() {
    createCanvas(windowWidth, windowHeight)
}

function draw() {
    // draw() runs every time before a new frame is rendered. 

    background(200)

    var displacement = 0

    if (gamePlaying) {
        if (currentTileSet === 0) {
            startTime = millis()
        }
        effectiveTime = millis()

        if (currentTileSet >= tileSetCount) {
            endGame()
        } else {
            // set displacement for tileSets
            if (tileSets[currentTileSet].y >= 0) {
                displacement = tileSets[currentTileSet].y / 5
                if (tileSets[currentTileSet].y <= 0.05) {
                    displacement = tileSets[currentTileSet].y
                }
            }
        }
    }

    // displace and draw tileSets
    for (var tileIndex in tileSets) {
        var tileSet = tileSets[tileIndex]
        tileSet.y -= displacement
        if (tileSet.y >= -1 && tileSet.y <= 4) {
            stroke(0)
            strokeWeight(1)
            fill(255)
            rect(0, windowHeight - (windowHeight / 3) * (tileSet.y + 1), windowWidth / 4, windowHeight / 3)
            rect(windowWidth / 4, windowHeight - (windowHeight / 3) * (tileSet.y + 1), windowWidth / 4, windowHeight / 3)
            rect(2 * windowWidth / 4, windowHeight - (windowHeight / 3) * (tileSet.y + 1), windowWidth / 4, windowHeight / 3)
            rect(3 * windowWidth / 4, windowHeight - (windowHeight / 3) * (tileSet.y + 1), windowWidth / 4, windowHeight / 3)

            fill(0)
            if (tileIndex < currentTileSet) {
                fill(0, 255, 0)
            }
            rect(tileSet.blackTile * windowWidth / 4, windowHeight - (windowHeight / 3) * (tileSet.y + 1), windowWidth / 4, windowHeight / 3)

            if (tileSet.redTile !== null) {
                fill(255, 0, 0)
                rect(tileSet.redTile * windowWidth / 4, windowHeight - (windowHeight / 3) * (tileSet.y + 1), windowWidth / 4, windowHeight / 3)
            }
        }
    }

    stroke(0)
    strokeWeight(10)
    fill(255)
    textAlign(CENTER, TOP)
    textSize(48)
    var decimal = Math.floor((effectiveTime - startTime) / 10) % 100
    var decimalString = (decimal >= 10) ? `${decimal}` : `0${decimal}`
    text(`${Math.floor((effectiveTime - startTime) / 1000)}.${decimalString}`, windowWidth / 2, 16)

    if (gamePlaying) {
        textAlign(CENTER, CENTER)
        textSize(96)
        if (tileSets[currentTileSet].blackTile === 0) {
            fill(255)
        } else {
            fill(0, 200, 200)
        }
        text("D", windowWidth / 8, 5 * windowHeight / 6)
        if (tileSets[currentTileSet].blackTile === 1) {
            fill(255)
        } else {
            fill(0, 200, 200)
        }
        text("F", windowWidth / 8 + windowWidth / 4, 5 * windowHeight / 6)
        if (tileSets[currentTileSet].blackTile === 2) {
            fill(255)
        } else {
            fill(0, 200, 200)
        }
        text("J", windowWidth / 8 + 2 * windowWidth / 4, 5 * windowHeight / 6)
        if (tileSets[currentTileSet].blackTile === 3) {
            fill(255)
        } else {
            fill(0, 200, 200)
        }
        text("K", windowWidth / 8 + 3 * windowWidth / 4, 5 * windowHeight / 6)

        noStroke()
        fill(0, 200, 200)
        textAlign(LEFT, TOP)
        textSize(24)
        text(`${currentTileSet}`, 16, 16)
    } else {
        stroke(0)
        strokeWeight(10)
        fill(255)
        textAlign(CENTER, CENTER)
        textSize(64)
        text("Click to Start", windowWidth / 2, windowHeight / 2)
    }

    noStroke()

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