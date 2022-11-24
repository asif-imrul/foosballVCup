//Selecting teams
var teams =["Brazil","Belgium","Argentina","France","England","Spain","Netherlands","Portugal","Germany","India","Bangladesh"];
var color =["#E8E337","#C0392B","#4ADEDE","#212F3D","#2874A6","#A93226","#D35400","#7B241C","#797D7F","#1B4F72","#145A32"];
var difficulty_speed=[3.5,3.3,3.2,3.0,2.7,2.5,2.3,2.4,2.1,1.2,1.0];
var homeTeam = 'Brazil';
var awayTeam = 'Argentina';

//sounds
function sound(src) {
	this.sound = document.createElement("audio");
	this.sound.src = src;
	this.sound.setAttribute("preload", "auto");
	this.sound.setAttribute("controls", "none");
	this.sound.style.display = "none";
	document.body.appendChild(this.sound);
	this.play = function(){
		this.sound.play();
	}
	this.stop = function(){
		this.sound.pause();
	}    
}
			
var goalSound_1 = new sound("sound/kick.mp3");
var crowdSound_1 = new sound("sound/kick.mp3");
var gameOverSound_1 = new sound("sound/kick.mp3");
var kickSound_1 = new sound("sound/kick.mp3");
var startSound_1 = new sound("sound/kick.mp3");
var cheersSound_1 = new sound("sound/kick.mp3");

//Sound effect
//secondary sound
function goalSound(){
	goalSound_1 = new sound("sound/goal.mp3");
	goalSound_1.play();
	goalSound_1.volume = 2;
	goalSound_1.loop = false;
}

function kickSound(){
	kickSound_1 = new sound("sound/kick.mp3");
	kickSound_1.play();
	kickSound_1.loop = false;
}

function cheersSound(){
	cheersSound_1 = new sound("sound/cheers.mp3");
	cheersSound_1.play();
	cheersSound_1.loop = false;
}

//Primary sound
function crowdSound(){
	crowdSound_1 = new sound("sound/crowd.mp3");
	crowdSound_1.play();
	crowdSound_1.volume = 0.3;
	gameOverSound_1.stop();
	startSound_1.stop();
}

function gameOverSound(){
	gameOverSound_1 = new sound("sound/gameover.mp3");
	gameOverSound_1.play();
	crowdSound_1.stop();
	startSound_1.stop();
}

function startSound(){
	var rndInt = Math.floor(Math.random() * 3) + 1;
	if (rndInt == 1)
		startSound_1 = new sound("sound/start_1.mp3");
	else if (rndInt == 2)
		startSound_1 = new sound("sound/start_2.mp3");
	else (rndInt == 3)
		startSound_1 = new sound("sound/start_3.mp3");
	startSound_1.play();
	gameOverSound_1.stop();
	crowdSound_1.stop();
}

var message = "";
//build canvas
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

//set initial ball location
var x = canvas.width/2;
var y = canvas.height/2;

//set ball radius
var ballRadius = 10;

//set ball speed
var dx = 4;
var dy = -4;

//initialize ball speed
var m = 0;
var j = 0;

var aiSpeed = 1.25;

//set paddle dimensions
var paddleHeight = 10;
var paddleWidth = 50;

var paddleX = (canvas.width-paddleWidth);

//initialize keypress status
var rightPressed = false;
var leftPressed = false;  

//set goalpost dimensions
var goalpostWidth = 180;
var goalpostHeight = 10;

//initialize scorecard
var homeScore = 0;
var awayScore = 0;

//set player dimensions
var playerHeight = 100;
var playerWidth = 80;


//set flags
var initFlag = true;
var gameOver = false;
var flag1 = 1;
var flag2 = 1;
var drawFlag = true;

//register for keypress events
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);


//initialize SAT.js variables
var V = SAT.Vector;
var C = SAT.Circle;
var B = SAT.Box;

var circle;
var box;

var manager_name = 'XXXX';

