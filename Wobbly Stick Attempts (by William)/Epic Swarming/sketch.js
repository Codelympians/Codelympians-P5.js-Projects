var allSegments = [];
var maxRange = 0;
var maxRangeNumber = 1000;
var spacing = 0;
var screenMiddleX = 0;
var angle = 0;
var acceleration = 0;

function segment()
{
    this.setup = function(rangeNumber)
    {
        this.rangeNumber = rangeNumber;
        this.space = spacing;
        this.x = screenMiddleX;
        this.y = windowHeight - this.rangeNumber * this.space;
        this.xSpeed = 0;
        this.ySpeed = 0;
        this.acceleration = acceleration;
        
        
    }
    this.update = function(Xmouse, Ymouse)
    {
        if (this.rangeNumber != 0)
        {
            angle = Math.atan2(windowHeight - Ymouse, screenMiddleX - Xmouse)
            this.xTarget = this.space * this.rangeNumber * Math.sin(angle)
            this.yTarget = this.space * this.rangeNumber * Math.cos(angle)

            this.x += this.xSpeed;
            if (this.x < this.xTarget)//if it is to the left of the target
            {
                this.xSpeed += this.acceleration;
            }
            else if (this.x > this.xTarget)//if it is to the right of its target
            {
                this.xSpeed -= this.acceleration;
            }
            this.y += this.ySpeed;
            if (this.y < this.yTarget)//if below target
            {
                this.ySpeed += this.acceleration;
            }
            else if (this.y > this.ySpeed)//if above target
            {
                this.ySpeed -= this.acceleration;
            }
            //speed decay
            this.xSpeed *= .99;
            this.ySpeed *= .99;
        }
        ellipse(this.x, this.y, 10, 10)
    }
}

function setup()
{
    createCanvas(windowWidth, windowHeight);
    screenMiddleX = windowWidth / 2;
    maxRange = windowHeight * 2 / 3;
    spacing = maxRange / maxRangeNumber;
    acceleration = spacing / 5;
    for (i=0; i < maxRangeNumber; i++)
    {
        var newSegment = new segment;
        newSegment.setup(i);
        allSegments.push(newSegment)
    }
}

function draw()
{
    background(100)
    for (i=0; i < allSegments.length; i++)
    {
        allSegments[i].update(mouseX, mouseY);
    }
}