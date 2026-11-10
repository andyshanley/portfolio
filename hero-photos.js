// Frameless hero photo with a visible next-photo ticket and live position.
(() => {
  const root = document.getElementById('hero-photos');
  if (!root) return;
  const gallery = root.closest('.hero-gallery');
  const photos = [...root.querySelectorAll('.print')];
  const ticket = gallery.querySelector('.hero-next-ticket');
  const count = gallery.querySelector('.hero-photo-count');
  const status = gallery.querySelector('.hero-photo-status');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  // Dominant and secondary photo accents, balanced for variety across the gallery.
  const photoAccents = {
  "hero-01.jpg": "red",
  "hero-02.jpg": "orange",
  "hero-03.jpg": "orange",
  "hero-04.jpg": "magenta",
  "hero-05.jpg": "blue",
  "hero-06.jpg": "green",
  "hero-07.jpg": "green",
  "hero-08.jpg": "cyan",
  "hero-09.jpg": "yellow",
  "hero-10.png": "blue",
  "hero-11.jpg": "purple"
};
  let current = 0, busy = false;
  function render(announce) {
    photos.forEach((photo, i) => {
      photo.classList.toggle('top', i === current);
      photo.setAttribute('aria-hidden', String(i !== current));
    });
    count.textContent = `${current + 1} / ${photos.length}`;
    const image = photos[current].querySelector('img');
    const filename = image.getAttribute('src').split('/').pop();
    const accent = photoAccents[filename] || 'yellow';
    gallery.style.setProperty('--hero-accent', `var(--fn-hl-${accent})`);
    const ink = { red: '#8c2926', orange: '#85421b', yellow: '#6d5310', green: '#46561f', cyan: '#1d5b49', blue: '#244f78', purple: '#62406f', magenta: '#843358' };
    gallery.style.setProperty('--hero-accent-ink', ink[accent] || ink.yellow);
    const description = image.alt;
    root.setAttribute('aria-label', `Photo ${current + 1} of ${photos.length}: ${description}. Show next photo.`);
    if (announce) status.textContent = `Photo ${current + 1} of ${photos.length}: ${description}`;
  }
  function next() {
    if (busy || photos.length < 2) return;
    busy = true;
    root.classList.add('is-changing');
    setTimeout(() => {
      current = (current + 1) % photos.length;
      render(true);
      root.classList.remove('is-changing');
      busy = false;
    }, reduced.matches ? 0 : 180);
  }
  root.addEventListener('click', next);
  ticket.addEventListener('click', next);
  root.addEventListener('keydown', e => {
    if (['Enter', ' ', 'ArrowRight'].includes(e.key)) { e.preventDefault(); next(); }
  });
  render(false);
})();
