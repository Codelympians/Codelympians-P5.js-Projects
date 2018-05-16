var allShit = [];
var shit = function (x, y) {
    fill(135, 0, 18);
    ellipse(x, y + 20, 100, 35);
    ellipse(x, y + 5, 80, 30);
    ellipse(x, y - 7, 60, 20);
    ellipse(x, y - 17, 45, 15);
    ellipse(x, y - 24, 30, 10);
}

var Shit = function(posX, posY)
{
    this.setup = function()
    {
        this.x = posX;
        this.y = posY;
    }
    
    this.update = function()
    {
        fill(135, 0, 18)
        ellipse(this.x, this.y+20, 100, 35);
        ellipse(this.x, this.y+5, 80, 30);
        ellipse(this.x, this.y-7, 60, 20);
        ellipse(this.x, this.y-17, 45, 15);
        ellipse(this.x, this.y-24, 30, 10);
    }
}
    
function setup()
{
    createCanvas(2000, 2000)
}

function draw()
{    
    noCursor()
    background(255, 255, 255);
    
    if(mouseIsPressed)
    {
        var newShit = new Shit(mouseX, mouseY);
        newShit.setup();
        allShit.push(newShit);
    }
    
    for(var i=0;i<allShit.length;i++)
    {
        allShit[i].update();
    }
    
    shit(mouseX, mouseY);
    text(allShit.length, 10, 10);
}