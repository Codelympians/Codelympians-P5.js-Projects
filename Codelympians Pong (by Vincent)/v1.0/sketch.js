var screenX = 960 /*windowWidth*/
var screenY = 640 /*windowHeight*/
var ballSpeed = rawBallSpeed * (Math.floor(Math.random() + 0.5) - 0.5) * 2 // Calculate ±rawBallSpeed
var gameStatus = 0

var keyCodeW = 87
var keyCodeS = 83
var keyCodeSpace = 32

var wKeyPressed = false
var sKeyPressed = false
var upKeyPressed = false
var downKeyPressed = false

var sessionScoreLeft = 0
var sessionScoreRight = 0

var AIMovingUp = false
var AIMovingDown = false

var ball = function (x, y) {

    this.setup = function () {

        this.xSpeed = ballSpeed
        this.ySpeed = ballSpeed
        this.x = x
        this.y = y

        this.width = ballRadius * 2
        this.height = ballRadius * 2

    }

    this.update = function () {

        this.x += this.xSpeed
        this.y += this.ySpeed
        noStroke()
        fill(ballColor[0], ballColor[1], ballColor[2])
        ellipse(this.x, this.y, this.width, this.height)

        this.previousXSpeed = this.xSpeed
        this.previousYSpeed = this.ySpeed

        // Top wall collision
        if ((this.y >= screenY - ballRadius) && (this.ySpeed > 0)) {
            this.ySpeed = -this.ySpeed
            BBHitWall(0, this.previousXSpeed, this.previousYSpeed, this.x)
        }

        // Bottom wall collision
        if ((this.y <= ballRadius) && (this.ySpeed < 0)) {
            this.ySpeed = -this.ySpeed
            BBHitWall(1, this.previousXSpeed, this.previousYSpeed, this.x)
        }

        // Right wall collision
        if ((this.x >= screenX - ballRadius) && (this.xSpeed > 0)) {
            //this.xSpeed = -this.xSpeed
            gameStatus = 2
            sessionScoreLeft += 1
        }

        // Left wall collision
        if ((this.x <= ballRadius) && (this.xSpeed < 0)) {
            //this.xSpeed = -this.xSpeed
            gameStatus = 2
            sessionScoreRight += 1
        }

    }

}

var paddle = function (x, y, useArrowKeys) {
    this.setup = function () {
        this.x = x
        this.y = y

        this.width = 15
        this.height = paddleHeight

        this.useArrowKeys = useArrowKeys
    }

    this.update = function () {
        fill(paddleColor[0], paddleColor[1], paddleColor[2])
        rect(this.x, this.y, this.width, this.height)

        if (this.useArrowKeys) {

            if (AIEnabled) {

                if (AIMovingUp) {

                    if (this.y <= screenY - this.height) {
                        this.y += paddleSpeed
                    }
                    
                    if (Math.random() > 0.5) {
                        AIMovingUp = false
                    }

                }

                if (AIMovingDown) {

                    if (this.y >= 0) {
                        this.y -= paddleSpeed
                    }

                    if (Math.random() > 0.6) {
                        AIMovingDown = false
                    }

                }

            } else {

                if (upKeyPressed && this.y >= 0) {
                    this.y -= paddleSpeed
                } else if (downKeyPressed && this.y <= screenY - this.height) {
                    this.y += paddleSpeed
                }

            }

        } else {


            if (wKeyPressed && this.y >= 0) {
                this.y -= paddleSpeed
            } else if (sKeyPressed && this.y <= screenY - this.height) {
                this.y += paddleSpeed
            }

        }

    }

    this.testForCollision = function (ballX, ballY, ballWidth, ballHeight, ballSpeedX, ballSpeedY) {

        // Test if ball's x overlaps with paddle's x
        if ((ballX + ballRadius >= this.x) && (ballX - ballRadius <= this.x + this.width)) {

            // Test ball's y in relation with paddle's y
            if ((ballY >= this.y) && (ballY <= this.y + this.height)) {
                // Within range

                // Test paddle orientation and collision orientation
                if (this.useArrowKeys) {
                    if (ballSpeedX > 0) {
                        return [-ballSpeedX, ballSpeedY, true, 0, 1]
                    }
                } else {
                    if (ballSpeedX < 0) {
                        return [-ballSpeedX, ballSpeedY, true, 0, 0]
                    }
                }

            } else if ((ballY >= this.y) && (ballY - ballHeight * 0.75 <= this.y + this.height)) {
                // Slightly below

                // Test paddle orientation and collision orientation
                if (ballSpeedY < 0) {
                    return [ballSpeedX, -ballSpeedY, true, 1, 0]
                } else {

                    if (this.useArrowKeys) {
                        if (ballSpeedX > 0) {
                            return [-ballSpeedX, ballSpeedY, true, 0, 1]
                        }
                    } else {
                        if (ballSpeedX < 0) {
                            return [-ballSpeedX, ballSpeedY, true, 0, 0]
                        }
                    }

                }

            } else if ((ballY + ballHeight * 0.75 >= this.y) && (ballY <= this.y + this.height)) {
                // Slightly above

                // Test paddle orientation and collision orientation
                if (ballSpeedY > 0) {
                    return [ballSpeedX, -ballSpeedY, 1, 1]
                } else {

                    if (this.useArrowKeys) {
                        if (ballSpeedX > 0) {
                            return [-ballSpeedX, ballSpeedY, 0, 1]
                        }
                    } else {
                        if (ballSpeedX < 0) {
                            return [-ballSpeedX, ballSpeedY, 0, 0]
                        }
                    }

                }

            }

        }

        return [ballSpeedX, ballSpeedY, false, 0, 0]

    }

}

