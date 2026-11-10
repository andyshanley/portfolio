/* The Netflix card has no case study to open (it is a current role), so it is not a link. Activating it, by
   click, Enter or Space, lets the card drop off its tape to show a message in the space behind, then it sticks
   back on after a few seconds. The tape and the message are in the markup (index.html); the motion is in
   styles.css. This script only switches the states and announces the message to screen readers. */
(function () {
  'use strict';
  var slot = document.getElementById('netflix-slot');
  if (!slot) return;
  var card = slot.querySelector('.drop');
  var MESSAGE = 'No case studies here. My Netflix story stays behind the scenes!';
  var timer = null;

  function release() {
    if (slot.classList.contains('is-open')) return;
    slot.classList.add('is-open');
    card.classList.remove('is-back');
    card.classList.add('is-dropping');
    var live = document.getElementById('netflix-live');   /* looked up now, so it does not matter where it sits in the page */
    if (live) { live.textContent = ''; setTimeout(function () { live.textContent = MESSAGE; }, 30); }
    timer = setTimeout(function () {
      card.classList.remove('is-dropping');
      void card.offsetWidth;
      card.classList.add('is-back');
      slot.classList.remove('is-open');
      setTimeout(function () { card.classList.remove('is-back'); }, 700);
    }, 4600);
  }

  card.addEventListener('click', function (e) { e.preventDefault(); release(); });
  card.addEventListener('keydown', function (e) {
    if (e.key === ' ') { e.preventDefault(); release(); }   /* Enter already clicks a link; Space does not */
  });
})();
