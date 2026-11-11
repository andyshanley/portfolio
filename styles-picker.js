/* Style guide colour picker. Choose one of the Footnote highlighter colours; it re-colours the components
   marked data-tintable on styles.html and the sidebar's current-section highlight. */
(function () {
  'use strict';
  var NAMES = ['red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'purple', 'magenta'];

  var INK = { red: '#8c2926', orange: '#85421b', yellow: '#6d5310', green: '#46561f', cyan: '#1d5b49', blue: '#244f78', purple: '#62406f', magenta: '#843358' };

  var chips = [].slice.call(document.querySelectorAll('.sg-chip'));

  var apply = function (name) {
    [].forEach.call(document.querySelectorAll('[data-tintable] .glance'), function (g) {
      NAMES.forEach(function (n) { g.classList.remove('glance--' + n); });
      g.classList.add('glance--' + name);
    });
    [].forEach.call(document.querySelectorAll('[data-tintable] mark'), function (m) {
      NAMES.forEach(function (n) { m.classList.remove('fn-hl-' + n); });
      m.classList.add('fn-hl-' + name);
    });
    [].forEach.call(document.querySelectorAll('[data-tintable] .fn-card'), function (c) {
      NAMES.forEach(function (n) { c.classList.remove('tint-' + n); });
      c.classList.add('tint-' + name);
    });
    /* the sidebar's current-section highlight takes the picked colour too */
    document.documentElement.style.setProperty('--sg-tint', 'var(--fn-hl-' + name + ')');
    document.documentElement.style.setProperty('--sg-ink', INK[name]);
    chips.forEach(function (c) { c.setAttribute('aria-pressed', c.getAttribute('data-tint') === name ? 'true' : 'false'); });
    document.documentElement.setAttribute('data-tint', name);
    try { localStorage.setItem('sg-tint', name); } catch (e) { /* storage may be blocked; the page still works */ }
  };

  chips.forEach(function (c) {
    c.addEventListener('click', function () { apply(c.getAttribute('data-tint')); });
  });
  var saved = null;
  try { saved = localStorage.getItem('sg-tint'); } catch (e) { /* ignore */ }
  var current = NAMES.indexOf(saved) > -1 ? saved : 'green';
  var applyCurrent = function () { apply(current); };
  var origApply = apply;
  apply = function (name) { current = name; origApply(name); };
  applyCurrent();

  /* highlight-lines.js rebuilds the highlights once fonts load and on resize; put the picked colour back on them */
  /* the coloured examples stay hidden (sg-pending, set in the page head) until the highlights have been rebuilt
     with the right colour, so there is no flash of the default colour */
  var reveal = function () { document.documentElement.classList.remove('sg-pending'); };
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { setTimeout(function () { applyCurrent(); reveal(); }, 80); });
  else reveal();
  setTimeout(function () { applyCurrent(); reveal(); }, 2000);   /* safety net */
  var t = null;
  window.addEventListener('resize', function () { clearTimeout(t); t = setTimeout(applyCurrent, 200); });
})();

/* Sidebar menu: mark the link for the section you are in (or just clicked) as the current one. */
(function () {
  'use strict';
  var links = [].slice.call(document.querySelectorAll('.sg-side nav a[href^="#"]'));
  if (!links.length) return;
  var byId = {};
  links.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });

  function setCurrent(id) {
    links.forEach(function (a) {
      if (a === byId[id]) a.setAttribute('aria-current', 'location');
      else a.removeAttribute('aria-current');
    });
  }

  links.forEach(function (a) {
    a.addEventListener('click', function () { setCurrent(a.getAttribute('href').slice(1)); });
  });

  var sections = Object.keys(byId).map(function (id) { return document.getElementById(id); }).filter(Boolean);
  /* the current section is the last one whose top has reached the upper part of the screen */
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      var current = sections[0].id;
      for (var i = 0; i < sections.length; i++) {
        if (sections[i].getBoundingClientRect().top <= window.innerHeight * 0.35) current = sections[i].id;
      }
      setCurrent(current);
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  setCurrent(location.hash && byId[location.hash.slice(1)] ? location.hash.slice(1) : sections[0].id);
})();


/* Module tabs: switch between a module's variations. Arrow keys move between tabs. */
(function () {
  'use strict';
  [].forEach.call(document.querySelectorAll('.sg-tabs'), function (list) {
    var tabs = [].slice.call(list.querySelectorAll('.sg-tab'));
    function show(i, focus) {
      /* the tabs stay exactly where they are on screen while the panel below changes height */
      var before = list.getBoundingClientRect().top;
      tabs.forEach(function (t, j) {
        var on = i === j;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
        var panel = document.getElementById(t.getAttribute('aria-controls'));
        if (panel) panel.hidden = !on;
      });
      var shift = list.getBoundingClientRect().top - before;
      if (shift) window.scrollBy({ top: shift, left: 0, behavior: 'instant' });   /* the page has smooth scrolling on; this must not animate */
      if (focus) tabs[i].focus({ preventScroll: true });
    }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { show(i, false); });
      t.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight') { e.preventDefault(); show((i + 1) % tabs.length, true); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); show((i + tabs.length - 1) % tabs.length, true); }
      });
    });
  });
})();

/* The examples are for looking at, not for following: links inside the module demos do nothing when clicked
   (hover and focus styles still work). The sidebar and the Explorations links are unaffected. */
document.addEventListener('click', function (e) {
  var a = e.target.closest ? e.target.closest('.sg-demo a') : null;
  if (a) e.preventDefault();
});
