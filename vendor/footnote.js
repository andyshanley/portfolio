/* InstaLanding design system · Footnote · footnote@1.0.0
   Component script from https://instalanding.ai/systems/footnote/specimen.html */
(function () {
  'use strict';
  /* Footnote components. A mark is inline-block so its filter has a box, which
     means a phrase can't wrap: split each mark[data-fn-split] into one mark per
     word (only the last keeps the pen blob). Runs again when marks are added
     later, e.g. by a framework rendering the components. */
  function split() {
    var list = document.querySelectorAll('mark[data-fn-split]');
    for (var i = 0; i < list.length; i++) {
      var m = list[i];
      if (m.querySelector('mark')) continue;
      var words = m.textContent.split(/\s+/).filter(Boolean);
      if (words.length < 2) continue;
      var frag = document.createDocumentFragment();
      words.forEach(function (w, j) {
        var s = document.createElement('mark');
        s.className = 'fn-w' + (j === words.length - 1 ? ' fn-last' : '');
        s.textContent = w;
        frag.append(s, document.createTextNode(' '));
      });
      frag.lastChild.remove();
      m.replaceChildren(frag);
    }
  }
  split();
  var queued = false;
  new MutationObserver(function () {
    if (queued) return;
    queued = true;
    requestAnimationFrame(function () { queued = false; split(); });
  }).observe(document.documentElement, { childList: true, subtree: true });

  /* Claims: picking one opens its source note under the sheet; picking it again closes it */
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-fn-claim]');
    if (!b) return;
    var sheet = b.closest('.fn-sheet'), note = sheet && sheet.querySelector('.fn-note');
    if (!note) return;
    var wasOpen = b.getAttribute('aria-expanded') === 'true';
    var all = sheet.querySelectorAll('[data-fn-claim]');
    for (var i = 0; i < all.length; i++) all[i].setAttribute('aria-expanded', 'false');
    if (wasOpen) { note.hidden = true; return; }
    b.setAttribute('aria-expanded', 'true');
    note.querySelector('.fn-who').textContent = b.getAttribute('data-fn-who');
    note.querySelector('q').textContent = b.getAttribute('data-fn-quote');
    note.querySelector('cite').textContent = b.getAttribute('data-fn-cite');
    note.hidden = false;
  });
})();
