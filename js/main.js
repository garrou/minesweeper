function play(width, height, nbBombs) {
    const board = new Board(width, height, nbBombs);
    board.build();
    board.update();
}

play(9, 9, 10);