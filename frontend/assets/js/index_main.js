function scrollToLeft() {
  const container = document.getElementById("scroll-container");
  container.scrollBy({ left: -250, behavior: "smooth" });
}

function scrollToRight() {
  const container = document.getElementById("scroll-container");
  container.scrollBy({ left: 250, behavior: "smooth" });
}


// Auto-scroll with loop
let autoScrollInterval = setInterval(() => {
  scrollToRight();
}, 4000);

document.getElementById("scroll-container").addEventListener("mouseover", () => {
  clearInterval(autoScrollInterval);
});

document.getElementById("scroll-container").addEventListener("mouseout", () => {
  autoScrollInterval = setInterval(() => {
    scrollToRight();
  }, 4000);
});