//initialize images
var homePlayer = new Image();
var awayPlayer = new Image();

//Team selection
function getOption() {
        selectElement1 = document.querySelector('#select1');
        output1 = selectElement1.options[selectElement1.selectedIndex].value
        selectElement2 = document.querySelector('#select2');
        output2 = selectElement2.options[selectElement2.selectedIndex].value;
		homeTeam = teams[output1];
		awayTeam = teams[output2];
		document.getElementById('homefont').style['color']=color[output1];
		document.getElementById('awayfont').style['color']=color[output2];
		aiSpeed = difficulty_speed[output2];
    }

// make the teams ready
function introdone() {
    removeStatus();
    startSound();
    manager_name = document.getElementById("manager_name").value;
    document.getElementById('introScreen').style['z-index'] = '-2';
    document.getElementById('startScreen').style['display']='block';
    
}

//Credit flashes
function creditFlash(){
	removeStatus();
	var showing = document.getElementById('foot').style['display'];
	if (showing == 'block'){
		document.getElementById('foot').style['display'] = 'none';
	}
	else{
		document.getElementById('foot').style['display'] = 'block';
	}
}

//it all starts here
function init() {
    removeStatus();
	getOption();
	crowdSound();
    homePlayer.src = 'img/'+homeTeam+'.png';
    awayPlayer.src = 'img/'+awayTeam+'.png';
    document.getElementById('startScreen').style['z-index'] = '-1';
    document.getElementById('gameOverScreen').style['z-index'] = '-1';
    document.getElementById('gameScreen').style['display']='block';
    document.getElementById('home').innerHTML = '0';
    document.getElementById('away').innerHTML = '0';
	document.getElementById('homeTeam').innerHTML = homeTeam;
	document.getElementById('awayTeam').innerHTML = awayTeam;
    awayScore = 0;
    homeScore = 0;
    gameOver = 0;
    setInitialDelay();
}


	
//it all ends here
function exit() {
	document.getElementById('status').innerHTML = '';
    document.getElementById('startScreen').style['z-index'] = '2';
    document.getElementById('gameOverScreen').style['z-index'] = '-1';
}

function setInitialDelay() {
    setTimeout(function() {
        startTimer(60 * 2);//Set timer here
        drawFlag = true;
        window.requestAnimationFrame(draw);
        var message1 = homeTeam
		var message2 = awayTeam
		var message3 = new Date()
		message = message1.concat(" vs ", message2, "<br/>", message3);
        updateStatus(message);
		
    }, 1500);
	setTimeout(function() {
        document.getElementById('status').innerHTML = '';
    }, 3500);
}

function setDelay() {
    setTimeout(function() {
        drawFlag = true;
        window.requestAnimationFrame(draw);
    }, 1500);
}

function startTimer(duration) {
    var timer = duration,
        minutes, seconds;
    countdown = setInterval(function() {
        minutes = parseInt(timer / 60, 10)
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        document.getElementById('countdown').innerHTML = minutes + ":" + seconds;
		if (minutes ==0){
			cheersSound();
		}
		if (minutes ==0 && seconds == 45){
			cheersSound_1.stop();
		}
        if (--timer < 0) {
    	    document.getElementById('gameOverScreen').style['display']='block';
            document.getElementById('gameOverScreen').style['z-index'] = 3;
			//document.getElementById('gameOverScreen').style['background-image'= url('../img/splash.png');
            
            gameOver = true;
			gameOverSound();
            clearInterval(countdown);
			if (homeScore > awayScore){
				var message1 = 'GAME OVER!<br>'
				var message2 = ' Won!!'
				message = message1.concat(homeTeam," ", message2);
				updateStatus(message);
			}
            else if (awayScore > homeScore){
				var message1 = 'GAME OVER!<br>'
				var message2 = ' Won!!'
				message = message1.concat(awayTeam," ", message2);
				updateStatus(message);
			}
            else
                updateStatus('GAME OVER!<br>Draw!')
        }
    }, 1000);
}

