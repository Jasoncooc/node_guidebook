const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const buttonStart = document.getElementById("buttonStart");
const BLOCK_SIZE = 20;  //放大畫素，20點為一格
const MAP_SIZE = canvas.width/BLOCK_SIZE ; // (寬400 / 格20) = 20格子(列)
let score1 = 0;     // 紀錄分數
let score2 = 0;     // 紀錄分數
playerKey1 = [38,40,37,39];     //按鍵配製1 上下左右
playerKey2 = [87,83,65,68];     //按鍵配製2 wsad
let snake1;
let snake2;
let apple;
let gameInterval;
let appleInterval;

//建構蛇蛇類別
class Snake { 
	//蛇蛇建構子(建構屬性)
        constructor(startX, startY, snakeColor, playerKey) {
        this.body = [{ x: startX, y: startY }];
        this.size = 5;
        this.score = 0;
        this.color = snakeColor;
        this.direction = { x: 0, y: -1 };
        this.playerKey = playerKey;
}

	//蛇蛇功能(drawSnake)
    drawSnake() {
    this.moveSnake();
    ctx.fillStyle = this.color;
    for (let i = 0; i < this.body.length; i++) {
        ctx.fillRect(
            this.body[i].x * BLOCK_SIZE,
            this.body[i].y * BLOCK_SIZE,
            BLOCK_SIZE,
            BLOCK_SIZE
        );
    }
    this.eatApple();
}

	//蛇蛇功能(moveSnake)
    moveSnake() {
    let newBlock = {
        x: this.body[0].x + this.direction.x,
        y: this.body[0].y + this.direction.y
    };
    this.body.unshift(newBlock);
    while (this.body.length > this.size) {
        this.body.pop();
    }
    this.checkDeath();
}

	//蛇蛇功能(eatApple)
    eatApple() {
    for (let i = 0; i < apple.apples.length; i++) {
        if (
            this.body[0].x === apple.apples[i].x &&
            this.body[0].y === apple.apples[i].y
        ) {
            apple.apples.splice(i, 1);
            this.size++;
            this.score++;
        }
    }
}

	//蛇蛇功能(checkDeath)
    heckDeath() {
    if (
        this.body[0].x < 0 ||
        this.body[0].x >= MAP_SIZE ||
        this.body[0].y < 0 ||
        this.body[0].y >= MAP_SIZE
    ) {
        this.score = this.score - 10;
        gameOver();
    }
    for (let i = 1; i < this.body.length; i++) {
        if (
            this.body[0].x === this.body[i].x &&
            this.body[0].y === this.body[i].y
        ) {
            this.score = this.score - 10;
            gameOver();
        }
    }
}

	//蛇蛇功能(move)
    move(event) {
    //up
    if (event.keyCode == this.playerKey[0] && this.direction.y !== 1 ) {
        this.direction = { x: 0, y: -1 };
    }
    //down
    else if (event.keyCode == this.playerKey[1] && this.direction.y !== -1) {
        this.direction = { x: 0, y: 1 };
    }
    //left
    else if (event.keyCode == this.playerKey[2] && this.direction.x !== 1) {
        this.direction = { x: -1, y: 0 };    
    }
    //right
    else if (event.keyCode == this.playerKey[3] && this.direction.x !== -1) {
        this.direction = { x: 1, y: 0 };    
    }
}

}

class Apple {
	//蘋果建構子(建構屬性)
    constructor() {
    this.apples = [];
    this.putApple();
}

	//蘋果功能(drawApple)
    drawApple() {
    ctx.fillStyle = 'red';
    for (let i = 0; i < this.apples.length; i++) {
        ctx.fillRect(
            this.apples[i].x * BLOCK_SIZE,
            this.apples[i].y * BLOCK_SIZE,
            BLOCK_SIZE,
            BLOCK_SIZE
        );
    }
}

	//蘋果功能(putApple)
    putApple() {
    let x = Math.floor(Math.random() * MAP_SIZE);
    let y = Math.floor(Math.random() * MAP_SIZE);
    this.apples.push({ x: x, y: y });
}

}


function gameStart() {
    gameOver();
    snake1 = new Snake(MAP_SIZE / 2, MAP_SIZE / 2, 'lime', playerKey1);
    snake2 = new Snake(MAP_SIZE / 4, MAP_SIZE / 2, 'yellow', playerKey2);
    apple = new Apple();
    gameInterval = setInterval(drawGame, 100);
    appleInterval = setInterval(function() {
        apple.putApple();
    }, 3000); // 每3秒放置一個新的蘋果
}
//繪製遊戲場景
function drawGame() {
    drawMap();
    apple.drawApple();
    snake1.drawSnake();
    snake2.drawSnake();
    drawScore();
}
//畫一個黑色背景
function drawMap() {
    ctx.fillStyle = 'black' ;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}
function drawScore() {
    ctx.fillStyle = "white";
    ctx.font = "20px Verdana";
    ctx.fillText("Score1 " + snake1.score, canvas.width - 150, 20);    
    ctx.fillText("Score2 " + snake2.score, canvas.width - 150, 40);
}
function gameOver(){
    clearInterval(gameInterval);
    clearInterval(appleInterval);
}
buttonStart.addEventListener("click", gameStart);

// 監聽鍵盤事件
document.addEventListener('keydown', function(event) {
    snake1.move(event);
    snake2.move(event);
});
