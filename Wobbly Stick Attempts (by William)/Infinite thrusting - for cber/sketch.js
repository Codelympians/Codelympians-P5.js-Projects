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
        this.y = screenMiddleY;
        this.x = screenMiddleX;
        this.range = range;//the number that a circle is in line
        this.space = 1;
        if (mouseX < this.x)//big - small
        {
            this.xDifference = mouseX - this.x;
            this.direction = "left";
        }
        else if (mouseX > this.x)
        {
            this.xDifference = this.x - mouseX;
            this.direction = "right";
        }
        else 
        {
            this.xDifference = 1;
            this.direction = "up";
        }
        this.yDifference = this.y - mouseY;
        this.xSpeed = 0;
        this.ySpeed = 0;
        this.acceleration = 10;
        
    }
    this.update = function()
    {
        //movement
        this.xTarget = this.range * (this.space * this.xDifference) / sqrt(sq(this.xDifference) + sq(this.yDifference));
        this.yTarget = this.range * (this.space * this.yDifference) / sqrt(sq(this.xDifference) + sq(this.yDifference));
        if (this.x > this.xTarget)
        {
            this.xSpeed -= this.acceleration;
        }
        if (this.x < this.xTarget)
        {
            this.xSpeed += this.acceleration;
        }
        this.x += this.xSpeed;
        this.y += this.ySpeed;
        fill(0)
        ellipse(this.x, this.y, 100, 100)
        if (this.range == 70)
        {
            fill(255)
            if (this.direction == "right")
            {
                ellipse(this.x, this.y - this.ySpeed, 10, 10)
            }
            if (this.direction == "left")
            {
                ellipse(this.x, this.y - this.ySpeed, 10, 10)
            }
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
/*function newSegment()
{
    
    for(i = 0; i < allSegments.length; i++)
    {
        allSegments.update();

        if (allSegments[i].range >= allSegments[i].maxRange)
        {
            allSegments.splice(i,1)
        }
    }
}
*/
function draw()
{    
    background(240);
    for(i = 0; i < allSegments.length; i++)
        {
            allSegments[i].update();
            //if (sqrt( sq(allSegments[i + 1].x - allSegments[i].x) + sq(allSegments[i + 1].y - allSegments[i].y) ) > allSegments[i].space)
            //{
            //allSegments[i].x = allSegments[i - 1]/2
            //allSegments[i].y = (allSegments[i - 1] + allSegments[i].space)/2
            //}
            if (allSegments[i].range >= allSegments[i].maxRange)
            {
                allSegments.splice(i,1)
            }
        }
}
function windowResized()
{
    createCanvas(windowWidth, windowHeight)
    screenMiddleX = windowWidth/2
    screenMiddleY = windowHeight
}