(function () {
  const pathDepth = window.location.pathname.split('/').filter(p => p.length > 0 && !p.endsWith('.html')).length;
  const isSubPage = pathDepth > 0;
  const root = isSubPage ? '../' : './';

  const footerHTML = `
<footer class="footer" id="footer">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <div class="footer-logo"><img src="${root}Staticdata/images/Logo-removebg-preview.png" alt="Yash Raj Motion Picture"></div>
        <p>Capturing love stories across Gujarat and India.</p>
        <div class="social-links">

          <a href="https://www.instagram.com/yashraj_motion_picturez/" class="social-link instagram" aria-label="Instagram" target="_blank" rel="noopener">
            <svg viewBox="0 0 448 512" fill="currentColor"><path d="M224.1 141c-63.6 0-115.1 51.5-115.1 115.1S160.5 371.2 224.1 371.2 339.2 319.7 339.2 256.1 287.7 141 224.1 141zm0 190.6c-41.6 0-75.5-33.9-75.5-75.5s33.9-75.5 75.5-75.5 75.5 33.9 75.5 75.5-33.9 75.5-75.5 75.5zm146.4-194.3c0 14.9-12.1 27-27 27h-27c-14.9 0-27-12.1-27-27v-27c0-14.9 12.1-27 27-27h27c14.9 0 27 12.1 27 27v27zM398.8 112.3c-1.7-35.3-9.9-66.7-36.2-92.9-26.3-26.3-57.7-34.5-93-36.2-36.6-2.1-146.4-2.1-183 0-35.3 1.7-66.7 9.9-92.9 36.2-26.3 26.3-34.5 57.7-36.2 93-2.1 36.6-2.1 146.4 0 183 1.7 35.3 9.9 66.7 36.2 92.9 26.3 26.3 57.7 34.5 93 36.2 36.6 2.1 146.4 2.1 183 0 35.3-1.7 66.7-9.9 92.9-36.2 26.3-26.3 34.5-57.7 36.2-93 2.1-36.6 2.1-146.4 0-183zM398.8 388c-1.1 30.7-8.3 56.9-30.7 79.3-22.4 22.4-48.6 29.6-79.3 30.7-36.5 2.1-146.5 2.1-183 0-30.7-1.1-56.9-8.3-79.3-30.7-22.4-22.4-29.6-48.6-30.7-79.3-2.1-36.5-2.1-146.5 0-183 1.1-30.7 8.3-56.9 30.7-79.3 22.4-22.4 48.6-29.6 79.3-30.7 36.5-2.1 146.5-2.1 183 0 30.7 1.1 56.9 8.3 79.3 30.7 22.4 22.4 29.6 48.6 30.7 79.3 2.1 36.5 2.1 146.5 0 183z"/></svg>
          </a>
          <a href="https://youtube.com/@yashrajmotionpicture" class="social-link twitter" aria-label="YouTube" target="_blank" rel="noopener">
            <svg viewBox="0 0 576 512" fill="currentColor"><path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.537V174.38L382.31 256l-150.165 81.62z"/></svg>
          </a>
          <a href="https://wa.me/919510212154" class="social-link whatsapp" aria-label="WhatsApp" target="_blank" rel="noopener">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"><path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92 l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/></svg>
          </a>
        </div>
      </div>
      <div class="footer-col">
        <h4>Quick Links</h4>
        <ul>
          <li><a href="${root}">Home</a></li>
          <li><a href="${root}about/">About</a></li>
          <li><a href="${root}portfolio/">Portfolio</a></li>
          <li><a href="${root}packages/">Packages</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Services</h4>
        <ul>
          <li><a href="${root}wedding-photography/">Wedding</a></li>
          <li><a href="${root}pre-wedding/">Pre-Wedding</a></li>
          <li><a href="${root}corporate-events/">Corporate</a></li>
          <li><a href="${root}drone-photography/">Drone</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Contact</h4>
        <ul class="footer-contact">
          <li><span class="contact-icon">📍</span><span class="contact-text">42, Satellite Road, Prahladnagar, Ahmedabad, Gujarat 380015</span></li>
          <li><span class="contact-icon">📞</span><span class="contact-text"><a href="tel:+919510212154">+91 95102 12154</a></span></li>
          <li><span class="contact-icon">✉️</span><span class="contact-text"><a href="mailto:info@yashrajmotionpicture.com">info@yashrajmotionpicture.com</a></span></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom" style="text-align: center;">
      <p style="text-align: center; margin: 0 auto;">© 2025 Yash Raj Motion Picture. All rights reserved.</p>
    </div>
  </div>
</footer>`;
  const currentScript = document.currentScript;
  if (currentScript) {
    currentScript.insertAdjacentHTML('beforebegin', footerHTML);
  } else {
    // Fallback if currentScript is somehow null (e.g., defer/async)
    document.write(footerHTML);
  }
})();
