* {
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
}

body {
    margin: 0;
    min-height: 100vh;
    overflow: hidden;

    font-family: Arial, sans-serif;
    color: white;

    background:
        radial-gradient(circle at 50% 0%, #55e3d0 0%, #2db3be 20%, transparent 45%),
        linear-gradient(#1db6bd 0%, #101c74 28%, #06165e 100%);
}


/* MAIN */

.game-shell {
    min-height: 100vh;

    display: flex;
    flex-direction: column;

    max-width: 760px;

    margin: auto;
}


/* TOP */

.top {

    min-height: 160px;

    padding: 12px;

    display: grid;

    grid-template-columns:
        1fr
        140px
        1fr
        55px;

    gap: 10px;

    align-items: center;

}


/* SCORE */

.score-card {

    text-shadow: 0 2px 3px #125;

}

.stars {

    font-size: 25px;

    color: #659a97;

    letter-spacing: 5px;

}

.progress {

    height: 14px;

    margin-top: 8px;

    border-radius: 20px;

    background: rgba(0, 80, 110, .5);

    overflow: hidden;

}

#scoreFill {

    height: 100%;

    width: 0%;

    border-radius: 20px;

    background:
        linear-gradient(
            90deg,
            #ffd25a,
            #fff4aa
        );

}

.score {

    margin-top: 10px;

    font-size: 18px;

}


/* LEVEL */

.level-card {

    height: 140px;

    border-radius:
        0
        0
        40px
        40px;

    background:
        radial-gradient(
            circle,
            #51d6c5,
            #169a9b 70%
        );

    display: flex;

    flex-direction: column;

    align-items: center;

    justify-content: center;

    box-shadow:
        0 8px 16px rgba(0,0,0,.3);

}

.level-card small {

    font-size: 18px;

    font-weight: bold;

    color: #176c76;

}

.level-card strong {

    font-size: 45px;

    line-height: 50px;

}

.level-card span {

    font-size: 10px;

    letter-spacing: 2px;

}


/* TARGET */

.target-card {

    display: flex;

    align-items: center;

    justify-content: center;

    gap: 8px;

    font-size: 24px;

}

.target-icon {

    font-size: 50px;

}


/* MENU */

.menu {

    width: 52px;

    height: 52px;

    border-radius: 15px;

    border: 3px solid #1971a5;

    background:
        linear-gradient(
            #43c8de,
            #126da3
        );

    font-size: 28px;

}


/* GAME AREA */

.play-area {

    flex: 1;

    display: flex;

    align-items: center;

    justify-content: center;

    padding: 8px;

}


.board-wrap {

    width: min(96vw, 690px);

    aspect-ratio: 1;

    padding: 7px;

    border-radius: 15px;

    background:
        linear-gradient(
            135deg,
            rgba(46,207,225,.4),
            rgba(4,37,121,.5)
        );

}


.board {

    width: 100%;

    height: 100%;

    display: grid;

    grid-template-columns: repeat(9, 1fr);

    grid-template-rows: repeat(9, 1fr);

    gap: 2px;

}


/* CELL */

.cell {

    border: 0;

    border-radius: 7px;

    position: relative;

    overflow: hidden;

    display: flex;

    align-items: center;

    justify-content: center;

    cursor: pointer;

    background:
        linear-gradient(
            135deg,
            #0a4a9c,
            #063179
        );

}

.cell.selected {

    outline: 4px solid #fff7a5;

    z-index: 10;

}


/* BLOCK */

.cell.blocked::after {

    content: "";

    position: absolute;

    inset: 3px;

    border-radius: 7px;

    background:
        linear-gradient(
            135deg,
            #ffc542,
            #ff7b12
        );

    border: 2px solid #fff0a0;

    z-index: 5;

}


/* CANDY */

.candy {

    width: 76%;

    height: 76%;

    position: relative;

    transition:
        transform .2s,
        opacity .2s;

}


/* RED */

.red {

    background:
        linear-gradient(
            135deg,
            #ff5145,
            #c60014,
            #70000c
        );

    border-radius:
        60%
        25%
        60%
        30%;

    transform: rotate(35deg);

}


/* YELLOW */

.yellow {

    background:
        radial-gradient(
            circle at 38% 25%,
            #fffbb0,
            #ffd520,
            #d28a00
        );

    border-radius: 50%;

}


/* BLUE */

.blue {

    background:
        linear-gradient(
            135deg,
            #6ffff8,
            #19b5dc,
            #0756ad
        );

    border-radius:
        55%
        45%
        55%
        45%;

    transform: rotate(45deg);

}


/* GREEN */

.green {

    background:
        linear-gradient(
            135deg,
            #63ff63,
            #0fbd29,
            #047014
        );

    border-radius:
        25%
        55%
        25%
        55%;

}


/* PURPLE */

.purple {

    background:
        radial-gradient(
            circle at 35% 25%,
            #ff9dff,
            #b11ad4,
            #590072
        );

    border-radius: 50%;

}


/* ORANGE */

.orange {

    background:
        radial-gradient(
            circle at 38% 25%,
            #fff3a4,
            #ff9e0a,
            #cf5200
        );

    border-radius: 45%;

}


/* BOOSTERS */

.boosters {

    height: 130px;

    display: flex;

    justify-content: center;

    align-items: center;

    gap: 15px;

}


.booster {

    width: 70px;

    height: 70px;

    border-radius: 50%;

    border: 3px solid #29b53a;

    background:
        radial-gradient(
            circle at 40% 25%,
            #4cf34d,
            #14962a,
            #075f1d
        );

    font-size: 30px;

    position: relative;

}


.booster b {

    position: absolute;

    right: -8px;

    top: -8px;

    background: #d62ea7;

    border-radius: 50%;

    padding: 5px 8px;

}


.booster.active {

    outline: 4px solid #fff7a5;

}


/* TOAST */

.toast {

    position: fixed;

    top: 15px;

    left: 50%;

    transform:
        translate(-50%, -100px);

    padding: 10px 20px;

    border-radius: 20px;

    background: #102d74;

    transition: .3s;

}


.toast.show {

    transform:
        translate(-50%, 0);

}


/* MODAL */

.modal {

    position: fixed;

    inset: 0;

    background:
        rgba(0,0,40,.7);

    display: grid;

    place-items: center;

}


.hidden {

    display: none;

}


.modal-card {

    width: 300px;

    padding: 30px;

    text-align: center;

    border-radius: 25px;

    background:
        linear-gradient(
            #55d9ce,
            #116aa4
        );

}


.modal-card button {

    padding:
        12px
        25px;

    border: 0;

    border-radius: 25px;

    background: #ffcf32;

    font-size: 18px;

}
