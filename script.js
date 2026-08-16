// 1. Daftar lagu: [Judul, Artis, Durasi (detik), URL YouTube]
const songs = [
  ["Golden Hour", "JVKE", 209, "https://www.youtube.com/watch?v=PEM0Vs8jf1w"],
  ["Ceilings", "Lizzy McAlpine", 194, "https://www.youtube.com/watch?v=2bpMSpFTdzM"],
  ["Death Bed", "Powfu ft. beabadoobee", 173, "https://www.youtube.com/watch?v=jJPMnTXl63E"],
];

// 2. Fungsi pembantu untuk mempermudah pemanggilan elemen HTML
const $ = (id) => document.querySelector(id);

// 3. Mengambil semua elemen yang ada di HTML
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

// 4. Variabel state (keadaan saat ini)
let currentSongIndex = 0;
let currentTime = 0;
let isPlaying = false;
let timer;

// 5. Fungsi untuk mengubah detik menjadi format menit:detik (misal: 209 -> 3:29)
const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const secs = String(seconds % 60).padStart(2, "0");
  return `${minutes}:${secs}`;
};

// 6. Fungsi utama untuk menggambar/memperbarui tampilan (UI)
function updateUI() {
  const [name, singer, duration, url] = songs[currentSongIndex];
  const percent = (currentTime / duration) * 100;

  // Update Teks dan Link
  title.textContent = name;
  artist.textContent = singer;
  link.href = url;
  
  // Update Progress Bar
  bar.max = duration;
  bar.value = currentTime;
  bar.style.setProperty("--progress", `${percent}%`); // Mengirim nilai ke CSS
  
  // Update Waktu
  now.textContent = formatTime(currentTime);
  left.textContent = `-${formatTime(duration - currentTime)}`;
  
  // Update Status & Tombol (Putar/Jeda)
  status.textContent = isPlaying ? "Memutar" : "Jeda";
  playBtn.innerHTML = isPlaying ? "Ⅱ <span>Jeda</span>" : "▶ <span>Putar</span>";
  
  // Putar Piringan Hitam jika sedang main
  vinyl.classList.toggle("is-spinning", isPlaying);
  
  // Buat ulang daftar lagu
  list.innerHTML = songs.map((songData, index) => {
    const isActive = index === currentSongIndex ? "active" : "";
    return `
      <a class="song-item ${isActive}" data-song="${index}" href="${songData[3]}" target="_blank" rel="noopener">
        <span>0${index + 1}</span>
        <span>${songData[0]}</span>
        <span>↗</span>
      </a>
    `;
  }).join("");
}

// 7. Fungsi untuk mengganti lagu
function changeSong(index) {
  currentSongIndex = index;
  currentTime = 0; // Reset waktu ke 0
  updateUI();
}

// 8. Fungsi untuk Menjalankan / Menghentikan lagu
function togglePlay() {
  isPlaying = !isPlaying;
  clearInterval(timer); // Bersihkan timer yang berjalan sebelumnya

  if (isPlaying) {
    // Jika memutar, jalankan detik setiap 1000ms (1 detik)
    timer = setInterval(() => {
      const duration = songs[currentSongIndex][2];
      
      if (currentTime >= duration) {
        // Jika lagu habis, otomatis putar lagu selanjutnya
        changeSong((currentSongIndex + 1) % songs.length);
      } else {
        currentTime++;
      }
      updateUI();
    }, 1000);
  }
  updateUI();
}

// 9. EVENT LISTENERS (Menangkap klik dari user)

// Klik tombol Putar/Jeda
playBtn.onclick = togglePlay;

// Klik tombol Next
$("#next").onclick = () => {
  changeSong((currentSongIndex + 1) % songs.length);
};

// Klik tombol Previous (Mundur)
$("#prev").onclick = () => {
  changeSong((currentSongIndex + songs.length - 1) % songs.length);
};

// Saat user menggeser progress bar secara manual
bar.oninput = () => {
  currentTime = Number(bar.value);
  updateUI();
};

// Saat user mengklik lagu di daftar lagu bagian bawah
list.onclick = (event) => {
  const item = event.target.closest("[data-song]");
  if (item) {
    // Hapus tanda dua garis miring di bawah ini jika kamu TIDAK ingin 
    // tab baru youtube terbuka saat baris lagu diklik.
    // event.preventDefault(); 
    
    changeSong(Number(item.dataset.song));
  }
};

// 10. Inisialisasi: Panggil fungsi updateUI agar tampilan web terisi data saat pertama kali dibuka
updateUI();
