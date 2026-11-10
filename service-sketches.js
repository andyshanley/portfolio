// Illustrations stay visible when JavaScript or motion is unavailable.
(() => {
  const sketches = document.querySelectorAll('.service-sketch');
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.remove('is-waiting');
      entry.target.classList.add('is-drawing');
      observer.unobserve(entry.target);
    }
  }, { threshold: 0.3 });
  for (const sketch of sketches) {
    for (const shape of sketch.querySelectorAll('svg > *')) {
      shape.style.setProperty('--sketch-length', shape.getTotalLength() + 1);
    }
    sketch.classList.add('is-waiting');
    observer.observe(sketch);
  }
})();
