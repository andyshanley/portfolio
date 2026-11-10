/* Hero photos: a stack of prints, pushed sideways like a deck across a desk.
   The top print is taped down and never moves on hover; the prints behind it slide out to the right
   (CSS: .hero-fan in styles.css), each at its own angle and distance. Clicking, or pressing Enter,
   Space or the right arrow, sends the top print to the back. */
(function () {
  'use strict';
  var root = document.getElementById('hero-photos');
  if (!root) return;
  var queue = Array.prototype.slice.call(root.querySelectorAll('.print'));
  if (queue.length < 2) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var busy = false;

  /* resting offsets: the first three prints behind the top one already peek (the rest sit tucked behind them) out a little to the right,
     and the rest sit tucked behind, so the stack never looks perfectly squared up */
  var ROT = ['-1deg', '2.4deg', '4.5deg', '7deg', '1.6deg', '-3deg'];
  var XS = ['0px', '14px', '32px', '48px', '-4px', '4px'];
  var YS = ['0px', '6px', '2px', '10px', '16px', '20px'];

  /* where each print behind the top one goes when the stack is spread, by its place in the stack.
     Deliberately uneven in angle, distance and height. */
  var SPREAD = [
    { a: 4,  x: 30,  y: -5 },
    { a: 9,  x: 62,  y: 5 },
    { a: 12, x: 88,  y: -6 },
    { a: 17, x: 108, y: 14 },
    { a: 11, x: 126, y: 4 }
  ];

  function layout() {
    queue.forEach(function (c, i) {
      var k = Math.min(i, 5);
      c.classList.toggle('top', i === 0);
      c.style.zIndex = 40 - i;
      c.style.setProperty('--sr', ROT[k]);
      c.style.setProperty('--sx', XS[k]);
      c.style.setProperty('--sy', YS[k]);
      var s = SPREAD[Math.min(i, SPREAD.length) - 1];
      if (i > 0 && s) {
        c.style.setProperty('--ha', s.a + 'deg');
        c.style.setProperty('--hx', s.x + 'px');
        c.style.setProperty('--hy', s.y + 'px');
      }
    });
  }

  function next() {
    if (busy) return;
    busy = true;
    var top = queue[0];
    top.classList.add('out');
    setTimeout(function () {
      queue.push(queue.shift());
      top.classList.remove('out');
      layout();
      busy = false;
    }, reduce ? 0 : 380);
  }

  layout();
  root.addEventListener('click', next);
  root.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight') {
      e.preventDefault();
      next();
    }
  });
})();
