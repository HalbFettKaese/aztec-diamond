class Board {
    constructor() {
        this.reset();
    }
    reset() {
        this.setTileNum(2);
        this.dominos = [];
        this.nextMove = "populate";
        this.populate(1);
        draws = 1;
    }
    purge() {
        let dominosSorted = {
            up: {},
            down: {},
            left: {},
            right: {}
        };
        this.dominos.forEach(domino => {
            dominosSorted[domino.direction][domino.x + "," + domino.y] = domino;
        });
        let purged = [];
        for (const [_, domino] of Object.entries(dominosSorted.down)) {
            let other = dominosSorted.up[domino.x + "," + (domino.y + 1)];
            if (other) {
                purged.push(domino);
                purged.push(other);
            }
        }
        for (const [_, domino] of Object.entries(dominosSorted.right)) {
            let other = dominosSorted.left[(domino.x+1) + "," + domino.y];
            if (other) {
                purged.push(domino);
                purged.push(other);
            }
        };
    
        this.dominos = this.dominos.filter(rect => !purged.includes(rect));
        this.nextMove = "move";
    }

    move() {
        this.setTileNum(this.tileNum+2);
        this.dominos.forEach(r => {
            r.move();
        });
        this.nextMove = "populate";
    }

    populate(alpha) {
        let tiles = [];
        let n = this.tileNum;
        for (let x=-n/2;x<n/2;x++) {
            let newLine = [];
            for (let y=-n/2;y<n/2;y++) {
                let inBoard = (Math.abs(x+0.5) + Math.abs(y+0.5)) <= n/2;
                newLine.push(inBoard);
            }
            tiles.push(newLine);
        }
        this.dominos.forEach(domino => {
            let x = domino.x + n/2;
            let y = domino.y + n/2;
            tiles[Math.floor(x+0.25)][Math.floor(y+0.25)] = false;
            tiles[Math.floor(x-0.25)][Math.floor(y-0.25)] = false;
        });
        for (let x=-n/2;x<n/2-1;x++) {
            let yBorder = n/2-Math.abs(x)+1;
            for (let y=-yBorder;y<yBorder;y+=2) {
                let a = x + n/2;
                let b = y + n/2;
                if (tiles[a][b]) {
                    tiles[a][b] = tiles[a+1][b] = tiles[a][b+1] = tiles[a+1][b+1] = false;
                    if (Math.random() < 0.5) {
                        this.dominos.push(new Domino(x+1, y+0.5, "up", alpha));
                        this.dominos.push(new Domino(x+1, y+1.5, "down", alpha));
                    } else {
                        this.dominos.push(new Domino(x+0.5, y+1, "left", alpha));
                        this.dominos.push(new Domino(x+1.5, y+1, "right", alpha));
                    }
                }
            }
        }
        this.nextMove = "purge";
    }

    setTileNum(n) {
        this.tileNum = n;
        tileSizeX = (canvas.width - 2*borderWidth) / this.tileNum;
        tileSizeY = (canvas.height - 2*borderWidth) / this.tileNum;
        
        this.arrowAlpha = Math.max(0, Math.min(1, 16/n - 0.2));
    }

    step(until) {
        let wait = this.nextMove != until;
        while (this.nextMove != until) {
            this[this.nextMove](-1);
        }
        this[this.nextMove](wait ? -1 : 0);
        draws = 33;
    }

    draw() {
        this.drawOutline();
        for (let i=0; i<this.dominos.length; i++) {
            this.dominos[i].draw();
        }
    }

    drawOutline() {
        ctx.fillStyle = "black";
        let n = this.tileNum;
        for (let x=-1;x<=n;x++) {
            let y = 1/2 + n - Math.abs(x - (n-1) / 2);
            if (x<(n-1)/2) {
                ctx.fillRect((x+1)*tileSizeX, borderWidth+y*tileSizeY, borderWidth, tileSizeY+borderWidth);
            } else {
                ctx.fillRect(borderWidth+x*tileSizeX, borderWidth+y*tileSizeY, borderWidth, tileSizeY+borderWidth);
            }
            ctx.fillRect(borderWidth+x*tileSizeX, borderWidth+y*tileSizeY, tileSizeX, borderWidth);
            y = -3/2 + Math.abs(x - (n-1) / 2);
            if (x<(n-1)/2) {
                ctx.fillRect((x+1)*tileSizeX, y*tileSizeY, borderWidth, tileSizeY+borderWidth);
            } else {
                ctx.fillRect(borderWidth+x*tileSizeX, y*tileSizeY, borderWidth, tileSizeY+borderWidth);
            }
            ctx.fillRect(borderWidth+x*tileSizeX, (y+1)*tileSizeY, tileSizeX, borderWidth);
        }
    }

    getPi() {
        let tiles = [];
        let n = this.tileNum;
        for (let x=-n/2;x<n/2;x++) {
            let newLine = [];
            for (let y=-n/2;y<n/2;y++) {
                newLine.push(-1);
            }
            tiles.push(newLine);
        }
        let dirIds = Object.keys(directions);
        this.dominos.forEach(domino => {
            let x = domino.x + n/2;
            let y = domino.y + n/2;
            let dirId = dirIds.indexOf(domino.direction);
            tiles[Math.floor(x+0.25)][Math.floor(y+0.25)] = dirId;
            tiles[Math.floor(x-0.25)][Math.floor(y-0.25)] = dirId;
        });
        let count = 0;
        for (let i=0; i<4; i++) {
            let dirId = dirIds[i];
            let dx = directions[dirId].offset.x;
            let dy = directions[dirId].offset.y;
            let seedX = this.tileNum/2 + Math.floor(((this.tileNum-1) * dx)/2);
            let seedY = this.tileNum/2 + Math.floor(((this.tileNum-1    ) * dy)/2);
            if (tiles[seedX] == undefined || tiles[seedX][seedY] != i) continue;
            let frontier = [[seedX, seedY]];
            let visited = [seedX + "," + seedY];
            while (frontier.length) {
                count++;
                let current = frontier.shift();
                for (const [dx, dy] of [[1,0],[-1,0],[0,1],[0,-1]]) {
                    let next = [current[0]+dx, current[1]+dy];
                    if (tiles[next[0]] == undefined) continue;
                    let nextId = tiles[next[0]][next[1]];
                    if (nextId==i && !visited.includes(next[0] + "," + next[1])) {
                        frontier.push(next);
                        visited.push(next[0] + "," + next[1]);
                    }
                }
            }
        }
        let diamondCount = n*(n/2 + 1); // (2*r)² = 4 * r²
        let circleCount = diamondCount - count; // pi * r²
        let piApprox = circleCount / diamondCount * 4;
        return piApprox;
    }
}