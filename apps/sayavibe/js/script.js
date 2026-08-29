// ========================================
// SayaVibe Music Player
// FINAL FIXED VERSION
// ========================================

document.addEventListener("DOMContentLoaded", function () {

    // ========================================
    // ELEMENTS
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

            audio:
                "https://nituldeka2026-debug.github.io/NITUL-Games/apps/sayavibe/assets/music/demo-song.mp3",

            cover:
                "assets/covers/default-cover.jpg",

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

            audio:
                "https://nituldeka2026-debug.github.io/NITUL-Games/apps/sayavibe/assets/music/my-first-song.mp3",

            cover:
                "assets/covers/default-cover.jpg",

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
            isNaN(seconds) ||
            !isFinite(seconds) ||
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

        return minutes + ":" + secs;
    }


    // ========================================
    // UPDATE DURATION
    // ========================================

    function updateDuration() {

        if (
            audio.readyState >= 1 &&
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

        const song = songs[currentSong];


        // Song information
        songTitle.textContent =
            song.title;

        artistName.textContent =
            song.artist;


        // Cover
        coverImage.src =
            song.cover;


        // Stop previous song
        audio.pause();


        // Reset player
        audio.removeAttribute("src");

        audio.load();

        currentTimeEl.textContent =
            "0:00";

        durationEl.textContent =
            "0:00";

        progressBar.value = 0;

        playBtn.textContent =
            "▶";


        // Set new song
        audio.src =
            song.audio;


        // Load new audio
        audio.load();


        // Render lyrics
        renderLyrics(
            song.lyrics
        );


        console.log(
            "SayaVibe loaded:",
            song.title
        );

        console.log(
            "Audio:",
            audio.src
        );
    }


    // ========================================
    // PLAY SONG
    // ========================================

    function playSong() {

        if (!audio.src) {
            return;
        }

        audio.play()
            .then(function () {

                playBtn.textContent =
                    "⏸";

            })
            .catch(function (error) {

                console.error(
                    "Playback Error:",
                    error
                );

            });
    }


    // ========================================
    // PLAY / PAUSE
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

            playBtn.textContent =
                "⏸";

        }
    );


    // ========================================
    // PAUSE EVENT
    // ========================================

    audio.addEventListener(
        "pause",
        function () {

            playBtn.textContent =
                "▶";

        }
    );


    // ========================================
    // LOADED METADATA
    // ========================================

    audio.addEventListener(
        "loadedmetadata",
        function () {

            console.log(
                "Audio duration:",
                audio.duration
            );

            updateDuration();

        }
    );


    // ========================================
    // DURATION CHANGE
    // ========================================

    audio.addEventListener(
        "durationchange",
        function () {

            updateDuration();

        }
    );


    // ========================================
    // LOADED DATA
    // ========================================

    audio.addEventListener(
        "loadeddata",
        function () {

            updateDuration();

        }
    );


    // ========================================
    // CAN PLAY
    // ========================================

    audio.addEventListener(
        "canplay",
        function () {

            updateDuration();

        }
    );


    // ========================================
    // TIME UPDATE
    // ========================================

    audio.addEventListener(
        "timeupdate",
        function () {

            if (
                !isFinite(audio.duration) ||
                audio.duration <= 0
            ) {
                return;
            }


            // Current time
            currentTimeEl.textContent =
                formatTime(
                    audio.currentTime
                );


            // Duration
            durationEl.textContent =
                formatTime(
                    audio.duration
                );


            // Progress
            progressBar.value =
                (
                    audio.currentTime /
                    audio.duration
                ) * 100;


            // Lyrics
            updateLyrics();

        }
    );


    // ========================================
    // PROGRESS BAR
    // ========================================

    progressBar.addEventListener(
        "input",
        function () {

            if (
                !isFinite(audio.duration) ||
                audio.duration <= 0
            ) {
                return;
            }


            audio.currentTime =
                (
                    Number(
                        progressBar.value
                    ) / 100
                ) * audio.duration;

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
                Number(
                    volumeBar.value
                );

        }
    );


    // ========================================
    // PREVIOUS SONG
    // ========================================

    previousBtn.addEventListener(
        "click",
        function () {

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
        function () {

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
        function () {

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
            function (line, index) {

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
            function (line, index) {

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

    const songItems =
        document.querySelectorAll(
            ".song-item"
        );


    songItems.forEach(
        function (item, index) {

            const button =
                item.querySelector(
                    ".song-play"
                );


            if (!button) {
                return;
            }


            button.addEventListener(
                "click",
                function () {

                    if (
                        songs[index]
                    ) {

                        loadSong(index);

                        playSong();

                    }

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
        searchSection
    ) {

        searchBtn.addEventListener(
            "click",
            function () {

                searchSection.classList.add(
                    "show"
                );

                if (searchInput) {
                    searchInput.focus();
                }

            }
        );

    }


    if (closeSearch) {

        closeSearch.addEventListener(
            "click",
            function () {

                searchSection.classList.remove(
                    "show"
                );

                if (searchInput) {
                    searchInput.value = "";
                }


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

    }


    if (searchInput) {

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
    // SYNC BUTTON
    // ========================================

    const syncBtn =
        document.getElementById(
            "syncBtn"
        );


    if (syncBtn) {

        syncBtn.addEventListener(
            "click",
            function () {

                alert(
                    "✨ Lyrics Sync will be added soon."
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
            function () {

                const section =
                    document.querySelector(
                        ".songs-section"
                    );


                if (section) {

                    section.scrollIntoView({
                        behavior: "smooth"
                    });

                }

            }
        );

    }


    // ========================================
    // BOTTOM NAV
    // ========================================

    document
        .querySelectorAll(
            ".nav-item"
        )
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
                "❌ AUDIO ERROR"
            );

            console.error(
                "Audio source:",
                audio.src
            );

        }
    );


    // ========================================
    // INITIALIZE
    // ========================================

    loadSong(0);


    console.log(
        "🎵 SayaVibe initialized successfully"
    );

});
