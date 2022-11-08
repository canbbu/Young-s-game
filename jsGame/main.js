
//캔버스 세팅
let canvas;
let ctx;
canvas = document.createElement('canvas');
ctx = canvas.getContext('2d');
canvas.width = 400;
canvas.height= 700;


document.body.appendChild(canvas);

let backgroundImage, spaceshipImage, bulletImage, enemyImage, gameOverImage;
let gameOver = false; // true 이면 게임이 끝남, false이면 안끝남

//우주선 좌표
let spaceshipX = canvas.width/2-32;
let spaceshipY = canvas.height-64;
let bulletList=[]
let score = 0;
function Bullet(){
    this.x = 0;
    this.y = 0;
    this.init = function(){
        this.x = spaceshipX +20;
        this.y = spaceshipY ;
        this.alive = true; //true면 살아있는 총알 false 죽은 총알
        bulletList.push(this);
    }
    this.update = function(){
        this.y -=7;
    }

    this.checkHit = function(){
        for(let i =0; i< enemyList.length; i++){
            if(this.y <=enemyList[i].y && 
                this.x >=enemyList[i].x && 
                this.x <= enemyList[i].x +40){
                score++;
                this.alive = false;
                enemyList.splice(i, 1);
            }
        }
    }
}

function generateRandomValue(min, max){
    let randomNum = Math.floor(Math.random()*(max-min+1))+min
    return randomNum;
}

let enemyList= [];
function Enemy(){
    this.x = 0;
    this.y = 0;
    this.init = function(){
        this.y = 0;
        this.x = generateRandomValue(0,canvas.width-40);
        enemyList.push(this);
    }

    this.update= function(){
        this.y += 2;
        
        if(this.y >= canvas.height-48){
            gameOver = true;
            console.log("Game Over!");
        }
    }
}


function loadImage() {
    backgroundImage = new Image();
    backgroundImage.src = "img/space.jfif";

    spaceshipImage = new Image();
    spaceshipImage.src = "img/me.png";

    bulletImage = new Image();
    bulletImage.src = "img/bullet.png";

    
    enemyImage = new Image();
    enemyImage.src = "img/enemy.png";

    gameOverImage = new Image();
    gameOverImage.src = "img/gameOver.jfif";
}

//keybutton
let keysDown={}
function setupKeyboardListener(){
    document.addEventListener("keydown",function(event){
        console.log("버튼 클릭 ", keysDown);
        keysDown[event.keyCode]=true;
    
    });
document.addEventListener("keyup",function(event){  
    delete keysDown[event.keyCode];
    

    if(event.keyCode==32){
        createBullet() // 총알생성
    }
    
    });
}

function createBullet(){
    console.log("총알생성");
    let b = new Bullet();
    b.init();
   
}

function createEnemy(){
    const interval = setInterval(function(){
        let e = new Enemy();
        e.init();
    },1000);
}

function update(){
    if( 39 in keysDown){
        spaceshipX += 5;
        
    }else if( 37 in keysDown){
        spaceshipX -= 5;
    }
    
    if(spaceshipX <= 0){
        spaceshipX = 0;
    }else if(spaceshipX >= canvas.width-60){
        spaceshipX = canvas.width-60;
    }

    //총알의 y좌표 업데이트 하는 함수 호출
    for(let i = 0; i < bulletList.length; i++){
        if(bulletList[i].alive){
        bulletList[i].update();
        bulletList[i].checkHit();
        }
    }

        for(let i = 0; i < enemyList.length; i++){
            enemyList[i].update();
        }

}


function render () {
    ctx.drawImage(backgroundImage,0,0,canvas.width, canvas.height);
    ctx.drawImage(spaceshipImage,spaceshipX,spaceshipY);
    
    //점수 넣기
    ctx.fillText('Score:${score}', 20 ,20);
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    for(let i=0; i<bulletList.length; i++) {
        if(bulletList[i].alive){
        ctx.drawImage(bulletImage,bulletList[i].x,bulletList[i].y);
        }
    }

    for(let i=0; i<enemyList.length; i++) {
        ctx.drawImage(enemyImage, enemyList[i].x, enemyList[i].y);
        console.log(enemyList[i]);
    }
}

function main(){
     if(!gameOver){
    update();  //좌표값을 업데이트 하고
    render(); // 그려주고
    requestAnimationFrame(main)
     }else{
        ctx.drawImage(gameOverImage,10,100, 380,380); 
     }
}

loadImage();
setupKeyboardListener();
createEnemy();
main();