//it all happens here
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPlayers();
    drawGoalPost();
    x += dx;
    y += dy;
    if (rightPressed && paddleX * 3 / 4 + m < canvas.width - paddleWidth) {
        m += 2;
    } else if (leftPressed && paddleX / 4 + m > 0) {
        m -= 2;
    }
    if (drawFlag && !gameOver)
        window.requestAnimationFrame(draw);
}


function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.closePath();
    circle = new C(new V(x, y), 6);
    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
            dx = -dx;
            if(x<0)
                x=0;
            if(x>canvas.width)
                x = canvas.width; 
    }
    if (y + dy > canvas.height - ballRadius || y + dy < ballRadius) {
        dy = -dy;
    }

}

function drawPlayers() {
    drawHomeTeam();
    drawAwayTeam();
    
}

function drawHomeTeam() {
    //home
    drawGoalkeeper();
    drawDefenders();
    drawMidfielders();
    drawStrikers();
}

function drawAwayTeam() {
    //away
    drawAwayGoalkeeper();
    drawAwayDefenders();
    drawAwayMidfielders();
    drawAwayStrikers();
}

function drawGoalPost() {

    //home
    ctx.beginPath();
    var gphX = (canvas.width - goalpostWidth) / 2;
    var gphY = canvas.height - goalpostHeight;
    ctx.rect(gphX, gphY, goalpostWidth, goalpostHeight);
    ctx.fillStyle = "#9C9C9C";
    ctx.fill();
    ctx.closePath();
    box = new B(new V(gphX, gphY), goalpostWidth, goalpostHeight).toPolygon();
    if (goalDetection(box)) {
        updateScore('home');
		
		var message1 = 'GOAL!<br>'
		var message2 = ' Score!'
		message = message1.concat(awayTeam," ", message2);
		goalSound();
        updateStatus(message);
		
        removeStatus();
        resetBall();
        setDelay();
    }
    //away
    ctx.beginPath();
    var gpaX = (canvas.width - goalpostWidth) / 2;
    var gpaY = paddleHeight - goalpostHeight;
    ctx.rect(gpaX, gpaY, goalpostWidth, goalpostHeight);
    ctx.fillStyle = "#9C9C9C";
    ctx.fill();
    ctx.closePath();

    box = new B(new V(gpaX, gpaY), goalpostWidth, goalpostHeight).toPolygon();
    if (goalDetection(box)) {
        updateScore('away');
		
		var message1 = 'GOAL!<br>'
		var message2 = ' Score!'
		message = message1.concat(homeTeam," ", message2);
		goalSound();
        updateStatus(message);
		
        removeStatus();
        resetBall();
        setDelay();
    }
}


function updateScore(goal) {

    if (goal === 'home') {
        awayScore += 1;
        document.getElementById('away').innerHTML = awayScore;
    } else {
        homeScore += 1;
        document.getElementById('home').innerHTML = homeScore;
    }
}

function resetBall() {
    x = canvas.width / 2;
    y = canvas.height / 2;
    drawBall();
    drawFlag = false;
    window.requestAnimationFrame(draw);

}

function updateStatus(message) {
    document.getElementById('status').innerHTML = message;

}

function removeStatus() {
    setTimeout(function() {
        document.getElementById('status').innerHTML = '';
    }, 1500);
}



function drawGoalkeeper() {

    var gkX = paddleX / 2 + m;
    var gkY = canvas.height * 7 / 8 - paddleHeight;
    ctx.drawImage(homePlayer, gkX, gkY - 15, playerWidth, playerHeight);
    drawRods(gkY);
    box = new B(new V(gkX, gkY), playerWidth, paddleHeight).toPolygon();
    collisionDetection(box, gkX);

}


