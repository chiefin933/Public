// Simple include loader: injects /includes/header.html and /includes/footer.html
// and populates the footer year. This runs before main script so DOMContentLoaded
// handlers in other scripts will see the injected content when possible.

(async function() {
  async function fetchFragment(path) {
    try {
      const res = await fetch(path, {cache: 'no-store'});
      if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
      return await res.text();
    } catch (e) {
      console.warn(e);
      return null;
    }
  }

  // Wait for DOM to be ready so we can insert in the right place
  if (document.readyState === 'loading') await new Promise(r => document.addEventListener('DOMContentLoaded', r));

  const headerContainer = document.getElementById('site-header');
  const footerContainer = document.getElementById('site-footer');

  if (headerContainer) {
    const html = await fetchFragment('includes/header.html');
    if (html) headerContainer.innerHTML = html;
  }

  if (footerContainer) {
    const html = await fetchFragment('includes/footer.html');
    if (html) {
      footerContainer.innerHTML = html;
      const yearEl = footerContainer.querySelector('#year');
      if (yearEl) yearEl.textContent = new Date().getFullYear();
    }
  }
})();