gameCanvas = document.getElementById('gameCanvas');
gameCtx = gameCanvas.getContext('2d');
attackCtx = document.getElementById('gameCanvas');
attackCtx = gameCanvas.getContext('2d');

const diceWidth = 60;
const dotWidth = 5;

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

const MONSTER= [
    {
        x: 100,
        y: 100,
        hp: 100,
        width: 50,
        height: 50,
    }, // type = 0
    {
        x: 200,
        y: 100,
        hp: 500,
        width: 100,
        height: 100
    } // type = 1
];

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

    getDam(){
        return self.damage;
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
        for (let i = 0 ; i < 7 ; i ++){
            this.dots[i] = new Dot(dotLocation[i].x, dotLocation[i].y);
        }
        this.dots[diceNumGuide[0]].active();
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

    setTarget(target){
        let activeIndex = self.getActiveDots();

        for(let i = 0 ;i<activeIndex.length ; i++){
            self.dots[activeIndex[i]].setTarget(target);
        }

    }

    attack(target){
        let actives = this.getActiveDots();
        console.log(actives);
        actives.map(value => {
            this.dots[value].attack(target);
        })
    }
}

class Monster {
    constructor(type){
        this.x = MONSTER[type].x;
        this.y = MONSTER[type].y;
        this.hp = MONSTER[type].hp;
        this.width = MONSTER[type].width;
        this.height = MONSTER[type].height;
    }

    getDamage(damage){
        console.log(damage);
        this.hp -= damage;
        console.log(this.hp);
        draw.drawMonster(this);
    }

    getHp(){
        return this.hp;
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

function controllInterval( onFlag, interval, method) {
    if(onFlag){
        interval = setInterval(method, 10, )
    }
}

const monsterA = new Monster(0);
const dice = new Dice(10, 10, monsterA);




draw.drawDice(dice.x, dice.y);
draw.drawDot(dice);
draw.drawMonster(monsterA);

dice.attack(monsterA);
