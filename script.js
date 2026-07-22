const modal = document.getElementById("modal");
const modalImg = document.getElementById("modalImg");
const modalCaption = document.getElementById("modalCaption");
const modalClose = document.getElementById("modalClose");

function bindGalleryClicks() {
  const galleryItems = document.querySelectorAll(".gallery-item");
  galleryItems.forEach(function (item) {
    item.addEventListener("click", function () {
      const media = item.querySelector("img, video");
      if (!media) return;
      const title = item.getAttribute("data-title") || "";
      const desc = item.getAttribute("data-desc") || "";

      if (media.tagName === "IMG") {
        modalImg.style.display = "block";
        modalImg.src = media.src;
        modalImg.alt = media.alt || "";
      }

      modalCaption.textContent = desc ? title + " — " + desc : title;
      modal.classList.add("active");
    });
  });
}
bindGalleryClicks();

function closeModal() {
  modal.classList.remove("active");
}

modalClose.addEventListener("click", closeModal);

modal.addEventListener("click", function (e) {
  if (e.target === modal) {
    closeModal();
  }
});

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    closeModal();
  }
});

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
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

const sections = document.querySelectorAll(".section");
const navLinks = document.querySelectorAll(".nav-link");

function updateActiveNav() {
  let currentId = "";
  const scrollPos = window.scrollY + window.innerHeight / 3;

  sections.forEach(function (section) {
    if (scrollPos >= section.offsetTop) {
      currentId = section.id;
    }
  });

  navLinks.forEach(function (link) {
    link.classList.remove("active");
    if (link.getAttribute("data-target") === currentId) {
      link.classList.add("active");
    }
  });
}

window.addEventListener("scroll", updateActiveNav);
window.addEventListener("load", updateActiveNav);

const canvas = document.getElementById("fluidCanvas");
const ctx = canvas.getContext("2d");
let cw, ch;
let currentBgColor = "#000000";

function resizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  cw = canvas.width = canvas.offsetWidth * dpr;
  ch = canvas.height = canvas.offsetHeight * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

function readBgColor() {
  currentBgColor = getComputedStyle(document.documentElement).getPropertyValue("--bg-1").trim() || "#000000";
}
readBgColor();

const blobCount = 4;
const blobs = [];
for (let i = 0; i < blobCount; i++) {
  blobs.push({
    baseX: Math.random(),
    baseY: Math.random(),
    radius: 140 + Math.random() * 120,
    speed: 0.12 + Math.random() * 0.15,
    offset: Math.random() * 1000
  });
}

let mouseX = 0.5;
let mouseY = 0.5;
let mouseActive = false;

canvas.addEventListener("mousemove", function (e) {
  const rect = canvas.getBoundingClientRect();
  mouseX = (e.clientX - rect.left) / rect.width;
  mouseY = (e.clientY - rect.top) / rect.height;
  mouseActive = true;
});

canvas.addEventListener("mouseleave", function () {
  mouseActive = false;
});

let heroVisible = true;
let animationRunning = false;

function drawFluid(time) {
  if (!heroVisible) {
    animationRunning = false;
    return;
  }

  const w = canvas.offsetWidth;
  const h = canvas.offsetHeight;

  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = currentBgColor;
  ctx.fillRect(0, 0, w, h);
  ctx.globalCompositeOperation = "lighter";

  blobs.forEach(function (b) {
    const t = time * 0.001 * b.speed + b.offset;
    let x = (b.baseX + Math.sin(t) * 0.15) * w;
    let y = (b.baseY + Math.cos(t * 0.8) * 0.15) * h;

    if (mouseActive) {
      const mx = mouseX * w;
      const my = mouseY * h;
      const dx = mx - x;
      const dy = my - y;
      x += dx * 0.08;
      y += dy * 0.08;
    }

    const gradient = ctx.createRadialGradient(x, y, 0, x, y, b.radius);
    gradient.addColorStop(0, "rgba(255,255,255,0.45)");
    gradient.addColorStop(0.6, "rgba(255,255,255,0.12)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, b.radius, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.globalCompositeOperation = "source-over";
  requestAnimationFrame(drawFluid);
}

function startFluidAnimation() {
  if (!animationRunning) {
    animationRunning = true;
    requestAnimationFrame(drawFluid);
  }
}
startFluidAnimation();

const heroSectionEl = document.getElementById("hero");
if ("IntersectionObserver" in window) {
  const heroObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        heroVisible = entry.isIntersecting;
        if (heroVisible) {
          startFluidAnimation();
        }
      });
    },
    { threshold: 0 }
  );
  heroObserver.observe(heroSectionEl);
}

