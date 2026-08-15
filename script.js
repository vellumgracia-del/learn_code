const songs = [
  ["Golden Hour", "JVKE", 209, "https://www.youtube.com/watch?v=PEM0Vs8jf1w"],
  ["Ceilings", "Lizzy McAlpine", 194, "https://www.youtube.com/watch?v=2bpMSpFTdzM"],
  ["Death Bed", "Powfu ft. beabadoobee", 173, "https://www.youtube.com/watch?v=jJPMnTXl63E"],
];
const $ = (id) => document.querySelector(id);
const [title, artist, link, bar, now, left, status, vinyl, list, play] = ["#title", "#artist", "#link", "#progress", "#now", "#left", "#status", "#vinyl", "#list", "#play"].map($);
let song = 0, time = 0, playing = false, timer;
const clock = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
function draw() {
  const [name, singer, duration, url] = songs[song], percent = time / duration * 100;
  title.textContent = name; artist.textContent = singer; link.href = url; bar.max = duration; bar.value = time;
  bar.style.setProperty("--progress", `${percent}%`); now.textContent = clock(time); left.textContent = `-${clock(duration - time)}`;
  status.textContent = playing ? "Memutar" : "Jeda"; play.innerHTML = `${playing ? "Ⅱ" : "▶"} <span>${playing ? "Jeda" : "Putar"}</span>`;
  vinyl.classList.toggle("is-spinning", playing);
  list.innerHTML = songs.map((x, i) => `<a class="song-item ${i === song ? "active" : ""}" data-song="${i}" href="${x[3]}" target="_blank" rel="noopener"><span>0${i + 1}</span><span>${x[0]}</span><span>↗</span></a>`).join("");
}
function change(index) { song = index; time = 0; draw(); }
function toggle() { playing = !playing; clearInterval(timer); if (playing) timer = setInterval(() => { time >= songs[song][2] ? change((song + 1) % songs.length) : time++; draw(); }, 1000); draw(); }
$("#play").onclick = toggle;
$("#next").onclick = () => change((song + 1) % songs.length);
$("#prev").onclick = () => change((song + songs.length - 1) % songs.length);
bar.oninput = () => { time = Number(bar.value); draw(); };
list.onclick = (event) => { const item = event.target.closest("[data-song]"); if (item) change(Number(item.dataset.song)); };
draw();