function drawDefenders() {

    var lcbX = paddleX / 4 + m;
    var lcbY = canvas.height * 13 / 16 - paddleHeight;
    drawRods(lcbY);
    ctx.drawImage(homePlayer, lcbX, lcbY - 15, playerWidth, playerHeight);
    box = new B(new V(lcbX, lcbY), playerWidth, paddleHeight).toPolygon();
    collisionDetection(box, lcbX);

    var rcbX = paddleX * 3 / 4 + m;
    var rcbY = canvas.height * 13 / 16 - paddleHeight;
    ctx.drawImage(homePlayer, rcbX, rcbY - 15, playerWidth, playerHeight);
    box = new B(new V(rcbX, rcbY), playerWidth, paddleHeight).toPolygon();
    collisionDetection(box, rcbX);
}

function drawMidfielders() {

    //midfielders
    var lwbX = paddleX * 1 / 8 + m;
    var lwbY = canvas.height * 5 / 8 - paddleHeight;
    drawRods(lwbY);
    ctx.drawImage(homePlayer, lwbX, lwbY - 15, playerWidth, playerHeight);
    box = new B(new V(lwbX, lwbY), playerWidth, paddleHeight).toPolygon();
    collisionDetection(box, lwbX);

    var lcmX = paddleX * 3 / 8 + m;
    var lcmY = canvas.height * 5 / 8 - paddleHeight;
    ctx.drawImage(homePlayer, lcmX, lcmY - 15, playerWidth, playerHeight);
    box = new B(new V(lcmX, lcmY), playerWidth, paddleHeight).toPolygon();
    collisionDetection(box, lcmX);

    var rcmX = paddleX * 5 / 8 + m;
    var rcmY = canvas.height * 5 / 8 - paddleHeight;
    ctx.drawImage(homePlayer, rcmX, rcmY - 15, playerWidth, playerHeight);
    box = new B(new V(rcmX, rcmY), playerWidth, paddleHeight).toPolygon();
    collisionDetection(box, rcmX);

    var rwbX = paddleX * 7 / 8 + m;
    var rwbY = canvas.height * 5 / 8 - paddleHeight;
    ctx.drawImage(homePlayer, rwbX, rwbY - 15, playerWidth, playerHeight);
    box = new B(new V(rwbX, rwbY), playerWidth, paddleHeight).toPolygon();
    collisionDetection(box, rwbX);

}

function drawStrikers() {
    //attackers
    var lwX = paddleX / 4 + m;
    var lwY = canvas.height * 9 / 32 - paddleHeight;
    drawRods(lwY);
    ctx.drawImage(homePlayer, lwX, lwY - 15, playerWidth, playerHeight);
    box = new B(new V(lwX, lwY), playerWidth, paddleHeight).toPolygon();
    collisionDetection(box, lwX);

    var cfX = paddleX / 2 + m;
    var cfY = canvas.height * 9 / 32 - paddleHeight;
    ctx.drawImage(homePlayer, cfX, cfY - 15, playerWidth, playerHeight);
    box = new B(new V(cfX, cfY), playerWidth, paddleHeight).toPolygon();
    collisionDetection(box, cfX);

    var rwX = paddleX * 3 / 4 + m;
    var rwY = canvas.height * 9 / 32 - paddleHeight;
    ctx.drawImage(homePlayer, rwX, rwY - 15, playerWidth, playerHeight);
    box = new B(new V(rwX, rwY), playerWidth, paddleHeight).toPolygon();
    collisionDetection(box, rwX);

}



function drawAwayGoalkeeper() {

    var gkX = paddleX / 2 + j;
    var gkY = canvas.height * 1 / 8 - paddleHeight;
    drawRods(gkY);
    ctx.drawImage(awayPlayer, gkX, gkY - 15, playerWidth, playerHeight);
    box = new B(new V(gkX, gkY), playerWidth, paddleHeight).toPolygon();
    collisionDetectionAway(box, gkX);

    if (x > gkX && gkX < paddleX * 3 / 4)
        j += aiSpeed;
    else if (gkX > paddleX * 1 / 4)
        j -= aiSpeed;

}

