// scripts/discover.js
const DATA_URL = 'data/members.json'; // use your existing JSON
const GRID_EL = document.getElementById('discoverGrid');
const VISIT_KEY = 'discover_last_visit';
const MSG_EL = document.getElementById('visitMessage');

async function getData() {
  try {
    const resp = await fetch(DATA_URL);
    if (!resp.ok) throw new Error('Failed to load data');
    const data = await resp.json();
    // data may be an array or object; handle both
    // if data has "members" property (your earlier members.json), use it:
    const items = Array.isArray(data) ? data : (data.members || []);
    return items;
  } catch (err) {
    console.error('Discover data error:', err);
    return [];
  }
}

function pick8(items) {
  // Prefer items that have an image property. If many exist, take first 8.
  const withImages = items.filter(i => i.image);
  return withImages.slice(0, 8);
}

function renderCards(items) {
  GRID_EL.innerHTML = '';
  items.forEach((item, idx) => {
    const n = idx + 1;
    const card = document.createElement('article');
    card.className = `discover-card item-${n}`;
    card.innerHTML = `
      <h2>${escapeHtml(item.name || item.title || 'Untitled')}</h2>
      <figure>
        <img src="${escapeAttr(item.image)}" alt="${escapeAttr(item.name || item.title || '')}" loading="lazy" width="300" height="200">
      </figure>
      <address>${escapeHtml(item.address || 'Address not provided')}</address>
      <p>${escapeHtml(item.description || '')}</p>
      <p><a class="learn-more" href="${escapeAttr(item.website || item.moreUrl || '#')}" target="_blank" rel="noopener">Learn more</a></p>
    `;
    GRID_EL.appendChild(card);
  });
}

function escapeHtml(str = '') {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function escapeAttr(s = '') {
  return (s + '').replace(/"/g, '&quot;');
}

function updateVisitMessage() {
  const now = Date.now();
  const last = localStorage.getItem(VISIT_KEY);
  if (!last) {
    MSG_EL.textContent = 'Welcome! Let us know if you have any questions.';
  } else {
    const lastMs = parseInt(last, 10);
    const days = Math.floor((now - lastMs) / (1000 * 60 * 60 * 24));
    if (days < 1) {
      MSG_EL.textContent = 'Back so soon! Awesome!';
    } else if (days === 1) {
      MSG_EL.textContent = 'You last visited 1 day ago.';
    } else {
      MSG_EL.textContent = `You last visited ${days} days ago.`;
    }
  }
  localStorage.setItem(VISIT_KEY, now.toString());
}

(async function init() {
  // set year in footer
  const y = document.getElementById('yearDiscover');
  if (y) y.textContent = new Date().getFullYear();

  // load data and render
  const allItems = await getData();
  const items = pick8(allItems);
  renderCards(items);

  // localStorage visit message
  updateVisitMessage();
})();
