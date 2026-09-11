// Tracks which guides a visitor has marked as read, stored locally in the browser.
// Vanilla JS, no backend, per the Materials specification.
// Runs on two different page types:
//   1. Individual guide pages: shows/toggles a "Mark this guide as read" button.
//   2. The Guides hub page: shows a "X of 6 read" summary and a badge per read card.

document.addEventListener('DOMContentLoaded', function () {
  var storageKey = 'bridge-read-guides';

  function getReadList() {
    try {
      return JSON.parse(localStorage.getItem(storageKey)) || [];
    } catch (e) {
      return [];
    }
  }

  function setReadList(list) {
    localStorage.setItem(storageKey, JSON.stringify(list));
  }

  // ---- Case 1: individual guide page ----
  var btn = document.getElementById('mark-read-btn');
  var label = document.getElementById('mark-read-label');
  if (btn && label) {
    var slug = btn.getAttribute('data-slug');

    function refreshButton() {
      var list = getReadList();
      var isRead = list.indexOf(slug) !== -1;
      btn.classList.toggle('is-read', isRead);
      label.textContent = isRead ? 'Marked as read' : 'Mark this guide as read';
    }

    btn.addEventListener('click', function () {
      var list = getReadList();
      var idx = list.indexOf(slug);
      if (idx === -1) {
        list.push(slug);
      } else {
        list.splice(idx, 1);
      }
      setReadList(list);
      refreshButton();
    });

    refreshButton();
  }

  // ---- Case 2: Guides hub page ----
  var summaryEl = document.getElementById('progress-summary');
  var grid = document.getElementById('scenario-grid');
  if (summaryEl && grid) {
    var list = getReadList();
    var cards = grid.querySelectorAll('.scenario-card');
    cards.forEach(function (card) {
      var cardSlug = card.getAttribute('data-slug');
      if (list.indexOf(cardSlug) !== -1) {
        var badge = document.createElement('span');
        badge.className = 'read-badge';
        badge.innerHTML = '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5"><path d="M20 6L9 17l-5-5"/></svg> Read';
        card.querySelector('h3').insertAdjacentElement('beforebegin', badge);
      }
    });
    summaryEl.textContent = list.length + ' of ' + cards.length + ' guides read';
  }
});