const heroDesc = document.getElementById("heroDesc");
const scrollHint = document.querySelector(".scroll-hint");
const heroSection = document.getElementById("hero");
const navbar = document.getElementById("navbar");

window.addEventListener("scroll", function () {
  const heroHeight = heroSection.offsetHeight;
  const progress = window.scrollY / (heroHeight * 0.4);
  if (progress > 1) {
    heroDesc.classList.add("faded");
    scrollHint.classList.add("faded");
  } else {
    heroDesc.classList.remove("faded");
    scrollHint.classList.remove("faded");
  }

  if (window.scrollY > heroHeight * 0.6) {
    navbar.classList.add("visible");
  } else {
    navbar.classList.remove("visible");
  }
});

scrollHint.addEventListener("click", function () {
  window.scrollTo({
    top: heroSection.offsetHeight,
    behavior: "smooth"
  });
});

const subtitleText = document.getElementById("subtitleText");
const contactInfo = document.getElementById("contactInfo");
const fullSubtitle = "Graphic Designer | Posters, Infographics & Visual Content";

let subtitleTyped = false;

function typeSubtitle() {
  if (subtitleTyped) return;
  subtitleTyped = true;
  let i = 0;
  const interval = setInterval(function () {
    subtitleText.textContent = fullSubtitle.slice(0, i + 1);
    i++;
    if (i >= fullSubtitle.length) {
      clearInterval(interval);
      setTimeout(function () {
        contactInfo.classList.add("visible");
      }, 300);
    }
  }, 35);
}

window.addEventListener("load", function () {
  setTimeout(typeSubtitle, 400);
});

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
  readBgColor();
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
  if (current === "auto") {
    applyTheme("auto");
  }
});

function initCarousel(wrapper) {
  const track = wrapper.querySelector(".carousel-track");
  const viewport = wrapper.querySelector(".carousel-viewport");
  const items = Array.from(wrapper.querySelectorAll(".carousel-item"));
  const prevBtn = wrapper.querySelector(".carousel-prev");
  const nextBtn = wrapper.querySelector(".carousel-next");
  const caption = wrapper.parentElement.querySelector(".carousel-caption");
  let index = 0;
  let typingInterval = null;

  function typeCaption(text) {
    if (!caption) return;
    if (typingInterval) clearInterval(typingInterval);
    caption.textContent = "";
    if (!text) return;
    let i = 0;
    typingInterval = setInterval(function () {
      caption.textContent = text.slice(0, i + 1);
      i++;
      if (i >= text.length) clearInterval(typingInterval);
    }, 35);
  }

  function update() {
    items.forEach(function (item, i) {
      item.classList.toggle("active", i === index);
    });
    const activeItem = items[index];
    const offset = activeItem.offsetLeft + activeItem.offsetWidth / 2 - viewport.offsetWidth / 2;
    track.style.transform = "translateX(" + (-offset) + "px)";
    typeCaption(activeItem.getAttribute("data-title") || "");
  }

  function openItemModal(item) {
    const img = item.querySelector("img");
    if (!img) return;
    const title = item.getAttribute("data-title") || "";
    modalImg.style.display = "block";
    modalImg.src = img.src;
    modalImg.alt = img.alt || "";
    modalCaption.textContent = title;
    modal.classList.add("active");
  }

  prevBtn.addEventListener("click", function () {
    index = (index - 1 + items.length) % items.length;
    update();
  });

  nextBtn.addEventListener("click", function () {
    index = (index + 1) % items.length;
    update();
  });

  items.forEach(function (item, i) {
    item.addEventListener("click", function () {
      if (i === index && !item.classList.contains("carousel-item-video")) {
        openItemModal(item);
      } else {
        index = i;
        update();
      }
    });
  });

  window.addEventListener("resize", update);
  update();
}

document.querySelectorAll(".carousel-wrapper").forEach(function (wrapper) {
  initCarousel(wrapper);
});
