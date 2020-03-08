gameCanvas = document.getElementById('gameCanvas');
gameCtx = gameCanvas.getContext('2d');

const boardWidth = 330;
const boardHeight = 135;
const diceBoardX = 85;
const diceBoardY = 285;

const diceSpace = 5;
const diceStartX = diceBoardX + diceSpace;
const diceStartY = diceBoardY + diceSpace;
const diceWidth = 60;
const dotWidth = 5;

const buttonWidth = 200;
const buttonHeight = 30;
const buttonX = gameCanvas.width/2 - buttonWidth/2;
const buttonY = gameCanvas.height - 55;


const dice = [];

const diceLocation = [
    {x: diceStartX, y: diceStartY},
    {x: diceStartX + (diceWidth + diceSpace), y: diceStartY},
    {x: diceStartX + (diceWidth + diceSpace) * 2, y: diceStartY},
    {x: diceStartX + (diceWidth + diceSpace) * 3, y: diceStartY},
    {x: diceStartX + (diceWidth + diceSpace) * 4, y: diceStartY},
    {x: diceStartX, y: diceStartY + diceWidth + diceSpace},
    {x: diceStartX + (diceWidth + diceSpace), y: diceStartY + diceWidth + diceSpace},
    {x: diceStartX + (diceWidth + diceSpace) * 2, y: diceStartY + diceWidth + diceSpace},
    {x: diceStartX + (diceWidth + diceSpace) * 3, y: diceStartY + diceWidth + diceSpace},
    {x: diceStartX + (diceWidth + diceSpace) * 4, y: diceStartY + diceWidth + diceSpace},
]

const locationGuide = [diceWidth / 3 - diceWidth / 3 / 2,  diceWidth / 2, diceWidth - diceWidth / 3 / 2];
const dotLocation = [
    {x: locationGuide[0], y: locationGuide[0]},
    {x: locationGuide[2], y: locationGuide[0]},
    {x: locationGuide[0], y: locationGuide[1]},
    {x: locationGuide[1], y: locationGuide[1]},
    {x: locationGuide[2], y: locationGuide[1]},
    {x: locationGuide[0], y: locationGuide[2]},
    {x: locationGuide[2], y: locationGuide[2]},
];
const diceNumGuide = [[3], [0,6], [0,3,6], [0,1,5,6], [0,1,3,5,6], [0,1,2,4,5,6]];

function init(){
    for(let i=0; i<10; i++){
        dice[i] = new Dice(diceLocation[i].x, diceLocation[i].y);
        //dice[i].active(false);
    }
    board();
}

class Dot {
    constructor(x, y){
        self = this;
        this.x = x;
        this.y = y;
        this.speed = 10;
        this.damage = 10;
        this.activeFlag = false;
        this.target = null;
    }

    active(){
        self.activeFlag = true;
    }

    disabled(){
        self.activeFlag = false;
    }

    attack(target){
        self.moveToTarget(self.x, self.y, target);
    }

    setTarget(target){
        self.target = target;
    }

    moveToTarget(x, y, target){
        console.log("move");
        let mx = target.x + target.width/2;
        let my = target.y + target.height/2;

        if (x > mx) {
            x--;
        }
        else {
            x++;
        }
        if (y > my){
            y--;
        }
        else{
            y++;
        }
        draw.drawFillArc(x, y, 'red');
        if(mx!==x || my!==y){
            setTimeout(self.moveToTarget, 10, x, y, target);

        }
    }

    inflictDamage(target){
        console.log('target, damage', target.getHp());
        let targetHp = target.getHp() - self.damage;
        if(targetHp <= 0){
            console.log('stop');
            clearInterval(self.timer);
        }
        target.getDamage(self.damage);
    }
}


class Dice {
    constructor(x, y){
        self = this;
        this.x = x;     // 왼쪽 상단 x 좌표
        this.y = y;     // 왼쪽 상단 y 좌표
        this.num = 1;   // 주사위 눈
        this.dots = [];
        this.active = false;
        for (let i = 0 ; i < 7 ; i ++){
            this.dots[i] = new Dot(dotLocation[i].x, dotLocation[i].y);
        }
        this.dots[diceNumGuide[0]].active();
    }

