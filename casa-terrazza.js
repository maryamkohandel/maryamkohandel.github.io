// ===== Theme (shared with main site) =====
const htmlEl = document.documentElement;
const lightBtn = document.getElementById("lightBtn");
const darkBtn = document.getElementById("darkBtn");
const autoBtn = document.getElementById("autoBtn");
const themeBtns = [lightBtn, darkBtn, autoBtn];

function getSystemTheme() {
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function applyTheme(mode) {
  const actualTheme = mode === "auto" ? getSystemTheme() : mode;
  htmlEl.setAttribute("data-theme", actualTheme);

  themeBtns.forEach(function (btn) {
    btn.classList.remove("active");
  });

  if (mode === "light") lightBtn.classList.add("active");
  if (mode === "dark") darkBtn.classList.add("active");
  if (mode === "auto") autoBtn.classList.add("active");

  localStorage.setItem("themePreference", mode);
}

lightBtn.addEventListener("click", function () {
  applyTheme("light");
});
darkBtn.addEventListener("click", function () {
  applyTheme("dark");
});
autoBtn.addEventListener("click", function () {
  applyTheme("auto");
});

const savedTheme = localStorage.getItem("themePreference") || "dark";
applyTheme(savedTheme);

window.matchMedia("(prefers-color-scheme: light)").addEventListener("change", function () {
  const current = localStorage.getItem("themePreference");
  if (current === "auto") applyTheme("auto");
});

// ===== Scroll reveal =====
const revealElements = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) entry.target.classList.add("visible");
      });
    },
    { threshold: 0.1 }
  );
  revealElements.forEach(function (el) {
    observer.observe(el);
  });
} else {
  revealElements.forEach(function (el) {
    el.classList.add("visible");
  });
}

// ===== Lightbox for project images & materials =====
const modal = document.getElementById("modal");
const modalImg = document.getElementById("modalImg");
const modalCaption = document.getElementById("modalCaption");
const modalClose = document.getElementById("modalClose");

document.querySelectorAll(".project-item, .material-item").forEach(function (item) {
  item.addEventListener("click", function () {
    const img = item.querySelector("img");
    if (!img) return;
    modalImg.style.display = "block";
    modalImg.src = img.src;
    modalImg.alt = img.alt || "";
    modalCaption.textContent = item.getAttribute("data-title") || "";
    modal.classList.add("active");
  });
});

modalClose.addEventListener("click", function () {
  modal.classList.remove("active");
});
modal.addEventListener("click", function (e) {
  if (e.target === modal) modal.classList.remove("active");
});
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") modal.classList.remove("active");
});
