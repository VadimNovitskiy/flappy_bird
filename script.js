'use strict';

let img = document.getElementById('bird');
let img2 = document.getElementById('road');
let downW = document.getElementById('wallDown');
let topW = document.getElementById('wallTop');

addEventListener('keypress', State);
addEventListener('click', State);

const canvas = new fabric.Canvas('canvas', {
    width: innerWidth,
    height: innerHeight,
});

canvas.setBackgroundImage('./img/Group 4.png', canvas.renderAll.bind(canvas), {
    originX: 'left',
    originY: 'top'
});

let bird;
let gravity = 0.5;
let angle = 0;
let speedY = 0.5;
let playAreaY = canvas.height - 165;
const roadArr = [];
const wallArr = [];
let id;
let id2;
let id3;
let state = 'start';

canvas.selection = false;
canvas.hasBorders = false;
canvas.hasControls = false;
canvas.lockMovementX = true;
canvas.lockMovementY = true;
canvas.subTargetCheck =  false;
canvas.hoverCursor = 'pointer';

class Bird {
    #birdImg
    constructor() {
        this.position = {
            x: 100,
            y: playAreaY / 2,
        }
        this.velocity = {
            x: 0,
            y: 0,
        }
        this.width = 54;
        this.height = 37;
        this.dirty = false;
    }

    draw() {
        this.#birdImg = new fabric.Image(img, {
            left: this.position.x,
            top: this.position.y,
            width: this.width,
            height: this.height,
            angle: angle,
            hoverCursor: "default",
            objectCaching: false,
        })
        this.#birdImg.lockMovementX = true;
        this.#birdImg.lockMovementY = true;
        this.#birdImg.hasControls = false;
        this.#birdImg.hasBorders = false;
        canvas.add(this.#birdImg);
    }

    update() {
        this.clear();
        this.draw();
        
        if(this.dirty) {
            this.gravitation();
        } else {
            this.willy();
        }
    }

    gravitation() {
        this.position.y += this.velocity.y;

        if(this.position.y + this.height + this.velocity.y <= playAreaY) {
            this.velocity.y += gravity;
            this.down();
        } else {
            this.velocity.y = 0;
            cancelAnimationFrame(id);
            cancelAnimationFrame(id2);
            cancelAnimationFrame(id3);
            state = 'replay';
        }
    }

    willy() {
        this.position.y -= speedY;

        if(this.position.y > playAreaY / 2 + 7 || this.position.y < playAreaY / 2 - 7) {
            speedY = speedY * (-1);
        }
    }

    down() {
        angle += 2;

        if(angle <= 90) {
            this.#birdImg.set('angle', angle);
        } else {
            angle = 90;
            this.#birdImg.set('angle', angle);
            return;
        }
    }

    up() {
        angle = -45;
        this.#birdImg.set('angle', angle);
    }

    clear() {
        canvas.remove(this.#birdImg);
    }
}

class Road {
    #roadImg
    constructor(x, y) {
        this.position = {
            x,
            y,
        }
        this.velocity = {
            x: 3,
            y: 0,
        }
        this.width = 508;
        this.height = 164.7;

        this.move = false;
    }

    draw() {
        this.#roadImg = new fabric.Image(img2, {
            left: this.position.x,
            top: this.position.y,
            width: this.width,
            height: this.height,
            hoverCursor: "default",
            objectCaching: false,
        })
        this.#roadImg.lockMovementX = true;
        this.#roadImg.lockMovementY = true;
        this.#roadImg.hasControls = false;
        this.#roadImg.hasBorders = false;
        canvas.add(this.#roadImg);
    }

    update() {
        this.position.x -= this.velocity.x;
        this.clear();
        this.draw();
        if(this.position.x < -this.width) {
            this.position.x = canvas.width;
        }
    }

    clear() {
        canvas.remove(this.#roadImg);
    }
}

class Wall {
    #wallDown
    #wallTop
    constructor(x, y) {
        this.position = {
            x,
            y,
        }
        this.velocity = {
            x: 3,
            y: 0,
        }
        this.width = 122;
        this.height = 440;
    }

