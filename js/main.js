function play(width, height, nbBombs) {
    document.getElementById("time-counter").textContent = 0;

    const game = new Game(width, height, nbBombs);
    game.build();
    game.update();
}

play(9, 9, 10);