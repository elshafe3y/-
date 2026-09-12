// ===== Wedding invitation — vanilla JS =====

const WEDDING_DATE = new Date("2026-09-18T20:30:00");
const TOTAL = 3;
let step = 0;

const slides = Array.from(document.querySelectorAll(".slide"));
const dots = Array.from(document.querySelectorAll(".dot"));
const music = document.getElementById("music");
const musicBtn = document.getElementById("musicBtn");

// ---- Arabic digits ----
function toArabic(n, pad = 2) {
  return String(n)
    .padStart(pad, "0")
    .replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[Number(d)]);
}

// ---- Slide navigation ----
function render() {
  slides.forEach((s, i) => s.classList.toggle("active", i === step));
  dots.forEach((d, i) => d.classList.toggle("active", i === step));
}

function go(next) {
  startMusic(); // first interaction kicks off music
  if (next < 0 || next >= TOTAL || next === step) return;
  step = next;
  render();
}

// Wire "next" buttons and dots
document.querySelectorAll("[data-next]").forEach((btn) => {
  btn.addEventListener("click", () => go(step + 1));
});
// Dots + any element with data-go (e.g. the restart button)
document.querySelectorAll("[data-go]").forEach((el) => {
  el.addEventListener("click", () => go(Number(el.dataset.go)));
});

// ---- Background music ----
function startMusic() {
  if (!music || !music.paused) return;
  music.volume = 0.5;
  music.play().then(() => musicBtn.classList.add("playing")).catch(() => {});
}

// Start as early as the browser allows: try on load, then fall back to the
// very first interaction anywhere on the page.
startMusic();
(function () {
  const kick = () => {
    startMusic();
    window.removeEventListener("pointerdown", kick);
    window.removeEventListener("keydown", kick);
    window.removeEventListener("touchstart", kick);
  };
  window.addEventListener("pointerdown", kick);
  window.addEventListener("keydown", kick);
  window.addEventListener("touchstart", kick);
})();

musicBtn.addEventListener("click", () => {
  if (music.paused) {
    music.volume = 0.5;
    music.play().then(() => musicBtn.classList.add("playing")).catch(() => {});
    musicBtn.setAttribute("aria-label", "كتم الموسيقى");
  } else {
    music.pause();
    musicBtn.classList.remove("playing");
    musicBtn.setAttribute("aria-label", "تشغيل الموسيقى");
  }
});

// ---- Live countdown ----
const elDays = document.querySelector("[data-days]");
const elHours = document.querySelector("[data-hours]");
const elMins = document.querySelector("[data-mins]");
const elSecs = document.querySelector("[data-secs]");

function tick() {
  const diff = Math.max(0, WEDDING_DATE.getTime() - Date.now());
  const s = Math.floor(diff / 1000);
  elDays.textContent = toArabic(Math.floor(s / 86400));
  elHours.textContent = toArabic(Math.floor((s % 86400) / 3600));
  elMins.textContent = toArabic(Math.floor((s % 3600) / 60));
  elSecs.textContent = toArabic(s % 60);
}
tick();
setInterval(tick, 1000);

render();
