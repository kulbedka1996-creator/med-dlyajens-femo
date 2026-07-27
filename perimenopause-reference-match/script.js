/* =========================================================
   ДляЖенс Фемо — interactions
   ========================================================= */

(function () {
  'use strict';

  /* ---- Section reveal on scroll ---- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---- Product buttons (PDF placeholders) ---- */
  document.querySelectorAll('.btn').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      // When real PDFs are ready, replace with:
      // window.location.href = '/instructions/abc.pdf';
    });
  });

  /* ---- Mobile nav toggle ---- */
  var toggle = document.getElementById('nav-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---- Sources: keep summary accessible ---- */
  var details = document.querySelector('.sources details');
  if (details) {
    var summary = details.querySelector('summary');
    summary.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        details.open = !details.open;
      }
    });
  }

  /* ---- Bind hanging prepositions (неразрывный пробел после предлога) ----
     Заменяет обычный пробел после короткого предлога/союза на \u00A0,
     чтобы предлог не оставался висячим в конце строки.            */
  function bindHangingPrepositions(root) {
    var preps = ['в','с','к','у','о','и','а','но','за','на','по','об','от','до',
                 'из','ко','со','при','для','про','без','над','под','перед',
                 'около','между','против','через','вдоль','вокруг','ради','именно'];
    var re = new RegExp('(^|\\s)(' + preps.join('|') + ')(\\s+)', 'gi');
    var skip = { SCRIPT:1, STYLE:1, TEXTAREA:1, NOSCRIPT:1, CODE:1, PRE:1, KBD:1 };
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        var p = node.parentNode;
        if (!p || skip[p.nodeName]) return NodeFilter.FILTER_REJECT;
        return re.test(node.nodeValue) ? NodeFilter.FILTER_ACCEPT
                                       : NodeFilter.FILTER_REJECT;
      }
    });
    var nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(function (node) {
      node.nodeValue = node.nodeValue.replace(re, '$1$2\u00A0');
    });
  }
  bindHangingPrepositions(document.body);
})();
