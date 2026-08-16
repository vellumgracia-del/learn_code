// 1. Daftar lagu: [Judul, Artis, Durasi (detik), Nama File MP3]
// Menggunakan link MP3 langsung dari server luar
const songs = [
  ["Acoustic Breeze", "Bensound", 157, "https://www.bensound.com/bensound-music/bensound-acousticbreeze.mp3"],
  ["Sunny", "Bensound", 140, "https://www.bensound.com/bensound-music/bensound-sunny.mp3"],
  ["Memories", "Bensound", 230, "https://www.bensound.com/bensound-music/bensound-memories.mp3"],
];

const $ = (id) => document.querySelector(id);

const title = $("#title");
const artist = $("#artist");
const link = $("#link"); 
const bar = $("#progress");
const now = $("#now");
const left = $("#left");
const status = $("#status");
const vinyl = $("#vinyl");
const list = $("#list");
const playBtn = $("#play");

// === FITUR BARU: AUDIO PLAYER ASLI ===
const audio = new Audio(); // Membuat mesin pemutar audio di belakang layar
let currentSongIndex = 0;
let isPlaying = false;

// Fungsi untuk mengubah detik menjadi menit:detik
const formatTime = (seconds) => {
  if (isNaN(seconds)) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const secs = String(Math.floor(seconds % 60)).padStart(2, "0");
  return `${minutes}:${secs}`;
};

// Fungsi untuk memperbarui tampilan web
function updateUI() {
  const [name, singer, duration, audioFile] = songs[currentSongIndex];

  title.textContent = name;
  artist.textContent = singer;
  
  // Menghilangkan fungsi klik yang mengarahkan ke halaman lain pada judul besar
  link.removeAttribute("href");
  link.style.cursor = "default"; 

  // Memperbarui daftar lagu di bawah
  list.innerHTML = songs.map((songData, index) => {
    const isActive = index === currentSongIndex ? "active" : "";
    return `
      <a class="song-item ${isActive}" data-song="${index}" href="javascript:void(0);">
        <span>0${index + 1}</span>
        <span>${songData[0]}</span>
        <span>▶</span> 
      </a>
    `;
  }).join("");

  status.textContent = isPlaying ? "Memutar" : "Jeda";
  playBtn.innerHTML = isPlaying ? "Ⅱ <span>Jeda</span>" : "▶ <span>Putar</span>";
  vinyl.classList.toggle("is-spinning", isPlaying);
}

// Fungsi untuk mengganti lagu
function changeSong(index) {
  currentSongIndex = index;
  const audioFile = songs[currentSongIndex][3];

  audio.src = audioFile; // Memasukkan file mp3 ke mesin pemutar

  // Jika lagu di-klik, langsung putar audionya!
  isPlaying = true;
  audio.play();
  
  updateUI();
}

// Fungsi tombol Putar / Jeda utama
function togglePlay() {
  // Jika tombol play ditekan pertama kali dan belum ada lagu yang dimuat
  if (!audio.src) {
    audio.src = songs[currentSongIndex][3];
  }

  if (isPlaying) {
    audio.pause(); // Jeda lagu asli
  } else {
    audio.play();  // Putar lagu asli
  }
  
  isPlaying = !isPlaying;
  updateUI();
}

// === EVENT LISTENER UNTUK AUDIO (Sistem Canggih) ===

// Event ini akan jalan otomatis saat lagu berputar (menggeser bar & waktu)
audio.addEventListener("timeupdate", () => {
  const currentTime = audio.currentTime; // Ambil waktu asli dari lagu
  const duration = songs[currentSongIndex][2]; // Ambil durasi dari array
  const percent = (currentTime / duration) * 100;

  bar.max = duration;
  bar.value = currentTime;
  bar.style.setProperty("--progress", `${percent}%`);

  now.textContent = formatTime(currentTime);
  left.textContent = `-${formatTime(duration - currentTime)}`;
});

// Kalau lagu habis, otomatis lompat dan putar lagu selanjutnya!
audio.addEventListener("ended", () => {
  changeSong((currentSongIndex + 1) % songs.length);
});


// === EVENT LISTENER UNTUK TOMBOL ===

playBtn.onclick = togglePlay;
$("#next").onclick = () => changeSong((currentSongIndex + 1) % songs.length);
$("#prev").onclick = () => changeSong((currentSongIndex + songs.length - 1) % songs.length);

// Saat Anda menggeser progress bar dengan mouse (lagu akan ikut dipercepat/mundur)
bar.oninput = () => {
  audio.currentTime = Number(bar.value); 
  updateUI(); 
};

// Saat judul lagu di daftar bawah diklik
list.onclick = (event) => {
  const item = event.target.closest("[data-song]");
  if (item) {
    changeSong(Number(item.dataset.song)); // Langsung ganti dan putar lagunya
  }
};

// Panggil pertama kali untuk menyiapkan tampilan
updateUI();
