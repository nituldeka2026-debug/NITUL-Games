const ROWS = 8;
const COLS = 8;

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

let selected = null;
let locked = false;
let boosterMode = null;
let soundOn = true;


/* ELEMENTS */

const board = document.getElementById("board");

const scoreEl = document.getElementById("score");
const movesEl = document.getElementById("moves");
const goalEl = document.getElementById("goal");

const levelEl = document.getElementById("level");
const progressEl = document.getElementById("progress");

const modal = document.getElementById("modal");

const modalTitle =
    document.getElementById("modalTitle");

const modalText =
    document.getElementById("modalText");

const modalIcon =
    document.getElementById("modalIcon");

const modalStars =
    document.getElementById("modalStars");

const playBtn =
    document.getElementById("playBtn");

const comboText =
    document.getElementById("comboText");

const particles =
    document.getElementById("particles");

const boosterButtons =
    document.querySelectorAll(".booster");


/* RANDOM */

function randomType() {

    return TYPES[
        Math.floor(Math.random() * TYPES.length)
    ];

}


function wait(ms) {

    return new Promise(resolve =>
        setTimeout(resolve, ms)
    );

}


/* SOUND */

function playSound(type = "pop") {

    if (!soundOn) return;

    try {

        const AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;

        const ctx = new AudioContext();

        const oscillator =
            ctx.createOscillator();

        const gain =
            ctx.createGain();

        oscillator.connect(gain);
        gain.connect(ctx.destination);

        if (type === "pop") {
            oscillator.frequency.value = 420;
        }

        if (type === "blast") {
            oscillator.frequency.value = 160;
        }

        if (type === "combo") {
            oscillator.frequency.value = 720;
        }

        gain.gain.setValueAtTime(
            0.08,
            ctx.currentTime
        );

        gain.gain.exponentialRampToValueAtTime(
            0.001,
            ctx.currentTime + 0.18
        );

        oscillator.start();

        oscillator.stop(
            ctx.currentTime + 0.18
        );

    } catch (error) {

        // Sound unsupported - game still works

    }

}


/* CANDY */

function createCandy() {

    return {
        type: randomType(),
        special: null
    };

}


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


/* LEVEL SETTINGS */

function getMoves() {

    return Math.max(
        18,
        27 - Math.floor(level / 3)
    );

}


function getGoal() {

    return 25 + (level * 8);

}


/* START */

function startLevel() {

    score = 0;

    moves = getMoves();

    goal = getGoal();

    selected = null;

    boosterMode = null;

    locked = false;


    grid = Array.from(
        { length: ROWS },
        () => Array(COLS)
    );


    for (let r = 0; r < ROWS; r++) {

        for (let c = 0; c < COLS; c++) {

            let type;

            do {

                type = randomType();

            } while (
                wouldMatch(r, c, type)
            );


            grid[r][c] = {

                type,
                special: null

            };

        }

    }


    ensurePlayableBoard();

    render();

    updateUI();

}


function render() {

    board.innerHTML = "";


    for (let r = 0; r < ROWS; r++) {

        for (let c = 0; c < COLS; c++) {

            const cell =
                document.createElement("div");

            cell.className = "cell";

            cell.dataset.row = r;
            cell.dataset.col = c;


            const item =
                grid[r][c];


            if (item) {

                const candy =
                    document.createElement("div");

                candy.className =
                    `candy ${item.type}`;


                if (item.special) {

                    candy.classList.add(
                        item.special
                    );

                }


                if (
                    selected &&
                    selected.r === r &&
                    selected.c === c
                ) {

                    candy.classList.add(
                        "selected"
                    );

                }


                cell.appendChild(candy);

            }


            cell.addEventListener(
                "pointerdown",
                () => {

                    handleCellClick(r, c);

                }
            );


            board.appendChild(cell);

        }

    }

}


/* UI */

function updateUI() {

    scoreEl.textContent = score;

    movesEl.textContent = moves;

    goalEl.textContent =
        `${Math.max(0, goal)}/${getGoal()}`;

    levelEl.textContent = level;


    const progress =
        ((getGoal() - goal) /
        getGoal()) * 100;


    progressEl.style.width =
        `${Math.min(100, progress)}%`;


    updateStars(progress);

}


