//select camvas
const canvas = document.getElementById("gamezone");
const context = canvas.getContext("2d");

//user paddle
const user = {
  x: 0,
  y: canvas.height / 2 - 100 / 2,
  width: 10,
  height: 100,
  color: "white",
  score: 0
}

//user computer
const com = {
  x: canvas.width - 10,
  y: canvas.height / 2 - 100 / 2,
  width: 10,
  height: 100,
  color: "white",
  score: 0
}

//crate ball
const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 10,
  speed: 5,
  velocityX: 5,
  velocityY: 5,
  color: "white"
}

// create the net
const net = {
  x : (canvas.width - 2)/2,
  y : 0,
  width : 2,
  height : 10,
  color : "white"
}

//draw rect function will be used to draw paddle
function drawRect(x, y, w, h, color) {
  context.fillStyle = color;
  context.fillRect(x, y, w, h);
}

//draw net
function drawNet(){
  for(let i=0; i<=canvas.height;i+=15){
    drawRect(net.x, net.y + i, net.width, net.height, net.color);
  }
}

//draw circle
function drawCircle(x, y, r, color) {
  context.fillStyle = color;
  context.beginPath();
  context.arc(x, y, r, 0, Math.PI * 2, false);
  context.closePath();
  context.fill();
}

//draw Text
function drawText(text, x, y, color) {
  context.fillStyle = color;
  context.font = "45px fantasy";
  context.fillText(text, x, y);
}

function render() {
  //clear canvas
  drawRect(0, 0, canvas.width, canvas.height, "black");

  // draw net
  drawNet();

  //draw score
  drawText(user.score, canvas.width / 4, canvas.height / 5, "white");
  drawText(com.score, 3 * canvas.width / 4, canvas.height / 5, "red");

  //draw the computer and user paddle
  drawRect(user.x, user.y, user.width,user.height, user.color);
  drawRect(com.x, com.y, com.width,com.height, com.color);

  //draw the ball
  drawCircle(ball.x,ball.y,ball.radius,ball.color);
}

//control the user paddle
canvas.addEventListener("mousemove",movePaddle);

function movePaddle(evt){
  let rect = canvas.getBoundingClientRect();

  user.y = evt.clientY - rect.top - user.height/2;

}


//collition detection
function collision(b,p){//b for ball and p for player
  b.top = b.y - b.radius;
  b.bottom = b.y + b.radius;
  b.left = b.x - b.radius;
  b.right = b.x + b.radius;

  p.top = p.y;
  p.bottom = p.y + p.height;
  p.left = p.x;
  p.right = p.x + p.width;

  return b.right > p.left && b.bottom > p.top && b.left < p.right
  && b.top < p.bottom;

}

//reset function
function resetBall(){
  ball.x = canvas.width/2;
  ball.y = canvas.height/2;
  ball.speed = 5;
  ball.velocityX = -ball.velocityX;
}


//update section
function update(){
  ball.x += ball.velocityX;
  ball.y += ball.velocityY;

  //simple AI to control the computer paddle
  let computerLevel = 0.1;
  com.y += (ball.y - (com.y + com.height/2)) * computerLevel;


  if(ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0){
    ball.velocityY = -ball.velocityY;
  }

  let player = (ball.x < canvas.width/2) ? user : com;
  if(collision(ball,player)){
    // ball.velocityX = -ball.velocityX;
    //let see where the ball hits the player paddle
    let collidePoint = ball.y - (player.y + player.height/2);

    //normalization(we need to get numbers between -1 and 1.)
    // -player.height/2 < collide Point < player.height/2
    collidePoint = collidePoint/(player.height/2);

    //calculate angle in Radian
    // when the ball hits the top of a paddle we want the ball, to take a -45degees angle
        // when the ball hits the center of the paddle we want the ball to take a 0degrees angle
        // when the ball hits the bottom of the paddle we want the ball to take a 45degrees
        // Math.PI/4 = 45degrees
    let angleInRad = collidePoint * (Math.PI/4);

    //X direction of the ball when it is hit
    let direction = (ball.x < canvas.width/2) ? 1 : -1;

    //changr the velocity of X and Y
    ball.velocityX = direction * ball.speed * Math.cos(angleInRad);
    ball.velocityY =             ball.speed * Math.sin(angleInRad);

    //everytime the ball hits the paddle increase the speed of the ball
    ball.speed += 0.3;
  }

  // Update the score
  if(ball.x - ball.radius < 0){
    //computer wins
    com.score++;
    resetBall();
  }
  else if(ball.x + ball.radius > canvas.width){
    //player wins
    user.score++;
    resetBall();
  }

}


//game init
function game(){
  update();
  render();
}

//loop
const framePerSecond = 50;
setInterval(game,1000/framePerSecond);
