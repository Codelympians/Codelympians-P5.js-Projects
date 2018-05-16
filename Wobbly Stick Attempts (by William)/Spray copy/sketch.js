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
        this.maxRange = 25;
        this.space = 20;
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
        if (this.direction === "up")
        {
            this.x = this.x
        }
        this.y -= this.ySpeed;
        fill(0)
        ellipse(this.x, this.y, 100, 100)
        if (this.range == 7)
        {
            fill(255)
            if (this.direction == "right")
            {
                ellipse(this.x - this.xSpeed, this.y - this.ySpeed, 10, 10)
            }
            if (this.direction == "left")
            {
                ellipse(this.x + this.xSpeed, this.y - this.ySpeed, 10, 10)
            }
        }

    }
}

function newSegment()
{
    var newSegment = new segment;
    newSegment.setup();
    allSegments.push(newSegment)

}

function setup()
{
    createCanvas(windowWidth, windowHeight)
    screenMiddleX = windowWidth/2
    screenMiddleY = windowHeight
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
    newSegment();
    for(i = 0; i < allSegments.length; i++)
        {
            allSegments[i].update();
    
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