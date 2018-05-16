let allShit = []

class Shit {
    constructor(x, y) {
        this.x = x
        this.y = y
    }

    static render(x, y) {
        fill(135, 0, 18)
        ellipse(x, y + 20, 100, 35)
        ellipse(x, y + 5, 80, 30)
        ellipse(x, y - 7, 60, 20)
        ellipse(x, y - 17, 45, 15)
        ellipse(x, y - 24, 30, 10)
    }
}

function setup() {
    createCanvas(windowWidth, windowHeight)
}

function draw()
{    
    background(255, 255, 255)
    
    for(const i in allShit) {
        const thisShit = allShit[i]
        Shit.render(thisShit.x, thisShit.y)
    }
    
    noCursor()
    Shit.render(mouseX, mouseY)

    text(allShit.length, 10, 10)
}

function mousePressed() {
    allShit.push(new Shit(mouseX, mouseY))
}

function mouseDragged() {
    allShit.push(new Shit(mouseX, mouseY))
}