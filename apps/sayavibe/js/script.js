```javascript
// ========================================
// SayaVibe - SIMPLE WORKING PLAYER
// ========================================

document.addEventListener("DOMContentLoaded", function () {

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
    // SONGS
    // ========================================

    const songs = [
        {
            title: "SayaVibe Demo",
            artist: "SayaVibe",

            // EXACT FILE LOCATION
            audio: "./assets/music/demo-song.mp3",

            cover: "./assets/covers/default-cover.jpg",

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

            audio: "./assets/music/my-first-song.mp3",

            cover: "./assets/covers/default-cover.jpg",

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

    function formatTime(time) {

        if (
            !Number.isFinite(time) ||
            time < 0
        ) {
            return "0:00";
        }

        const minutes =
            Math.floor(time / 60);

        const seconds =
            Math.floor(time % 60)
                .toString()
                .padStart(2, "0");

        return minutes + ":" + seconds;
    }


    // ========================================
    // LOAD SONG
    // ========================================

    function loadSong(index) {

        if (!songs[index]) {
            return;
        }

        currentSong = index;

        const song = songs[index];

        songTitle.textContent = song.title;
        artistName.textContent = song.artist;

        coverImage.src = song.cover;

        // Stop old audio
        audio.pause();

        // Remove old source
        audio.removeAttribute("src");

        // Reset
        currentTimeEl.textContent = "0:00";
        durationEl.textContent = "0:00";
        progressBar.value = 0;

        playBtn.textContent = "▶";

        // Set NEW source
        audio.src = song.audio;

        // Force reload
        audio.load();

        // Lyrics
        renderLyrics(song.lyrics);

        console.log("SayaVibe song:", song.title);
        console.log("Audio URL:", audio.src);
    }


    // ========================================
    // PLAY
    // ========================================

    function playSong() {

        audio.play()
            .then(function () {

                playBtn.textContent = "⏸";

                console.log("Song playing");

            })
            .catch(function (error) {

                console.error(
                    "PLAY ERROR:",
                    error
                );

                alert(
                    "Song play হোৱা নাই। Browser console check কৰক।"
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
    // LOADED METADATA
    // ========================================

    audio.addEventListener(
        "loadedmetadata",
        function () {

            console.log(
                "Duration:",
                audio.duration
            );

            if (
                Number.isFinite(audio.duration)
            ) {

                durationEl.textContent =
                    formatTime(
                        audio.duration
                    );

            }
        }
    );


    // ========================================
    // LOADED DATA
    // ========================================

    audio.addEventListener(
        "loadeddata",
        function () {

            if (
                Number.isFinite(audio.duration)
            ) {

                durationEl.textContent =
                    formatTime(
                        audio.duration
                    );

            }
        }
    );


    // ========================================
    // CAN PLAY
    // ========================================

    audio.addEventListener(
        "canplay",
        function () {

            if (
                Number.isFinite(audio.duration)
            ) {

                durationEl.textContent =
                    formatTime(
                        audio.duration
                    );

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
                !Number.isFinite(
                    audio.duration
                ) ||
                audio.duration <= 0
            ) {
                return;
            }


            currentTimeEl.textContent =
                formatTime(
                    audio.currentTime
                );


            durationEl.textContent =
                formatTime(
                    audio.duration
                );


            progressBar.value =
                (
                    audio.currentTime /
                    audio.duration
                ) * 100;


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
                !Number.isFinite(
                    audio.duration
                )
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
        function () {

            audio.volume =
                Number(volumeBar.value);

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

            if (
                currentSong >=
                songs.length
            ) {
                currentSong = 0;
            }

            loadSong(currentSong);

        }
    );


    // ========================================
    // END
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

            loadSong(currentSong);

            playSong();

        }
    );


    // ========================================
    // LYRICS
    // ========================================

    function renderLyrics(lyrics) {

        lyricsContainer.innerHTML = "";

        lyrics.forEach(
            function (line, index) {

                const p =
                    document.createElement("p");

                p.className =
                    "lyrics-line";

                p.textContent = line;

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
            !Number.isFinite(
                audio.duration
            )
        ) {
            return;
        }


        const percentage =
            audio.currentTime /
            audio.duration;


        let index =
            Math.floor(
                percentage *
                lines.length
            );


        if (
            index >= lines.length
        ) {
            index =
                lines.length - 1;
        }


        lines.forEach(
            function (line, i) {

                line.classList.toggle(
                    "active",
                    i === index
                );

            }
        );

    }


    // ========================================
    // SONG LIST
    // ========================================

    document
        .querySelectorAll(".song-play")
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const index =
                            Number(
                                button.dataset.index
                            );

                        if (
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
        searchSection
    ) {

        searchBtn.addEventListener(
            "click",
            function () {

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
            function () {

                searchSection.classList.remove(
                    "show"
                );

                searchInput.value = "";

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
    // SYNC
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
    // AUDIO ERROR
    // ========================================

    audio.addEventListener(
        "error",
        function () {

            console.error(
                "❌ Audio failed"
            );

            console.error(
                "Source:",
                audio.src
            );

        }
    );


    // ========================================
    // START
    // ========================================

    loadSong(0);

});
```
