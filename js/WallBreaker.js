// getting a reference to our HTML element
const canvas = document.querySelector('canvas');

// initiating 2D context on it
const c = canvas.getContext('2d');
//var w = canvas.getContext("2d");
//const checkbox = $("#musicCheck");

var interval;
var boardInterval;
var x;// = 50;
var y;// = 180;
var w;
var h;
var color1;
var color2;
var color3;
var color4;
var color5;
var speedX = 1;
var speedY = -1;
var hits = 0;

var xWall = new Array(55);
var yWall = new Array(55);
var brick = new Array(55);
var brickX;
var brickY;
var brickW;
var brickH;
var impact = new Array(55);
//var sound;
var sound = document.getElementById("music");

var board;
var mouseX = 100;
var score = 0;

var ball;
var level = 1;
var speed = 15;
var count = 0;

var temp;

document.body.onload = init();
canvas.addEventListener('mousemove', mouseM, false);
//canvas.addEventListener('click', playing, false);

function init(){

	canvas.width = 600;
	canvas.height = 400;

	speed = 15;
	speedY = -1;
	speedX = 1;
	
	if(level == 1){
		count = 0;
		levelOne();
	}else if(level == 2){
		levelTwo();
	}else if(level == 3){
		levelThree();
	}else if(level == 4){
		levelFour();
	}else if(level == 5){
		levelFive();
	}

	ball = new object("black", (mouseX+50), 342, 7, 7);
	board = new gameBoard();

	for(var i = 0; i < 55; i++){
		impact[i]=false;
		if(i>-1 && i<11){
			brick[i] = new wall(color1, xWall[i], yWall[i], brickW, brickH, i);
		}
		if(i>10 && i<22){
			brick[i] = new wall(color2, xWall[i], yWall[i], brickW, brickH, i);
		}
		if(i>21 && i<33){
			brick[i] = new wall(color3, xWall[i], yWall[i], brickW, brickH, i);
		}
		if(i>32 && i<44){
			brick[i] = new wall(color4, xWall[i], yWall[i], brickW, brickH, i);
		}
		if(i>43 && i<55){
			brick[i] = new wall(color5, xWall[i], yWall[i], brickW, brickH, i);
		}
	}
	canvas.addEventListener('click', playing, false);
	updateGameArea();
	boardInterval = setInterval(updateBoard, speed);
}

function updateBoard(){
	clear();
	ball.pregame();
	board.update();
	output();
	for(var i = 0; i < 55; i++){
		brick[i].crash();
	}
}

function playing(){
	
	clearInterval(boardInterval);
	interval = setInterval(updateGameArea, speed);
	canvas.removeEventListener('click', playing);
}

function gameBoard(){
	this.update = function(){

		if (document.getElementById("musicCheck").checked) {
			//sound = document.getElementById("music");
			sound.play();
		}
		c.fillStyle = "black";
		if(x <= (mouseX+100) && (x+7) >= mouseX && (y+7) >= 350 && y <= 355){
			if((y+7) == 350){
				speedY = speedY * -1;
				if(x <= (mouseX+25)){
					speedX = -1;
				}else if(x >= (mouseX+75)){
					speedX = 1;
				}
			}
		}

		if(mouseX >= 500){
			c.fillRect(500, 350, 100, 10);
		}else if(mouseX <= 1){
			c.fillRect(0, 350, 100, 10);
		}else{
			c.fillRect(mouseX, 350, 100, 10);
		}
	}
}

function diff(){
	if(level < 3){
		if(score == 14 && speed == 15){
			speed -= 3;
			clearInterval(interval);
			interval = setInterval(updateGameArea, speed);
		}
		if(score == 29 && speed == 12){
			speed -= 3;
			clearInterval(interval);
			interval = setInterval(updateGameArea, speed);
		}
		if(score == 49 && speed == 9){
			speed -= 3;
			clearInterval(interval);
			interval = setInterval(updateGameArea, speed);
		}
	}
	else{
		if(score == 9 && speed == 15){
			speed -= 3;
			clearInterval(interval);
			interval = setInterval(updateGameArea, speed);
		}
		if(score == 19 && speed == 12){
			speed -= 3;
			clearInterval(interval);
			interval = setInterval(updateGameArea, speed);
		}
		if(score == 29 && speed == 9){
			speed -= 3;
			clearInterval(interval);
			interval = setInterval(updateGameArea, speed);
		}
		if(score == 39 && speed == 6){
			speed -= 3;
			clearInterval(interval);
			interval = setInterval(updateGameArea, speed);
		}
		if(score == 49 && speed == 3){
			speed -= 2;
			clearInterval(interval);
			interval = setInterval(updateGameArea, speed);
		}
	}
}

function mouseM(e){
	var rect = canvas.getBoundingClientRect();
	mouseX = e.pageX - (rect.left+50);
}

