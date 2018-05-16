var n = parseInt(prompt("How many objects?"))
var asteroids = []

var speed = 0.5
/////
var frameTime = 0
var oldTime = 0
var fpsCooldown = 0
var fps = 0
var displayFPS = 0
/////

function setup() {
    createCanvas(1200, 600)
    for (var i = 0; i < n; i++) {
        asteroids[i] = new Asteroid(random(width), random(height), random(1, 14))
    }
}

function draw() {
    background(20)
    
    for (i in asteroids) { // Time: O(n log n)
        asteroids[i].update() // Time: O(1)
        asteroids[i].mouseConstellate() // Time: O(1)
        asteroids[i].constellate(i) // Time: O(n)
    }

    // Time updates

    frameTime = millis()
    var timeDiff = frameTime - oldTime
    fps = 1000 / (timeDiff)
    textSize(32)
    fpsCooldown -= timeDiff

    // UI Elements 

    if (fpsCooldown <= 0) {
        displayFPS = fps
        fpsCooldown = 1000
    }

    fill(255)
    textAlign(LEFT, TOP)
    textSize(24)
    text(`${Math.floor(displayFPS)} fps`, 10, 10)

    // Finalizing frame

    oldTime = millis()
}

function Asteroid(x, y, s) {
    this.velocityX = random(-speed, speed)
    this.velocityY = random(-speed, speed)
    this.x = x
    this.y = y

    function generalComeback(original, lesser, greater) {
        if (original > greater) {
            return lesser
        }

        if (original < lesser) {
            return greater
        }

        return original
    }

    function generalConstellateAndGetDistance(x1, y1, x2, y2) {
        const diffX = x2 - x1
        const diffY = y2 - y1
        const distance = Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2)) 

        if (distance <= 400) {
            strokeWeight(1)
            stroke(255, 255, 255, 180 - 1 * distance)
            line(x1, y1, x2, y2)
        }

        return distance
    }

    this.update = function () {
        // Perform "comeback"
        this.x = generalComeback(this.x, -200, width + 200)
        this.y = generalComeback(this.y, -200, height + 200)

        // Render the nodes
        fill(255, 255, 255, 180)
        noStroke()
        ellipse(this.x, this.y, s, s)

        // Change position by velocity
        this.x += this.velocityX
        this.y += this.velocityY
    }

    this.mouseConstellate = function () {
        const distance = generalConstellateAndGetDistance(this.x, this.y, mouseX, mouseY)
        
        if (mouseIsPressed && distance <= 200) {
            this.x = this.x + this.velocityX * 50.5
            this.y = this.y + this.velocityY * 50.5
        }
    }

    this.constellate = function (currentIndex) {
        for (var t = currentIndex; t < asteroids.length; t++) {
            generalConstellateAndGetDistance(this.x, this.y, asteroids[t].x, asteroids[t].y)
        }
    }
}
