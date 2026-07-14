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
