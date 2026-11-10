/* Highlights that run the length of the text.
   Footnote's highlighter is an inline-block, so a phrase can't wrap, and its own script works around that
   by giving every word its own mark. This script does it per line instead: a phrase that fits on one line
   gets a single continuous stroke, and a phrase that wraps gets one stroke per line.

   Use it on a mark like <mark data-fn-lines data-fn-split>…</mark> (add a colour class for non-yellow).
   Without this script the data-fn-split attribute still lets Footnote's own per-word fallback work.
   Load it before vendor/footnote.js so it gets to the mark first. */
(function () {
  'use strict';
  var marks = Array.prototype.slice.call(document.querySelectorAll('mark[data-fn-lines]'));
  if (!marks.length) return;

  var wrappers = marks.map(function (m) {
    var w = document.createElement('span');
    w.className = 'fn-lines';
    w.setAttribute('data-text', m.textContent.replace(/\s+/g, ' ').trim());
    w.setAttribute('data-color', (m.className || '').trim());
    /* punctuation straight after the phrase (a comma, full stop...) goes inside the last stroke, otherwise
       the stroke, which runs a little past the end of the text, would be painted over it and fade it */
    var tail = '', next = m.nextSibling;
    if (next && next.nodeType === 3) {
      var t = /^[,.;:!?)\u201D\u2019"']+/.exec(next.nodeValue);
      if (t) { tail = t[0]; next.nodeValue = next.nodeValue.slice(tail.length); }
    }
    w.setAttribute('data-tail', tail);
    m.parentNode.replaceChild(w, m);
    return w;
  });

  function layout(w) {
    var words = w.getAttribute('data-text').split(' ');
    words[words.length - 1] += w.getAttribute('data-tail') || '';
    var color = w.getAttribute('data-color');
    var i;

    /* 1. lay the words out as plain inline text and see which line each one lands on */
    w.textContent = '';
    var spans = [];
    for (i = 0; i < words.length; i++) {
      var s = document.createElement('span');
      s.style.whiteSpace = 'nowrap';
      s.textContent = words[i];
      w.appendChild(s);
      if (i < words.length - 1) w.appendChild(document.createTextNode(' '));
      spans.push(s);
    }
    var groups = [], lastTop = null;
    spans.forEach(function (s, idx) {
      var top = s.offsetTop;
      if (lastTop === null || Math.abs(top - lastTop) > 2) {
        groups.push([words[idx]]);
        lastTop = top;
      } else {
        groups[groups.length - 1].push(words[idx]);
      }
    });

    /* 2. one mark per line */
    w.textContent = '';
    groups.forEach(function (g, idx) {
      var m = document.createElement('mark');
      if (color) m.className = color;
      m.textContent = g.join(' ');
      w.appendChild(m);
      if (idx < groups.length - 1) w.appendChild(document.createTextNode(' '));
    });
  }

  var widths = new Map();
  function run(force) {
    wrappers.forEach(function (w) {
      var host = w.parentElement, width = host ? host.clientWidth : 0;
      if (force || widths.get(w) !== width) {
        widths.set(w, width);
        layout(w);
      }
    });
  }

  run(true);
  /* fonts change the widths, and so does resizing the window, so lay the lines out again */
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { run(true); });
  var queued = false;
  window.addEventListener('resize', function () {
    // Resplitting lines creates new marks: keep already-revealed intro colors visible.
    var intro = document.querySelector('.hero-copy.is-color-visible');
    if (intro) intro.classList.add('hero-colors-settled');
    if (queued) return;
    queued = true;
    requestAnimationFrame(function () { queued = false; run(false); });
  });
})();