function updateStars(progress) {

    const stars = [
        document.getElementById("star1"),
        document.getElementById("star2"),
        document.getElementById("star3")
    ];


    stars.forEach(star =>
        star.classList.remove("active")
    );


    if (progress >= 25) {

        stars[0].classList.add("active");

    }

    if (progress >= 55) {

        stars[1].classList.add("active");

    }

    if (progress >= 90) {

        stars[2].classList.add("active");

    }

}


/* CLICK */

function handleCellClick(r, c) {

    if (locked) return;


    if (boosterMode) {

        useBooster(r, c);

        return;

    }


    const candy =
        grid[r][c];


    if (!candy) return;


    if (candy.special && !selected) {

        activateSpecial(r, c);

        return;

    }


    selectCandy(r, c);

}


function selectCandy(r, c) {

    if (!selected) {

        selected = { r, c };

        render();

        return;

    }


    if (
        selected.r === r &&
        selected.c === c
    ) {

        selected = null;

        render();

        return;

    }


    const distance =
        Math.abs(r - selected.r) +
        Math.abs(c - selected.c);


    if (distance !== 1) {

        selected = { r, c };

        render();

        return;

    }


    const first =
        { ...selected };


    selected = null;


    swapCandies(
        first.r,
        first.c,
        r,
        c
    );

}


/* SWAP */

async function swapCandies(
    r1,
    c1,
    r2,
    c2
) {

    if (
        locked ||
        moves <= 0
    ) return;


    locked = true;


    [
        grid[r1][c1],
        grid[r2][c2]
    ] =
    [
        grid[r2][c2],
        grid[r1][c1]
    ];


    render();

    await wait(160);


    const first =
        grid[r1][c1];

    const second =
        grid[r2][c2];


    /* SPECIAL COMBINATION */

    if (
        first?.special ||
        second?.special
    ) {

        moves--;

        await activateSwapSpecial(
            r1,
            c1,
            r2,
            c2
        );

        locked = false;

        checkGameEnd();

        return;

    }


    let matches =
        findMatches();


    if (matches.length === 0) {

        [
            grid[r1][c1],
            grid[r2][c2]
        ] =
        [
            grid[r2][c2],
            grid[r1][c1]
        ];


        render();

        playSound("pop");

        locked = false;

        return;

    }


    moves--;


    await resolveMatches(
        matches,
        { r: r2, c: c2 }
    );


    locked = false;

    checkGameEnd();

}


/* MATCH DETECTION */

function findMatches() {

    const map = new Map();


    /* HORIZONTAL */

    for (let r = 0; r < ROWS; r++) {

        let start = 0;


        for (
            let c = 1;
            c <= COLS;
            c++
        ) {

            if (
                c < COLS &&
                grid[r][c] &&
                grid[r][start] &&
                grid[r][c].type ===
                grid[r][start].type
            ) {

                continue;

            }


            const length =
                c - start;


            if (length >= 3) {

                for (
                    let x = start;
                    x < c;
                    x++
                ) {

                    const key =
                        `${r},${x}`;


                    const old =
                        map.get(key);


                    map.set(key, {

                        r,
                        c: x,

                        horizontal:
                            Math.max(
                                length,
                                old?.horizontal || 0
                            ),

                        vertical:
                            old?.vertical || 0

                    });

                }

            }


            start = c;

        }

    }


    /* VERTICAL */

    for (let c = 0; c < COLS; c++) {

        let start = 0;


        for (
            let r = 1;
            r <= ROWS;
            r++
        ) {

            if (
                r < ROWS &&
                grid[r][c] &&
                grid[start][c] &&
                grid[r][c].type ===
                grid[start][c].type
            ) {

                continue;

            }


            const length =
                r - start;


            if (length >= 3) {

                for (
                    let y = start;
                    y < r;
                    y++
                ) {

                    const key =
                        `${y},${c}`;

                    const old =
                        map.get(key);


                    map.set(key, {

                        r: y,
                        c,

                        horizontal:
                            old?.horizontal || 0,

                        vertical:
                            Math.max(
                                length,
                                old?.vertical || 0
                            )

                    });

                }

            }


            start = r;

        }

    }


    return [
        ...map.values()
    ];

}


/* SPECIAL CREATION */

