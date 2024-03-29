class Game {

    /**
     * @param {Number} width 
     * @param {Number} height 
     * @param {Number} nbMines 
     */
    constructor(width, height, nbMines) {
        this.width = width;
        this.height = height;
        this.nbMines = nbMines;
        this.isBegin = true;
        this.isPlay = true;
        this.cells = null;
        this.hasMines = null;
        this.intervalId = null;
    }

    /**
     * Build grid
     */
    build() {
        this.cells = Array.from(Array(this.width), () => new Array(this.height).fill(null));
        this.hasMines = Array.from(Array(this.width), () => new Array(this.height).fill(false));
        let mines = 0;

        while (mines < this.nbMines) {
            let x = Math.floor(Math.random() * this.width);
            let y = Math.floor(Math.random() * this.height);

            if (!this.hasMines[x][y]) {
                this.hasMines[x][y] = true;
                mines++;
            }
        }

        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                const minesAround = this.checkSquare(i, j);
                this.cells[i][j] = new Cell(i, j, minesAround, true, this.hasMines[i][j], false);
            }
        }
    }

    /**
     * Returns the number of mines around
     * @param {Number} i 
     * @param {Number} j 
     * @returns number of mines around
     */
    checkSquare(i, j) {
        let minesAround = 0;

        for (let x = i - 1; x <= i + 1; x++) {
            for (let y = j - 1; y <= j + 1; y++) {
                if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
                    minesAround += this.hasMines[x][y];
                }
            }
        }
        return minesAround;
    }

    /**
     * Show on grid
     * @param {Number} x 
     * @param {Number} y 
     */
    show(x, y) {
        if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
            return;
        }
        if (!this.cells[x][y].isHide || this.cells[x][y].isFlag) {
            return;
        }
        if (this.isBegin) {
            this.isBegin = false;

            while (this.cells[x][y].nbMinesAround > 0) {
                this.build();
            }
            this.startTimer();
        }
        this.cells[x][y].isHide = false;

        if (this.cells[x][y].isMine) {
            this.stopTimer();
            this.isPlay = false;
        }
        if (this.cells[x][y].nbMinesAround === 0) {
            const neighbors = [
                { x: x - 1, y: y - 1 },
                { x: x - 1, y: y },
                { x: x - 1, y: y + 1 },
                { x: x, y: y - 1 },
                { x: x, y: y + 1 },
                { x: x + 1, y: y - 1 },
                { x: x + 1, y: y },
                { x: x + 1, y: y + 1 },
            ]
            neighbors.forEach(obj => this.show(obj.x, obj.y));
        }
    }

    /**
     * Check if user win
     * @returns true if user win (all flags)
     */
    isWon() {
        for (let row of this.cells) {
            for (let cell of row) {
                if (!cell.isMine && cell.isHide) {
                    return false;
                }
            }
        }
        return true;
    }

    /**
     * Update grid
     */
    update() {
        const grid = document.getElementById("grid");
        grid.innerHTML = null;

        for (const row of this.cells) {
            const tr = grid.insertRow();
            for (const cell of row) {
                const td = tr.insertCell();
                td.classList.add("cell");

                if (cell.isHide) {
                    td.classList.add("hide");
                }
                if (cell.isMine && !this.isPlay) {
                    td.classList.add("mine");
                }
                if (cell.isFlag) {
                    td.classList.add("flag");
                }
                let text;

                if (!this.isPlay && cell.isMine) {
                    text = document.createTextNode("💣");
                } else if (cell.isFlag) {
                    text = document.createTextNode("🚩");
                } else {
                    text = document.createTextNode(cell.isHide
                        || cell.isMine
                        || !cell.nbMinesAround > 0 ? '' : cell.nbMinesAround);
                    td.style.color = getColorByNbMines(cell.nbMinesAround);
                }
                td.appendChild(text);

                // On left click
                td.addEventListener("click", () => {
                    if (this.isPlay) {
                        this.show(cell.x, cell.y);
                        this.update();
                    }
                });

                // On right click
                td.addEventListener("contextmenu", (e) => {
                    e.preventDefault();
                    if (this.isPlay && !this.isBegin && cell.isHide) {
                        cell.isFlag = !cell.isFlag;
                        this.update();
                    }
                });

                this.getRemainingMines();
            }
        }

        if (this.isWon()) {
            this.stopTimer();
            this.isPlay = false;
            const timeContent = document.getElementById("time-counter").textContent;
            alert(`YOU WON ! Duration ${timeContent} seconds.`);
        }
    }

    getRemainingMines() {
        const minesCounter = document.getElementById("mines-counter");
        let remainingMines = 0;

        for (let row of this.cells) {
            remainingMines += row.filter(cell => cell.isFlag).length;
        }
        minesCounter.textContent = this.nbMines - remainingMines;
    }

    startTimer() {
        if (this.intervalId === null) {
            const timeCounter = document.getElementById("time-counter");
            this.intervalId = setInterval(() => timeCounter.textContent = parseInt(timeCounter.textContent) + 1, 1000);
        }
    }

    stopTimer() {
        if (this.intervalId !== null) {
            clearInterval(this.intervalId);
            this.intervalId = undefined;
        }
    }
}