// scripts/designers-page.js
import { fetchJSON } from './api.js';
import { createDesignerCard, setupModal } from './ui.js';

const modal = setupModal();
document.getElementById('year2').textContent = new Date().getFullYear();

function toggleHamburger() {
  const burger = document.querySelector('.hamburger');
  const nav = document.querySelector('.nav-links');
  if (!burger || !nav) return;
  burger.addEventListener('click', () => nav.classList.toggle('show'));
}

async function init() {
  try {
    const designers = await fetchJSON('data/designers.json');
    localStorage.setItem('designers', JSON.stringify(designers));
    renderDesigners(designers);
    populateCountryFilter(designers);
    setupGlobalListeners(designers);
  } catch (err) {
    document.getElementById('designers-grid').textContent = 'Failed to load designers.';
    console.error(err);
  }
}

function renderDesigners(list) {
  const grid = document.getElementById('designers-grid');
  grid.innerHTML = list.map(createDesignerCard).join('');
  setupCardListeners();
}

function setupCardListeners() {
  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', () => openDesignerModal(btn.dataset.id));
  });
  document.querySelectorAll('.favorite-btn').forEach(btn => {
    const favs = JSON.parse(localStorage.getItem('favs') || '[]');
    if (favs.includes(btn.dataset.id)) {
      btn.classList.add('is-fav');
      btn.textContent = '♥';
      btn.setAttribute('aria-pressed','true');
    }
    btn.addEventListener('click', () => toggleFavorite(btn));
  });
}

function openDesignerModal(id) {
  const designers = JSON.parse(localStorage.getItem('designers') || '[]');
  const d = designers.find(x => String(x.id) === String(id));
  if (!d) return;
  const html = `
    <img src="${d.image || 'images/placeholder.jpg'}" alt="${d.name}" style="width:100%;height:auto;border-radius:6px;margin-bottom:12px" loading="lazy">
    <p><strong>Location:</strong> ${d.location}</p>
    <p><strong>Founded:</strong> ${d.established}</p>
    <p><strong>Signature:</strong> ${d.signature}</p>
    <p>${d.bio}</p>
    <p><a href="${d.instagram}" target="_blank" rel="noopener">Instagram</a></p>
  `;
  modal.open(html, d.name);
}

function toggleFavorite(btn) {
  const id = btn.dataset.id;
  const favs = JSON.parse(localStorage.getItem('favs') || '[]');
  if (favs.includes(id)) {
    const newFavs = favs.filter(x => x !== id);
    localStorage.setItem('favs', JSON.stringify(newFavs));
    btn.classList.remove('is-fav');
    btn.textContent = '♡';
  } else {
    favs.push(id);
    localStorage.setItem('favs', JSON.stringify(favs));
    btn.classList.add('is-fav');
    btn.textContent = '♥';
  }
}

function populateCountryFilter(designers) {
  const select = document.getElementById('filter-country');
  const countries = Array.from(new Set(designers.map(d => d.location))).sort();
  countries.forEach(c => select.insertAdjacentHTML('beforeend', `<option value="${c}">${c}</option>`));
  select.addEventListener('change', () => {
    const val = select.value;
    if (val === 'all') renderDesigners(designers);
    else renderDesigners(designers.filter(d => d.location === val));
  });
}

function setupGlobalListeners(designers) {
  document.getElementById('show-favorites').addEventListener('click', () => {
    const favs = JSON.parse(localStorage.getItem('favs') || '[]');
    if (favs.length === 0) {
      alert('No favorites saved yet.');
      return;
    }
    const favDesigners = designers.filter(d => favs.includes(String(d.id)));
    renderDesigners(favDesigners);
  });

  document.getElementById('clear-favorites').addEventListener('click', () => {
    localStorage.removeItem('favs');
    renderDesigners(designers);
  });
}

toggleHamburger();
init();
