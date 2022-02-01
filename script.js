const canvas = new fabric.Canvas('canvas', {
    width: innerWidth,
    height: innerHeight,
    backgroundColor: '#2d2d29',
});


let img = document.getElementById('bird');
let img2 = document.getElementById('road');

let birdImg;
let roadImg;
let id;
const gravity = 0.5;
let angle = 0;
let speedY = 0.5;
let playArea = canvas.height - 180;

canvas.hasBorders = false;
canvas.hasControls = false;
canvas.lockMovementX = true;
canvas.lockMovementY = true;
canvas.subTargetCheck =  true;
canvas.hoverCursor = 'pointer';

class Bird {
    constructor() {
        this.position = {
            x: 100,
            y: playArea / 2,
        }
        this.velocity = {
            x: 0,
            y: 0,
        }
        this.width = 55
        this.height = 38
        this.dirty = false
    }

    draw() {
        birdImg = new fabric.Image(img, {
            left: this.position.x,
            top: this.position.y,
            width: this.width,
            height: this.height,
            angle: angle,
            hoverCursor: "default",
        })
        birdImg.lockMovementX = true;
        birdImg.lockMovementY = true;
        birdImg.hasControls = false;
        birdImg.hasBorders = false;
        canvas.add(birdImg);
    }

    update() {
        this.draw();
        
        if(this.dirty) {
            this.gravitation();
        } else {
            this.willy();
        }
    }

    gravitation() {
        this.position.y += this.velocity.y;

        if(this.position.y + this.height + this.velocity.y <= playArea) {
            this.velocity.y += gravity;
            this.down();
        } else {
            this.velocity.y = 0;
        }
    }

    willy() {
        this.position.y -= speedY;

        if(this.position.y > playArea / 2 + 7 || this.position.y < playArea / 2 - 7) {
            speedY = speedY * (-1);
        }
    }

    down() {
        angle += 2;
        if(angle <= 45) {
            birdImg.set('angle', angle);
        } else {
            angle = 45;
            birdImg.set('angle', angle);
            return;
        }
    }

    up() {
        angle = -45;
        birdImg.set('angle', angle);
    }

    clear() {
        canvas.remove(birdImg);
    }
}

class Road {
    constructor(x, y) {
        this.position = {
            x,
            y,
        }
        this.velocity = {
            x: 3,
            y: 0,
        }
        this.width = 2029;
        this.height = 164.7;

        this.move = false;
    }

    draw() {
        roadImg = new fabric.Image(img2, {
            left: this.position.x,
            top: this.position.y,
            width: this.width,
            height: this.height,
            hoverCursor: "default",
        })
        roadImg.lockMovementX = true;
        roadImg.lockMovementY = true;
        roadImg.hasControls = false;
        roadImg.hasBorders = false;
        canvas.add(roadImg);
    }

    clear() {
        canvas.remove(roadImg);
    }
}

let bird = new Bird();

function animate() {
    requestAnimationFrame(animate);
    bird.clear();
    bird.update();
}
animate();


addEventListener('keypress', () => {
    bird.dirty = true;
    bird.up();
    if(bird.position.y <= 0) {
        bird.velocity.y = 0;
    } else {
        bird.velocity.y -= 12;
    }
})

let road = new Road(0, canvas.height - 164.7);

function animateRoad() {
    road.position.x -= road.velocity.x;

    if(road.position.x < canvas.width - road.width) {
        road.position.x = 0;
    }

    road.clear();
    road.draw();

    requestAnimationFrame(animateRoad);
}
requestAnimationFrame(animateRoad);