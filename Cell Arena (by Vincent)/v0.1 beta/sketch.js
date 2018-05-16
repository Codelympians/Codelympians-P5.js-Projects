//////////////// Constants ////////////////

const arenaRadius = 2000
const animationSpeed = 0.4

//////////////// Model ////////////////

'use strict'

function renderObject(object) {
    const screenDiagonalRadius = modulus(width / 2, height / 2)
    const screenX = sceneXToCameraX(object.x)
    const screenY = sceneYToCameraY(object.y)

    if (modulus(reverseConvertX(screenX), reverseConvertY(screenY)) - object.size / 2 <= screenDiagonalRadius) {
        // Renders only when visible on screen
        fill(object.r, object.g, object.b)
        ellipse(screenX, screenY, object.renderSize, object.renderSize)
    }
}

class GameObject {
    constructor(x, y, initialSize) {
        this.x = x
        this.y = y
        this.size = initialSize
        this.renderSize = this.size
        this.willDestroy = false

        this.respawnCooldown = 0

        // Set random color
        const colorPool = 200
        this.r = colorPool * (2 / 3) * Math.random()
        this.g = (colorPool - this.r) * Math.random()
        this.b = colorPool - this.r - this.g
    }

    update(index, isCharacter) {
        if (this.willDestroy) {
            if (!isCharacter) {
                this.willDestroy = false
                particles.splice(index, 1)
            }
            return
        }
        renderObject(this)
    }

    destroy() {
        this.willDestroy = true
    }
}

class Character extends GameObject {
    constructor(x, y, initialSize, isPlayer) {
        super(x, y, initialSize)

        this.score = 0
        this.rank = 0

        this.targetX = x
        this.targetY = y

        this.isPlayer = isPlayer
    }

    update(index, timeDiff) {
        if (this.willDestroy) {
            this.willDestroy = false
            this.respawnCooldown = 1000

            const angle = Math.random() * 2 * Math.PI
            const distance = Math.sqrt(Math.random()) * arenaRadius
            this.x = distance * cos(angle)
            this.y = distance * sin(angle)

            this.targetX = this.x
            this.targetY = this.y

            this.size = 20 + Math.random() * 40
            this.renderSize = this.size

            return
        }

        if (this.respawnCooldown > 0) {
            this.respawnCooldown -= timeDiff
            return
        }

        if (!isPaused) {
            this.rank = characters.length - index

            this.speed = 40000 / this.size
            this.renderSize += (this.size - this.renderSize) / (fps / 8)
            this.applyFollow()
            this.testForBorder()

            if (!this.isPlayer) {
                this.automaticPathfind()
            }

            for (const i in particles) {
                this.testForContact(particles[i])
            }

            for (let i = index; i < characters.length; i++) {
                this.testForContact(characters[i])
            }

            this.score = Math.floor(this.size * this.size / 10)
        }
        super.update(index, true)
    }

    setTarget(tX, tY) {
        this.targetX = tX
        this.targetY = tY
    }

    applyFollow() {
        const yDifference = this.targetY - this.y
        const xDifference = this.targetX - this.x
        const distance = modulus(yDifference, xDifference)

        if (distance > 5) {
            const angle = Math.atan2(yDifference, xDifference)
            const screenCircleHalf = (width > height) ? height / 2 : width / 2
            const moveSpeed = (distance > screenCircleHalf) ? this.speed : this.speed * (distance / screenCircleHalf)

            this.x += moveSpeed * cos(angle) / fps
            this.y += moveSpeed * sin(angle) / fps
        }
    }

    testForBorder() {
        const absolutePosition = modulus(this.y, this.x)
        const borderBoundbox = arenaRadius - this.size / 2

        if (absolutePosition > borderBoundbox) {
            const angle = Math.atan2(this.y, this.x)
            this.x = borderBoundbox * cos(angle)
            this.y = borderBoundbox * sin(angle)
        }
    }

