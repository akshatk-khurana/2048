// Important components for reuse
const currentScoreElement = document.querySelector('#score-display');
const bestScoreElement = document.querySelector('#best-score-display');
const newGameButton = document.querySelector('#new-game');

// Important variables to be used throughout the game
let gameStarted = false;
let scoreTracker = 0;
let choices = ["_2", "_4"] 

// Rows and columns for the 4x4 grid in index.html
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
            move(event.key);
            if (scoreTracker > parseInt(getBestScore())) {
                localStorage.setItem("best", scoreTracker)
                bestScoreElement.innerHTML = scoreTracker;
            }

            if (is2048OnBoard() == true) {
                alert('You have won by reaching the 2048 tile!');
            }

            if (isGridFull() == false) {
                console.log('Generating random tile.')
                generateRandomTile();
            } else {
                console.log('Grid is full!')
                if (isGameFinished() == true) {
                    console.log('Game is finished!')
                    gameStarted = false;
                    alert('You lost!')
                    startGame();
                }
            }
        }
    }
})

// All utility functions that need for the game logic to run.

function startGame(first) {
    if (first == false) {clearBoard()}
    gameStarted = true;
    bestScoreElement.innerHTML = getBestScore();
    
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

function clearBoard() {
    document.querySelectorAll('td').forEach(square => {
        square.className = '';
        square.innerHTML = '';
    });

    gameStarted = false;
    scoreTracker = 0;
    currentScoreElement.innerHTML = 0;
}

function getBestScore() {
    if (!localStorage.getItem("best")) {
        localStorage.setItem("best", 0);
        return 0
    } else {return localStorage.getItem("best")}
}

function isGameFinished() {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            let top;
            let bottom;
            let left;
            let right;

            if (i != 0) {top = document.getElementById(`(${i-1},${j})`).innerHTML};
            if (i != 3) {bottom = document.getElementById(`(${i+1},${j})`).innerHTML};
            if (j != 0) {left = document.getElementById(`(${i},${j-1})`).innerHTML};
            if (j != 3) {right = document.getElementById(`(${i},${j+1})`).innerHTML};

            let current = document.getElementById(`(${i},${j})`).innerHTML;
            if (top == current || bottom == current || left == current || right == current) {
                return false;
            }
        }
    }
    return true
}

function isGridFull() {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (document.getElementById(columns[i][j]).className == '') {return false}
        }
    }
    return true;
}

function is2048OnBoard() {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (document.getElementById(columns[i][j]).className == '_2048') {return true}
        }
    }
    return false;
}

function changeScore(scoreToAdd) {
    scoreTracker += scoreToAdd;
    currentScoreElement.innerHTML = scoreTracker;
}

// Most important game logic is contained within these two functions

function moveTilesWithoutMerge(list) {
    for (let j = 1; j < 4; j++) {
        let tileAtCurrentIndex = document.getElementById(list[j]);
        let tileAtBeforeIndex = document.getElementById(list[j-1]);

        if (tileAtCurrentIndex.className.length == 0) {
            if (tileAtBeforeIndex.className.length > 0) {
                changeTile(list[j], tileAtBeforeIndex.className);
                if (j > 1) {
                    changeTile(list[j-1], document.getElementById(list[j-2]).className);
                    if (j > 2) {
                        changeTile(list[j-2], document.getElementById(list[j-3]).className);
                        changeTile(list[j-3], "");
                    } else {
                        changeTile(list[j-2], "");
                    }
                } else {
                    changeTile(list[j-1], "");
                }
            }
        }
    }
}

function move(direction) {
    let arrayToConsider = [];
    if (direction == 'ArrowDown' || direction == 'ArrowUp') {arrayToConsider = columns} 
    else {arrayToConsider = rows}

    for (let i = 0; i < 4; i++) {
        let list = arrayToConsider[i].slice();
        if (direction == 'ArrowUp' || direction == 'ArrowLeft') {list.reverse()}

        moveTilesWithoutMerge(list);
        for (let j = 3; j > 0; j--) {
            let tileAtCurrentIndex = document.getElementById(list[j]);
            if (tileAtCurrentIndex.className != '') {

                let tileAtBeforeIndex = document.getElementById(list[j-1])
                if (tileAtBeforeIndex.className == tileAtCurrentIndex.className) {
                    let sum = 2*parseInt(tileAtCurrentIndex.className.slice(1));
                    changeScore(sum)
                    changeTile(list[j], `_${sum}`);
                    changeTile(list[j-1], '');
                }
            }
        }
        moveTilesWithoutMerge(list);
    }
}