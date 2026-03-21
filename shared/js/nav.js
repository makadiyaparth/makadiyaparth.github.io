/**
 * Shared navigation injector for app pages.
 * Adds a "← Back to Apps" bar at the top of each page.
 * 
 * Usage: Include in any app page:
 *   <link rel="stylesheet" href="/shared/css/nav.css">
 *   <script src="/shared/js/nav.js"></script>
 */
(function () {
  // Determine if we are on the apps hub or an individual app
  const isAppsHub = window.location.pathname === '/apps/' || window.location.pathname.endsWith('/apps/index.html');
  const backUrl = isAppsHub ? '/' : '/apps/';
  const backText = isAppsHub ? 'Home' : 'Apps';

  // Find the page title and hide it since it will move to nav
  let titleText = document.title;
  const h1El = document.querySelector('h1.page-title');
  if (h1El) {
    titleText = h1El.textContent;
    h1El.style.display = 'none'; // hide original title
  }

  const nav = document.createElement('nav');
  nav.className = 'app-nav';
  nav.innerHTML = `
    <div class="nav-left">
      <a href="${backUrl}">
        <svg viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
        ${backText}
      </a>
    </div>
    <div class="nav-center">
      <h1 class="nav-title">${titleText}</h1>
    </div>
    <div class="nav-right"></div>
  `;

  document.body.prepend(nav);
  document.body.classList.add('has-app-nav');
})();
