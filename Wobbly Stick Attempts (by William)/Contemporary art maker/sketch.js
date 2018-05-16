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
        this.xPrevious = screenMiddleX;
        this.yPrevious = windowHeight;
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
            this.xDiff = sqrt(sq(mouseX - screenMiddleX))
            this.yDiff = sqrt(sq(mouseY - windowHeight))

            angle = Math.atan2(windowHeight - Ymouse, screenMiddleX - Xmouse)
            this.xTarget = screenMiddleX - (this.xDiff / maxRange * this.rangeNumber * Math.cos(angle)) //(this.space * this.rangeNumber * Math.cos(angle))
            this.yTarget = windowHeight -  (this.yDiff / maxRange * this.rangeNumber * Math.sin(angle))//(this.space * this.rangeNumber * Math.sin(angle))

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
        //strokeWeight(5)
        line(this.xPrevious, this.yPrevious, this.x, this.y)
    }
}

function setup()
{
    createCanvas(windowWidth, windowHeight);
    screenMiddleX = windowWidth / 2;
    maxRange = windowHeight * 2 / 3;
    spacing = 1;//maxRange / maxRangeNumber;
    acceleration = spacing / 5;
    for (i = 0; i < maxRangeNumber; i++)
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
        if (i > 0)
        {
            allSegments[i].xPrevious = allSegments[i - 1].x;
            allSegments[i].yPrevious = allSegments[i - 1].y;
        }
    }
}