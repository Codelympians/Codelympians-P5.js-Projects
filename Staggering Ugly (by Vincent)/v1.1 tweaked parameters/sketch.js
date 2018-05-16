// Changable variables

const coordinateCount = 20
const stickLength = 640
const stickRadius = 60

// Internal variables
var crazyMode = false
var keepCrazyMode = false
var randomColor = [0, 0, 0]

var frameTime = 0
var oldTime = 0
var fpsCooldown = 0
var fps = 0
var displayFPS = 0

var mouseAngle = Math.PI / 2
var pastAngleCooldown = 0

const acceleration = 50
const friction = 0.1
const coordinates = []
const pastTargetAngles = []

function modulus(a, b) {
    return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2))
}

var eyePositionX = 0
var eyePositionY = 0
var eyeRotation = 0

var physicsCoordinate = function () {
    // All angles measured in radians
    // All time measured in seconds

    this.angle = Math.PI / 2
    this.angularVelocity = 0

    this.setup = function(index) {
        this.index = index
        this.distance = (index + 1) * stickLength / coordinateCount
    }

    this.update = function(previousX, previousY, totalLength, previousAngle) {
        // Accelerate
        var targetAngle = pastTargetAngles[coordinateCount - this.index - 1]
        const angleDifference = targetAngle - this.angle
        this.angularVelocity += acceleration * angleDifference / fps

        if (Math.abs(angleDifference) >= Math.PI / 720) {
            this.angularVelocity += acceleration * angleDifference / fps
        } else if (abs(this.angularVelocity) < Math.PI / 720) {
            this.angle = targetAngle
        }
        
        this.angularVelocity *= 1 - friction

        // Check if too long
        if (totalLength > stickLength * (1 + Math.abs(angleDifference))) {
            this.angle = previousAngle
            return [previousX, previousY, totalLength, previousAngle]
        }

        // Move by velocity
        this.angle += this.angularVelocity / fps
        if (this.angle < -Math.PI / 2) {
            this.angle = Math.PI
        } else if (this.angle < 0) {
            this.angle = 0
        }

        // Translate to Cartesian coordinates, then P5 coordinates
        const cartesianX = Math.cos(this.angle) * this.distance
        const cartesianY = Math.sin(this.angle) * this.distance
        var P5_X = cartesianX + width / 2
        var P5_Y = -cartesianY + height

        // Apply screen constraints
        if (P5_X < stickRadius) {
            P5_X = stickRadius
        } else if (P5_X > width - stickRadius) {
            P5_X = width - stickRadius
        }

        const slope = (stickRadius * 2 / (stickLength / (this.distance + 0.1)))
        if (P5_Y < 0) {
            P5_Y = 0
        } else if (P5_Y > height - slope) {
            P5_Y = height - slope
        }
        P5_Y += stickRadius

        // Draw
        const segmentLength = modulus(P5_X - previousX, P5_Y - previousY)

        if (segmentLength > stickRadius * 2) {
            keepCrazyMode = true
        }

        if (totalLength < stickLength * 0.9) {
            eyePositionX = P5_X
            eyePositionY = P5_Y
            eyeRotation = atan2(P5_Y - previousY, P5_X - previousX) + Math.PI / 2
        }

        if (crazyMode) {
            stroke(randomColor[0], randomColor[1], randomColor[2])
        } else {
            stroke(0)
        }

        strokeWeight(stickRadius * 2)
        line(previousX, previousY, P5_X, P5_Y)
        return [P5_X, P5_Y, totalLength + segmentLength, this.angle]
    }
}

function setup() {
    createCanvas(960, 720)

    for (var i = 0; i < coordinateCount; i++) {
        const newCoordinate = new physicsCoordinate()
        newCoordinate.setup(i)
        coordinates.push(newCoordinate)
        pastTargetAngles.push(Math.PI / 2)
    }
}

function draw() {
    // Test for crazy mode
    if (crazyMode) {
        background(Math.random() * 255, Math.random() * 255, Math.random() * 255)
        randomColor = [Math.random() * 128 + 127, Math.random() * 128 + 127, Math.random() * 128 + 127]
    } else {
        background(200)
    }

    // Time updates
    frameTime = millis()
    var timeDiff = frameTime - oldTime
    fps = 1000 / (timeDiff)
    textSize(32)
    fpsCooldown -= timeDiff
    pastAngleCooldown -= timeDiff

    // Call main logic
    if (fps >= 25) {
        mouseAngle = Math.atan2(-mouseY + height + stickRadius, mouseX - width / 2)
        if (mouseAngle < -Math.PI / 2) {
            mouseAngle = Math.PI
        } else if (mouseAngle < 0) {
            mouseAngle = 0
        }
    
        var previousX = width / 2
        var previousY = height + stickRadius
        var totalLength = 0
        var previousAngle = mouseAngle

        keepCrazyMode = false

        for (var i = 0; i < coordinates.length; i++) {
            const previousCoordinate = coordinates[i].update(previousX, previousY, totalLength, previousAngle)
            previousX = previousCoordinate[0]
            previousY = previousCoordinate[1]
            totalLength = previousCoordinate[2]
            previousAngle = previousCoordinate[3]
        }

        if (keepCrazyMode) {
            crazyMode = true
        } else {
            crazyMode = false
        }
    }

    if (pastAngleCooldown <= 0) {
        if (pastTargetAngles.length == coordinateCount) {
            pastTargetAngles.shift()
        }

        if (pastTargetAngles.length < coordinateCount) {
            pastTargetAngles.push(mouseAngle)
        }

        pastAngleCooldown = 100 / coordinateCount
    }

    // Draw eyes

    const eyeXShift = cos(eyeRotation) * (stickRadius / 2)
    const eyeYShift = sin(eyeRotation) * (stickRadius / 2)

    fill(255)
    strokeWeight(0)
    ellipse(eyePositionX + eyeXShift, eyePositionY + eyeYShift, stickRadius / 5, stickRadius / 5)
    ellipse(eyePositionX - eyeXShift, eyePositionY - eyeYShift, stickRadius / 5, stickRadius / 5)

    // UI Elements 

    if (fpsCooldown <= 0) {
        displayFPS = fps
        fpsCooldown = 1000
    }

    fill(0, 0, 0)
    textAlign(LEFT, TOP)
    textSize(24)
    text(`${Math.floor(displayFPS)} fps`, 10, 10)
    textAlign(RIGHT, TOP)
    text(`Mouse angle: ${Math.floor(mouseAngle * 1000) / 1000}`, width - 10, 10)

    // Finalizing frame

    oldTime = millis()
}