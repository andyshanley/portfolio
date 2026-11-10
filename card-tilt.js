// Subtle movement opposite the pointer; links and Netflix click behavior stay intact.
(() => {
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const pointer = matchMedia('(hover: hover) and (pointer: fine)');
  const cards = document.querySelectorAll('.card-grid a.fn-card, .hero-gallery .hero-fan, .services .service-sketch');
  for (const card of cards) {
    let bounds, frame = 0, point;
    const reset = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      card.classList.remove('is-pointer-tilting');
      card.style.removeProperty('--pointer-x');
      card.style.removeProperty('--pointer-y');
      bounds = null;
    };
    card.addEventListener('pointerenter', event => {
      if (motion.matches || !pointer.matches || event.pointerType === 'touch') return;
      if (card.closest('.slot.is-open')) return;
      bounds = card.getBoundingClientRect();
      card.classList.add('is-pointer-tilting');
    });
    card.addEventListener('pointermove', event => {
      if (!bounds || motion.matches || card.closest('.slot.is-open')) { reset(); return; }
      point = { x: event.clientX, y: event.clientY };
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const x = Math.max(-1, Math.min(1, (point.x - bounds.left) / bounds.width * 2 - 1));
        const y = Math.max(-1, Math.min(1, (point.y - bounds.top) / bounds.height * 2 - 1));
        card.style.setProperty('--pointer-x', (-x * 4).toFixed(2) + 'px');
        card.style.setProperty('--pointer-y', (-y * 4).toFixed(2) + 'px');
      });
    });
    card.addEventListener('pointerleave', reset);
    card.addEventListener('pointercancel', reset);
    // Cycling hero photos should keep tracking the pointer without re-entering.
    if (!card.matches('.hero-fan')) card.addEventListener('click', reset);
    motion.addEventListener('change', reset);
    window.addEventListener('blur', reset);
    window.addEventListener('resize', reset);
    window.addEventListener('scroll', reset, { passive: true });
  }
})();
