///////////////////////Size Customization///////////////////////

// The height of the paddle, in pixels. Default value: 100
var paddleHeight = 100

// The radius of the ball, in pixels. Default value: 20
var ballRadius = 20

//////////////////////Speed Customization///////////////////////

// The y-velocity of the paddle, in pixels per frame. Default value: 10
var paddleSpeed = 10

// The x and y speed of the ball, in pixels per frame. Default value: 8
var rawBallSpeed = 8

//////////////////////Color Customization///////////////////////

// The color of the paddle, in RGB. Default value: [255, 255, 255]
var paddleColor = [255, 255, 255]

// The color of the ball, in RGB. Default value: [200, 0, 0]
var ballColor = [200, 0, 0]

// The color of the background, in RGB. Default value: [200, 200, 200]
var backgroundColor = [200, 200, 200]

// THe color of score display, in RGB. Default value: [255, 100, 100]
var scoreColor = [255, 100, 100]

////////////////////////////////////////////////////////////////
/////////////////////Customize Ball Behavior////////////////////
////////////////////////////////////////////////////////////////

// In this section, feel free to use any variable declared in this file to do creative stuff to the ball.
// Manipulate the respective x and y speeds of the ball with "theBall.xSpeed" and "theBall.ySpeed"

function BBStartNewRound() {
    //ballColor = [200, 0, 0]
}

// wallIndex: 0 for top, 1 for bottom
function BBHitWall(wallIndex, previousXSpeed, previousYSpeed, xPosition) {
    //ballColor = [200, 0, 200]
}

// paddleSide: 0 for left, 1 for right
function BBHitPaddleFace(paddleSide, previousXSpeed, previousYSpeed, yPosition) {
    //ballColor = [0, 200, 200]
}

// edgeSide: 0 for top, 1 for bottom
function BBHitPaddleEdge(edgeSide, previousXSpeed, previousYSpeed, yPosition) {
    //ballColor = [200, 200, 0]
}

////////////////////////////////////////////////////////////////
///////////////////////Customize Enemy AI///////////////////////
////////////////////////////////////////////////////////////////

// In this section, Use the variables and functions listed below in the comments and code 
// to customize enemy AI behavior

// The default value of "AIEnabled" is false, meaning that the player controls the enemy paddle
// instead of the AI controlling it.

var AIEnabled = false

// Set "AIEnabled" to true to disable user control for the enemy paddle and enable its AI
// Write all your AI code in "AIUpdate()"
// Use "AIMoveUp()" and "AIMoveDown()" to move the enemy paddle every update

function AIUpdate(AIPositionY, PlayerPositionY, ballX, ballY, screenWidth, screenHeight) {
    /*
    if (ballX > screenWidth * 0.35) {

        if (ballY > AIPositionY) {
            AIMoveUp()
        } else {
            AIMoveDown()
        }

    }
    */
}

// If your AI broke the game, don't worry, just set "AIEnabled" to false and any AI code 
// won't affect the game anymore. 

////////////////////////////////////////////////////////////////
////////////////////////////Playground//////////////////////////
////////////////////////////////////////////////////////////////

// If you feel pro enough, do anything you want in the space below. We have backups of this project. 