function chooseSpecial(
    matches,
    preferred
) {

    let special = null;


    const crossMatch =
        matches.find(item =>
            item.horizontal >= 3 &&
            item.vertical >= 3
        );


    if (crossMatch) {

        special = "bomb";

        return {
            r: preferred?.r ??
                crossMatch.r,

            c: preferred?.c ??
                crossMatch.c,

            special
        };

    }


    let maxLength = 0;


    matches.forEach(item => {

        maxLength = Math.max(
            maxLength,
            item.horizontal || 0,
            item.vertical || 0
        );

    });


    if (maxLength >= 5) {

        special = "rainbow";

    } else if (maxLength === 4) {

        special = "rocket";

    }


    if (!special) return null;


    const preferredMatch =
        matches.find(item =>
            item.r === preferred?.r &&
            item.c === preferred?.c
        );


    const target =
        preferredMatch || matches[0];


    return {

        r: target.r,
        c: target.c,
        special

    };

}


/* RESOLVE */

async function resolveMatches(
    matches,
    preferred = null
) {

    let combo = 1;


    while (matches.length > 0) {

        const specialInfo =
            chooseSpecial(
                matches,
                preferred
            );


        const keepKey =
            specialInfo
                ? `${specialInfo.r},${specialInfo.c}`
                : null;


        let removed = 0;


        /* BLAST ANIMATION */

        for (
            const item of matches
        ) {

            const key =
                `${item.r},${item.c}`;


            if (
                key === keepKey
            ) continue;


            if (
                grid[item.r][item.c]
            ) {

                animateBlast(
                    item.r,
                    item.c
                );


                createParticles(
                    item.r,
                    item.c,
                    grid[item.r][item.c].type
                );


                grid[item.r][item.c] =
                    null;


                removed++;

            }

        }


        if (specialInfo) {

            grid[
                specialInfo.r
            ][
                specialInfo.c
            ] = {

                type: randomType(),

                special:
                    specialInfo.special

            };

        }


        score +=
            removed *
            60 *
            combo;


        goal =
            Math.max(
                0,
                goal - removed
            );


        if (combo >= 2) {

            showCombo(combo);

            playSound("combo");

        } else {

            playSound("blast");

        }


        render();

        updateUI();


        await wait(260);


        collapseBoard();


        render();


        await wait(230);


        matches =
            findMatches();


        preferred = null;

        combo++;

    }


    ensurePlayableBoard();

    render();

    updateUI();

}


/* ANIMATION */

function animateBlast(r, c) {

    const index =
        r * COLS + c;


    const cell =
        board.children[index];


    const candy =
        cell?.querySelector(".candy");


    candy?.classList.add("blast");

}


function createParticles(
    r,
    c,
    type
) {

    const cellSize =
        board.clientWidth / COLS;


    const rect =
        board.getBoundingClientRect();


    const x =
        rect.left +
        c * cellSize +
        cellSize / 2;


    const y =
        rect.top +
        r * cellSize +
        cellSize / 2;


    const colors = {

        red: "#ff5370",
        yellow: "#ffd53d",
        blue: "#52baff",
        green: "#6ee46a",
        purple: "#bd68ff",
        orange: "#ff8d38"

    };


    for (
        let i = 0;
        i < 10;
        i++
    ) {

        const particle =
            document.createElement("div");


        particle.className =
            "particle";


        particle.style.left =
            `${x}px`;

        particle.style.top =
            `${y}px`;

        particle.style.background =
            colors[type] || "#fff";


        particle.style.setProperty(
            "--x",
            `${(Math.random() - .5) * 130}px`
        );


        particle.style.setProperty(
            "--y",
            `${(Math.random() - .5) * 130}px`
        );


        particles.appendChild(
            particle
        );


        setTimeout(() => {

            particle.remove();

        }, 650);

    }

}


/* COMBO */

function showCombo(combo) {

    comboText.textContent =
        combo === 2
            ? "SWEET COMBO!"
            : combo === 3
            ? "AMAZING!"
            : combo === 4
            ? "DELIGHTFUL!"
            : "PUKU BLAST!";


    comboText.classList.remove(
        "show"
    );


    void comboText.offsetWidth;


    comboText.classList.add(
        "show"
    );

}


/* COLLAPSE */

function collapseBoard() {

    for (
        let c = 0;
        c < COLS;
        c++
    ) {

        const column = [];


        for (
            let r = ROWS - 1;
            r >= 0;
            r--
        ) {

            if (grid[r][c]) {

                column.push(
                    grid[r][c]
                );

            }

        }


        let index = 0;


        for (
            let r = ROWS - 1;
            r >= 0;
            r--
        ) {

            if (
                index < column.length
            ) {

                grid[r][c] =
                    column[index++];

            } else {

                grid[r][c] =
                    createCandy();

            }

        }

    }

}