function wall(colorW, xBrick, yBrick, wBrick, hBrick, index){
	this.crash = function(){			
		if(x <= (xBrick+brickW) && (x+7) >=xBrick && (y+7) >= yBrick && y <= (yBrick+brickH)){
			if(hits == 0){
				c.fillStyle = colorW;
				c.fillRect(-50, -50, 40, 20);
				impact[index] = true;
				xWall[index] = -50;
				yWall[index] = -50;
			}else if (hits == 1){
				if(colorW == "purple"){
					//hits = hits - 1;
					c.fillStyle = colorW;
					c.fillRect(-50, -50, 40, 20);
					impact[index] = true;
					xWall[index] = -50;
					yWall[index] = -50;
				}
				c.fillStyle = "purple";
				colorW = "purple";
				c.fillRect(xBrick, yBrick, wBrick, hBrick);
				//hits = hits -1;
			}
			if(x == (xBrick+brickW) || (x+7) == xBrick){
				speedX = speedX * -1;
			}
			if((y+7) == yBrick || y == (yBrick+brickH)){
				speedY = speedY * -1;
			}
			xBrick = xWall[index];
			yBrick = yWall[index];
			
			output();
		}else if(!impact[index]){
			c.fillStyle = colorW;
			c.fillRect(xBrick, yBrick, wBrick, hBrick);
		}
	}
}

function checkWin(){
	for(var i = 0; i < 55; i++){
		if(xWall[i] !== -50 && yWall[i] !== -50){
			winner = false;
		}
	}
}

function object(colorOf, xValue, yValue, wValue, hValue){
	w = wValue;
	h = hValue;
	x = xValue;
	y = yValue;
	this.update = function(){
		c.fillStyle = colorOf;
		c.fillRect(x, y, w, h);
	}
	this.pregame = function(){
		c.fillStyle = colorOf;
		c.fillRect((mouseX+50), 342, w, h);
		x = mouseX+50;
		y = 342;
	}
}

function clear(){
	c.clearRect(0, 0, canvas.width, canvas.height);
}

function output(){
	/*if (document.getElementById("musicCheck").checked){
		soundEffects();		
	}*/
	diff();
	
	score = impact.filter(function(value){
    return value === true;
	}).length
	if(score == 55){
		stop();
	}
	if(speed == 15){
		temp = 10;
	}
	if(speed == 12){
		temp = 20;
	}
	if(speed == 9){
		temp = 30;
	}
	if(speed == 6){
		temp = 40;
	}
	if(speed == 3){
		temp = 50;
	}
	if(speed == 1){
		temp = "Max";
	}
	count = score;
	if(level==2){
		count += 55;
	}else if(level==3){
		count += 110;
	}else if(level==4){
		count += 165;
	}else if(level==5){
		count += 220;
	}
	document.getElementById("score").innerHTML = "Score: " + (count*15);
	document.getElementById("blocksLeft").innerHTML = "Blocks Left: " + (55 - score);
	document.getElementById("speed").innerHTML = "Speed: " + temp;
	document.getElementById("level").innerHTML = "Level: " + level;
	
}

function stop(){
	clearInterval(interval);
	sound.pause();
	sound.currentTime = 0;
	document.getElementById("musicCheck").checked = false;
	if(score==55){
		//count = score;
		winnerSound();
		if(level == 1){
			level = 2;
		}else if(level == 2){
			level = 3;
		}else if(level == 3){
			level = 4;
		}else if(level == 4){
			level = 5;
		}
		alert("You Win!");
	}else{
		loserSound();
		alert("You Lose!");
	}
	init();
}

function updateGameArea() {
	clear();
	//diff();
	x = x + speedX;
	y = y + speedY;
	if(x > 595 || x < 1){
		speedX = speedX * -1;
	}
	if(y < 1){
		speedY = speedY * -1;
	}
	if(y > 360){
		//checkWin();
		stop();
	}
	ball.update();
	board.update();
	//output();
	for(var i = 0; i < 55; i++){
		brick[i].crash();
	}
}

function levelOne(){
	var tempX = 50;
	brickH = 20;
	brickW = 40;
	color1 = "gold";
	color2 = "red";
	color3 = "green";
	color4 = "blue";
	color5 = "cyan";

	for(var i = 0; i < xWall.length; i++){
		if(i >=0 && i <= 10){
			xWall[i] = tempX;
			yWall[i] = 50;
			tempX += 45;
			if(i == 10){
				tempX = 50;
			}
		}else if(i > 10 && i <=21){
			xWall[i] = tempX;
			yWall[i] = 75;
			tempX += 45;
			if(i == 21){
				tempX = 50;
			}
		}else if(i > 21 && i <=32){
			xWall[i] = tempX;
			yWall[i] = 100;
			tempX += 45;
			if(i == 32){
				tempX = 50;
			}
		}else if(i > 32 && i <=43){
			xWall[i] = tempX;
			yWall[i] = 125;
			tempX += 45;
			if(i == 43){
				tempX = 50;
			}
		}else if(i > 43 && i <=55){
			xWall[i] = tempX;
			yWall[i] = 150;
			tempX += 45;
		}
	}
}
function levelTwo(){
	var tempX = 5;
	brickH = 30;
	brickW = 49;
	color1 = "Aquamarine";
	color2 = "BurlyWood";
	color3 = "gold";
	color4 = "BurlyWood";
	color5 = "Aquamarine";

	for(var i = 0; i < xWall.length; i++){
		if(i >=0 && i <= 10){
			xWall[i] = tempX;
			yWall[i] = 50;
			tempX += 54;
			if(i == 10){
				tempX = 5;
			}
		}else if(i > 10 && i <=21){
			xWall[i] = tempX;
			yWall[i] = 85;
			tempX += 54;
			if(i == 21){
				tempX = 5;
			}
		}else if(i > 21 && i <=32){
			xWall[i] = tempX;
			yWall[i] = 120;
			tempX += 54;
			if(i == 32){
				tempX = 5;
			}
		}else if(i > 32 && i <=43){
			xWall[i] = tempX;
			yWall[i] = 155;
			tempX += 54;
			if(i == 43){
				tempX = 5;
			}
		}else if(i > 43 && i <=55){
			xWall[i] = tempX;
			yWall[i] = 190;
			tempX += 54;
		}
	}
}

