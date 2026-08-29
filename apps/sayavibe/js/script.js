```javascript
// ========================================
// SayaVibe Music Player - FIXED VERSION
// ========================================

const audio = document.getElementById("audioPlayer");

const playBtn = document.getElementById("playBtn");
const previousBtn = document.getElementById("previousBtn");
const nextBtn = document.getElementById("nextBtn");

const progressBar = document.getElementById("progressBar");
const volumeBar = document.getElementById("volumeBar");

const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");

const songTitle = document.getElementById("songTitle");
const artistName = document.getElementById("artistName");
const coverImage = document.getElementById("coverImage");

const lyricsContainer =
    document.getElementById("lyricsContainer");


// ========================================
// SONG DATABASE
// ========================================

const songs = [

    {
        title: "SayaVibe Demo",
        artist: "SayaVibe",

        // IMPORTANT: correct GitHub Pages path
        audio: "assets/music/demo-song.mp3",

        cover: "assets/covers/default-cover.jpg",

        lyrics: [
            "Welcome to SayaVibe 🎵",
            "Feel the music...",
            "Read every lyric...",
            "And enjoy the vibe ❤️"
        ]
    },

    {
        title: "My First Song",
        artist: "SayaVibe",

        audio: "assets/music/my-first-song.mp3",

        cover: "assets/covers/default-cover.jpg",

        lyrics: [
            "This is my first song 🎵",
            "Welcome to the SayaVibe world",
            "Music brings us together",
            "Feel every lyric ❤️"
        ]
    }

];


let currentSong = 0;


// ========================================
// LOAD SONG
// ========================================

function loadSong(index) {

    currentSong = index;

    const song = songs[currentSong];

    songTitle.textContent = song.title;

    artistName.textContent = song.artist;

    coverImage.src = song.cover;

    audio.pause();

    audio.src = song.audio;

    audio.load();

    currentTimeEl.textContent = "0:00";

    durationEl.textContent = "0:00";

    progressBar.value = 0;

    playBtn.textContent = "▶";

    renderLyrics(song.lyrics);

}


// ========================================
// PLAY SONG
// ========================================

function playSong() {

    const playPromise = audio.play();

    if (playPromise !== undefined) {

        playPromise
            .then(() => {

                playBtn.textContent = "⏸";

            })
            .catch(error => {

                console.error(
                    "PLAY ERROR:",
                    error
                );

                alert(
                    "Song play হোৱা নাই। Browser-ত Play button আকৌ click কৰক।"
                );

            });

    }

}


// ========================================
// PLAY / PAUSE BUTTON
// ========================================

playBtn.addEventListener(
    "click",
    function () {

        if (audio.paused) {

            playSong();

        } else {

            audio.pause();

        }

    }
);


// ========================================
// PLAY EVENT
// ========================================

audio.addEventListener(
    "play",
    function () {

        playBtn.textContent = "⏸";

    }
);


// ========================================
// PAUSE EVENT
// ========================================

audio.addEventListener(
    "pause",
    function () {

        playBtn.textContent = "▶";

    }
);


// ========================================
// PREVIOUS
// ========================================

previousBtn.addEventListener(
    "click",
    function () {

        currentSong--;

        if (currentSong < 0) {

            currentSong =
                songs.length - 1;

        }

        loadSong(currentSong);

    }
);


// ========================================
// NEXT
// ========================================

nextBtn.addEventListener(
    "click",
    function () {

        currentSong++;

        if (currentSong >= songs.length) {

            currentSong = 0;

        }

        loadSong(currentSong);

    }
);


// ========================================
// AUDIO READY
// ========================================

audio.addEventListener(
    "loadedmetadata",
    function () {

        if (!isNaN(audio.duration)) {

            durationEl.textContent =
                formatTime(audio.duration);

        }

    }
);


// ========================================
// TIME UPDATE
// ========================================

audio.addEventListener(
    "timeupdate",
    function () {

        if (
            !audio.duration ||
            isNaN(audio.duration)
        ) {

            return;

        }


        const percentage =
            (audio.currentTime /
                audio.duration) * 100;


        progressBar.value =
            percentage;


        currentTimeEl.textContent =
            formatTime(
                audio.currentTime
            );


        durationEl.textContent =
            formatTime(
                audio.duration
            );


        updateLyrics();

    }
);


// ========================================
// SEEK BAR
// ========================================

progressBar.addEventListener(
    "input",
    function () {

        if (!audio.duration) {

            return;

        }


        audio.currentTime =
            (progressBar.value / 100) *
            audio.duration;

    }
);


// ========================================
// VOLUME
// ========================================

audio.volume = 1;

volumeBar.addEventListener(
    "input",
    function () {

        audio.volume =
            Number(volumeBar.value);

    }
);


// ========================================
// SONG FINISHED
// ========================================

audio.addEventListener(
    "ended",
    function () {

        currentSong++;

        if (currentSong >= songs.length) {

            currentSong = 0;

        }

        loadSong(currentSong);

        playSong();

    }
);


// ========================================
// FORMAT TIME
// ========================================

function formatTime(seconds) {

    if (
        isNaN(seconds) ||
        !isFinite(seconds)
    ) {

        return "0:00";

    }


    const minutes =
        Math.floor(seconds / 60);


    const secs =
        Math.floor(seconds % 60)
            .toString()
            .padStart(2, "0");


    return `${minutes}:${secs}`;

}


// ========================================
// RENDER LYRICS
// ========================================

function renderLyrics(lyrics) {

    lyricsContainer.innerHTML = "";


    lyrics.forEach(
        function (line, index) {

            const p =
                document.createElement("p");


            p.className =
                "lyrics-line";


            p.textContent =
                line;


            if (index === 0) {

                p.classList.add(
                    "active"
                );

            }


            lyricsContainer.appendChild(p);

        }
    );

}


// ========================================
// AUTO LYRICS
// ========================================

function updateLyrics() {

    const lines =
        lyricsContainer.querySelectorAll(
            ".lyrics-line"
        );


    if (
        !lines.length ||
        !audio.duration
    ) {

        return;

    }


    const percentage =
        audio.currentTime /
        audio.duration;


    let activeIndex =
        Math.floor(
            percentage *
            lines.length
        );


    if (
        activeIndex >=
        lines.length
    ) {

        activeIndex =
            lines.length - 1;

    }


    lines.forEach(
        function (line, index) {

            line.classList.toggle(
                "active",
                index === activeIndex
            );

        }
    );

}


// ========================================
// SONG LIST BUTTONS
// ========================================

const songButtons =
    document.querySelectorAll(
        ".song-play"
    );


songButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                const index =
                    Number(
                        button.dataset.index
                    );


                if (
                    isNaN(index) ||
                    !songs[index]
                ) {

                    return;

                }


                loadSong(index);

                playSong();

            }
        );

    }
);


// ========================================
// SEARCH
// ========================================

const searchBtn =
    document.getElementById(
        "searchBtn"
    );

const searchSection =
    document.getElementById(
        "searchSection"
    );

const closeSearch =
    document.getElementById(
        "closeSearch"
    );

const searchInput =
    document.getElementById(
        "searchInput"
    );


searchBtn.addEventListener(
    "click",
    function () {

        searchSection.classList.add(
            "show"
        );

        searchInput.focus();

    }
);


closeSearch.addEventListener(
    "click",
    function () {

        searchSection.classList.remove(
            "show"
        );

        searchInput.value = "";


        document
            .querySelectorAll(
                ".song-item"
            )
            .forEach(
                function (item) {

                    item.style.display =
                        "flex";

                }
            );

    }
);


searchInput.addEventListener(
    "input",
    function () {

        const query =
            searchInput.value
                .toLowerCase()
                .trim();


        document
            .querySelectorAll(
                ".song-item"
            )
            .forEach(
                function (item) {

                    const text =
                        item.textContent
                            .toLowerCase();


                    item.style.display =
                        text.includes(query)
                            ? "flex"
                            : "none";

                }
            );

    }
);


// ========================================
// AUTO SYNC
// ========================================

const syncBtn =
    document.getElementById(
        "syncBtn"
    );


syncBtn.addEventListener(
    "click",
    function () {

        alert(
            "✨ Auto Sync is ready for real timed lyrics in the next update."
        );

    }
);


// ========================================
// NAVIGATION
// ========================================

document
    .querySelectorAll(".nav-item")
    .forEach(
        function (item) {

            item.addEventListener(
                "click",
                function () {

                    document
                        .querySelectorAll(
                            ".nav-item"
                        )
                        .forEach(
                            function (nav) {

                                nav.classList.remove(
                                    "active"
                                );

                            }
                        );


                    item.classList.add(
                        "active"
                    );

                }
            );

        }
    );


// ========================================
// AUDIO ERROR
// ========================================

audio.addEventListener(
    "error",
    function () {

        console.error(
            "Audio could not load:",
            audio.src
        );

    }
);


// ========================================
// START
// ========================================

loadSong(0);

console.log(
    "🎵 SayaVibe Player Loaded"
);

console.log(
    "🎵 Audio:",
    songs[0].audio
);
```