/* SPECIAL ACTIVATE */

async function activateSpecial(
    r,
    c
) {

    if (locked) return;


    const special =
        grid[r][c]?.special;


    if (!special) return;


    locked = true;


    moves--;


    const target =
        grid[r][c]?.type;


    let removed = [];


    if (
        special === "rocket"
    ) {

        for (
            let x = 0;
            x < COLS;
            x++
        ) {

            removed.push({
                r,
                c: x
            });

        }

    }


    if (
        special === "rainbow"
    ) {

        const randomTarget =
            randomType();


        for (
            let y = 0;
            y < ROWS;
            y++
        ) {

            for (
                let x = 0;
                x < COLS;
                x++
            ) {

                if (
                    grid[y][x]?.type ===
                    randomTarget
                ) {

                    removed.push({
                        r: y,
                        c: x
                    });

                }

            }

        }

    }


    if (
        special === "bomb"
    ) {

        for (
            let y = r - 1;
            y <= r + 1;
            y++
        ) {

            for (
                let x = c - 1;
                x <= c + 1;
                x++
            ) {

                if (
                    y >= 0 &&
                    y < ROWS &&
                    x >= 0 &&
                    x < COLS
                ) {

                    removed.push({
                        r: y,
                        c: x
                    });

                }

            }

        }

    }


    await removeCells(
        removed
    );


    locked = false;

    checkGameEnd();

}


/* SPECIAL SWAP */

async function activateSwapSpecial(
    r1,
    c1,
    r2,
    c2
) {

    const first =
        grid[r1][c1];

    const second =
        grid[r2][c2];


    let cells = [];


    if (
        first.special === "rainbow" ||
        second.special === "rainbow"
    ) {

        const targetType =
            first.special === "rainbow"
                ? second.type
                : first.type;


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
                    grid[r][c]?.type ===
                    targetType
                ) {

                    cells.push({ r, c });

                }

            }

        }

    } else {

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

                cells.push({ r, c });

            }

        }

    }


    await removeCells(cells);

}


/* REMOVE */

async function removeCells(cells) {

    let removed = 0;

    const unique =
        new Map();


    cells.forEach(item => {

        unique.set(
            `${item.r},${item.c}`,
            item
        );

    });


    unique.forEach(item => {

        if (
            grid[item.r][item.c]
        ) {

            animateBlast(
                item.r,
                item.c
            );


            createParticles(
                item.r,
                item.c,
                grid[item.r][item.c].type
            );


            grid[item.r][item.c] =
                null;


            removed++;

        }

    });


    score += removed * 80;

    goal =
        Math.max(
            0,
            goal - removed
        );


    playSound("blast");


    await wait(260);


    collapseBoard();


    render();

    updateUI();


    await wait(220);


    const matches =
        findMatches();


    if (matches.length) {

        await resolveMatches(
            matches
        );

    }

}


/* BOOSTERS */

async function useBooster(
    r,
    c
) {

    if (
        locked ||
        !boosterMode
    ) return;


    const button =
        [...boosterButtons].find(
            btn =>
                btn.dataset.type ===
                boosterMode
        );


    const count =
        button?.querySelector("b");


    if (
        !count ||
        Number(count.textContent) <= 0
    ) {

        boosterMode = null;

        return;

    }


    locked = true;


    let cells = [];


    if (
        boosterMode === "hammer"
    ) {

        cells.push({ r, c });

    }


    if (
        boosterMode === "rocket"
    ) {

        for (
            let x = 0;
            x < COLS;
            x++
        ) {

            cells.push({
                r,
                c: x
            });

        }

    }


    if (
        boosterMode === "bomb"
    ) {

        for (
            let y = r - 1;
            y <= r + 1;
            y++
        ) {

            for (
                let x = c - 1;
                x <= c + 1;
                x++
            ) {

                if (
                    y >= 0 &&
                    y < ROWS &&
                    x >= 0 &&
                    x < COLS
                ) {

                    cells.push({
                        r: y,
                        c: x
                    });

                }

            }

        }

    }


    if (
        boosterMode === "rainbow"
    ) {

        const type =
            grid[r][c].type;


        for (
            let y = 0;
            y < ROWS;
            y++
        ) {

            for (
                let x = 0;
                x < COLS;
                x++
            ) {

                if (
                    grid[y][x]?.type ===
                    type
                ) {

                    cells.push({
                        r: y,
                        c: x
                    });

                }

            }

        }

    }


    count.textContent =
        Math.max(
            0,
            Number(count.textContent) - 1
        );


    moves--;


    button.classList.remove(
        "active"
    );


    boosterMode = null;


    await removeCells(cells);


    locked = false;

    checkGameEnd();

}


