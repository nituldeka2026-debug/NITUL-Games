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

const lyricsContainer = document.getElementById("lyricsContainer");

// ========================================
// SONG DATA
// ========================================

const songs = [
    {
        title: "SayaVibe Demo",
        artist: "SayaVibe",
        audio: "music/demo-song.mp3",
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
        audio: "music/my-first-song.mp3",
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

    renderLyrics(song.lyrics);

    progressBar.value = 0;
    currentTimeEl.textContent = "0:00";
    durationEl.textContent = "0:00";

    playBtn.textContent = "▶";
}

// ========================================
// PLAY / PAUSE
// ========================================

function togglePlay() {

    if (audio.paused) {

        audio.play()
            .then(() => {
                playBtn.textContent = "⏸";
            })
            .catch(() => {
                alert("Add an MP3 file inside the music folder first.");
            });

    } else {

        audio.pause();

        playBtn.textContent = "▶";
    }
}

playBtn.addEventListener("click", togglePlay);


// ========================================
// PREVIOUS SONG
// ========================================

previousBtn.addEventListener("click", () => {

    currentSong--;

    if (currentSong < 0) {
        currentSong = songs.length - 1;
    }

    loadSong(currentSong);
});


// ========================================
// NEXT SONG
// ========================================

nextBtn.addEventListener("click", () => {

    currentSong++;

    if (currentSong >= songs.length) {
        currentSong = 0;
    }

    loadSong(currentSong);
});


// ========================================
// AUDIO TIME UPDATE
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
// SEEK
// ========================================

progressBar.addEventListener("input", () => {

    if (!audio.duration) return;

    audio.currentTime =
        (progressBar.value / 100) * audio.duration;
});


// ========================================
// VOLUME
// ========================================

volumeBar.addEventListener("input", () => {

    audio.volume = volumeBar.value;
});


// ========================================
// SONG ENDED
// ========================================

audio.addEventListener("ended", () => {

    currentSong++;

    if (currentSong >= songs.length) {
        currentSong = 0;
    }

    loadSong(currentSong);

    audio.play()
        .then(() => {
            playBtn.textContent = "⏸";
        });
});


// ========================================
// FORMAT TIME
// ========================================

function formatTime(seconds) {

    if (isNaN(seconds)) {
        return "0:00";
    }

    const minutes = Math.floor(seconds / 60);

    const secs = Math.floor(seconds % 60)
        .toString()
        .padStart(2, "0");

    return `${minutes}:${secs}`;
}


// ========================================
// LYRICS
// ========================================

function renderLyrics(lyrics) {

    lyricsContainer.innerHTML = "";

    lyrics.forEach((line, index) => {

        const p = document.createElement("p");

        p.className = "lyrics-line";

        if (index === 0) {
            p.classList.add("active");
        }

        p.textContent = line;

        lyricsContainer.appendChild(p);
    });
}


// ========================================
// SIMPLE AUTO LYRICS
// ========================================

function updateLyrics() {

    const lines =
        lyricsContainer.querySelectorAll(".lyrics-line");

    if (!lines.length || !audio.duration) return;

    const percentage =
        audio.currentTime / audio.duration;

    let activeIndex =
        Math.floor(percentage * lines.length);

    if (activeIndex >= lines.length) {
        activeIndex = lines.length - 1;
    }

    lines.forEach((line, index) => {

        line.classList.toggle(
            "active",
            index === activeIndex
        );

    });

    const activeLine =
        lines[activeIndex];

    if (activeLine) {

        activeLine.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }
}


// ========================================
// SEARCH
// ========================================

const searchBtn =
    document.getElementById("searchBtn");

const searchSection =
    document.getElementById("searchSection");

const closeSearch =
    document.getElementById("closeSearch");

const searchInput =
    document.getElementById("searchInput");


searchBtn.addEventListener("click", () => {

    searchSection.classList.add("show");

    searchInput.focus();
});


closeSearch.addEventListener("click", () => {

    searchSection.classList.remove("show");

    searchInput.value = "";
});


searchInput.addEventListener("input", () => {

    const query =
        searchInput.value.toLowerCase().trim();

    const items =
        document.querySelectorAll(".song-item");

    items.forEach(item => {

        const text =
            item.textContent.toLowerCase();

        item.style.display =
            text.includes(query)
                ? "flex"
                : "none";
    });
});


// ========================================
// SYNC BUTTON
// ========================================

const syncBtn =
    document.getElementById("syncBtn");

syncBtn.addEventListener("click", () => {

    alert(
        "Auto Sync system will be connected to real synced lyrics in the next version."
    );
});


// ========================================
// INITIALIZE
// ========================================

loadSong(0);

console.log("🎵 SayaVibe initialized successfully!");
