const SIZE = 9;

const COLORS = [
    "red",
    "yellow",
    "blue",
    "green",
    "purple",
    "orange"
];

let board = [];

let score = 0;

let moves = 25;

let target = 0;

let need = 30;

let selected = null;

let busy = false;

let activeBooster = null;


const boardEl =
    document.getElementById("board");

const scoreEl =
    document.getElementById("score");

const movesEl =
    document.getElementById("moves");

const targetNow =
    document.getElementById("targetNow");

const targetNeed =
    document.getElementById("targetNeed");


/* RANDOM CANDY */

function randomCandy() {

    return COLORS[
        Math.floor(
            Math.random() * COLORS.length
        )
    ];

}


/* CREATE BOARD */

function createBoard() {

    board = [];

    for (let row = 0; row < SIZE; row++) {

        let newRow = [];

        for (let col = 0; col < SIZE; col++) {

            newRow.push({

                type: randomCandy(),

                blocked: false

            });

        }

        board.push(newRow);

    }


    /* HONEY BLOCKS */

    const blocks = [

        [0,0],[0,1],[0,3],
        [0,4],[0,5],[0,7],
        [0,8],

        [1,0],[1,1],
        [1,3],[1,4],[1,5],
        [1,7],[1,8],

        [2,0],
        [2,4],
        [2,8],

        [6,3],
        [6,5],

        [7,3],[7,4],[7,5],

        [8,3],[8,4],[8,5]

    ];


    blocks.forEach(pos => {

        let r = pos[0];

        let c = pos[1];

        board[r][c].blocked = true;

    });


    renderBoard();

}


/* DRAW BOARD */

function renderBoard() {

    boardEl.innerHTML = "";

    for (let r = 0; r < SIZE; r++) {

        for (let c = 0; c < SIZE; c++) {

            const data =
                board[r][c];


            const cell =
                document.createElement("button");


            cell.className = "cell";


            if (data.blocked) {

                cell.classList.add(
                    "blocked"
                );

            }


            const candy =
                document.createElement("div");


            candy.className =
                "candy " + data.type;


            cell.appendChild(candy);


            cell.addEventListener(
                "click",
                function() {

                    clickCandy(r, c);

                }
            );


            boardEl.appendChild(cell);

        }

    }


    updateHUD();

}


/* UPDATE SCORE */

function updateHUD() {

    scoreEl.textContent =
        score;

    movesEl.textContent =
        moves;

    targetNow.textContent =
        target;

    targetNeed.textContent =
        need;


    document
        .getElementById("scoreFill")
        .style.width =
        Math.min(
            100,
            score / 1500 * 100
        ) + "%";

}


/* CANDY CLICK */

function clickCandy(r, c) {

    if (busy) return;

    if (moves <= 0) return;


    if (board[r][c].blocked) {

        showMessage(
            "Blocked Candy!"
        );

        return;

    }


    /* FIRST SELECT */

    if (selected === null) {

        selected = [r, c];

        highlightSelected();

        return;

    }


    const sr =
        selected[0];

    const sc =
        selected[1];


    /* SAME CANDY */

    if (sr === r && sc === c) {

        selected = null;

        highlightSelected();

        return;

    }


    /* CHECK NEIGHBOUR */

    const distance =
        Math.abs(sr - r)
        +
        Math.abs(sc - c);


    if (distance !== 1) {

        selected = [r, c];

        highlightSelected();

        return;

    }


    swap(sr, sc, r, c);


    let matches =
        findMatches();


    /* NO MATCH */

    if (matches.length === 0) {

        swap(sr, sc, r, c);

        selected = null;

        renderBoard();

        showMessage(
            "No Match!"
        );

        return;

    }


    selected = null;

    moves--;


    resolveMatches(
        matches
    );

}


/* HIGHLIGHT */

function highlightSelected() {

    document
        .querySelectorAll(".cell")
        .forEach(cell => {

            cell.classList.remove(
                "selected"
            );

        });


    if (selected) {

        const r =
            selected[0];

        const c =
            selected[1];


        const cells =
            document.querySelectorAll(
                ".cell"
            );


        cells[
            r * SIZE + c
        ].classList.add(
            "selected"
        );

    }

}


/* SWAP */

function swap(
    r1,
    c1,
    r2,
    c2
) {

    const temp =
        board[r1][c1];


    board[r1][c1] =
        board[r2][c2];


    board[r2][c2] =
        temp;

}


/* FIND MATCH */