/* PLAYABLE BOARD */

function ensurePlayableBoard() {

    let tries = 0;


    while (
        !hasPossibleMove() &&
        tries < 50
    ) {

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

                grid[r][c] =
                    createCandy();

            }

        }


        while (
            findMatches().length > 0
        ) {

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

                    grid[r][c] =
                        createCandy();

                }

            }

        }


        tries++;

    }

}


function hasPossibleMove() {

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

            const directions = [
                [0, 1],
                [1, 0]
            ];


            for (
                const [dr, dc]
                of directions
            ) {

                const nr =
                    r + dr;

                const nc =
                    c + dc;


                if (
                    nr >= ROWS ||
                    nc >= COLS
                ) continue;


                [
                    grid[r][c],
                    grid[nr][nc]
                ] =
                [
                    grid[nr][nc],
                    grid[r][c]
                ];


                const works =
                    findMatches().length > 0;


                [
                    grid[r][c],
                    grid[nr][nc]
                ] =
                [
                    grid[nr][nc],
                    grid[r][c]
                ];


                if (works) {

                    return true;

                }

            }

        }

    }


    return false;

}


/* END GAME */

function checkGameEnd() {

    if (goal <= 0) {

        winLevel();

        return;

    }


    if (moves <= 0) {

        loseLevel();

    }

}


function winLevel() {

    locked = true;


    let stars = 1;


    const completed =
        ((getGoal() - goal) /
        getGoal()) * 100;


    if (completed >= 55) stars++;

    if (completed >= 90) stars++;


    modalIcon.textContent = "🏆";

    modalTitle.textContent =
        "LEVEL COMPLETE!";


    modalText.textContent =
        `Amazing! You scored ${score} points!`;


    modalStars.textContent =
        "★".repeat(stars) +
        "☆".repeat(3 - stars);


    playBtn.textContent =
        "NEXT LEVEL";


    playBtn.onclick = () => {

        level++;

        modal.classList.add(
            "hidden"
        );

        startLevel();

    };


    modal.classList.remove(
        "hidden"
    );

}


function loseLevel() {

    locked = true;


    modalIcon.textContent = "😵";

    modalTitle.textContent =
        "OUT OF MOVES";


    modalText.textContent =
        "Try again and create bigger chocolate combos!";


    modalStars.textContent =
        "☆☆☆";


    playBtn.textContent =
        "TRY AGAIN";


    playBtn.onclick = () => {

        modal.classList.add(
            "hidden"
        );

        startLevel();

    };


    modal.classList.remove(
        "hidden"
    );

}


/* BOOSTER BUTTONS */

boosterButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            if (locked) return;


            const type =
                button.dataset.type;


            boosterButtons.forEach(btn =>
                btn.classList.remove(
                    "active"
                )
            );


            if (
                boosterMode === type
            ) {

                boosterMode = null;

                return;

            }


            boosterMode = type;


            button.classList.add(
                "active"
            );

        }
    );

});


/* MENU */

const menuPanel =
    document.getElementById(
        "menuPanel"
    );


document
    .getElementById("menuBtn")
    .addEventListener(
        "click",
        () => {

            menuPanel.classList.add(
                "show"
            );

        }
    );


document
    .getElementById("closeMenu")
    .addEventListener(
        "click",
        () => {

            menuPanel.classList.remove(
                "show"
            );

        }
    );


document
    .getElementById("restartBtn")
    .addEventListener(
        "click",
        () => {

            menuPanel.classList.remove(
                "show"
            );

            startLevel();

        }
    );


document
    .getElementById("soundBtn")
    .addEventListener(
        "click",
        function () {

            soundOn =
                !soundOn;


            this.textContent =
                soundOn
                    ? "🔊 Sound On"
                    : "🔇 Sound Off";

        }
    );


function goHome() {

    window.location.href =
        "../../index.html";

}


document
    .getElementById("homeBtn")
    .addEventListener(
        "click",
        goHome
    );


document
    .getElementById("menuHomeBtn")
    .addEventListener(
        "click",
        goHome
    );


/* START BUTTON */

playBtn.onclick = () => {

    modal.classList.add(
        "hidden"
    );

    startLevel();

};


/* START */

startLevel();
