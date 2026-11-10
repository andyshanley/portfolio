/* Services colour reveal, in step with the hand-drawn sketches.
   1. The sketches draw themselves when they scroll into view (service-sketches.js). At that moment the
      highlighter colour behind each "to" word draws in too (CSS, in styles.css).
   2. Once the drawing has finished and the colour has held for a beat, all the colour fades out: the splash
      behind each icon and the highlight behind each word.
   3. Hovering a column brings that column's colour back (CSS).
   This script only switches states on the section: has-js, is-revealed and is-resting.
   Without it, or with reduced motion, the colours simply stay on. */
(function () {
  'use strict';
  var section = document.querySelector('.services');
  if (!section || !('IntersectionObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  section.classList.add('has-js');

  var started = false;
  function start() {
    if (started) return;
    started = true;
    section.classList.add('is-revealed');
    /* the sketch strokes take 2.8s to draw; hold the colour for a beat after that, then fade it */
    setTimeout(function () { section.classList.add('is-resting'); }, 3400);
  }

  /* follow the sketches: start when the first one begins to draw */
  var sketches = Array.prototype.slice.call(section.querySelectorAll('.service-sketch'));
  function anyDrawing() {
    return sketches.some(function (s) { return s.classList.contains('is-drawing'); });
  }
  if (sketches.length && 'MutationObserver' in window) {
    var mo = new MutationObserver(function () {
      if (anyDrawing()) { mo.disconnect(); start(); }
    });
    sketches.forEach(function (s) { mo.observe(s, { attributes: true, attributeFilter: ['class'] }); });
    if (anyDrawing()) { mo.disconnect(); start(); }
  }

  /* fallback, in case the sketches never start: begin once the section has been on screen for a moment */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      io.disconnect();
      setTimeout(start, 1500);
    });
  }, { threshold: 0.3 });
  io.observe(section);
})();
