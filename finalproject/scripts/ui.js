// scripts/ui.js
export function createDesignerCard(d) {
  return `
    <article class="card designer-card" data-id="${d.id}" tabindex="0" role="article" aria-labelledby="d-${d.id}-title">
      <img src="${d.image || 'images/placeholder.jpg'}" alt="${escapeHtml(d.name)} photo" loading="lazy" width="480" height="320">
      <h3 id="d-${d.id}-title">${escapeHtml(d.name)}</h3>
      <p class="meta">${escapeHtml(d.location)} • Est. ${escapeHtml(String(d.established))} • ${escapeHtml(d.signature)}</p>
      <p>${escapeHtml(d.bio)}</p>
      <div class="actions">
        <button class="view-btn" data-id="${d.id}">View</button>
        <a class="link" href="${d.instagram}" target="_blank" rel="noopener">Instagram</a>
        <button class="favorite-btn" data-id="${d.id}" aria-pressed="false" title="Save as favorite">♡</button>
      </div>
    </article>
  `;
}

export function createEventCard(e) {
  return `
    <article class="card events-card" data-id="${e.id}">
      <div class="meta date">${escapeHtml(e.date)}</div>
      <h3>${escapeHtml(e.title)}</h3>
      <p class="meta">${escapeHtml(e.venue)}</p>
      <p>${escapeHtml(e.description)}</p>
      <p class="meta">Tickets: ${escapeHtml(e.tickets)}</p>
      <div class="actions">
        <button class="view-event" data-id="${e.id}">Details</button>
      </div>
    </article>
  `;
}

export function setupModal(containerId = 'modal') {
  const modal = document.getElementById(containerId);
  if (!modal) {
    const div = document.createElement('div');
    div.id = containerId;
    div.className = 'modal';
    div.setAttribute('role', 'dialog');
    div.setAttribute('aria-hidden', 'true');
    document.body.appendChild(div);
  }
  const container = document.getElementById(containerId);
  return {
    open(html, titleText) {
      container.innerHTML = `
        <div class="modal-card" role="document">
          <button class="close" aria-label="Close modal">&times;</button>
          <h2 id="modal-title">${escapeHtml(titleText || '')}</h2>
          <div id="modal-desc">${html}</div>
        </div>
      `;
      container.style.display = 'flex';
      container.setAttribute('aria-hidden', 'false');
      const close = container.querySelector('.close');
      close.focus();
      function onClose(){ container.style.display='none'; container.setAttribute('aria-hidden','true'); document.removeEventListener('keydown', onKey); }
      close.addEventListener('click', onClose);
      container.addEventListener('click', (ev) => { if (ev.target === container) onClose(); });
      function onKey(e){ if(e.key === 'Escape') onClose(); }
      document.addEventListener('keydown', onKey);
    },
    close() {
      container.style.display = 'none';
      container.setAttribute('aria-hidden', 'true');
    }
  };
}

export function escapeHtml(str = '') {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
