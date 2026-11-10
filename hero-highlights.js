// Reveal the intro highlights once, in reading order. Notes and text stay still.
(() => {
  const copy = document.querySelector('.hero-copy');
  if (!copy || matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
  copy.classList.add('hero-color-intro');
  const observer = new IntersectionObserver(entries => {
    if (!entries.some(entry => entry.isIntersecting)) return;
    observer.disconnect();
    const ready = document.fonts ? document.fonts.ready : Promise.resolve();
    ready.then(() => requestAnimationFrame(() => requestAnimationFrame(() => copy.classList.add('is-color-visible'))));
  }, { threshold: .15 });
  observer.observe(copy);
})();
