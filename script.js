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

// افکت بلور محو شونده هنگام اسکرول
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

// هایلایت کردن منو بر اساس بخشی که در حال دیدنشیم
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

// ===== Fluid Hero Background =====
const canvas = document.getElementById("fluidCanvas");
const ctx = canvas.getContext("2d");
let cw, ch;

function resizeCanvas() {
  cw = canvas.width = canvas.offsetWidth;
  ch = canvas.height = canvas.offsetHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const blobCount = 6;
const blobs = [];
for (let i = 0; i < blobCount; i++) {
  blobs.push({
    baseX: Math.random(),
    baseY: Math.random(),
    radius: 120 + Math.random() * 140,
    speed: 0.15 + Math.random() * 0.2,
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

function getBgColor() {
  return getComputedStyle(document.documentElement).getPropertyValue("--bg-1").trim() || "#000000";
}

function drawFluid(time) {
  ctx.clearRect(0, 0, cw, ch);
  ctx.fillStyle = getBgColor();
  ctx.fillRect(0, 0, cw, ch);
  ctx.globalCompositeOperation = "lighter";
  ctx.filter = "blur(45px)";

  blobs.forEach(function (b) {
    const t = time * 0.001 * b.speed + b.offset;
    let x = (b.baseX + Math.sin(t) * 0.15) * cw;
    let y = (b.baseY + Math.cos(t * 0.8) * 0.15) * ch;

    if (mouseActive) {
      const mx = mouseX * cw;
      const my = mouseY * ch;
      const dx = mx - x;
      const dy = my - y;
      x += dx * 0.08;
      y += dy * 0.08;
    }

    const gradient = ctx.createRadialGradient(x, y, 0, x, y, b.radius);
    gradient.addColorStop(0, "rgba(255,255,255,0.55)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, b.radius, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.filter = "none";
  ctx.globalCompositeOperation = "source-over";
  requestAnimationFrame(drawFluid);
}
requestAnimationFrame(drawFluid);

// ===== Hero scroll fade =====
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

// ===== Header reveal sequence (typing subtitle -> contact) =====
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

// شروع تایپ به‌محض بارگذاری صفحه (مطمئن‌ترین حالت، بدون وابستگی به observer)
window.addEventListener("load", function () {
  setTimeout(typeSubtitle, 400);
});
