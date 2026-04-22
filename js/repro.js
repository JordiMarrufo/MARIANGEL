const audioPlayer = document.getElementById("audioPlayer");
const playBtn = document.getElementById("playBtn");
const pauseBtn = document.getElementById("pauseBtn");
const progressBar = document.querySelector(".progress-bar");
const progressFill = document.querySelector(".progress-fill");
const progressDot = document.querySelector(".progress-dot");

const MAX_TIME = 155; // 2 minutos y 35 segundos

let isPlaying = false;

playBtn.addEventListener("click", () => {
  audioPlayer.play();
  isPlaying = true;
  playBtn.style.display = "none";
  pauseBtn.style.display = "block";
});

pauseBtn.addEventListener("click", () => {
  audioPlayer.pause();
  isPlaying = false;
  playBtn.style.display = "block";
  pauseBtn.style.display = "none";
});

audioPlayer.addEventListener("timeupdate", () => {
  if (audioPlayer.currentTime >= MAX_TIME) {
    audioPlayer.pause();
    audioPlayer.currentTime = MAX_TIME;
    isPlaying = false;
    playBtn.style.display = "block";
    pauseBtn.style.display = "none";
  }

  const percent = (audioPlayer.currentTime / MAX_TIME) * 100;
  progressFill.style.width = percent + "%";
  progressDot.style.left = percent + "%";
});

progressBar.addEventListener("click", (e) => {
  const clickX = e.offsetX;
  const width = progressBar.offsetWidth;
  const newTime = (clickX / width) * MAX_TIME;
  audioPlayer.currentTime = Math.min(newTime, MAX_TIME);
});

pauseBtn.style.display = "none";
