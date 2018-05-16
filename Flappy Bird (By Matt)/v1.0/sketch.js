function setup() {
createCanvas(400, 500);
}


var xPosition  = 100;
var yPosition  = 100;

var create = true; 
var go = 600; 

var boii = 200;

var score = 0; 

var firstTime = true; 

var x = 0;
var y = 0; 
var z = 0;

function draw() {
    background(0, 150, 0);
    fill(255);
    ellipse(xPosition, yPosition, 50, 50);
    yPosition = yPosition + 5;

    if(keyIsDown(32))
    {
        yPosition = yPosition - 25;
    }

    if(yPosition < 25 || yPosition > 475 || dist(xPosition, yPosition, go, boii)< 25 ||dist(xPosition, yPosition, go, boii-25)< 25||dist(xPosition, yPosition, go, boii-50)< 25||dist(xPosition, yPosition, go, boii-75)< 25||dist(xPosition, yPosition, go, boii-100)< 25|| dist(xPosition, yPosition, go, boii+170)< 25||dist(xPosition, yPosition, go, boii+200)< 25||dist(xPosition, yPosition, go, boii+225)< 25||dist(xPosition, yPosition, go, boii+250)< 25||dist(xPosition, yPosition, go, boii+275)< 25||dist(xPosition, yPosition, go, boii+300)< 25)
    {
        fill(255, 0, 0);
        rect(0, -1, 400,501);
        fill(0);
        text("Game Over", 165, 250);
        text("Press 'command R' to restart", 120, 350);
        text(score, 190, 300)
        exit();
    }

    fill(x, y, z);
    rect(go, 0, 50, boii);
    rect(go, boii+170, 50, 1000)
    go = go - 5; 

    if(go < 0)
    {
        go = 400;
        boii = random(20, 200);
        score++;
        firstTime = false;
        x = random(0,255);
        y = random(0,255);
        x = random(0,255);
    }

    fill(255);
    rect(40, 10, 50, 50);
    fill(0);
    text("Score", 50, 30);
    text(score, 50, 50);
    
    if(firstTime)
    {
        fill(255);
        rect(135, 135, 130, 20);
        fill(0);
        text("Use spacebar to fly up", 140, 150);
    }
}