    draw() {
        this.#wallDown = new fabric.Image(downW, {
            left: this.position.x,
            top: this.position.y + this.height + 250,
            width: this.width,
            height: this.height,
            hoverCursor: "default",
            objectCaching: false,
        })

        this.#wallDown.lockMovementX = true;
        this.#wallDown.lockMovementY = true;
        this.#wallDown.hasControls = false;
        this.#wallDown.hasBorders = false;
        canvas.add(this.#wallDown);
        canvas.sendToBack(this.#wallDown);

        this.#wallTop = new fabric.Image(topW, {
            left: this.position.x,
            top: this.position.y,
            width: this.width,
            height: this.height,
            hoverCursor: "default",
            objectCaching: false,
        })

        this.#wallTop.lockMovementX = true;
        this.#wallTop.lockMovementY = true;
        this.#wallTop.hasControls = false;
        this.#wallTop.hasBorders = false;
        canvas.add(this.#wallTop);
        canvas.sendToBack(this.#wallTop);
    }

    update() {
        if(this.collision()) {
            gravity = 5;
            cancelAnimationFrame(id2);
            cancelAnimationFrame(id3);
            wallArr.length = 0;
            state = 'replay';
            return;
        }

        this.position.x -= this.velocity.x;
        this.clear();
        this.draw();

        if(this.position.x < -this.width && this.position.x2 < -this.width) {
            this.clear();
            wallArr.splice(0, 1);
        }

        if(this.position.x < canvas.width - 400 && this.position.x > canvas.width - 404) {
            createWall();
        }
    }

    collision() {
        let XColl = false;
        let YColl = false;

        if(bird.position.x + bird.width >= this.position.x && bird.position.x <= this.position.x + this.width) {
            XColl = true;
        }
        if(bird.position.y + bird.height >= this.position.y && bird.position.y <= this.position.y + this.height) {
            YColl = true;
        }
        if(bird.position.y + bird.height >= this.position.y + this.height + 250 && bird.position.y <= this.position.y + this.height * 2 + 250) {
            YColl = true;
        }

        if(XColl && YColl) {
            return true;
        }
        return false;
    }

    clear() {
        canvas.remove(this.#wallDown);
        canvas.remove(this.#wallTop);
    }
}

class Namber {
    #num;
    constructor(num) {
        this.position = {
            x: canvas.width / 2,
            y: 150,
        }
        this.num = num;
    }

    draw() {
        this.#num = new fabric.Image()
    }
}

function animateBird() {
    bird.update();
    id = requestAnimationFrame(animateBird);
}

function fly() {
    bird.dirty = true;
    bird.up();
    if(bird.position.y + bird.height <= 0) {
        bird.velocity.y = 0;
    } else {
        bird.velocity.y -= 13;
        return;
    }
}


function randomHeight(min, max) {
    let random = Math.floor(Math.random() * (max - min + 1)) + min;
    return random;
}

function createWall() {
    let wall = new Wall(canvas.width, randomHeight(-340, 0));
    wallArr.push(wall);
}

function animateWall() {
    id2 = requestAnimationFrame(animateWall);
    
    wallArr.forEach((el) => {
        el.update();
    })
}

function createRoad() {
    let length = 5;
    for(let i = 0; i < length; i++) {
        let road = new Road(i * 507, canvas.height - 164.7);
        roadArr.push(road);
    }
}

function animateRoad() {
    id3 = requestAnimationFrame(animateRoad);

    roadArr.forEach((el) => {
        el.update();
    })
}

function State() {
    switch(state) {
        case 'start':
            state = 'init';
            bird = new Bird();
            animateBird();
            createRoad();
            animateRoad();
            state = 'createWall';
            break;
        case 'createWall':
            state = 'animateWall';
            createWall();
            animateWall();
            state = 'play';
        case 'play':
            fly();
            break;
        case 'replay':
            state = 'delete all';
            cancelAnimationFrame(id);
            bird.velocity.y = 0;
            bird = null;
            angle = 0;
            canvas.remove(...canvas.getObjects());

            roadArr.length = 0;
            wallArr.length = 0;
            gravity = 0.5;
            state = 'start';
            State();
            break;
    }
}
State();