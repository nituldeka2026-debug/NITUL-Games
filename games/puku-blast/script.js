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
let goal = 34;
let level = 1;
let locked = false;
let selected = null;
let boosterMode = null;

const board = document.getElementById("board");
const scoreEl = document.getElementById("score");
const movesEl = document.getElementById("moves");
const goalEl = document.getElementById("goal");
const levelEl = document.getElementById("level");
const progress = document.getElementById("progress");

const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const modalText = document.getElementById("modalText");
const playBtn = document.getElementById("playBtn");

const boosterButtons = document.querySelectorAll(".booster");

function randomType() {
    return TYPES[Math.floor(Math.random() * TYPES.length)];
}

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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

function createCandy() {
    return {
        type: randomType(),
        special: null
    };
}

function getGoal() {
    return 30 + level * 4;
}

function getMoves() {
    return 25 + Math.min(8, Math.floor(level / 4));
}

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
            } while (wouldMatch(r, c, type));

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
            const cell = document.createElement("div");
            cell.className = "cell";

            const item = grid[r][c];

            if (item) {
                const candy = document.createElement("div");

                candy.className =
                    "candy " +
                    item.type +
                    (item.special ? " " + item.special : "");

                if (selected &&
                    selected.r === r &&
                    selected.c === c) {
                    candy.classList.add("selected");
                }

                cell.appendChild(candy);
            }

            cell.addEventListener("pointerdown", () => {
                handleCellClick(r, c);
            });

            board.appendChild(cell);
        }
    }
}

