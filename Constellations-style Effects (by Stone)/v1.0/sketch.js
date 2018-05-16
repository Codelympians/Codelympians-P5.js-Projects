var n = parseInt(prompt("How many objects?"))
var astroids = [];

var border = 1;
var friction = 0;
var speed  = 0.5;

function setup() {
    createCanvas(1200, 600);
    for (var i=0;i<n;i++){
        astroids[i] = new Astroid(random(width), random(height),random(1,14));
    }
    img = loadImage("assets/Gradient Background.jpg");
    
    
}


function draw(){
    image(img, 0, 0);
    /*for (var i=0;i<8;i++){
        line(xgrid[i],0,xgrid[i],600)
        line(0,ygrid[i],1200,ygrid[i])
    }*/ 
    //The above is for the cells
    
    //tells me what cell its in
   
    for (var i=0;i<n;i++){
        astroids[i].display();
        astroids[i].comeback();
        astroids[i].update();
        astroids[i].mouseConstellate();
        astroids[i].constellate();
        //astroids[i].cell();
 
        
        
    }

}

function Astroid(x,y,s){
    this.velocityx = random(-speed,speed);
    this.velocityy = random(-speed,speed);
    this.pos = createVector(x,y);
    this.display = function() {
        fill(255,255,255,180);
        noStroke();
        ellipse(this.pos.x, this.pos.y, s, s);
    }
    this.update = function(){

        this.pos = this.pos.add(this.velocityx,this.velocityy)
    }


    this.comeback = function() {
        //open borders
        if (border == 1){
 
                if (this.pos.x > width + 200 ){
                    this.pos.x = -200
  
                }
                if (this.pos.x < -200){
                    this.pos.x = width+200
                }
                if (this.pos.y > height + 200){
                    this.pos.y = -200
                }
                if (this.pos.y < - 200){
                    this.pos.y = height+200
                }
        }
    }
  
    this.mouseConstellate = function(){
        diffx = mouseX - this.pos.x
        diffy = mouseY - this.pos.y
        if (sqrt(pow(diffx,2) + pow(diffy,2)) <= 400){
           
            strokeWeight(1);
            stroke(255, 255, 255, 180-1*sqrt(pow(diffx,2) + pow(diffy,2)));
            line(this.pos.x, this.pos.y, mouseX, mouseY)
            line(mouseX, mouseY, this.pos.x, this.pos.y)
        }
        if (mouseIsPressed && sqrt(pow(diffx,2) + pow(diffy,2)) <= 200) {
            this.pos.x = this.pos.x + this.velocityx*50.5
            this.pos.y = this.pos.y + this.velocityy*50.5
            console.log("Hi")
        }
    }
    

    this.constellate = function(){
        
        for (var t=0;t<n;t++){
            if (sqrt(pow((astroids[t].pos.x - this.pos.x),2) + pow((astroids[t].pos.y - this.pos.y),2)) <= 400){
                stroke(255, 255, 255, 180-1*sqrt(pow((astroids[t].pos.x - this.pos.x),2) + pow((astroids[t].pos.y - this.pos.y),2)));
                line(this.pos.x, this.pos.y, astroids[t].pos.x, astroids[t].pos.y)
        
                

            }

        }

        

        
    }
        
}

function mouseClicked(){
    return true;
}
