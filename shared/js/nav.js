/**
 * Shared navigation injector for app pages.
 * Adds a "← Back to Apps" bar at the top of each page.
 * 
 * Usage: Include in any app page:
 *   <link rel="stylesheet" href="/shared/css/nav.css">
 *   <script src="/shared/js/nav.js"></script>
 */
(function () {
  const nav = document.createElement('nav');
  nav.className = 'app-nav';
  nav.innerHTML = `
    <a href="/apps/">
      <svg viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
      Apps
    </a>
  `;

  document.body.prepend(nav);
  document.body.classList.add('has-app-nav');
})();
