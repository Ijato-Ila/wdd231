// scripts/main.js
import { fetchJSON } from './api.js';
import { createDesignerCard, createEventCard, setupModal } from './ui.js';

const modal = setupModal();
document.getElementById('year')?.textContent = new Date().getFullYear();

function toggleHamburger() {
  const burger = document.querySelector('.hamburger');
  const nav = document.querySelector('.nav-links');
  if (!burger || !nav) return;
  burger.addEventListener('click', () => {
    const shown = nav.classList.toggle('show');
    burger.setAttribute('aria-expanded', String(shown));
  });
}

async function loadFeatured() {
  try {
    const designers = await fetchJSON('data/designers.json');
    const featured = designers.filter((d, i) => i % 2 === 0).slice(0, 4);
    const html = featured.map(createDesignerCard).join('');
    const grid = document.getElementById('featured-grid');
    if (grid) grid.innerHTML = html;
    setupDesignerListeners();
    localStorage.setItem('designers', JSON.stringify(designers));
  } catch (err) {
    const grid = document.getElementById('featured-grid');
    if (grid) grid.textContent = 'Failed to load designers.';
    console.error(err);
  }
}

async function loadEvents() {
  try {
    const events = await fetchJSON('data/events.json');
    const html = events.map(createEventCard).join('');
    const list = document.getElementById('events-list');
    if (list) list.innerHTML = html;
    setupEventListeners(events);
    localStorage.setItem('events', JSON.stringify(events));
  } catch (err) {
    const list = document.getElementById('events-list');
    if (list) list.textContent = 'Failed to load events.';
    console.error(err);
  }
}

function setupDesignerListeners() {
  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', () => openDesignerModal(btn.dataset.id));
  });
  document.querySelectorAll('.favorite-btn').forEach(btn => {
    btn.addEventListener('click', () => toggleFavorite(btn));
  });
}

function setupEventListeners(events) {
  document.querySelectorAll('.view-event').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = Number(btn.dataset.id);
      const e = events.find(x => x.id === id);
      if (e) {
        modal.open(`<p><strong>Date:</strong> ${e.date}</p><p>${e.description}</p><p><strong>Venue:</strong> ${e.venue}</p>`, e.title);
      }
    });
  });
}

function toggleFavorite(btn) {
  const id = btn.dataset.id;
  const favs = JSON.parse(localStorage.getItem('favs') || '[]');
  const exists = favs.includes(id);
  if (exists) {
    const newFavs = favs.filter(x => x !== id);
    localStorage.setItem('favs', JSON.stringify(newFavs));
    btn.classList.remove('is-fav');
    btn.textContent = '♡';
    btn.setAttribute('aria-pressed', 'false');
  } else {
    favs.push(id);
    localStorage.setItem('favs', JSON.stringify(favs));
    btn.classList.add('is-fav');
    btn.textContent = '♥';
    btn.setAttribute('aria-pressed', 'true');
  }
}

function openDesignerModal(id) {
  const designers = JSON.parse(localStorage.getItem('designers') || '[]');
  const d = designers.find(x => String(x.id) === String(id));
  if (!d) return;
  const html = `
    <img src="${d.image || 'images/placeholder.jpg'}" alt="${d.name}" style="width:100%;height:auto;border-radius:6px;margin-bottom:12px" loading="lazy">
    <p><strong>Location:</strong> ${d.location}</p>
    <p><strong>Founded:</strong> ${d.established}</p>
    <p>${d.bio}</p>
    <p><a href="${d.instagram}" target="_blank" rel="noopener">Instagram</a></p>
  `;
  modal.open(html, d.name);
}

// init
toggleHamburger();
loadFeatured();
loadEvents();
