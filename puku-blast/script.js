const ROWS = 9;
const COLS = 9;

const TYPES = [
    "red",
    "yellow",
    "blue",
    "green",
    "purple",
    "orange"
];


let grid = [];

let score = 0;

let moves = 25;

let goal = 30;

let level = 1;

let locked = false;

let selected = null;


/* ELEMENTS */

const board =
    document.getElementById("board");

const scoreEl =
    document.getElementById("score");

const movesEl =
    document.getElementById("moves");

const goalEl =
    document.getElementById("goal");

const levelEl =
    document.getElementById("level");

const progress =
    document.getElementById("progress");

const modal =
    document.getElementById("modal");

const modalTitle =
    document.getElementById("modalTitle");

const modalText =
    document.getElementById("modalText");

const playBtn =
    document.getElementById("playBtn");


/* RANDOM CANDY */

function randomType() {

    return TYPES[
        Math.floor(
            Math.random() * TYPES.length
        )
    ];
}


/* PREVENT STARTING MATCH */

function wouldMatch(r, c, type) {

    const horizontal =
        c >= 2 &&
        grid[r][c - 1]?.type === type &&
        grid[r][c - 2]?.type === type;

    const vertical =
        r >= 2 &&
        grid[r - 1]?.[c]?.type === type &&
        grid[r - 2]?.[c]?.type === type;

    return horizontal || vertical;
}


/* START LEVEL */

function startLevel() {

    score = 0;

    moves =
        25 +
        Math.min(
            10,
            Math.floor(level / 5)
        );

    goal =
        30 +
        level * 4;


    grid =
        Array.from(
            { length: ROWS },
            () => Array(COLS)
        );


    for (
        let r = 0;
        r < ROWS;
        r++
    ) {

        for (
            let c = 0;
            c < COLS;
            c++
        ) {

            let type;

            do {

                type =
                    randomType();

            } while (
                wouldMatch(
                    r,
                    c,
                    type
                )
            );


            grid[r][c] = {

                type: type,

                special: null

            };

        }

    }


    render();

    updateUI();
}


/* DRAW BOARD */

function render() {

    board.innerHTML = "";


    for (
        let r = 0;
        r < ROWS;
        r++
    ) {

        for (
            let c = 0;
            c < COLS;
            c++
        ) {

            const cell =
                document.createElement(
                    "div"
                );


            cell.className =
                "cell";


            const candy =
                document.createElement(
                    "div"
                );


            const item =
                grid[r][c];


            candy.className =
                "candy " +
                item.type +
                (
                    item.special
                    ?
                    " " +
                    item.special
                    :
                    ""
                );


            cell.appendChild(
                candy
            );


            cell.addEventListener(
                "pointerdown",
                () => selectCandy(r, c)
            );


            board.appendChild(
                cell
            );

        }

    }

}


/* SELECT CANDY */

function selectCandy(r, c) {

    if (locked) return;


    if (!selected) {

        selected = {
            r: r,
            c: c
        };

        return;

    }


    const rowDifference =
        Math.abs(
            r - selected.r
        );


    const colDifference =
        Math.abs(
            c - selected.c
        );


    if (
        rowDifference +
        colDifference === 1
    ) {

        swapCandies(
            selected.r,
            selected.c,
            r,
            c
        );

    }


    selected = null;
}


/* SWAP */

async function swapCandies(
    r1,
    c1,
    r2,
    c2
) {

    [
        grid[r1][c1],
        grid[r2][c2]
    ] =
    [
        grid[r2][c2],
        grid[r1][c1]
    ];


    let matches =
        findMatches();


    if (
        matches.length === 0
    ) {

        [
            grid[r1][c1],
            grid[r2][c2]
        ] =
        [
            grid[r2][c2],
            grid[r1][c1]
        ];

        return;
    }


    moves--;

    locked = true;


    await resolveMatches(
        matches
    );


    locked = false;


    checkGameEnd();
}


/* FIND MATCHES */

function findMatches() {

    const matches =
        new Set();


    /* HORIZONTAL */

    for (
        let r = 0;
        r < ROWS;
        r++
    ) {

        let start = 0;


        for (
            let c = 1;
            c <= COLS;
            c++
        ) {

            if (
                c < COLS &&
                grid[r][c].type ===
                grid[r][start].type
            ) {

                continue;

            }


            if (
                c - start >= 3
            ) {

                for (
                    let x = start;
                    x < c;
                    x++
                ) {

                    matches.add(
                        `${r},${x}`
                    );

                }

            }


            start = c;

        }

    }


    /* VERTICAL */

    for (
        let c = 0;
        c < COLS;
        c++
    ) {

        let start = 0;


        for (
            let r = 1;
            r <= ROWS;
            r++
        ) {

            if (
                r < ROWS &&
                grid[r][c].type ===
                grid[start][c].type
            ) {

                continue;

            }


            if (
                r - start >= 3
            ) {

                for (
                    let x = start;
                    x < r;
                    x++
                ) {

                    matches.add(
                        `${x},${c}`
                    );

                }

            }


            start = r;

        }

    }


    return [
        ...matches
    ].map(
        value =>
            value
                .split(",")
                .map(Number)
    );
}


/* RESOLVE */