function handleCellClick(r, c) {
    if (locked) return;

    if (boosterMode) {
        useTargetBooster(r, c);
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

    const first = { ...selected };
    selected = null;

    swapCandies(
        first.r,
        first.c,
        r,
        c
    );
}

async function swapCandies(r1, c1, r2, c2) {
    if (locked || moves <= 0) return;

    locked = true;

    [grid[r1][c1], grid[r2][c2]] =
        [grid[r2][c2], grid[r1][c1]];

    render();

    await wait(120);

    let matches = findMatches();

    if (matches.length === 0) {
        [grid[r1][c1], grid[r2][c2]] =
            [grid[r2][c2], grid[r1][c1]];

        render();
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

function findMatches() {
    const matchMap = new Map();

    for (let r = 0; r < ROWS; r++) {
        let start = 0;

        for (let c = 1; c <= COLS; c++) {
            if (
                c < COLS &&
                grid[r][c] &&
                grid[r][start] &&
                grid[r][c].type === grid[r][start].type
            ) {
                continue;
            }

            const length = c - start;

            if (length >= 3) {
                for (let x = start; x < c; x++) {
                    const key = `${r},${x}`;

                    matchMap.set(key, {
                        r,
                        c: x,
                        horizontal: length
                    });
                }
            }

            start = c;
        }
    }

    for (let c = 0; c < COLS; c++) {
        let start = 0;

        for (let r = 1; r <= ROWS; r++) {
            if (
                r < ROWS &&
                grid[r][c] &&
                grid[start][c] &&
                grid[r][c].type === grid[start][c].type
            ) {
                continue;
            }

            const length = r - start;

            if (length >= 3) {
                for (let x = start; x < r; x++) {
                    const key = `${x},${c}`;
                    const old = matchMap.get(key);

                    matchMap.set(key, {
                        r: x,
                        c,
                        horizontal: old?.horizontal || 0,
                        vertical: length
                    });
                }
            }

            start = r;
        }
    }

    return [...matchMap.values()];
}

function chooseSpecial(matches, preferredCell) {
    let maxLength = 0;
    let special = null;

    for (const item of matches) {
        const size = Math.max(
            item.horizontal || 0,
            item.vertical || 0
        );

        if (size > maxLength) {
            maxLength = size;
        }
    }

    if (maxLength >= 5) {
        special = "rainbow";
    } else if (maxLength === 4) {
        special = "rocket";
    }

    if (!special) return null;

    const preferred = matches.find(
        item =>
            item.r === preferredCell?.r &&
            item.c === preferredCell?.c
    );

    return {
        r: preferred ? preferred.r : matches[0].r,
        c: preferred ? preferred.c : matches[0].c,
        special
    };
}

async function resolveMatches(matches, preferredCell) {
    let combo = 1;

    while (matches.length > 0) {
        const specialInfo =
            chooseSpecial(matches, preferredCell);

        const keepKey = specialInfo
            ? `${specialInfo.r},${specialInfo.c}`
            : null;

        let removed = 0;

        for (const item of matches) {
            const key = `${item.r},${item.c}`;

            if (key === keepKey) continue;

            if (grid[item.r][item.c]) {
                grid[item.r][item.c] = null;
                removed++;
            }
        }

        if (specialInfo) {
            grid[specialInfo.r][specialInfo.c] = {
                type: randomType(),
                special: specialInfo.special
            };
        }

        score += removed * 60 * combo;
        goal = Math.max(0, goal - removed);

        render();
        updateUI();

        await wait(180);

        collapseBoard();

        render();
        await wait(180);

        matches = findMatches();
        preferredCell = null;
        combo++;
    }

    ensurePlayableBoard();
    render();
    updateUI();
}

function collapseBoard() {
    for (let c = 0; c < COLS; c++) {
        const column = [];

        for (let r = ROWS - 1; r >= 0; r--) {
            if (grid[r][c]) {
                column.push(grid[r][c]);
            }
        }

        let index = 0;

        for (let r = ROWS - 1; r >= 0; r--) {
            if (index < column.length) {
                grid[r][c] = column[index++];
            } else {
                grid[r][c] = createCandy();
            }
        }
    }
}

function ensurePlayableBoard() {
    let tries = 0;

    while (!hasPossibleMove() && tries < 50) {
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                grid[r][c] = createCandy();
            }
        }

        while (findMatches().length > 0) {
            for (let r = 0; r < ROWS; r++) {
                for (let c = 0; c < COLS; c++) {
                    grid[r][c] = createCandy();
                }
            }
        }

        tries++;
    }
}

function hasPossibleMove() {
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            const directions = [
                [0, 1],
                [1, 0]
            ];

            for (const [dr, dc] of directions) {
                const nr = r + dr;
                const nc = c + dc;

                if (nr >= ROWS || nc >= COLS) continue;

                [grid[r][c], grid[nr][nc]] =
                    [grid[nr][nc], grid[r][c]];

                const works =
                    findMatches().length > 0;

                [grid[r][c], grid[nr][nc]] =
                    [grid[nr][nc], grid[r][c]];

                if (works) return true;
            }
        }
    }

    return false;
}

async function useTargetBooster(r, c) {
    if (!boosterMode || locked) return;

    const button = [...boosterButtons].find(
        btn => btn.dataset.type === boosterMode
    );

    const count = button?.querySelector("span");

    if (
        count &&
        count.textContent !== "+" &&
        Number(count.textContent) <= 0
    ) {
        boosterMode = null;
        return;
    }

    locked = true;

    let removed = 0;

    if (boosterMode === "hammer") {
        grid[r][c] = null;
        removed = 1;
    }

    if (boosterMode === "rocket") {
        for (let x = 0; x < COLS; x++) {
            if (grid[r][x]) {
                grid[r][x] = null;
                removed++;
            }
        }
    }

    if (boosterMode === "bomb") {
        for (let y = Math.max(0, r - 1);
            y <= Math.min(ROWS - 1, r + 1);
            y++) {

            for (let x = Math.max(0, c - 1);
                x <= Math.min(COLS - 1, c + 1);
                x++) {

                if (grid[y][x]) {
                    grid[y][x] = null;
                    removed++;
                }
            }
        }
    }

    if (boosterMode === "rainbow") {
        const targetType = grid[r][c].type;

        for (let y = 0; y < ROWS; y++) {
            for (let x = 0; x < COLS; x++) {
                if (grid[y][x]?.type === targetType) {
                    grid[y][x] = null;
                    removed++;
                }
            }
        }
    }

    if (count && count.textContent !== "+") {
        count.textContent =
            Math.max(0, Number(count.textContent) - 1);
    }

    score += removed * 80;
    goal = Math.max(0, goal - removed);

    moves--;
    boosterMode = null;

    collapseBoard();

    render();
    updateUI();

    await wait(150);

    let matches = findMatches();

    if (matches.length) {
        await resolveMatches(matches);
    }

    locked = false;
    checkGameEnd();
}

