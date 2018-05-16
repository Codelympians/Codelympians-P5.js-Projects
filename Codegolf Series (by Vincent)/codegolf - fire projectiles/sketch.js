function setup(){createCanvas(500,500)}
var p=[];class P {
    constructor(x,y){this.x = x;this.y = y;}
    u(){ellipse(this.x, this.y, 20, 20);this.x += 10;}
}
function draw(){background(255);for(i of p){i.u()}}
function mousePressed(){p.push(new P(mouseX,mouseY))}