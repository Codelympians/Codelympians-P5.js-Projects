function setup(){
    createCanvas(250,250)
}
var c=[]
function draw(){
    fill(c[0],c[1],c[2]);
    rect(0,0,250,250)
}
function r(){
    return random()*255
}
function mousePressed(){
    c[0]=r();
    c[1]=r();
    c[2]=r()
}