async function activateSpecial(r, c) {
    const special = grid[r][c]?.special;

    if (!special || locked) return;

    locked = true;

    let removed = 0;

    if (special === "rocket") {
        for (let x = 0; x < COLS; x++) {
            if (grid[r][x]) {
                grid[r][x] = null;
                removed++;
            }
        }
    }

    if (special === "rainbow") {
        const target = randomType();

        for (let y = 0; y < ROWS; y++) {
            for (let x = 0; x < COLS; x++) {
                if (grid[y][x]?.type === target) {
                    grid[y][x] = null;
                    removed++;
                }
            }
        }
    }

    score += removed * 100;
    goal = Math.max(0, goal - removed);

    collapseBoard();
    render();
    updateUI();

    await wait(160);

    let matches = findMatches();

    if (matches.length) {
        await resolveMatches(matches);
    }

    locked = false;
    checkGameEnd();
}

function updateUI() {
    scoreEl.textContent =
        score.toLocaleString();

    movesEl.textContent = moves;

    const total = getGoal();
    const completed = total - goal;

    goalEl.textContent =
        `${completed}/${total}`;

    levelEl.textContent = level;

    const percentage =
        Math.min(
            100,
            (completed / total) * 100
        );

    progress.style.width =
        `${percentage}%`;
}

function checkGameEnd() {
    if (goal <= 0) {
        modalTitle.textContent =
            "⭐ LEVEL COMPLETE!";

        modalText.textContent =
            `Excellent! You scored ${score.toLocaleString()} points.`;

        playBtn.textContent =
            "NEXT LEVEL";

        modal.classList.add("show");
        return;
    }

    if (moves <= 0) {
        modalTitle.textContent =
            "TRY AGAIN";

        modalText.textContent =
            "No moves left! Try a better strategy.";

        playBtn.textContent =
            "RETRY";

        modal.classList.add("show");
    }
}

playBtn.addEventListener("click", () => {
    if (goal <= 0) {
        level++;
    }

    startLevel();

    modal.classList.remove("show");

    playBtn.textContent = "PLAY!";
});

document
    .getElementById("menuBtn")
    .addEventListener("click", () => {
        modalTitle.textContent =
            "🍬 PUKU BLAST";

        modalText.textContent =
            `Level ${level} • Score ${score.toLocaleString()}`;

        playBtn.textContent =
            "CONTINUE";

        modal.classList.add("show");
    });

boosterButtons.forEach(button => {
    button.addEventListener("click", () => {
        if (locked || moves <= 0) return;

        const type = button.dataset.type;

        if (type === "shuffle") {
            shuffleBoard();
            return;
        }

        boosterMode =
            boosterMode === type
                ? null
                : type;

        boosterButtons.forEach(btn =>
            btn.classList.remove("active")
        );

        if (boosterMode) {
            button.classList.add("active");
        }

        selected = null;
        render();
    });
});

function shuffleBoard() {
    if (locked) return;

    const all = grid.flat()
        .sort(() => Math.random() - 0.5);

    grid = Array.from(
        { length: ROWS },
        (_, r) =>
            all.slice(
                r * COLS,
                r * COLS + COLS
            )
    );

    while (findMatches().length > 0) {
        grid = grid.flat()
            .sort(() => Math.random() - 0.5);

        grid = Array.from(
            { length: ROWS },
            (_, r) =>
                grid.slice(
                    r * COLS,
                    r * COLS + COLS
                )
        );
    }

    score += 50;
    moves--;

    ensurePlayableBoard();

    render();
    updateUI();
    checkGameEnd();
}

startLevel();
