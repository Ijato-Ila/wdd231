// scripts/join.js
// Handles timestamp, modals, accessibility and small helpers

document.addEventListener('DOMContentLoaded', () => {
  // 1) populate timestamp
  console.log('Timestamp:', document.getElementById('timestamp').value);

  const ts = document.getElementById('timestamp');
  if (ts) ts.value = new Date().toISOString();

  // 2) footer year
  const y = document.getElementById('yearFooter');
  if (y) y.textContent = new Date().getFullYear();

  // 3) modal handling (open, close, focus management)
  const openers = document.querySelectorAll('.open-modal');
  const modals = document.querySelectorAll('.modal');

  openers.forEach(op => {
    op.addEventListener('click', (e) => {
      e.preventDefault();
      const id = op.getAttribute('data-target');
      const modal = document.getElementById(id);
      openModal(modal, op);
    });
  });

  modals.forEach(modal => {
    const closeBtn = modal.querySelector('.modal-close');
    if (closeBtn) closeBtn.addEventListener('click', () => closeModal(modal));

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal(modal); // click outside content
    });

    modal.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal(modal);
      if (e.key === 'Tab') trapTabKey(e, modal);
    });
  });

  // helpers for focus trapping
  function openModal(modal, opener) {
    if (!modal) return;
    modal.setAttribute('aria-hidden', 'false');
    modal.style.display = 'flex';

    // store opener to return focus later
    modal._opener = opener;

    // focus first focusable inside modal
    const focusable = modal.querySelectorAll('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])');
    if (focusable.length) focusable[0].focus();
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.setAttribute('aria-hidden', 'true');
    modal.style.display = 'none';
    const opener = modal._opener;
    if (opener) opener.focus();
  }

  function trapTabKey(e, modal) {
    const focusable = Array.from(modal.querySelectorAll('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'))
      .filter(el => !el.hasAttribute('disabled'));
    if (focusable.length === 0) {
      e.preventDefault();
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length -1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  // 4) Basic client-side validation enhancement: show native validity on submit if invalid
  const form = document.getElementById('joinForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      // allow the browser to do native validation; if invalid, prevent submit and show message
      if (!form.checkValidity()) {
        e.preventDefault();
        form.reportValidity();
      }
      // if valid, form will submit via GET to thankyou.html
    });
  }
});
