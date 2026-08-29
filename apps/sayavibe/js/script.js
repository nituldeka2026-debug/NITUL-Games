```javascript
// ========================================
// SayaVibe Music Player
// FULL FIXED VERSION
// ========================================

document.addEventListener("DOMContentLoaded", () => {

    // ========================================
    // ELEMENTS
    // ========================================

    const audio = document.getElementById("audioPlayer");

    const playBtn = document.getElementById("playBtn");
    const previousBtn = document.getElementById("previousBtn");
    const nextBtn = document.getElementById("nextBtn");

    const progressBar = document.getElementById("progressBar");
    const volumeBar = document.getElementById("volumeBar");

    const currentTimeEl =
        document.getElementById("currentTime");

    const durationEl =
        document.getElementById("duration");

    const songTitle =
        document.getElementById("songTitle");

    const artistName =
        document.getElementById("artistName");

    const coverImage =
        document.getElementById("coverImage");

    const lyricsContainer =
        document.getElementById("lyricsContainer");


    // ========================================
    // SONG DATA
    // ========================================

    const songs = [

        {
            title: "SayaVibe Demo",
            artist: "SayaVibe",

            // CORRECT PATH
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

            // Add this MP3 later
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
    // FORMAT TIME
    // ========================================

    function formatTime(seconds) {

        if (
            !isFinite(seconds) ||
            isNaN(seconds) ||
            seconds < 0
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
    // UPDATE DURATION
    // ========================================

    function updateDuration() {

        if (
            isFinite(audio.duration) &&
            audio.duration > 0
        ) {

            durationEl.textContent =
                formatTime(audio.duration);

        }

    }


    // ========================================
    // LOAD SONG
    // ========================================

    function loadSong(index) {

        if (!songs[index]) {

            return;

        }


        currentSong = index;

        const song =
            songs[currentSong];


        // Song information

        songTitle.textContent =
            song.title;

        artistName.textContent =
            song.artist;


        // Cover

        coverImage.src =
            song.cover;


        // Stop current audio

        audio.pause();


        // Reset

        audio.currentTime = 0;

        progressBar.value = 0;

        currentTimeEl.textContent =
            "0:00";

        durationEl.textContent =
            "0:00";


        // Set new audio

        audio.src =
            song.audio;


        // Load audio

        audio.load();


        // Reset play button

        playBtn.textContent =
            "▶";


        // Render lyrics

        renderLyrics(
            song.lyrics
        );


        console.log(
            "Loaded song:",
            song.title
        );

        console.log(
            "Audio path:",
            song.audio
        );

    }


    // ========================================
    // PLAY SONG
    // ========================================

    function playSong() {

        if (!audio.src) {

            return;

        }


        const promise =
            audio.play();


        if (promise !== undefined) {

            promise
                .then(() => {

                    playBtn.textContent =
                        "⏸";

                })
                .catch(error => {

                    console.error(
                        "Playback error:",
                        error
                    );

                    alert(
                        "Song play হোৱা নাই। আকৌ Play button click কৰক।"
                    );

                });

        }

    }


    // ========================================
    // PLAY / PAUSE
    // ========================================

    playBtn.addEventListener(
        "click",
        () => {

            if (audio.paused) {

                playSong();

            } else {

                audio.pause();

            }

        }
    );


    // ========================================
    // AUDIO PLAY EVENT
    // ========================================

    audio.addEventListener(
        "play",
        () => {

            playBtn.textContent =
                "⏸";

        }
    );


    // ========================================
    // AUDIO PAUSE EVENT
    // ========================================

    audio.addEventListener(
        "pause",
        () => {

            playBtn.textContent =
                "▶";

        }
    );


    // ========================================
    // AUDIO METADATA
    // ========================================

    audio.addEventListener(
        "loadedmetadata",
        () => {

            updateDuration();

            console.log(
                "Duration:",
                audio.duration
            );

        }
    );


    // ========================================
    // DURATION CHANGE
    // ========================================

    audio.addEventListener(
        "durationchange",
        () => {

            updateDuration();

        }
    );


    // ========================================
    // CAN PLAY
    // ========================================

    audio.addEventListener(
        "canplay",
        () => {

            updateDuration();

        }
    );


    // ========================================
    // TIME UPDATE
    // ========================================

    audio.addEventListener(
        "timeupdate",
        () => {

            if (
                !isFinite(audio.duration) ||
                audio.duration <= 0
            ) {

                return;

            }


            const percentage =
                (
                    audio.currentTime /
                    audio.duration
                ) * 100;


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
    // PROGRESS BAR
    // ========================================

    progressBar.addEventListener(
        "input",
        () => {

            if (
                !isFinite(audio.duration) ||
                audio.duration <= 0
            ) {

                return;

            }


            audio.currentTime =
                (
                    Number(progressBar.value) /
                    100
                ) * audio.duration;

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
    // PREVIOUS SONG
    // ========================================

    previousBtn.addEventListener(
        "click",
        () => {

            currentSong--;

            if (currentSong < 0) {

                currentSong =
                    songs.length - 1;

            }


            loadSong(
                currentSong
            );

        }
    );


    // ========================================
    // NEXT SONG
    // ========================================

    nextBtn.addEventListener(
        "click",
        () => {

            currentSong++;

            if (
                currentSong >=
                songs.length
            ) {

                currentSong = 0;

            }


            loadSong(
                currentSong
            );

        }
    );


    // ========================================
    // SONG ENDED
    // ========================================

    audio.addEventListener(
        "ended",
        () => {

            currentSong++;

            if (
                currentSong >=
                songs.length
            ) {

                currentSong = 0;

            }


            loadSong(
                currentSong
            );


            // Automatically play next song

            playSong();

        }
    );


    // ========================================
    // RENDER LYRICS
    // ========================================

    function renderLyrics(lyrics) {

        lyricsContainer.innerHTML =
            "";


        lyrics.forEach(
            (line, index) => {

                const p =
                    document.createElement(
                        "p"
                    );


                p.className =
                    "lyrics-line";


                p.textContent =
                    line;


                if (index === 0) {

                    p.classList.add(
                        "active"
                    );

                }


                lyricsContainer.appendChild(
                    p
                );

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
            !isFinite(audio.duration) ||
            audio.duration <= 0
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
            (line, index) => {

                line.classList.toggle(
                    "active",
                    index === activeIndex
                );

            }
        );


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
    // SONG LIST BUTTONS
    // ========================================

    const songButtons =
        document.querySelectorAll(
            ".song-play"
        );


    songButtons.forEach(
        (button) => {

            button.addEventListener(
                "click",
                () => {

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


    if (
        searchBtn &&
        searchSection &&
        searchInput
    ) {

        searchBtn.addEventListener(
            "click",
            () => {

                searchSection.classList.add(
                    "show"
                );

                searchInput.focus();

            }
        );

    }


    if (closeSearch) {

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
                    .forEach(
                        item => {

                            item.style.display =
                                "flex";

                        }
                    );

            }
        );

    }


    if (searchInput) {

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
                    .forEach(
                        item => {

                            const text =
                                item.textContent
                                    .toLowerCase();


                            item.style.display =
                                text.includes(
                                    query
                                )
                                    ? "flex"
                                    : "none";

                        }
                    );

            }
        );

    }


    // ========================================
    // AUTO SYNC BUTTON
    // ========================================

    const syncBtn =
        document.getElementById(
            "syncBtn"
        );


    if (syncBtn) {

        syncBtn.addEventListener(
            "click",
            () => {

                alert(
                    "✨ Real-time lyrics sync will be added with timed lyrics."
                );

            }
        );

    }


    // ========================================
    // VIEW ALL
    // ========================================

    const viewAllBtn =
        document.getElementById(
            "viewAllBtn"
        );


    if (viewAllBtn) {

        viewAllBtn.addEventListener(
            "click",
            () => {

                document
                    .querySelector(
                        ".songs-section"
                    )
                    .scrollIntoView({
                        behavior: "smooth"
                    });

            }
        );

    }


    // ========================================
    // NAVIGATION
    // ========================================

    document
        .querySelectorAll(
            ".nav-item"
        )
        .forEach(
            item => {

                item.addEventListener(
                    "click",
                    () => {

                        document
                            .querySelectorAll(
                                ".nav-item"
                            )
                            .forEach(
                                nav => {

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
        () => {

            console.error(
                "❌ AUDIO ERROR"
            );

            console.error(
                "Audio URL:",
                audio.src
            );

        }
    );


    // ========================================
    // INITIALIZE
    // ========================================

    loadSong(0);


    console.log(
        "🎵 SayaVibe initialized"
    );

});
```