function drawAwayDefenders() {

    var lcbX = paddleX / 4 + j;
    var lcbY = canvas.height * 3 / 16 - paddleHeight;
    drawRods(lcbY);
    ctx.drawImage(awayPlayer, lcbX, lcbY - 15, playerWidth, playerHeight);
    box = new B(new V(lcbX, lcbY), playerWidth, paddleHeight).toPolygon();
    collisionDetectionAway(box, lcbX);

    var rcbX = paddleX * 3 / 4 + j;
    var rcbY = canvas.height * 3 / 16 - paddleHeight;
    ctx.drawImage(awayPlayer, rcbX, rcbY - 15, playerWidth, playerHeight);
    box = new B(new V(rcbX, rcbY), playerWidth, paddleHeight).toPolygon();
    collisionDetectionAway(box, rcbX);

    if (x > lcbX && lcbX < paddleX * 3 / 4)
        j += aiSpeed;
    else if (lcbX > paddleX * 1 / 4)
        j -= aiSpeed;
    if (x > rcbX && rcbX < paddleX * 3 / 4)
        j += aiSpeed;
    else if (rcbX > paddleX * 1 / 4)
        j -= aiSpeed;
}

function drawAwayMidfielders() {

    //midfielders
    var lwbX = paddleX * 1 / 8 + j;
    var lwbY = canvas.height * 3 / 8 - paddleHeight;
    drawRods(lwbY)
    ctx.drawImage(awayPlayer, lwbX, lwbY - 15, playerWidth, playerHeight);
    box = new B(new V(lwbX, lwbY), playerWidth, paddleHeight).toPolygon();
    collisionDetectionAway(box, lwbX);

    var lcmX = paddleX * 3 / 8 + j;
    var lcmY = canvas.height * 3 / 8 - paddleHeight;
    ctx.drawImage(awayPlayer, lcmX, lcmY - 15, playerWidth, playerHeight);
    box = new B(new V(lcmX, lcmY), playerWidth, paddleHeight).toPolygon();
    collisionDetectionAway(box, lcmX);

    var rcmX = paddleX * 5 / 8 + j;
    var rcmY = canvas.height * 3 / 8 - paddleHeight;
    ctx.drawImage(awayPlayer, rcmX, rcmY - 15, playerWidth, playerHeight);
    box = new B(new V(rcmX, rcmY), playerWidth, paddleHeight).toPolygon();
    collisionDetectionAway(box, rcmX);

    var rwbX = paddleX * 7 / 8 + j;
    var rwbY = canvas.height * 3 / 8 - paddleHeight;
    ctx.drawImage(awayPlayer, rwbX, rwbY - 15, playerWidth, playerHeight);
    box = new B(new V(rwbX, rwbY), playerWidth, paddleHeight).toPolygon();
    collisionDetectionAway(box, rwbX);

    if (x > lwbX && lwbX < paddleX * 3 / 4)
        j += aiSpeed;
    else if (lwbX > paddleX * 1 / 4)
        j -= aiSpeed;
    if (x > rwbX && rwbX < paddleX * 3 / 4)
        j += aiSpeed;
    else if (rwbX > paddleX * 1 / 4)
        j -= aiSpeed;
    if (x > rcmX && rcmX < paddleX * 3 / 4)
        j += aiSpeed;
    else if (rcmX > paddleX * 1 / 4)
        j -= aiSpeed;
    if (x > lcmX && lcmX < paddleX * 3 / 4)
        j += aiSpeed;
    else if (lcmX > paddleX * 1 / 4)
        j -= aiSpeed;
}