    testForContact(target) {
        const yDifference = target.y - this.y
        const xDifference = target.x - this.x
        const distance = modulus(yDifference, xDifference)
        const angle = Math.atan2(yDifference, xDifference)

        if (distance > this.size / 2 + target.size / 2) {
            return
        }

        if (Math.floor(this.size / 10 + 0.5) == Math.floor(target.size / 10 + 0.5)) {
            const displacement = this.size - distance
            this.x -= displacement * cos(angle)
            this.y -= displacement * sin(angle)
            target.x += displacement * cos(angle)
            target.y += displacement * sin(angle)
        } else if (distance <= this.size / 2 && this.size > target.size &&
            target.respawnCooldown <= 0 && this.respawnCooldown <= 0) {
            target.destroy()
            this.size += (target.size / this.size) * 10
        } else if (distance <= target.size / 2 && this.size < target.size &&
            this.respawnCooldown <= 0 && target.respawnCooldown <= 0) {
            this.destroy()
            target.size += (this.size / target.size) * 10
        }
    }

    automaticPathfind() {
        let targetVectorX = 0
        let targetVectorY = 0

        for (const index in characters) {
            const evaluationTarget = characters[index]
            const yDifference = evaluationTarget.y - this.y
            const xDifference = evaluationTarget.x - this.x
            const distance = Math.abs(modulus(yDifference, xDifference) - evaluationTarget.size / 2 - this.size / 2)
            const sizeDifference = evaluationTarget.size - this.size

            if (distance < 600 + sizeDifference && evaluationTarget.respawnCooldown <= 0) {
                const angle = atan2(yDifference, xDifference)
                let dangerValue = 0
                if (sizeDifference > 10) {
                    dangerValue = 100 / distance
                } else if (sizeDifference < -10) {
                    dangerValue = -50 / distance
                }
                targetVectorX -= dangerValue * cos(angle)
                targetVectorY -= dangerValue * sin(angle)
            }
        }

        for (const index in particles) {
            const evaluationTarget = particles[index]
            const yDifference = evaluationTarget.y - this.y
            const xDifference = evaluationTarget.x - this.x
            const distance = modulus(yDifference, xDifference)

            if (distance < 600) {
                const utilitarianDistance = distance - this.size / 2
                const angle = atan2(yDifference, xDifference)

                let value = 5 / utilitarianDistance

                targetVectorX += value * cos(angle)
                targetVectorY += value * sin(angle)
            }
        }

        this.targetX = this.x + targetVectorX * this.speed
        this.targetY = this.y + targetVectorY * this.speed

        console.log(`${targetVectorX}, ${targetVectorY}`)
    }
}

class Animator {
    constructor(x, y, initialSize, targetX, targetY, targetSize, r, g, b) {
        this.x = x
        this.y = y
        this.initialSize = initialSize
        this.size = initialSize
        this.renderSize = this.size

        this.r = r
        this.g = g
        this.b = b
        this.targetAngle = atan2(targetY - y, targetX - x)
    }

    update() {
        if (!isPaused) {
            const sizeDecrease = this.initialSize * animationSpeed / fps
            this.renderSize -= sizeDecrease
            this.x += sizeDecrease / 2 * cos(targetAngle)
            this.y += sizeDecrease / 2 * sin(targetAngle)
        }
        renderObject(this)
    }
}

//////////////// Global variables ////////////////

let userCanInput = true

let frameTime = 0
let oldTime = 0
let fpsCooldown = 0
let fps = 0
let displayFPS = 0

const camera = new Character(0, 0, 40 + Math.random() * 60, true)
let particles = []
let characters = [camera]
let animators = []

let isPaused = false

//////////////// Convenience methods ////////////////

function modulus(a, b) {
    return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2))
}

function convertX(x) {
    return x + width / 2
}

function convertY(y) {
    return -y + height / 2
}

function reverseConvertX(x) {
    return x - width / 2
}

