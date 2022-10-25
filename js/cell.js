class Cell {

    /**
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} nbMinesAround
     * @param {Boolean} isHide
     * @param {Boolean} isMine 
     * @param {Boolean} isFlag
     */
    constructor(x, y, nbMinesAround, isHide, isMine, isFlag) {
        this.x = x;
        this.y = y;
        this.nbMinesAround = nbMinesAround;
        this.isHide = isHide;
        this.isMine = isMine;
        this.isFlag = isFlag;
    }
}