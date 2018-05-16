//////////////// PROBLEMS TO SOLVE / FEATURES TO IMPLEMENT ////////////////

// ---- First item in grid briefly renders as "undefined"
// ---- Animation
// ---- End-of-game tests / restart game
// ---- Saving local highscores
// ---- Screenshot

//////////////// Global Variables ////////////////

var score = 0
var animationBlocks = []
const grid =
    [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ]

var userCanInput = true

var frameTime = 0
var oldTime = 0
var fpsCooldown = 0
var fps = 0
var displayFPS = 0

//////////////// Convenience methods ////////////////

function convertX(x) {
    return x + width / 2
}

function convertY(y) {
    return -y + height / 2
}

function centerRect(x, y, w, h) {
    rect(convertX(x - w / 2), convertY(y + h / 2), w, h)
}

//////////////// Model ////////////////

var AnimationBlock = function () {
    this.setup = function (xIndex, yIndex) {
        this.xIndex = xIndex
        this.yIndex = yIndex
        this.x = this.targetX()
        this.y = this.targetY()
        this.inAnimation = false
    }

    this.update = function () {
        // Apply animations (use a simplified version for now)

        this.x = this.targetX()
        this.y = this.targetY()
        checkAnimationDone()

        // Render to screen

        const value = grid[this.yIndex][this.xIndex]
        const colorDeviation = (Math.log2(value) % 3) / 2 * 32
        fill(96 - colorDeviation)
        centerRect(this.x, this.y, 64, 64)

        if (!this.inAnimation) {
            const valueText = `${value}`

            fill(48 - colorDeviation)
            textSize(18 + 18 / valueText.length)
            textAlign(CENTER, CENTER)
            text(valueText, convertX(this.x), convertY(this.y))
        }
    }

    this.move = function (targetXIndex, targetYIndex) {
        this.xIndex = targetXIndex
        this.yIndex = targetYIndex
    }

    this.targetX = function () {
        return (this.xIndex - 1.5) * 80
    }

    this.targetY = function () {
        return (this.yIndex - 1.5) * -80 - 40
    }
}

function checkAnimationDone() {
    for (var i = 0; i < animationBlocks.length; i++) {
        if (animationBlocks[i].inAnimation) {
            return
        }
    }

    // If none of the animationBlocks are in animation:

    userCanInput = true
    animationBlocks = []

    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            const currentCell = grid[i][j]
            if (currentCell != 0) {
                const animationBlock = new AnimationBlock()
                animationBlock.setup(j, i)
                animationBlocks.push(animationBlock)
            }
        }
    }
}

function copyGrid(targetGrid) {
    const newGrid = []
    for (var i = 0; i < targetGrid.length; i++) {
        newGrid.push(targetGrid[i].slice())
    }
    return newGrid
}

function checkGridsEqual(grid1, grid2) {
    for (var i = 0; i < grid1.length; i++) {
        for (var j = 0; j < grid1[i].length; j++) {
            console.log(`${grid1[i][j]}, ${grid2[i][j]}`)
            if (grid1[i][j] != grid2[i][j]) {
                console.log("false")
                return false
            }
        }
    }
    console.log("true")
    return true
}

