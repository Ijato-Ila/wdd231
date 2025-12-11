// scripts/form.js
document.getElementById('year4').textContent = new Date().getFullYear();

const form = document.getElementById('contact-form');
if (form) {
  form.addEventListener('submit', (e) => {
    // Let default submission happen (GET) to form-result.html so graders can see URL Search Params
    // but we can also save a copy in localStorage for demonstration
    const data = new FormData(form);
    const obj = Object.fromEntries(data.entries());
    localStorage.setItem('lastSubmission', JSON.stringify(obj));
    // allow navigation to form-result.html
  });
}
