// scripts/events-page.js
import { fetchJSON } from './api.js';
import { createEventCard, setupModal } from './ui.js';

const modal = setupModal();
document.getElementById('year3').textContent = new Date().getFullYear();

function toggleHamburger() {
  const burger = document.querySelector('.hamburger');
  const nav = document.querySelector('.nav-links');
  if (!burger || !nav) return;
  burger.addEventListener('click', () => nav.classList.toggle('show'));
}

async function init() {
  try {
    const events = await fetchJSON('data/events.json');
    localStorage.setItem('events', JSON.stringify(events));
    const grid = document.getElementById('events-grid');
    grid.innerHTML = events.map(createEventCard).join('');
    attachEventListeners(events);
  } catch (err) {
    document.getElementById('events-grid').textContent = 'Failed to load events.';
    console.error(err);
  }
}

function attachEventListeners(events) {
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

toggleHamburger();
init();