function findMatches() {

    let matches = [];


    /* HORIZONTAL */

    for (
        let r = 0;
        r < SIZE;
        r++
    ) {

        let count = 1;


        for (
            let c = 1;
            c <= SIZE;
            c++
        ) {

            if (
                c < SIZE
                &&
                board[r][c].type
                ===
                board[r][c - 1].type
            ) {

                count++;

            }

            else {

                if (
                    count >= 3
                ) {

                    for (
                        let i =
                            c - count;
                        i < c;
                        i++
                    ) {

                        matches.push(
                            [r, i]
                        );

                    }

                }

                count = 1;

            }

        }

    }


    /* VERTICAL */

    for (
        let c = 0;
        c < SIZE;
        c++
    ) {

        let count = 1;


        for (
            let r = 1;
            r <= SIZE;
            r++
        ) {

            if (

                r < SIZE

                &&

                board[r][c].type
                ===
                board[r - 1][c].type

            ) {

                count++;

            }

            else {

                if (
                    count >= 3
                ) {

                    for (

                        let i =
                            r - count;

                        i < r;

                        i++

                    ) {

                        matches.push(
                            [i, c]
                        );

                    }

                }

                count = 1;

            }

        }

    }


    /* REMOVE DUPLICATE */

    const unique =
        new Map();


    matches.forEach(pos => {

        unique.set(
            pos[0] + "-" + pos[1],
            pos
        );

    });


    return [
        ...unique.values()
    ];

}


/* REMOVE MATCH */

async function resolveMatches(matches) {

    busy = true;


    while (
        matches.length > 0
    ) {

        score +=
            matches.length * 20;


        target +=
            matches.length;


        matches.forEach(pos => {

            const r =
                pos[0];

            const c =
                pos[1];


            board[r][c] =
                null;

        });


        collapseBoard();


        renderBoard();


        await sleep(250);


        matches =
            findMatches();

    }


    busy = false;


    checkGame();

}


/* DROP CANDY */

function collapseBoard() {

    for (
        let c = 0;
        c < SIZE;
        c++
    ) {

        let candies = [];


        for (
            let r =
                SIZE - 1;
            r >= 0;
            r--
        ) {

            if (
                board[r][c]
                !== null
            ) {

                candies.push(
                    board[r][c]
                );

            }

        }


        for (
            let r =
                SIZE - 1;

            r >= 0;

            r--
        ) {

            let index =
                SIZE - 1 - r;


            if (
                candies[index]
            ) {

                board[r][c] =
                    candies[index];

            }

            else {

                board[r][c] = {

                    type:
                        randomCandy(),

                    blocked:
                        false

                };

            }

        }

    }

}


/* CHECK GAME */

function checkGame() {

    if (
        target >= need
    ) {

        gameOver(
            true
        );

        return;

    }


    if (
        moves <= 0
    ) {

        gameOver(
            false
        );

    }

}


/* GAME OVER */

function gameOver(win) {

    const modal =
        document.getElementById(
            "modal"
        );


    const title =
        document.getElementById(
            "modalTitle"
        );


    const text =
        document.getElementById(
            "modalText"
        );


    if (win) {

        title.textContent =
            "Level Complete! 🎉";


        text.textContent =
            "Excellent! You collected "
            +
            target
            +
            " targets.";

    }

    else {

        title.textContent =
            "Out of Moves!";


        text.textContent =
            "You collected "
            +
            target
            +
            " / "
            +
            need;

    }


    modal.classList.remove(
        "hidden"
    );

}


/* MESSAGE */

function showMessage(text) {

    const toast =
        document.getElementById(
            "toast"
        );


    toast.textContent =
        text;


    toast.classList.add(
        "show"
    );


    setTimeout(
        function() {

            toast.classList.remove(
                "show"
            );

        },
        1000
    );

}


/* DELAY */

function sleep(ms) {

    return new Promise(
        resolve =>
            setTimeout(
                resolve,
                ms
            )
    );

}


/* BOOSTERS */

document
    .querySelectorAll(
        ".booster"
    )
    .forEach(btn => {

        btn.addEventListener(
            "click",
            function() {

                activeBooster =
                    btn.dataset.booster;


                document
                    .querySelectorAll(
                        ".booster"
                    )
                    .forEach(b => {

                        b.classList.remove(
                            "active"
                        );

                    });


                btn.classList.add(
                    "active"
                );


                showMessage(
                    activeBooster
                    +
                    " selected"
                );

            }
        );

    });


/* MENU */

document
    .getElementById(
        "menuBtn"
    )
    .addEventListener(
        "click",
        function() {

            showMessage(
                "Puku Blast Menu"
            );

        }
    );


/* RESTART */

document
    .getElementById(
        "restartBtn"
    )
    .addEventListener(
        "click",
        function() {

            score = 0;

            moves = 25;

            target = 0;

            selected = null;


            document
                .getElementById(
                    "modal"
                )
                .classList.add(
                    "hidden"
                );


            createBoard();

        }
    );


/* START GAME */

createBoard();
