// navigation.js
const menuButton = document.getElementById('menu');
const navMenu = document.getElementById('navMenu');

menuButton.addEventListener('click', () => {
  const isExpanded = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', !isExpanded);
  navMenu.classList.toggle('open');
});
