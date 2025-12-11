// scripts/form-result.js
document.getElementById('year5').textContent = new Date().getFullYear();

function displaySearchParams() {
  const out = document.getElementById('form-results');
  const params = new URLSearchParams(window.location.search);
  if (!params.toString()) {
    out.innerHTML = '<p>No form data found in URL. Try submitting the form from <a href="contact.html">Contact</a>.</p>';
    return;
  }
  const rows = [];
  for (const [k,v] of params.entries()) {
    rows.push(`<tr><th>${escapeHtml(k)}</th><td>${escapeHtml(v)}</td></tr>`);
  }
  out.innerHTML = `<table><tbody>${rows.join('')}</tbody></table>`;
}

function escapeHtml(s=''){return String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;')}

displaySearchParams();
