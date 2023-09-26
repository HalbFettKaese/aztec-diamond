class Domino {
    constructor(x, y, direction, alpha) {
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.offset = {x:0,y:0};
        this.alpha = alpha;
    }
    draw() {
        if (this.alpha > 0) {
            let x = (this.x - this.offset.x + board.tileNum/2)*tileSizeX+borderWidth;
            let y = (this.y - this.offset.y + board.tileNum/2)*tileSizeY+borderWidth;
            let w = tileSizeX;
            let h = tileSizeY;
            let d = directions[this.direction];
            if (Math.abs(d.offset.x)==1) {
                h *= 2;
            } else {
                w *= 2;
            }
            ctx.globalAlpha = this.alpha;
            ctx.fillStyle = d.color;
            ctx.fillRect(x+-w*0.5,y+-h*0.5,w,h);
            if (board.arrowAlpha > 0) {
                let dx = d.offset.x;
                let dy = d.offset.y;
                ctx.globalAlpha *= board.arrowAlpha;
                ctx.beginPath();
                ctx.fillStyle = "black";
                let x1 = -0.125*tileSizeX;
                let y1 = 0.25*tileSizeY;
                ctx.moveTo(x+x1*dx-y1*dy, y+x1*dy+y1*dx);
                ctx.lineTo(x-x1*dx, y-x1*dy);
                ctx.lineTo(x+x1*dx+y1*dy, y+x1*dy-y1*dx);
                ctx.closePath();
                ctx.fill();
            }
            ctx.globalAlpha = 1;
        }

        this.offset.x = Math.sign(this.offset.x) * Math.max(0, Math.abs(this.offset.x) - 0.0625);
        this.offset.y = Math.sign(this.offset.y) * Math.max(0, Math.abs(this.offset.y) - 0.0625);
        this.alpha = Math.min(this.alpha + 0.0625, 1);
    }
    move() {
        let d = directions[this.direction].offset;
        this.x += d.x;
        this.y += d.y;
        this.offset.x = d.x;
        this.offset.y = d.y;
    }
}