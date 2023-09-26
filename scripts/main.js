function setCanvasDimensions(w, h) {
    canvas.width = w;
    canvas.height = h;
    canvas.style.width = w + "px;"
    canvas.style.height = h + "px";
}

let canvas;
let ctx;
let board;
let tileSizeX;
let tileSizeY;
let edge = 0.5;
canvas = document.querySelector("#main-canvas");
ctx = canvas.getContext("2d");
pi_display = document.querySelector("#pi-display");
function setupCanvas() {

    setCanvasDimensions(512 + 2*borderWidth, 512 + 2*borderWidth);
    
    board = new Board();
    
    ctx.imageSmoothingEnabled = false;

};
let draws = 1;
let borderWidth = 2;

let directions = {right: {angle:0, color:"red"}, up: {angle:-Math.PI*0.5,color:"blue"}, left: {angle:Math.PI,color:"gold"}, down: {angle:Math.PI*0.5,color:"lime"}};
for ([_, direction] of Object.entries(directions)) {
    let angle = direction.angle;
    direction.offset = {
        x: Math.round(Math.cos(angle)),
        y: Math.round(Math.sin(angle))
    };
}

function draw() {
    if (draws) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        board.draw();
        draws--;
    }
}

setupCanvas();
setInterval(draw, 15);