    setActive(){
        this.active = true;
        board();
    }

    setTarget(target){
        let activeIndexes = self.getActiveDots();
        for(let i = 0;i <activeIndexes.length; i++){
            self.dots[activeIndexes[i]].setTarget(target);
        }
    }

    getActiveDots(){
        let indexes = [];

        for(let i=0; i<this.dots.length; i++){
            if(this.dots[i].activeFlag){
                indexes.push(i);
            }
        }
        return indexes;
    }

    attack(target){
        let actives = this.getActiveDots();
        console.log(actives);
        actives.map(value => {
            this.dots[value].attack(target);
        })
    }
}

const make = {
    makeDice: function(){
        let index = getRandumNum(0, 10);
        dice[index].setActive();

    }
}


const draw = {
    drawFillRect: function(x, y, width, height, color){
        gameCtx.beginPath();
        gameCtx.rect(x, y, width, height);
        gameCtx.fillStyle = color;
        gameCtx.fill();
        gameCtx.closePath();
    },
    drawStrokeRect: function(x, y, width, height, color){
        gameCtx.beginPath();
        gameCtx.rect(x, y, width, height);
        gameCtx.strokeStyle = color;
        gameCtx.stroke();
        gameCtx.closePath();
    },

    drawFillArc: function(x, y, color){
        gameCtx.beginPath();
        gameCtx.arc(x, y, dotWidth, 0, Math.PI * 2);
        gameCtx.fillStyle = color;
        gameCtx.fill();
        gameCtx.closePath();
    },

    drawText: function(fontSize, color, text, x, y){
        gameCtx.font = fontSize+"px Arial";
        gameCtx.fillStyle = color;
        gameCtx.fillText(text, x+ 9, y + 25);

    },

    drawDice : function(x, y){
        this.drawStrokeRect(x, y, diceWidth, diceWidth, 'blue');
    },

    drawDot : function(dice){
        diceNumGuide[dice.num - 1].map(value => {
            this.drawFillArc(dotLocation[value].x + dice.x, dotLocation[value].y + dice.y, 'blue');

        });
    },

    drawMonster : function(monster){
        this.drawFillRect(monster.x, monster.y, monster.width, monster.height, 'black');
        this.drawText(15, 'white', monster.hp, monster.x, monster.y);
    },


};

function board(){
    draw.drawStrokeRect(diceBoardX, diceBoardY, boardWidth, boardHeight, 'gray');
    // draw dice board

    for(let i = 0; i<diceLocation.length; i++){
        console.log(dice[i].active);
        if(dice[i].active){
            draw.drawStrokeRect(dice[i].x, dice[i].y, diceWidth, diceWidth, 'blue');
            draw.drawDot(dice[i]);
        }
        else{
            draw.drawStrokeRect(diceLocation[i].x, diceLocation[i].y, diceWidth, diceWidth, 'gray');
        }
    } // draw empty dice space

    draw.drawFillRect(buttonX, buttonY, 200, 30, 'green' );
    draw.drawText(15, 'white', 'Dice',buttonX, buttonY )
    // draw create dice button
}

const Handler = {
    mouseClickHandler(e) {
        let x = e.offsetX;
        let y = e.offsetY;
        if(x >buttonX && x<buttonX+buttonWidth && y >buttonY && y < buttonY + buttonHeight){
            make.makeDice();

        }
    }
}

function getRandumNum(flag, num){
    let index;
    let cnt = 0;
    while (1){
        index = Math.floor(Math.random() * num + flag );
        if(!dice[index].active ){
            return index;
        }
        cnt ++;
        if(cnt === 10){
            break;
        }
    }
}// flag == 1: 1이상 num 이하 / flag == 0 : 0이상 num 미만

init();


document.addEventListener('mousedown', Handler.mouseClickHandler, false);
