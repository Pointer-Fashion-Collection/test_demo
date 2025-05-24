function toggleMenu() {
  const navLinks = document.getElementById('navLinks');
  navLinks.classList.toggle('active');
}

fetch('header.html')
  .then(res => res.text())
  .then(data => {
    document.getElementById("header-include").innerHTML = data;
});

function toggleTheme() {
  const body = document.body;
  body.classList.toggle("dark-theme");
  body.classList.toggle("light-theme");
}
