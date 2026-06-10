(function () {
  // Determine if we are at root or in a subfolder based on path depth
  const pathDepth = window.location.pathname.split('/').filter(p => p.length > 0 && !p.endsWith('.html')).length;
  const isSubPage = pathDepth > 0;

  // Base URL resolution
  const root = isSubPage ? '../' : './';

  const headerHTML = `
  <nav class="navbar" id="navbar">
    <div class="nav-container">
      <a href="${root}" class="nav-logo"><span class="logo-light">Yash Raj</span><span class="logo-sub">Motion Picture</span></a>
      <ul class="nav-links" id="navLinks">
        <li><a href="${root}" class="nav-link">Home</a></li>
        <li><a href="${root}about/" class="nav-link">About</a></li>
        <li class="nav-has-dropdown"><a href="${root}services/" class="nav-link">Services <span class="nav-arrow">▾</span></a>
          <ul class="nav-dropdown">
            <li><a href="${root}wedding-photography/">Wedding Photography</a></li>
            <li><a href="${root}pre-wedding/">Pre-Wedding Shoots</a></li>
            <li><a href="${root}corporate-events/">Corporate & Events</a></li>
            <li><a href="${root}product-fashion/">Product & Fashion</a></li>
            <li><a href="${root}drone-photography/">Drone Photography</a></li>
          </ul>
        </li>
        <li><a href="${root}portfolio/" class="nav-link">Portfolio</a></li>
        <li><a href="${root}packages/" class="nav-link">Packages</a></li>
        <li><a href="${root}contact/" class="nav-link">Contact</a></li>
      </ul>
      <a href="${root}book-now/" class="btn-book">Book Now</a>
      <button class="nav-toggle" id="navToggle" aria-label="Toggle menu"><span></span><span></span><span></span></button>
    </div>
  </nav>
  `;
  document.write(headerHTML);
})();