function drawAwayStrikers() {
    //attackers
    ctx.beginPath();
    var lwX = paddleX / 4 + j;
    var lwY = canvas.height * 23 / 32 - paddleHeight;
    drawRods(lwY);
    ctx.drawImage(awayPlayer, lwX, lwY - 15, playerWidth, playerHeight);
    box = new B(new V(lwX, lwY), playerWidth, paddleHeight).toPolygon();
    collisionDetectionAway(box, lwX);

    ctx.beginPath();
    var cfX = paddleX / 2 + j;
    var cfY = canvas.height * 23 / 32 - paddleHeight;
    ctx.drawImage(awayPlayer, cfX, cfY - 15, playerWidth, playerHeight);
    box = new B(new V(cfX, cfY), playerWidth, paddleHeight).toPolygon();
    collisionDetectionAway(box, cfX);

    ctx.beginPath();
    var rwX = paddleX * 3 / 4 + j;
    var rwY = canvas.height * 23 / 32 - paddleHeight;
    ctx.drawImage(awayPlayer, rwX, rwY - 15, playerWidth, playerHeight);
    box = new B(new V(rwX, rwY), playerWidth, paddleHeight).toPolygon();
    collisionDetectionAway(box, rwX);


    // if(y + 10 == rwY || y - 10 == rwY) {
    if (x > lwX && lwX < paddleX * 3 / 4)
        j += aiSpeed;
    else if (lwX > paddleX * 1 / 4)
        j -= aiSpeed;
    if (x > rwX && rwX < paddleX * 3 / 4)
        j += aiSpeed;
    else if (rwX > paddleX * 1 / 4)
        j -= aiSpeed;
    if (x > cfX && cfX < paddleX * 3 / 4)
        j += aiSpeed;
    else if (cfX > paddleX * 1 / 4)
        j -= aiSpeed;
    //}


}


function collisionDetection(box, pX) {
    var response = new SAT.Response();
    if (SAT.testPolygonCircle(box, circle, response)) {
        var speed = (x + (12 / 2) - pX + (20 / 2)) / (20 / 2) * 5;
        if (flag1 == 1) {
            if (dy > 0) {
                dy = -dy;
                y = y - speed;
                if (dx > 0)
                    x = x + speed;
                else
                    x = x - speed;
            } else {
                y = y - speed;
                if (dx > 0)
                    x = x - speed;
                else
                    x = x + speed;
            }
            flag1 = 0;
        }
    } else
        flag1 = 1;
}

function collisionDetectionAway(box, pX) {
    var response = new SAT.Response();
    if (SAT.testPolygonCircle(box, circle, response)) {
        var speed = (x + (12 / 2) - pX + (20 / 2)) / (20 / 2) * 5;
        if (flag2 == 1) {
            if (dy < 0) {
                dy = -dy;
                y = y + speed;
                if (dx > 0)
                    x = x + speed;
                else
                    x = x - speed;
            } else {
                y = y + speed;
                if (dx > 0)
                    x = x + speed;
                else
                    x = x - speed;
            }
        }
    } else
        flag2 = 1;
}


function goalDetection(box) {
    var response = new SAT.Response();
    return SAT.testPolygonCircle(box, circle, response);
}

function drawRods(yAxis) {
    ctx.beginPath();
    ctx.rect(0, yAxis + 2, canvas.width, paddleHeight - 5);
    ctx.fillStyle = "#BDBDBD";
    ctx.fill();
    ctx.strokeStyle = 'black';
    ctx.stroke();
    ctx.closePath();
}

function keyDownHandler(e) {
    if (e.keyCode == 39) {
        rightPressed = true;
    } else if (e.keyCode == 37) {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.keyCode == 39) {
        rightPressed = false;
    } else if (e.keyCode == 37) {
        leftPressed = false;
    }
}

function touchkeyDownHandler(e) {
    if (e == 'Right') {
	leftPressed = false;
        rightPressed = true;
    } else if (e == 'Left') {
	rightPressed = false;
        leftPressed = true;
    }else if (e == 'Down') {
	rightPressed = false;
        leftPressed = false;
    }
	//var a = setInterval(touchkeyUpHandler(e),1500);
}