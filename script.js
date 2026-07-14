const modal = document.getElementById("modal");
const modalImg = document.getElementById("modalImg");
const modalCaption = document.getElementById("modalCaption");
const modalClose = document.getElementById("modalClose");

const galleryItems = document.querySelectorAll(".gallery-item");

galleryItems.forEach(function (item) {
  item.addEventListener("click", function () {
    const img = item.querySelector("img");
    const title = item.getAttribute("data-title") || "";
    const desc = item.getAttribute("data-desc") || "";

    modalImg.src = img.src;
    modalImg.alt = img.alt;
    modalCaption.textContent = desc ? title + " — " + desc : title;

    modal.classList.add("active");
  });
});

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
