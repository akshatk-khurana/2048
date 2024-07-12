// Important components
const currentScoreElement = document.querySelector('#score-display');
const bestScoreElement = document.querySelector('#best-score-display');
const newGameButton = document.querySelector('#new-game');

// Important variables
let gameStarted = false;
let scoreTracker = 0;
let choices = ["_2", "_4"] 

// Rows + Columns (4x4)
const columns = [
    ['(0,0)', '(1,0)', '(2,0)', '(3,0)'],
    ['(0,1)', '(1,1)', '(2,1)', '(3,1)'],
    ['(0,2)', '(1,2)', '(2,2)', '(3,2)'],
    ['(0,3)', '(1,3)', '(2,3)', '(3,3)'],
]

const rows = [
    ['(0,0)', '(0,1)', '(0,2)', '(0,3)'],
    ['(1,0)', '(1,1)', '(1,2)', '(1,3)'],
    ['(2,0)', '(2,1)', '(2,2)', '(2,3)'],
    ['(3,0)', '(3,1)', '(3,2)', '(3,3)'],
]

document.addEventListener("DOMContentLoaded", () => {
    startGame(true);
    newGameButton.addEventListener('click', () => {startGame(false)})
})

window.addEventListener('keydown', (event) => {
    if (gameStarted == true) {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].indexOf(event.key) != -1) {
            console.log(`${event.key} was pressed!`);
        }
    }
})

function startGame(first) {
    gameStarted = true;
    
    let tileClass = choices[Math.round(Math.random() * 1)];
    for (let i = 0; i < 2; i++) {generateRandomTile(tileClass)}
}

function randomCoordinate() {
    let x = Math.round(Math.random() * 3)
    let y = Math.round(Math.random() * 3)
    return [x, y]
}

function changeTile(coordinate, className) {
    const tile = document.getElementById(coordinate);
    tile.className = className;
    if (className == "") {tile.innerHTML = ""} 
    else {tile.innerHTML = className.slice(1)}
}

function generateRandomTile(chosenClass) {
    let coordinate = randomCoordinate();

    let x = coordinate[0]
    let y = coordinate[1]

    while (document.getElementById(`(${x},${y})`).className != '') {
        let newCoordinate = randomCoordinate();
        x = newCoordinate[0];
        y = newCoordinate[1];
    }

    let tileClass = '';

    if (chosenClass == null) {tileClass = choices[Math.round(Math.random() * 1)]} 
    else {tileClass = chosenClass}
    changeTile(`(${x},${y})`, tileClass);
}