function reverseConvertY(y) {
    return -y + height / 2
}

function centerRect(x, y, w, h) {
    rect(convertX(x - w / 2), convertY(y + h / 2), w, h)
}

function sceneXToCameraX(x) {
    return convertX(x - camera.x)
}

function sceneYToCameraY(y) {
    return convertY(y - camera.y)
}

function cameraXToSceneX(x) {
    return reverseConvertX(x) + camera.x
}

function cameraYToSceneY(y) {
    return reverseConvertY(y) + camera.y
}

function sortCharactersBySize() {
    function merge(array, p, q, r) {
        let lowHalf = []
        let highHalf = []

        let k = p
        let i, j
        for (i = 0; k <= q; i++ , k++) {
            lowHalf[i] = array[k];
        }
        for (j = 0; k <= r; j++ , k++) {
            highHalf[j] = array[k];
        }

        k = p
        i = 0
        j = 0

        // Repeatedly compare the lowest untaken element in
        //  lowHalf with the lowest untaken element in highHalf
        //  and copy the lower of the two back into array
        while (i < lowHalf.length && j < highHalf.length) {
            if (lowHalf[i].size < highHalf[j].size) {
                array[k] = lowHalf[i]
                i++
            } else {
                array[k] = highHalf[j]
                j++
            }
            k++
        }

        // Once one of lowHalf and highHalf has been fully copied
        //  back into array, copy the remaining elements from the
        //  other temporary array back into the array
        while (i < lowHalf.length) {
            array[k] = lowHalf[i]
            i++
            k++
        }

        while (j < highHalf.length) {
            array[k] = highHalf[j]
            j++
            k++
        }
    }

    function mergeSort(array, p, r) {
        if (r - p > 0) {
            const q = Math.floor((p + r) / 2)
            mergeSort(array, p, q)
            mergeSort(array, q + 1, r)
            merge(array, p, q, r)
        }
    }

    mergeSort(characters, 0, characters.length - 1)
}

//////////////// View Controller ////////////////

function setup() {
    createCanvas(windowWidth, windowHeight)
    noStroke()

    for (let i = 0; i < 400; i++) {
        const angle = Math.random() * 2 * Math.PI
        const distance = Math.sqrt(Math.random()) * (arenaRadius - 5)

        particles.push(new GameObject(distance * cos(angle), distance * sin(angle), 10))
    }

    for (let i = 0; i < 59; i++) {
        const angle = Math.random() * 2 * Math.PI
        const distance = Math.sqrt(Math.random()) * arenaRadius

        characters.push(new Character(distance * cos(angle), distance * sin(angle), 20 + Math.random() * 40, false))
    }
}

