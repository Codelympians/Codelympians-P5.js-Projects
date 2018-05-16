var allSegments = [];
var originalXSpeed = 0;
var originalYSpeed = 10;
var screenMiddleX = 0;
var screenMiddleY = 0;


function segment()
{
    this.setup = function()
    {
        this.y = screenMiddleY;
        this.x = screenMiddleX;
        this.range = 0;//the number that a circle is in line
        this.maxRange = 100;
        this.space = 5;
        if (mouseX < screenMiddleX)//big - small
        {
            this.xDifference = mouseX - screenMiddleX;
            this.direction = "left";
        }
        if (mouseX > screenMiddleX)
        {
            this.xDifference = screenMiddleX - mouseX;
            this.direction = "right";
        }
        this.yDifference = screenMiddleY - mouseY;
        this.xSpeed = (this.space * this.xDifference) / sqrt(sq(this.xDifference) + sq(this.yDifference));
        this.ySpeed = (this.space * this.yDifference) / sqrt(sq(this.xDifference) + sq(this.yDifference));
    }
    this.update = function()
    {
        this.range++
        //movement
        if (this.direction === "left")
        {
            this.x += this.xSpeed;
        }
        if (this.direction === "right")
        {
            this.x -= this.xSpeed;
        }
        this.y -= this.ySpeed;
        fill(0)
        ellipse(this.x, this.y, 30, 30)

    }
}
/*
function newSegment()
{
    var newSegment = new segment;
    newSegment.setup();
    allSegments.push(newSegment)

}
*/
function setup()
{
    createCanvas(windowWidth, windowHeight)
    screenMiddleX = windowWidth/2
    screenMiddleY = windowHeight
}
function newSegment()
{
    var newSegment = new segment;
    newSegment.setup();
    allSegments.push(newSegment)
    for(i = 0; i < allSegments.length; i++)
    {
        newSegment.update();

        if (allSegments[i].range >= allSegments[i].maxRange)
        {
            allSegments.splice(i,1)
        }
    }
}

function draw()
{    
    background(240);
    newSegment();
    
}
function windowResized()
{
    createCanvas(windowWidth, windowHeight)
    screenMiddleX = windowWidth/2
    screenMiddleY = windowHeight
}