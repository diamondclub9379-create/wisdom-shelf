// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.getElementById('menuToggle');
  var nav = document.getElementById('mainNav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
    });
  }

  // Search/filter books on homepage
  var searchInput = document.getElementById('searchInput');
  var bookGrid = document.getElementById('bookGrid');
  if (searchInput && bookGrid) {
    var cards = bookGrid.querySelectorAll('.book-card');
    searchInput.addEventListener('input', function () {
      var query = this.value.toLowerCase().trim();
      cards.forEach(function (card) {
        var title = card.querySelector('.book-title');
        var author = card.querySelector('.book-author');
        var text = (title ? title.textContent : '') + ' ' + (author ? author.textContent : '');
        card.style.display = text.toLowerCase().includes(query) ? '' : 'none';
      });
    });
  }
});
