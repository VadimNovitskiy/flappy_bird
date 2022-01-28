
let img = document.getElementById('bird');
let img2 = document.getElementById('road');

let birdImg;
let roadImg;
let id;
const gravity = 0.5;
let angle = 0;
const roads = [];

const canvas = new fabric.Canvas('canvas', {
    width: 480,
    height: 640,
    backgroundColor: '#2d2d29',
});

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
            y: 0,
        }
        this.velocity = {
            x: 0,
            y: 0,
        }
        this.width = 55
        this.height = 38
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
        
        this.position.y += this.velocity.y;

        if(this.position.y + this.height + this.velocity.y <= road.position.y - 10) {
            this.velocity.y += gravity;
            this.down();
        } else {
            this.velocity.y = 0;
            // cancelAnimationFrame(id);
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
        this.width = 508;
        this.height = 164.7;
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

    update() {
        this.draw();
        this.position.x -= 1;

        // if(this.position.x === canvas.width - this.width) {
        //     console.log('move');
        // }

        // if(this.position.x === -this.width) {
        //     console.log('clear');
        // }
    }

    clear() {
        canvas.remove(roadImg);
    }
}

let bird = new Bird();
let road = new Road(0, 530);
let road2;
road.draw();

function animate() {
    requestAnimationFrame(animate);
    // bird.clear();
    // bird.update();

    road.clear();
    road.update();
    if(road.position.x === canvas.width - road.width) {
        road2 = new Road(canvas.width, 530);
        road2.update();
    }

    if(road.position.x === -road.width) {
        road.clear();
    }
}
animate();


addEventListener('keypress', () => {
    bird.up();
    if(bird.position.y <= 0) {
        bird.velocity.y = 0;
    } else {
        bird.velocity.y -= 12;
    }
})










