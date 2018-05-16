
var birdY = 250;
var wallPos = 500;
var wallY = 200;
var spawnCooldown = 2000;
var previousTime = 0;
var velocity = 0;
var score = 0;
var restartable;

function setup() {
    createCanvas(500, 500);
    previousTime = millis();
}

function draw() {
    background('green');
    velocity += 0.4;

    var timeDifference = millis() - previousTime;
    spawnCooldown -= timeDifference;
    if (spawnCooldown <= 0) {
        spawnCooldown = 2000;
        wallPos = 500;
        wallY = Math.random() * 250 + 50;
    }

    fill('blue');
    stroke('blue');
    ellipse(125, birdY, 30, 30);

    fill(255);
    rect(wallPos, 0, 50, wallY);
    rect(wallPos, wallY + 125, 50, 500 - wallY);
    wallPos = wallPos - 5;

    if (wallPos + 10 == 125) {
        score += 1;
    }

    if (wallPos - 10 <= 125 && 
        wallPos + 60 >= 125 && 
        birdY <= wallY + 20) {

        background('red');
        fill(255);
        textSize(32);
        text(`Game over!!!`, 25, 150);
        text(`Your score was: ${score}`, 25, 250);
        text(`Tap mouse to restart`, 25, 350);
        restart(mouseClicked);
        noLoop();

    } else if (wallPos - 10 <= 125 && 
        wallPos + 60 >= 125 && 
        birdY >= wallY + 115) {

        background('red');
        fill(255);
        textSize(32);
        text(`Game over!!!`, 25, 150);
        text(`Your score was: ${score}`, 25, 250);
        text(`Tap mouse to restart`, 25, 350);
        restart(mouseClicked);
        noLoop();

    } else if (birdY >= 500 || birdY <= 0) {

        background('red');
        fill(255);
        textSize(32);
        text(`Game over!!!`, 25, 150);
        text(`Your score was: ${score}`, 25, 250);
        text(`Tap mouse to restart`, 25, 350);        
        restart(mouseClicked);
        noLoop();

    }

    previousTime = millis();

    fill(255);
    textSize(36);
    text(`Points: ${score}`, 200, 100);

    birdY += velocity;
}

function keyPressed() {
    
    if (keyCode === 32) {
        velocity = -9;
    }
}

function restart() {
    restartable = true;
}

function mouseClicked() {
    
    if (restartable) {
        birdY = 250;
        velocity = 0;
        wallPos = -500;
        spawnCooldown = 2000;
        timeDifference = 0;
        score = 0;
        loop();
    }
    restartable = false;
}