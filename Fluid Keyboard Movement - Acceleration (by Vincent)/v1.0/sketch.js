var ellipseX = 400, ellipseY = 200
var velocityX = 0, velocityY = 0
var keysPressed = new Map()

function setup() {
    createCanvas(800, 600)

    keysPressed.set(LEFT_ARROW, false)
    keysPressed.set(RIGHT_ARROW, false)
    keysPressed.set(UP_ARROW, false)
    keysPressed.set(DOWN_ARROW, false)
}

function draw() {
    background(100)

    // Apply ease-out

    velocityX -= velocityX / 5
    velocityY -= velocityY / 5

    // Apply directional velocity

    var directionX = 0
    var directionY = 0

    if (keysPressed[LEFT_ARROW]) {
        directionX -= 1
    }

    if (keysPressed[RIGHT_ARROW]) {
        directionX += 1
    }

    if (keysPressed[UP_ARROW]) {
        directionY -= 1
    }

    if (keysPressed[DOWN_ARROW]) {
        directionY += 1
    }

    const angle = Math.atan2(directionY, directionX)
    const cosAngle = Math.cos(angle)
    const sinAngle = Math.sin(angle)

    if (directionX != 0) {
        velocityX += 2 * cosAngle
    }

    if (directionY != 0) {
        velocityY += 2 * sinAngle
    }

    // Apply edge reflections

    if (ellipseX < 0) {
        velocityX += -ellipseX / 2
    }

    if (ellipseX > width) {
        velocityX -= (ellipseX - width) / 2
    }

    if (ellipseY < 0) {
        velocityY += -ellipseY / 2
    }

    if (ellipseY > height) {
        velocityY -= (ellipseY - height) / 2
    }

    // draw

    ellipseX += velocityX
    ellipseY += velocityY

    fill(255, 0, 0)
    stroke(1)
    ellipse(ellipseX, ellipseY, 50, 50)
}

function keyPressed() {
    if (keysPressed.has(keyCode)) {
        keysPressed[keyCode] = true
    }
}

function keyReleased() {
    if (keysPressed.has(keyCode)) {
        keysPressed[keyCode] = false
    }
}
