// scripts/api.js
export async function fetchJSON(path) {
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`HTTP ${res.status} - ${res.statusText}`);
    const json = await res.json();
    return json;
  } catch (err) {
    console.error('fetchJSON error:', err);
    throw err;
  }
}