var theBall = new ball(screenX / 2, screenY * Math.random())
var paddle1 = new paddle(100, screenY / 2 - paddleHeight / 2, false)
var paddle2 = new paddle(screenX - 100, screenY / 2 - paddleHeight / 2, true)

function AIMoveUp() {
    if (!AIMovingDown) {
        AIMovingUp = true
    }
}

function AIMoveDown() {
    if (!AIMovingUp) {
        AIMovingDown = true
    }
}

function keyPressed() {

    if (keyCode == keyCodeW) {
        wKeyPressed = true
    } else if (keyCode == keyCodeS) {
        sKeyPressed = true
    } else if (keyCode == UP_ARROW) {
        upKeyPressed = true
    } else if (keyCode == DOWN_ARROW) {
        downKeyPressed = true
    }

}

function keyReleased(upKey, upKeyCode) {
    if (gameStatus == 0) {
        // Title screen

        if (keyCode == keyCodeSpace) {

            theBall.x = screenX / 2
            theBall.y = screenY * Math.random()

            paddle1.y = screenY / 2 - paddleHeight / 2
            paddle2.y = screenY / 2 - paddleHeight / 2

            gameStatus = 1

            BBStartNewRound()

        }

    } else if (gameStatus == 2) {
        // Game over screen

        if (keyCode == keyCodeSpace) {
            gameStatus = 0
        }
    }

    if (keyCode == keyCodeW) {
        wKeyPressed = false
    } else if (keyCode == keyCodeS) {
        sKeyPressed = false
    } else if (keyCode == UP_ARROW) {
        upKeyPressed = false
    } else if (keyCode == DOWN_ARROW) {
        downKeyPressed = false
    }
}

function setup() {
    createCanvas(screenX, screenY)
    theBall.setup()
    paddle1.setup()
    paddle2.setup()
}


function draw() {

    if (gameStatus == 1) {
        // In gameplay

        background(backgroundColor[0], backgroundColor[1], backgroundColor[2])

        var collisionWithPaddle1 = paddle1.testForCollision(theBall.x, theBall.y, theBall.width, theBall.height, theBall.xSpeed, theBall.ySpeed)
        theBall.xSpeed = collisionWithPaddle1[0]
        theBall.ySpeed = collisionWithPaddle1[1]

        if (collisionWithPaddle1[2]) {

            if (collisionWithPaddle1[3] == 1) {
                BBHitPaddleEdge(collisionWithPaddle1[4], theBall.previousXSpeed, theBall.previousYSpeed, theBall.y)
            } else {
                BBHitPaddleFace(0, theBall.previousXSpeed, theBall.previousYSpeed, theBall.y)
            }

        }

        var collisionWithPaddle2 = paddle2.testForCollision(theBall.x, theBall.y, theBall.width, theBall.height, theBall.xSpeed, theBall.ySpeed)
        theBall.xSpeed = collisionWithPaddle2[0]
        theBall.ySpeed = collisionWithPaddle2[1]

        if (collisionWithPaddle2[2]) {

            if (collisionWithPaddle2[3] == 1) {
                BBHitPaddleEdge(collisionWithPaddle2[4], theBall.previousXSpeed, theBall.previousYSpeed, theBall.y)
            } else {
                BBHitPaddleFace(1, theBall.previousXSpeed, theBall.previousYSpeed, theBall.y)
            }

        } 

        if (AIEnabled) {
            AIUpdate(paddle2.y, paddle1.y, theBall.x, theBall.y, screenX, screenY)
        }

        paddle1.update()
        paddle2.update()

        theBall.update()

        textAlign(CENTER, TOP)
        textSize(screenY / 20)
        fill(scoreColor[0], scoreColor[1], scoreColor[2])
        text(`${sessionScoreLeft} : ${sessionScoreRight}`, screenX / 2, screenY * 0.05)

    } else if (gameStatus == 2) {
        // Game over screen

        background(200, 0, 0)

        textAlign(CENTER, CENTER)

        textSize(screenY / 10)
        fill(20)
        text("Game Over", screenX / 2, screenY * 0.25)

        textSize(screenY / 20)
        fill(0)
        text("Codelympians Pong", screenX / 2, screenY * 0.4)

        textSize(screenY / 15)
        fill(255, 200, 200)
        text(`${sessionScoreLeft} : ${sessionScoreRight}`, screenX / 2, screenY * 0.525)

        textSize(screenY / 20)
        fill(200)
        text("Press space to start a new round.", screenX / 2, screenY * 0.65)

        textSize(screenY / 20)
        fill(100)
        text("Reload the page to reset scores.", screenX / 2, screenY * 0.8)

    } else {
        // Title screen

        background(20)
        textAlign(CENTER, CENTER)

        textSize(screenY / 10)
        fill(200, 0, 0)
        text("Codelympians Pong", screenX / 2, screenY * 0.25)

        textSize(screenY / 40)
        fill(200)
        text("Player 1 - W & S to move paddle. Player 2 - Up & Down arrow keys to move paddle.", screenX / 2, screenY * 0.55)

        textSize(screenY / 20)
        fill(200)
        text("Press space to start game.", screenX / 2, screenY * 0.75)

    }

}
