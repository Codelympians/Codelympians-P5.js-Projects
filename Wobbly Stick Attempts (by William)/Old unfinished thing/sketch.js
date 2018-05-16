var allSegments = [];
var originalXSpeed = 0;
var originalYSpeed = 10;
var screenMiddleX = 0;
var screenMiddleY = 0;
var maxRange = 100;

function segment()
{
    this.setup = function(range)
    {
        this.range = range;//the number that a circle is in line
        this.space = 1;
        this.xSpeed = -10;
        this.ySpeed = -10;
        this.acceleration = 0.1;

        this.xTarget = screenMiddleX
        this.yTarget = windowHeight - this.range * this.space
        this.y = this.yTarget;
        this.x = this.xTarget;
        
    }
    this.update = function(pinned)
    {
        this.xDifference = this.x - mouseX;
        this.yDifference = this.y - mouseY;

        if (!pinned) 
        {
            //movement
            this.xTarget = this.range * ((this.space * this.xDifference) / sqrt(sq(this.xDifference) + sq(this.yDifference)));
            this.yTarget = this.range * ((this.space * this.yDifference) / sqrt(sq(this.xDifference) + sq(this.yDifference)));
            if (this.x > this.xTarget)
            {
                this.xSpeed -= this.acceleration;
            }
            if (this.x < this.xTarget)
            {
                this.xSpeed += this.acceleration;
            }
            if (this.y > this.yTarget)
            {
                this.ySpeed -= this.acceleration;
            }
            if (this.y < this.yTarget)
            {
                this.ySpeed += this.acceleration;
            }
            /*if (this.x < 0)
            {
                this.x = windowWidth
            }
            if (this.y < 0)
            {
                this.y = windowHeight
            }*/
            this.x += this.xSpeed;
            this.y += this.ySpeed;
        }
        fill(0)
        ellipse(this.x, this.y, 10, 10)
        if (this.range = 8)
        {
            console.log(this.xTarget, this.yTarget)
        }
    }
}

function newSegment(number)
{
    var newSegment = new segment;
    newSegment.setup(number);
    allSegments.push(newSegment)

}
function segments()
{
    for(i = 0; i < maxRange; i++)
    {
        newSegment(i);
    }
}
function setup()
{
    createCanvas(windowWidth, windowHeight);
    screenMiddleX = windowWidth/2;
    screenMiddleY = windowHeight;
    segments();
}

function draw()
{    
    background(240);
    allSegments[0].update(true);
    for(var i = 1; i < allSegments.length; i++)
        {
            allSegments[i].update(false);
        }
}

function windowResized()
{
    createCanvas(windowWidth, windowHeight)
    screenMiddleX = windowWidth/2
    screenMiddleY = windowHeight
}