function generalShift(yDirection, xDirection) {
    // Arguments: -1, 0, 1
    // One and only one of the 2 arguments must be 0

    const oldGrid = copyGrid(grid)

    function getIndex(i, j, jDirection) {
        if (jDirection == 0) {
            return i
        }

        // Possible values: j, 3 - j
        return j * jDirection + 3 * (-jDirection + 1) / 2
    }

    function getAnimationBlock(xIndex, yIndex) {
        for (var i = 0; i < animationBlocks.length; i++) {
            const currentBlock = animationBlocks[i]
            if (currentBlock.xIndex = xIndex && currentBlock.yIndex == yIndex) {
                return currentBlock
            }
        }
    }

    for (var i = 0; i < 4; i++) {
        // Combine cells, then compress into tempArray

        var currentValue = 0
        var tempArray = []
        var animationArray = []

        for (var j = 0; j < 4; j++) {
            const yIndex = getIndex(i, j, yDirection)
            const xIndex = getIndex(i, j, xDirection)
            const currentCell = grid[yIndex][xIndex]

            // If combinable
            if (currentValue == currentCell && currentValue != 0) {
                grid[yIndex][xIndex] = 0

                if (tempArray.length > 0) {
                    tempArray.pop()
                }

                tempArray.push(currentCell * 2)
                score += currentCell * 2
                currentValue = 0

                animationArray.push(getAnimationBlock(xIndex, yIndex))
            }

            // If uncombinable
            if (grid[yIndex][xIndex] != 0) {
                currentValue = grid[yIndex][xIndex]
                tempArray.push(currentCell)
                animationArray.push(getAnimationBlock(xIndex, yIndex))
            }
        }

        // Dump tempArray back into the row or column

        const absoluteDirection = yDirection + xDirection

        function setCell(j, value) {
            grid[getIndex(i, j, yDirection)][getIndex(i, j, xDirection)] = value
        }

        for (var j = 0; j < tempArray.length; j++) {
            setCell(j, tempArray[j])
            //animationArray[j].move(getIndex(i, j, xDirection), getIndex(i, j, yDirection))
        }

        for (var j = tempArray.length; j < 4; j++) {
            setCell(j, 0)
        }
    }

    if (!checkGridsEqual(oldGrid, grid)) {
        newCell()
    } else {
        // Check if game is over
    }
}

function shiftLeft() {
    generalShift(0, 1)
}

function shiftRight() {
    generalShift(0, -1)
}

function shiftUp() {
    generalShift(1, 0)
}

function shiftDown() {
    generalShift(-1, 0)
}

function newCell() {
    var yIndex, xIndex
    do {
        yIndex = Math.floor(Math.random() * 4)
        xIndex = Math.floor(Math.random() * 4)
    } while (grid[yIndex][xIndex] != 0)

    // 90% chance of getting 2, 10% chance of getting 4
    grid[yIndex][xIndex] = 2 + 2 * Math.floor(Math.random() + 0.1)

    const animationBlock = new AnimationBlock()
    animationBlock.setup(xIndex, yIndex)
    animationBlocks.push(animationBlock)
}

//////////////// View Controller ////////////////

function keyPressed() {
    if (userCanInput) {
        userCanInput = false

        if (keyCode == UP_ARROW || key == "w") {
            shiftUp()
        } else if (keyCode == DOWN_ARROW || key == "s") {
            shiftDown()
        } else if (keyCode == LEFT_ARROW || key == "a") {
            shiftLeft()
        } else if (keyCode == RIGHT_ARROW || key == "d") {
            shiftRight()
        } else {
            userCanInput = true
        }
    }
}

function setup() {
    createCanvas(windowWidth, windowHeight)

    // Set up the two initial blocks
    for (var i = 1; i <= 2; i++) {
        newCell()
    }
}

function draw() {
    // Time updates

    frameTime = millis()
    var timeDiff = frameTime - oldTime
    fps = 1000 / (timeDiff)
    textSize(32)
    fpsCooldown -= timeDiff

    // UI Elements

    background(32)

    const centerRectWidth = 400
    const centerRectHeight = 480
    noStroke()
    fill(64)
    centerRect(0, 0, centerRectWidth, centerRectHeight)

    fill(32)
    centerRect(centerRectWidth / 2 - 64 - 32, centerRectHeight / 2 - 32 - 24, 128, 64)
    centerRect(0, -40, 336, 336)

    fill(96)
    textSize(16)
    textAlign(CENTER, TOP)
    text("SCORE", convertX(centerRectWidth / 2 - 64 - 32), convertY(centerRectHeight / 2 - 32))

    fill(128)
    textSize(32)
    textAlign(CENTER, BOTTOM)
    text(`${score}`, convertX(centerRectWidth / 2 - 64 - 32), convertY(centerRectHeight / 2 - 32 - 50))

    // Refresh animation blocks

    for (var i = 0; i < animationBlocks.length; i++) {
        animationBlocks[i].update()
    }

    // Display FPS

    if (fpsCooldown <= 0) {
        displayFPS = fps
        fpsCooldown = 1000
    }

    fill(0, 0, 0)
    textAlign(LEFT, TOP)
    textSize(24)
    text(`${Math.floor(displayFPS)} fps`, 10, 10)

    // Finalizing frame

    oldTime = millis()
}
