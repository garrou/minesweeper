/**
 * @param {Number} nb 
 * @returns {String}
 */
function getColorByNbMines(nb) {
    let color;

    switch (nb) {
        case 1:
            color = "blue";
            break;
        case 2:
            color = "green";
            break;
        case 3:
            color = "red";
            break;
        case 4:
            color = "purple";
            break;
        case 5:
            color = "maroon";
            break;
        case 6:
            color = "turquoise";
            break;
        case 7:
            color = "black";
            break;
        case 8:
            color = "grey";
            break;
    }
    return color;
}