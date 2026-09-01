const audio = document.getElementById("audio");

const playBtn = document.getElementById("playBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

const progress = document.getElementById("progress");

const songTitle = document.getElementById("songTitle");
const artistName = document.getElementById("artistName");

const currentTime = document.getElementById("currentTime");
const duration = document.getElementById("duration");

const lyricsBox = document.getElementById("lyricsBox");
const lyricsStatus = document.getElementById("lyricsStatus");

const songList = document.getElementById("songList");

const searchInput = document.getElementById("searchInput");

const favBtn = document.getElementById("favBtn");

const themeBtn = document.getElementById("themeBtn");


/*
  IMPORTANT:
  Replace the audio paths below with your
  own / licensed audio files.
*/

const songs = [

  {
    title: "SAYA VIBE",
    artist: "SAYAVIBE",
    audio: "assets/music/song1.mp3",

    lyrics: [
      { time: 0, text: "Welcome to SAYAVIBE" },
      { time: 5, text: "Your music. Your lyrics." },
      { time: 10, text: "Feel every moment." },
      { time: 15, text: "Sing with your heart." }
    ]
  },

  {
    title: "Dream Vibe",
    artist: "SAYAVIBE",
    audio: "assets/music/song2.mp3",

    lyrics: [
      { time: 0, text: "Close your eyes" },
      { time: 5, text: "Feel the music" },
      { time: 10, text: "Follow the rhythm" },
      { time: 15, text: "Live your vibe" }
    ]
  }

];


let currentSong = 0;
let isPlaying = false;


/* LOAD SONG */

function loadSong(index) {

  currentSong = index;

  const song = songs[currentSong];

  songTitle.textContent = song.title;
  artistName.textContent = song.artist;

  audio.src = song.audio;

  renderLyrics(song.lyrics);

  lyricsStatus.textContent = "Ready";

  progress.value = 0;

  currentTime.textContent = "0:00";
  duration.textContent = "0:00";

  updateFavoriteButton();

}


/* PLAY / PAUSE */

function togglePlay() {

  if (!audio.src) return;

  if (isPlaying) {

    audio.pause();

  } else {

    audio.play().catch(() => {
      lyricsStatus.textContent = "Tap Play to start";
    });

  }

}


/* AUDIO EVENTS */

audio.addEventListener("play", () => {

  isPlaying = true;

  playBtn.textContent = "⏸";

  lyricsStatus.textContent = "Playing";

});


audio.addEventListener("pause", () => {

  isPlaying = false;

  playBtn.textContent = "▶";

  lyricsStatus.textContent = "Paused";

});


audio.addEventListener("loadedmetadata", () => {

  progress.max = audio.duration;

  duration.textContent = formatTime(audio.duration);

});


audio.addEventListener("timeupdate", () => {

  progress.value = audio.currentTime;

  currentTime.textContent =
    formatTime(audio.currentTime);

  updateLyrics();

});


audio.addEventListener("ended", () => {

  nextSong();

});


/* PROGRESS */

progress.addEventListener("input", () => {

  audio.currentTime = progress.value;

});


/* NEXT */

function nextSong() {

  currentSong++;

  if (currentSong >= songs.length) {
    currentSong = 0;
  }

  loadSong(currentSong);

  audio.play().catch(() => {});

}


/* PREVIOUS */

function previousSong() {

  currentSong--;

  if (currentSong < 0) {
    currentSong = songs.length - 1;
  }

  loadSong(currentSong);

  audio.play().catch(() => {});

}


playBtn.addEventListener("click", togglePlay);

nextBtn.addEventListener("click", nextSong);

prevBtn.addEventListener("click", previousSong);


/* FORMAT TIME */

function formatTime(seconds) {

  if (!isFinite(seconds)) {
    return "0:00";
  }

  const minutes = Math.floor(seconds / 60);

  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");

  return `${minutes}:${secs}`;

}


/* LYRICS */

function renderLyrics(lyrics) {

  lyricsBox.innerHTML = "";

  lyrics.forEach((line, index) => {

    const p = document.createElement("p");

    p.className = "lyric";

    p.dataset.time = line.time;

    p.dataset.index = index;

    p.textContent = line.text;

    lyricsBox.appendChild(p);

  });

}


function updateLyrics() {

  const song = songs[currentSong];

  const lines = document.querySelectorAll(".lyric");

  let activeIndex = 0;

  for (let i = 0; i < song.lyrics.length; i++) {

    if (audio.currentTime >= song.lyrics[i].time) {
      activeIndex = i;
    }

  }

  lines.forEach((line, index) => {

    line.classList.toggle(
      "active",
      index === activeIndex
    );

  });

  const activeLine = lines[activeIndex];

  if (activeLine) {

    activeLine.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });

  }

}


/* SONG LIST */

function renderSongs(list = songs) {

  songList.innerHTML = "";

  list.forEach((song, index) => {

    const card = document.createElement("div");

    card.className = "song-card";

    card.innerHTML = `
      <div class="song-icon">🎵</div>

      <div>
        <h3>${song.title}</h3>
        <p>${song.artist}</p>
      </div>
    `;

    card.addEventListener("click", () => {

      const originalIndex = songs.indexOf(song);

      loadSong(originalIndex);

      audio.play().catch(() => {});

    });

    songList.appendChild(card);

  });

}


/* SEARCH */

searchInput.addEventListener("input", () => {

  const value =
    searchInput.value.toLowerCase().trim();

  const filtered = songs.filter(song =>

    song.title.toLowerCase().includes(value) ||

    song.artist.toLowerCase().includes(value)

  );

  renderSongs(filtered);

});


/* FAVOURITE */

function updateFavoriteButton() {

  const favorites =
    JSON.parse(
      localStorage.getItem("sayavibeFavorites") || "[]"
    );

  const exists =
    favorites.includes(currentSong);

  favBtn.textContent =
    exists
      ? "♥ Added to Favourite"
      : "♡ Add to Favourite";

}


favBtn.addEventListener("click", () => {

  let favorites =
    JSON.parse(
      localStorage.getItem("sayavibeFavorites") || "[]"
    );

  if (favorites.includes(currentSong)) {

    favorites =
      favorites.filter(
        item => item !== currentSong
      );

  } else {

    favorites.push(currentSong);

  }

  localStorage.setItem(
    "sayavibeFavorites",
    JSON.stringify(favorites)
  );

  updateFavoriteButton();

});


/* DARK / LIGHT */

themeBtn.addEventListener("click", () => {

  document.body.classList.toggle("light");

  const light =
    document.body.classList.contains("light");

  themeBtn.textContent =
    light ? "🌙" : "☀️";

  localStorage.setItem(
    "sayavibeTheme",
    light ? "light" : "dark"
  );

});


/* RESTORE THEME */

if (
  localStorage.getItem("sayavibeTheme") === "light"
) {

  document.body.classList.add("light");

  themeBtn.textContent = "🌙";

}


/* START */

loadSong(0);

renderSongs();
