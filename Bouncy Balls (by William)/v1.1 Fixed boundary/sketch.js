var gravity = 2;
theWidth = 1400;
theHeight = 500;
function bouncyBall(x, y, xSpeed, xDiameter, yDiameter)
{
    this.setup = function()
    {
        this.x = x;
        this.y = y;
        this.gravity = gravity;
        this.ySpeed = gravity;
        this.xSpeed = xSpeed;
        this.xDiameter = xDiameter;
        this.yDiameter = yDiameter;
        this.xRadius = this.xDiameter / 2;
        this.yRadius = this.yDiameter / 2;
        this.topBoundary = 0 + this.yRadius;
        this.leftBoundary = 0 + this.xRadius;
        this.rightBoundary = theWidth - this.xRadius;
        this.bottonBoundary = theHeight - this.yRadius;
    }
    this.update = function()
    {
        if (this.y >= this.topBoundary && this.y <= this.bottonBoundary) {
            this.ySpeed += this.gravity;
        }
        this.ySpeed *= 1 - 0.01;
        this.xSpeed *= 1 - 0.01;

        this.y += this.ySpeed;
        this.x += this.xSpeed;
        fill(200, 0, 0);
        ellipse(this.x, this.y, this.xDiameter, this.yDiameter);
        if (this.xSpeed < .01 && this.xSpeed > 0)//if the x speed if really small/irrelevant, speed is 0 to prevent vibrations
        {
            this.xSpeed = 0;
        }

        if ((this.y >= this.bottonBoundary && this.ySpeed > 0) | (this.y <= this.topBoundary && this.ySpeed < 0))
        {
            this.ySpeed = -this.ySpeed;
        } else {
        }
        if ((this.x >= this.rightBoundary && this.xSpeed > 0) | (this.x <= this.leftBoundary && this.xSpeed < 0))
        {
            this.xSpeed = -this.xSpeed;
        }
        
    }
}
var newBall = new bouncyBall(20, 120, 5, 20, 20);
function setup()
{
    createCanvas(theWidth, theHeight);
    newBall.setup();
}

function draw()
{    
    background(100);
    newBall.update();
}