async function resolveMatches(
    matches
) {

    while (
        matches.length
    ) {

        score +=
            matches.length * 60;


        goal =
            Math.max(
                0,
                goal - matches.length
            );


        /* REMOVE */

        matches.forEach(
            ([r, c]) => {

                grid[r][c] =
                    null;

            }
        );


        render();

        updateUI();


        await wait(150);


        /* DROP */

        for (
            let c = 0;
            c < COLS;
            c++
        ) {

            let write =
                ROWS - 1;


            for (
                let r = ROWS - 1;
                r >= 0;
                r--
            ) {

                if (
                    grid[r][c]
                ) {

                    grid[write][c] =
                        grid[r][c];

                    write--;

                }

            }


            /* NEW CANDIES */

            for (
                let r = write;
                r >= 0;
                r--
            ) {

                grid[r][c] = {

                    type:
                        randomType(),

                    special:
                        null

                };

            }

        }


        render();


        await wait(150);


        matches =
            findMatches();

    }

}


/* UI */

function updateUI() {

    scoreEl.textContent =
        score.toLocaleString();


    movesEl.textContent =
        moves;


    const total =
        30 + level * 4;


    const completed =
        total - goal;


    goalEl.textContent =
        completed +
        "/" +
        total;


    levelEl.textContent =
        level;


    const percentage =
        (
            completed /
            total
        ) * 100;


    progress.style.width =
        Math.min(
            100,
            percentage
        ) + "%";

}


/* END GAME */

function checkGameEnd() {

    if (
        goal <= 0
    ) {

        modalTitle.textContent =
            "⭐ LEVEL COMPLETE!";


        modalText.textContent =
            "Excellent! You scored " +
            score.toLocaleString() +
            " points. Ready for the next level?";


        playBtn.textContent =
            "NEXT LEVEL";


        modal.classList.add(
            "show"
        );

    }


    else if (
        moves <= 0
    ) {

        modalTitle.textContent =
            "TRY AGAIN";


        modalText.textContent =
            "No moves left! Blast the candies again.";


        playBtn.textContent =
            "RETRY";


        modal.classList.add(
            "show"
        );

    }

}


/* WAIT */

function wait(ms) {

    return new Promise(
        resolve =>
            setTimeout(
                resolve,
                ms
            )
    );

}


/* PLAY BUTTON */

playBtn.addEventListener(
    "click",
    () => {

        if (
            goal <= 0
        ) {

            level++;

        }


        startLevel();


        modal.classList.remove(
            "show"
        );


        playBtn.textContent =
            "PLAY!";

    }
);


/* MENU */

document
    .getElementById("menuBtn")
    .addEventListener(
        "click",
        () => {

            modalTitle.textContent =
                "🍬 PUKU BLAST";


            modalText.textContent =
                "Match 3 or more candies, " +
                "make combos and clear the board!";


            playBtn.textContent =
                "PLAY!";


            modal.classList.add(
                "show"
            );

        }
    );


/* BOOSTERS */

document
    .querySelectorAll(".booster")
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    if (
                        locked ||
                        moves <= 0
                    ) return;


                    const type =
                        button.dataset.type;


                    /* SHUFFLE */

                    if (
                        type ===
                        "shuffle"
                    ) {

                        const all =
                            grid
                                .flat()
                                .sort(
                                    () =>
                                        Math.random() -
                                        0.5
                                );


                        grid =
                            Array.from(
                                {
                                    length:
                                        ROWS
                                },
                                (_, r) =>
                                    all.slice(
                                        r * COLS,
                                        r * COLS +
                                        COLS
                                    )
                            );


                        score += 50;

                    }


                    /* HAMMER */

                    if (
                        type ===
                        "hammer"
                    ) {

                        const r =
                            Math.floor(
                                Math.random() *
                                ROWS
                            );


                        const c =
                            Math.floor(
                                Math.random() *
                                COLS
                            );


                        grid[r][c] = {

                            type:
                                randomType(),

                            special:
                                null

                        };


                        score += 100;

                    }


                    /* ROCKET */

                    if (
                        type ===
                        "rocket"
                    ) {

                        const r =
                            Math.floor(
                                Math.random() *
                                ROWS
                            );


                        for (
                            let c = 0;
                            c < COLS;
                            c++
                        ) {

                            grid[r][c] =
                                null;

                        }


                        score += 500;

                    }


                    /* BOMB */

                    if (
                        type ===
                        "bomb"
                    ) {

                        const r =
                            Math.floor(
                                Math.random() *
                                ROWS
                            );


                        const c =
                            Math.floor(
                                Math.random() *
                                COLS
                            );


                        for (
                            let y =
                                Math.max(
                                    0,
                                    r - 1
                                );

                            y <=
                                Math.min(
                                    ROWS - 1,
                                    r + 1
                                );

                            y++
                        ) {

                            for (
                                let x =
                                    Math.max(
                                        0,
                                        c - 1
                                    );

                                x <=
                                    Math.min(
                                        COLS - 1,
                                        c + 1
                                    );

                                x++
                            ) {

                                grid[y][x] =
                                    null;

                            }

                        }


                        score += 700;

                    }


                    /* RAINBOW */

                    if (
                        type ===
                        "rainbow"
                    ) {

                        const target =
                            randomType();


                        for (
                            let r = 0;
                            r < ROWS;
                            r++
                        ) {

                            for (
                                let c = 0;
                                c < COLS;
                                c++
                            ) {

                                if (
                                    grid[r][c]
                                        .type ===
                                    target
                                ) {

                                    grid[r][c] = {

                                        type:
                                            randomType(),

                                        special:
                                            null

                                    };

                                }

                            }

                        }


                        score += 1000;

                    }


                    moves--;


                    render();

                    updateUI();

                    checkGameEnd();

                }
            );

        }
    );


/* START */

startLevel();
