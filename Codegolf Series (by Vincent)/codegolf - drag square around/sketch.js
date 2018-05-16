function setup(){createCanvas(500,500)}
var p=[0,0]
function draw(){background(255);fill(0);rect(p[0],p[1],100,100)}
function mouseDragged(){if(p[0]<mouseX&&p[0]+100>mouseX&&p[1]<mouseY&&p[1]+100>mouseY){
    p[0]=mouseX-50
    p[1]=mouseY-50
}}