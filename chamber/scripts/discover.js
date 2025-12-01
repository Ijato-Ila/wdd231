// scripts/discover.js
// Uses existing data/members.json to render 8 cards and show visit message via localStorage

const DATA_URL = 'data/members.json'; // your main JSON file
const GRID_EL = document.getElementById('discoverGrid');
const MSG_EL = document.getElementById('visitMessage');
const VISIT_KEY = 'discover_last_visit';
const MS_PER_DAY = 1000 * 60 * 60 * 24;

if (!GRID_EL || !MSG_EL) {
  console.error('discover.js: Missing expected DOM elements #discoverGrid or #visitMessage');
}

// safe fetch and normalize items
async function fetchItems() {
  try {
    const res = await fetch(DATA_URL);
    if (!res.ok) throw new Error(`Failed to fetch ${DATA_URL}: ${res.status}`);
    const raw = await res.json();
    // normalize: if array, use it; if object with members property, use that
    if (Array.isArray(raw)) return raw;
    if (raw && Array.isArray(raw.members)) return raw.members;
    console.warn('discover.js: data format unexpected; expected array or { members: [] }');
    return [];
  } catch (err) {
    console.error('discover.js fetch error:', err);
    return [];
  }
}

function pick8(items) {
  // pick the first 8 items that have an image; fallback to first 8 if none found
  const withImg = items.filter(i => i.image);
  return (withImg.length >= 8 ? withImg.slice(0, 8) : items.slice(0, 8));
}

function renderCards(items) {
  if (!GRID_EL) return;
  GRID_EL.innerHTML = '';
  items.forEach((item, idx) => {
    const n = idx + 1;
    const title = escapeHtml(item.name || item.title || 'Untitled');
    const addr = escapeHtml(item.address || 'Address not provided');
    const desc = escapeHtml(item.description || '');
    const img = escapeAttr(item.image || 'images/discover-placeholder.webp');
    const link = escapeAttr(item.website || item.moreUrl || '#');

    const article = document.createElement('article');
    article.className = `discover-card item-${n}`;
    article.innerHTML = `
      <h2>${title}</h2>
      <figure>
        <img src="${img}" alt="${title}" loading="lazy" width="300" height="200">
      </figure>
      <address>${addr}</address>
      <p>${desc}</p>
      <p><a class="learn-more" href="${link}" target="_blank" rel="noopener">Learn more</a></p>
    `;
    GRID_EL.appendChild(article);
  });
}

function escapeHtml(str = '') {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}
function escapeAttr(s = '') {
  return String(s).replace(/"/g, '&quot;');
}

/* ---------- visit message logic using localStorage ---------- */
/* Behaviour required:
   - If no stored last visit: "Welcome! Let us know if you have any questions."
   - If last visit < 1 day (difference < 1): "Back so soon! Awesome!"
   - Else: "You last visited n days ago."  (use "day" singular when n === 1)
   After computing and showing the message, store the current timestamp for next visit.
*/

function computeVisitMessage() {
  try {
    const now = Date.now();
    const raw = localStorage.getItem(VISIT_KEY);
    if (!raw) {
      return { text: 'Welcome! Let us know if you have any questions.', now };
    }

    const prev = parseInt(raw, 10);
    if (Number.isNaN(prev)) {
      // data corrupted — treat as first visit
      return { text: 'Welcome! Let us know if you have any questions.', now };
    }

    const diffMs = now - prev;
    const diffDays = Math.floor(diffMs / MS_PER_DAY);

    if (diffDays < 1) {
      return { text: 'Back so soon! Awesome!', now };
    } else if (diffDays === 1) {
      return { text: 'You last visited 1 day ago.', now };
    } else {
      return { text: `You last visited ${diffDays} days ago.`, now };
    }
  } catch (err) {
    console.error('computeVisitMessage error:', err);
    return { text: 'Welcome! Let us know if you have any questions.', now: Date.now() };
  }
}

function showVisitMessage() {
  if (!MSG_EL) return;
  // compute message based on stored value
  const { text, now } = computeVisitMessage();

  // inject accessible message and a close button
  MSG_EL.innerHTML = `
    <span class="visit-text">${escapeHtml(text)}</span>
    <button type="button" id="visitClose" class="visit-close" aria-label="Close visit message">✕</button>
  `;

  // attach close behavior (removes message from DOM but does NOT change stored timestamp)
  const closeBtn = document.getElementById('visitClose');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      MSG_EL.style.display = 'none';
    });
  }

  // now store current timestamp for next visit
  try {
    localStorage.setItem(VISIT_KEY, String(now));
  } catch (err) {
    console.warn('Unable to write to localStorage:', err);
  }
}

/* ---------- init ---------- */
(async function init() {
  // set footer year if present
  const yearEl = document.getElementById('yearDiscover') || document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // load and render items
  const rawItems = await fetchItems();
  const items = pick8(rawItems);
  renderCards(items);

  // show visit message
  showVisitMessage();
})();
