```javascript
// ========================================
// SayaVibe Music Player
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
// SONG DATA
// ========================================

const songs = [

    {
        title: "SayaVibe Demo",
        artist: "SayaVibe",
        audio: "assets/music/demo-song.mp3",
        cover: "assets/covers/default-cover.jpg",

        lyrics: [
            "Welcome to SayaVibe",
            "Feel the music...",
            "Read every lyric...",
            "And enjoy the vibe 🎵"
        ]
    },

    {
        title: "My First Song",
        artist: "SayaVibe",
        audio: "assets/music/my-first-song.mp3",
        cover: "assets/covers/default-cover.jpg",

        lyrics: [
            "This is my first song",
            "Welcome to the SayaVibe world",
            "Music brings us together",
            "Feel every lyric 🎵"
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

    audio.src = song.audio;

    audio.load();

    progressBar.value = 0;

    currentTimeEl.textContent = "0:00";

    durationEl.textContent = "0:00";

    playBtn.textContent = "▶";

    renderLyrics(song.lyrics);

}


// ========================================
// PLAY
// ========================================

function playSong() {

    audio.play()
        .then(() => {

            playBtn.textContent = "⏸";

        })
        .catch(error => {

            console.error(
                "Audio playback error:",
                error
            );

            alert(
                "MP3 fileটো load হোৱা নাই। GitHub-ত assets/music/demo-song.mp3 আছে নেকি check কৰক।"
            );

        });

}


// ========================================
// PLAY / PAUSE
// ========================================

playBtn.addEventListener("click", () => {

    if (audio.paused) {

        playSong();

    } else {

        audio.pause();

    }

});


audio.addEventListener("play", () => {

    playBtn.textContent = "⏸";

});


audio.addEventListener("pause", () => {

    playBtn.textContent = "▶";

});


// ========================================
// PREVIOUS
// ========================================

previousBtn.addEventListener("click", () => {

    currentSong--;

    if (currentSong < 0) {

        currentSong = songs.length - 1;

    }

    loadSong(currentSong);

});


// ========================================
// NEXT
// ========================================

nextBtn.addEventListener("click", () => {

    currentSong++;

    if (currentSong >= songs.length) {

        currentSong = 0;

    }

    loadSong(currentSong);

});


// ========================================
// TIME UPDATE
// ========================================

audio.addEventListener("timeupdate", () => {

    if (!audio.duration) return;

    const progress =
        (audio.currentTime / audio.duration) * 100;

    progressBar.value = progress;

    currentTimeEl.textContent =
        formatTime(audio.currentTime);

    durationEl.textContent =
        formatTime(audio.duration);

    updateLyrics();

});


// ========================================
// METADATA
// ========================================

audio.addEventListener(
    "loadedmetadata",
    () => {

        durationEl.textContent =
            formatTime(audio.duration);

    }
);


// ========================================
// SEEK
// ========================================

progressBar.addEventListener(
    "input",
    () => {

        if (!audio.duration) return;

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
    () => {

        audio.volume =
            Number(volumeBar.value);

    }
);


// ========================================
// SONG ENDED
// ========================================

audio.addEventListener(
    "ended",
    () => {

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

    if (!isFinite(seconds)) {

        return "0:00";

    }

    const minutes =
        Math.floor(seconds / 60);

    const secondsPart =
        Math.floor(seconds % 60)
        .toString()
        .padStart(2, "0");

    return `${minutes}:${secondsPart}`;

}


// ========================================
// LYRICS
// ========================================

function renderLyrics(lyrics) {

    lyricsContainer.innerHTML = "";

    lyrics.forEach((line, index) => {

        const p =
            document.createElement("p");

        p.className =
            "lyrics-line";

        if (index === 0) {

            p.classList.add("active");

        }

        p.textContent = line;

        lyricsContainer.appendChild(p);

    });

}


// ========================================
// AUTO LYRICS
// ========================================

function updateLyrics() {

    const lines =
        lyricsContainer.querySelectorAll(
            ".lyrics-line"
        );

    if (!lines.length || !audio.duration) {

        return;

    }

    const percentage =
        audio.currentTime /
        audio.duration;

    let activeIndex =
        Math.floor(
            percentage * lines.length
        );

    if (
        activeIndex >=
        lines.length
    ) {

        activeIndex =
            lines.length - 1;

    }

    lines.forEach(
        (line, index) => {

            line.classList.toggle(
                "active",
                index === activeIndex
            );

        }
    );

}


// ========================================
// SONG LIST
// ========================================

document
    .querySelectorAll(".song-play")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const index =
                    Number(
                        button.dataset.index
                    );

                if (!songs[index]) return;

                loadSong(index);

                playSong();

            }
        );

    });


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
    () => {

        searchSection.classList.add(
            "show"
        );

        searchInput.focus();

    }
);


closeSearch.addEventListener(
    "click",
    () => {

        searchSection.classList.remove(
            "show"
        );

        searchInput.value = "";

        document
            .querySelectorAll(
                ".song-item"
            )
            .forEach(item => {

                item.style.display =
                    "flex";

            });

    }
);


searchInput.addEventListener(
    "input",
    () => {

        const query =
            searchInput.value
            .toLowerCase()
            .trim();

        document
            .querySelectorAll(
                ".song-item"
            )
            .forEach(item => {

                const text =
                    item.textContent
                    .toLowerCase();

                item.style.display =
                    text.includes(query)
                        ? "flex"
                        : "none";

            });

    }
);


// ========================================
// AUTO SYNC BUTTON
// ========================================

const syncBtn =
    document.getElementById(
        "syncBtn"
    );

syncBtn.addEventListener(
    "click",
    () => {

        alert(
            "Real synced lyrics system will be added in the next version."
        );

    }
);


// ========================================
// VIEW ALL
// ========================================

const viewAllBtn =
    document.getElementById(
        "viewAllBtn"
    );

viewAllBtn.addEventListener(
    "click",
    () => {

        document
            .querySelector(".songs-section")
            .scrollIntoView({
                behavior: "smooth"
            });

    }
);


// ========================================
// NAVIGATION
// ========================================

document
    .querySelectorAll(".nav-item")
    .forEach(item => {

        item.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(
                        ".nav-item"
                    )
                    .forEach(nav => {

                        nav.classList.remove(
                            "active"
                        );

                    });

                item.classList.add(
                    "active"
                );

            }
        );

    });


// ========================================
// AUDIO ERROR
// ========================================

audio.addEventListener(
    "error",
    () => {

        console.error(
            "Could not load:",
            audio.src
        );

    }
);


// ========================================
// INITIALIZE
// ========================================

loadSong(0);

console.log(
    "🎵 SayaVibe initialized successfully!"
);
```