function levelThree(){
	var tempX = 5;
	brickH = 30;
	brickW = 49;
	color1 = "blue";
	color2 = "green";
	color3 = "yellow";
	color4 = "orange";
	color5 = "red";
	hits = 1;

	for(var i = 0; i < xWall.length; i++){
		if(i >=0 && i <= 10){
			xWall[i] = tempX;
			yWall[i] = 50;
			tempX += 54;
			if(i == 10){
				tempX = 5;
			}
		}else if(i > 10 && i <=21){
			xWall[i] = tempX;
			yWall[i] = 85;
			tempX += 54;
			if(i == 21){
				tempX = 5;
			}
		}else if(i > 21 && i <=32){
			xWall[i] = tempX;
			yWall[i] = 120;
			tempX += 54;
			if(i == 32){
				tempX = 5;
			}
		}else if(i > 32 && i <=43){
			xWall[i] = tempX;
			yWall[i] = 155;
			tempX += 54;
			if(i == 43){
				tempX = 5;
			}
		}else if(i > 43 && i <=55){
			xWall[i] = tempX;
			yWall[i] = 190;
			tempX += 54;
		}
	}
}

function levelFour(){
	var tempX = 10;
	brickH = 30;
	brickW = 49;
	color1 = "LightGreen";
	color2 = "MediumSpringGreen";
	color3 = "SpringGreen";
	color4 = "MediumSeaGreen";
	color5 = "SeaGreen";
	hits = 1;
	speed = 15;

	for(var i = 0; i < xWall.length; i++){
		if(i >=0 && i <= 10){
			xWall[i] = tempX;
			yWall[i] = 50;
			tempX += 53;
			if(i == 10){
				tempX = 10;
			}
		}else if(i > 10 && i <=21){
			xWall[i] = tempX;
			yWall[i] = 85;
			tempX += 53;
			if(i == 21){
				tempX = 10;
			}
		}else if(i > 21 && i <=32){
			xWall[i] = tempX;
			yWall[i] = 120;
			tempX += 53;
			if(i == 32){
				tempX = 10;
			}
		}else if(i > 32 && i <=43){
			xWall[i] = tempX;
			yWall[i] = 155;
			tempX += 53;
			if(i == 43){
				tempX = 10;
			}
		}else if(i > 43 && i <=55){
			xWall[i] = tempX;
			yWall[i] = 190;
			tempX += 53;
		}
	}
}

function levelFive(){
	var tempX = 10;
	brickH = 50;
	brickW = 49;
	color1 = "Orange";
	color2 = "DarkOrange";
	color3 = "Coral";
	color4 = "Tomato";
	color5 = "OrangeRed";
	hits = 1;
	speed = 15;

	for(var i = 0; i < xWall.length; i++){
		if(i >=0 && i <= 10){
			xWall[i] = tempX;
			yWall[i] = 20;
			tempX += 53;
			if(i == 10){
				tempX = 10;
			}
		}else if(i > 10 && i <=21){
			xWall[i] = tempX;
			yWall[i] = 72;
			tempX += 53;
			if(i == 21){
				tempX = 10;
			}
		}else if(i > 21 && i <=32){
			xWall[i] = tempX;
			yWall[i] = 124;
			tempX += 53;
			if(i == 32){
				tempX = 10;
			}
		}else if(i > 32 && i <=43){
			xWall[i] = tempX;
			yWall[i] = 176;
			tempX += 53;
			if(i == 43){
				tempX = 10;
			}
		}else if(i > 43 && i <=55){
			xWall[i] = tempX;
			yWall[i] = 228;
			tempX += 53;
		}
	}
}

function soundEffects(){
	var x = document.getElementById("soundEffect");
	x.play();
}
function winnerSound(){
    var x = document.getElementById("winner");
    x.play();
}
function loserSound(){
    var x = document.getElementById("loser");
    x.play();
}
