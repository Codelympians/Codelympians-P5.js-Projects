/*
This is a simple shooter that demonstrates some of the things that JavaScript and p5.js
can do. If you have trouble understanding the code, be sure to check out "arrays",
"objects", and "classes" in CodeAcademy.
*/

var scene = "start";
var shipX = window.innerWidth/2;
var shipY = window.innerHeight - window.innerHeight/8;
var left = false, right = false;
var allBullets = [];
var allEnemies = [];
var enemyCount = 0;
var level = 1;
var killCount = 0;
var addLevel = false;
var health = 10;
var killEnemy = false;

class Bullet
{
	constructor (xPos, yPos)
	{

		this.x = xPos;
		this.y = yPos;

		this.width = 10;
		this.height = 10;
	}

	draw()
	{
		fill(255);
		rect(this.x, this.y, this.width, this.height);
	}

	collision(enemy)
	{
		if (this.y < enemy.y + enemy.height && this.x < enemy.x + enemy.width
		&& this.x + this.width > enemy.x && this.y + this.height > enemy.y)
		{
			return true
		}
		else return false;
	}
}

class Enemy
{
	constructor(xPos, yPos)
	{
		this.x = xPos;
		this.y = yPos;

		this.width = 30;
		this.height = 30;
		this.red = random() * 255 + 50;
		this.green = random() * 255 + 50;
		this.blue = random() * 255 + 50;
	}
	
	draw()
	{
		fill(this.red, this.green, this.blue);
		rect(this.x, this.y, this.width, this.height);
	}
}

function setup()
{
	createCanvas(window.innerWidth, window.innerHeight);
}

function draw()
{
	background(0);

	if (scene == "start")
	{
		fill(255);
		textSize(64);
		textAlign(CENTER);
		text("Welcome to square shooter.\nWASD to move.\nSpace to shoot.\nPress ENTER to start.", 
		window.innerWidth/2, window.innerHeight/3);
	}

	if (scene == "game")
	{
		fill(255);
		rect(shipX, shipY, 50, 10);

		textSize(24);
		textAlign(LEFT);
		text("Health: " + health + "\n" + "Level: " + level, 
		window.innerWidth/15, window.innerHeight/8);

		if (left && shipX >= 5)
		{
			shipX -= 5;
		}

		if (right && shipX + 55 <= window.innerWidth)
		{
			shipX += 5;
		}

		if (enemyCount < level)
		{
			var newEnemy = new Enemy(random() * (window.innerWidth - 40) + 10, -20);
			allEnemies.push(newEnemy);
			enemyCount++;
		}
		
		for (var i = 0; i < allBullets.length; i++)
		{
			allBullets[i].draw();
			allBullets[i].y -= 5;
			
			for (var j = 0; j < allEnemies.length; j++)
			{				
				if (allBullets[i].collision(allEnemies[j]))
				{
					enemyCount -= 1;
					killCount++;

					if (killCount != 0 && killCount % 5 == 0)
					{
						level++;
					}

					allEnemies.splice(j, 1);
				}
				
			}
			
			if (allBullets[i].y < 0)
			{
				allBullets.splice(i, 1);
			}			
		}

		for (var i = 0; i < allEnemies.length; i++)
		{
			allEnemies[i].y += 1;
			allEnemies[i].draw();
		
			if (allEnemies[i].y + 20 > window.innerHeight)
			{
				killEnemy = true;

			}

			if (allEnemies[i].x < shipX + 50
				&& allEnemies[i].x + allEnemies[i].width > shipX
			&& allEnemies[i].y + allEnemies[i].height > shipY)
			{
				killEnemy = true;
			}

			if (killEnemy)
			{
				allEnemies.splice(i, 1);
				enemyCount -= 1;
				health -= 1;
				killEnemy = false;
			}
		}		
	
		if (health == 0)
		{
			scene = "dead";
		}
	}

	if (scene == "dead")
	{
		fill(255);
		textSize(32);
		textAlign(CENTER);
		text("You died.\nLevel: " + level
		+ "\nPress ENTER to start again",
		window.innerWidth/2, window.innerHeight/3);
	}
}

function keyPressed()
{
	if (keyCode == 65)
	{
		left = true;
	}
		
	if (keyCode == 68)
	{
		right = true;
	}	
}

function keyReleased()
{
	if (keyCode == 13)
	{
		if (scene == "start")
		{
			scene = "game";
		}

		if (scene == "dead")
		{
			scene = "game";
		}
	}

	if (scene == "game" && keyCode == 32)
	{
		var newBullet = new Bullet(shipX + 15, shipY - 10);
		allBullets.push(newBullet);
	}

	if (keyCode == 65)
	{
		left = false;
	}

	if (keyCode == 68)
	{
		right = false;
	}
}