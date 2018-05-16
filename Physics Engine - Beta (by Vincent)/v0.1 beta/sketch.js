const gravity = -6

var objectIdCount = 0

function modulus(a, b) {
    return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2))
}

var physicsBody = function(x, y, r, g, b, width, height, type, pinned) {

    this.setup = function() {
        this.r = r
        this.g = g
        this.b = b
        this.width = width
        this.height = height
        this.x = x
        this.y = y
        this.type = type
        this.pinned = pinned

        this.mass = 100
        this.friction = 0.1
        this.zRotation = 0
        this.xVelocity = 0
        this.yVelocity = 0
        this.xAcceleration = 0
        this.yAcceleration = 0

        this.id = objectIdCount
        objectIdCount += 1
    }

    this.update = function() {
        // Apply gravity

        if (!pinned) {
            this.yAcceleration += gravity
        }

        // Apply friction

        this.xVelocity -= this.xVelocity * this.friction
        this.yVelocity -= this.yVelocity * this.friction

        // Apply air resistance

        const airResistance = modulus(this.yVelocity, this.xVelocity) * 0.5
        const velocityDirection = atan2(this.yVelocity, this.xVelocity)
        const xAirResistance = -airResistance * cos(velocityDirection)
        const yAirResistance = -airResistance * sin(velocityDirection)
        this.applyForce(xAirResistance, yAirResistance)

        // Apply accelerations

        this.xVelocity += this.xAcceleration
        this.yVelocity += this.yAcceleration
        this.xAcceleration = 0
        this.yAcceleration = 0

        // Apply velocity

        this.x += this.xVelocity
        this.y += this.yVelocity

        // Detect body collisions

        for (var i = 0; i < objects.length; i++) {
            const currentObject = objects[i]

            if (this.id != currentObject.id && !this.pinned) {
                if (this.type === "circle" && currentObject.type === "circle") {
                    const yDifference = currentObject.y - this.y
                    const xDifference = currentObject.x - this.x
                    const distance = modulus(yDifference, xDifference)
    
                    if (distance <= this.width / 2 + currentObject.width / 2) {
                        const normal = Math.atan2(yDifference, xDifference)

                        const initialVelocityAngle = Math.atan2(-this.yVelocity, -this.xVelocity)
                        const finalVelocityAngle = normal - (initialVelocityAngle - normal)
                        const absoluteVelocity = modulus(this.yVelocity, this.xVelocity)
                        this.xVelocity = absoluteVelocity * -Math.cos(normal)
                        this.yVelocity = absoluteVelocity * -Math.sin(normal)
                        
                        const intrusion = -(distance - this.width / 2 - currentObject.width / 2) / 10
                        const xIntrusion = currentObject.mass * intrusion * -Math.cos(normal)
                        const yIntrusion = currentObject.mass * intrusion * -Math.sin(normal)
                        this.applyForce(xIntrusion, yIntrusion)

                        /*
                        const impact = modulus(currentObject.yVelocity, currentObject.xVelocity) / 4
                        const xForce = currentObject.mass * impact * -Math.cos(normal)
                        const yForce = currentObject.mass * impact * -Math.sin(normal)
                        this.applyForce(xForce, yForce)
                        */

                        this.x = currentObject.x + (currentObject.width / 2 + this.width / 2) * -Math.cos(normal)
                        this.y = currentObject.y + (currentObject.height / 2 + this.height / 2) * -Math.sin(normal)

                        if (this.y === currentObject.y && this.x === currentObject.x) {
                            this.y = currentObject.y + (currentObject.height / 2 + this.height / 2)
                        }
                    }
                }
            }
        }

        // Detect edge collisions

        if (this.x < 0 + this.width / 2) {
            if (this.xVelocity < 0 || this.xAcceleration < 0) {
                this.xVelocity = -this.xVelocity
            }
            this.x = 0 + this.width / 2
        } else if (this.x > 960 - this.width / 2) {
            if (this.xVelocity > 0 || this.xAcceleration > 0) {
                this.xVelocity = -this.xVelocity
            }
            this.x = 960 - this.width / 2
        }

        if (this.y < 0 + this.height / 2) {
            if (this.yVelocity < 0 || this.yAcceleration > 0) {
                this.yVelocity = -this.yVelocity
            }
            this.y = 0 + this.height / 2
        } else if (this.y > 640 - this.height / 2) {
            if (this.yVelocity > 0 || this.yAcceleration < 0) {
                this.yVelocity = -this.yVelocity
            }
            this.y = 640 - this.height / 2
        }

        // Draw

        fill(this.r, this.g, this.b)
        if (this.type === "rect") {
            rect(this.x, 640 - this.y, this.width, this.height)
        } else {
            ellipse(this.x, 640 - this.y, this.width, this.height)
        }
    }

    this.applyForce = function(xMagnitude, yMagnitude) {
        this.xAcceleration += xMagnitude / this.mass
        this.yAcceleration += yMagnitude / this.mass
    }

    this.createCirclePhysicsBody = function() {
        this.type = "circle"
    }

    this.createRectPhysicsBody = function() {
        this.type = "rect"
    }

}

const inputDevice = new physicsBody(320, 240, 200, 0, 0, 64, 64, "circle", true)
const objects = [inputDevice]

function mouseDragged() {
    inputDevice.applyForce(mouseX - inputDevice.x, 640 - mouseY - inputDevice.y)
}

function keyPressed() {
    if(keyCode === 32) {
        var verticalShift = 96
        if (inputDevice.y <= 320) {
            verticalShift = -96
        }

        var newObject = new physicsBody(inputDevice.x, inputDevice.y - verticalShift, 10, 10, 10, 96, 96, "circle", false)
        newObject.setup()
        objects.push(newObject)
    } 
}

function setup() {
    createCanvas(960, 640)
    noStroke()

    inputDevice.setup()
}

function draw() {
    background(200)
    inputDevice.update()

    for (var i = 0; i < objects.length; i++) {
        objects[i].update()
    }
}