function draw() {
    // Render arena background

    background(16)
    fill(32)
    ellipse(sceneXToCameraX(0), sceneYToCameraY(0), arenaRadius * 2, arenaRadius * 2)

    // Time updates

    frameTime = millis()
    const timeDiff = frameTime - oldTime
    fps = 1000 / (timeDiff)
    textSize(32)
    fpsCooldown -= timeDiff

    // Camera setup

    camera.targetX = cameraXToSceneX(mouseX)
    camera.targetY = cameraYToSceneY(mouseY)

    // Update

    sortCharactersBySize()

    for (const index in particles) {
        particles[index].update(index, false)
    }

    for (const index in characters) {
        characters[index].update(index, timeDiff)
    }

    for (const index in animators) {
        animators[index].update()
    }

    // UI Elements

    if (isPaused) {
        fill(0, 0, 0, 128)
        rect(0, 0, width, height)

        fill(160)
        textSize(36)
        textAlign(CENTER)
        text("P A U S E D", convertX(0), convertY(height * 0.25))
    }

    textAlign(RIGHT, TOP)

    fill(96)
    textSize(16)
    text("SCORE", width - 16, 16)

    fill(128)
    textSize(32)
    text(`${camera.score}`, width - 16, 40)

    textSize(32)
    switch (camera.rank) {
        case (1):
            fill(255, 255, 0)
            text("1st Place", width - 16, 88)
            break
        case (2):
            fill(170)
            text("2nd Place", width - 16, 88)
            break
        case (3):
            fill(108, 36, 0)
            text("3rd Place", width - 16, 88)
            break
        default:
            textSize(16)
            fill(96)
            text(`Rank: #${camera.rank}`, width - 16, 88)
            break
    }

    // Leaderboard

    textAlign(LEFT, TOP)
    textSize(24)
    fill(128)
    text(`LEADERBOARD`, 16, 16)

    let previousSize = 52
    for (let i = 1; i <= 10; i++) {
        const character = characters[characters.length - i]
        fill(character.r, character.g, character.b)
        let thisSize = 16

        if (character.rank == camera.rank) {
            thisSize = 24
            textSize(thisSize)
            text(`#${i} : SCORE ${camera.score} (YOU)`, 16, previousSize)
        } else {
            textSize(thisSize)
            text(`#${i} : Score ${character.score}`, 16, previousSize)
        }

        previousSize += thisSize * 1.5
    }

    // Display FPS

    if (fpsCooldown <= 0) {
        displayFPS = fps
        fpsCooldown = 1000
    }

    fill(0, 0, 0)
    textAlign(RIGHT, BOTTOM)
    textSize(24)
    text(`${Math.floor(displayFPS)} fps`, width - 16, height - 16)

    // Finalizing frame

    oldTime = millis()
}

function mouseClicked() {
    isPaused = !isPaused
}

//////////////// PROBLEMS TO SOLVE / FEATURES TO IMPLEMENT ////////////////

/*

 - Improve AI: Make them pursue smaller cells near their size, and fear larger cells near their size

 - Animate cells being eaten: Dead cells create an Animator that shrinks and moves to the target location

 - Spawn new Particles, with the maximum amount of particles depending on the total size of cells in the arena

 - The game will end when someone reaches a score of 100,000
 : - Present a restart button

 - New split ability: divide all subcells that a character has
 : - Press space
 : - Reduce current cell to half size
 : - Launch a Split Animator by (new size + new speed) / (fps * 2) for 0.5s
 : - Split Animator spawns a new cell at final location
 : - If this character is the current player, move camera to average position of all its cells
 : - Merge cells at (speed / 8), merge occurs when one cell's edge overlaps another's center
 : - Make sure to differenciate between cells of different characters (do not friendly fire)

 - Multiplayer: 
 : - Enter from pause screen
 : - Present an alert of "Entering Multiplayer will end the current game. Continue?"
 : : - Alert includes checkbox of "Don't show this again", use LocalStorage or whatever P5 uses to implement it
 : - Set your name
 : : - Automatically saved locally
 : : - Changable
 : - Create or join games
 : : - Max number of games on the server at the same time: 60
 : : - Max number of players connecting to a game: 60
 : : - Name your created game: it will show up in the join screen as well as the top of the gameplay screen
 : : - Show name, joinability status, number of players, elapsed time, and maximum score reached for each game
 : : - Search by name or filter by joinability status, number of players, elapsed time, and maximum score
 : : : - Number of players: 0-4, 5-9, 10-14, 15-24, 25-34, 35-44, 45-60
 : : : - Elapsed time: 0-5 min, 5-10 min, 10-15 min, 15-20 min, >20 min
 : : : - Maximum score: <1000, 1000-5000, 5000-10000, 10000-20000, 20000-50000, >50000
 : - Present ping on the bottom-left corner
 : - Show disconnection or poor connection to other players
 : : - A bot will temporarily take over when disconnected
 : : - The game will "disconnect" you out if you've had generally poor connection for the past 30 seconds
 : : - The game ends when everyone in the room disconnects
 : - Reconnections
 : : - Join previous game
 : : - Create or join another game
 */
