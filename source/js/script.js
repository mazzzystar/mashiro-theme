// Vanilla JS — no jQuery. Image lightbox, mobile nav, table wrapping,
// code block toolbar (fold/copy), X embed loading.
document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  /* ---------- Image lightbox (replaces fancybox) ---------- */
  var overlay = null;

  function closeLightbox() {
    if (!overlay) return;
    overlay.classList.remove('is-open');
    document.removeEventListener('keydown', onLightboxKey);
  }

  function onLightboxKey(e) {
    if (e.key === 'Escape') closeLightbox();
  }

  function openLightbox(src, alt) {
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'lightbox';
      overlay.innerHTML = '<img alt="">';
      overlay.addEventListener('click', closeLightbox);
      document.body.appendChild(overlay);
    }
    var img = overlay.querySelector('img');
    img.src = src;
    img.alt = alt || '';
    // double rAF so the transition plays on first open
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        overlay.classList.add('is-open');
      });
    });
    document.addEventListener('keydown', onLightboxKey);
  }

  document.querySelectorAll('.article-entry img').forEach(function (img) {
    if (img.closest('a')) return; // linked images keep their link
    img.classList.add('zoomable');
    img.addEventListener('click', function () {
      openLightbox(img.currentSrc || img.src, img.alt);
    });
  });

  /* ---------- Mobile nav ---------- */
  var container = document.getElementById('container');
  var navToggle = document.getElementById('main-nav-toggle');
  var wrap = document.getElementById('wrap');

  if (navToggle && container) {
    navToggle.addEventListener('click', function () {
      container.classList.toggle('mobile-nav-on');
    });
  }
  if (wrap && container) {
    wrap.addEventListener('click', function () {
      container.classList.remove('mobile-nav-on');
    });
  }

  /* ---------- Wrap raw HTML tables so they stay readable ---------- */
  document.querySelectorAll('.article-entry table').forEach(function (table) {
    if (table.parentElement.classList.contains('table-scroll')) return;
    if (table.closest('.table-scroll')) return;
    var scroll = document.createElement('div');
    scroll.className = 'table-scroll';
    table.parentNode.insertBefore(scroll, table);
    scroll.appendChild(table);
  });

  /* ---------- Code block toolbar: fold + copy ---------- */
  function getCodeText(block) {
    var code = block.querySelector('pre code');
    return code ? code.innerText : '';
  }

  function setFoldState(block, collapsed) {
    var toggle = block.querySelector('.code-fold-toggle');
    block.classList.toggle('is-collapsed', collapsed);
    block.setAttribute('data-code-fold', collapsed ? 'collapsed' : 'open');
    if (toggle) {
      toggle.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
      toggle.textContent = collapsed ? 'Expand' : 'Collapse';
    }
  }

  function ensureCodeToolbar(block) {
    if (!block.querySelector('pre')) return;
    block.classList.add('code-block');

    if (!block.querySelector('.code-block-toolbar')) {
      var lang = block.getAttribute('data-code-lang') || 'text';
      var toolbar = document.createElement('div');
      toolbar.className = 'code-block-toolbar';
      toolbar.innerHTML = '<span class="code-block-lang">' + lang + '</span>' +
        '<div class="code-block-actions">' +
        '<button class="code-fold-toggle" type="button" aria-expanded="true">Collapse</button>' +
        '<button class="copy-button" type="button">Copy</button>' +
        '</div>';
      block.insertBefore(toolbar, block.firstChild);
    }

    var toggle = block.querySelector('.code-fold-toggle');
    if (toggle && !toggle.dataset.bound) {
      toggle.dataset.bound = 'true';
      toggle.addEventListener('click', function () {
        setFoldState(block, !block.classList.contains('is-collapsed'));
      });
    }

    var copyButton = block.querySelector('.copy-button');
    if (copyButton && !copyButton.dataset.bound) {
      copyButton.dataset.bound = 'true';
      copyButton.addEventListener('click', function () {
        if (navigator.clipboard) navigator.clipboard.writeText(getCodeText(block));
        copyButton.textContent = 'Copied!';
        setTimeout(function () {
          copyButton.textContent = 'Copy';
        }, 1000);
      });
    }

    setFoldState(block, block.classList.contains('is-collapsed') ||
      block.getAttribute('data-code-fold') === 'collapsed');
  }

  document.querySelectorAll('.article-entry .highlight').forEach(function (block) {
    if (block.closest('.gist')) return;
    ensureCodeToolbar(block);
  });

  /* ---------- X (Twitter) embeds ---------- */
  function syncTweetEmbeds() {
    document.querySelectorAll('.x-embed-card').forEach(function (card) {
      if (card.querySelector('iframe.twitter-tweet-rendered, iframe[id^="twitter-widget-"]')) {
        card.classList.add('is-rendered');
      }
    });
  }

  function loadTwitterWidgets() {
    if (!document.querySelector('.twitter-tweet')) return;

    if (window.twttr && window.twttr.widgets) {
      window.twttr.widgets.load(document.body);
      syncTweetEmbeds();
      return;
    }

    if (!document.querySelector('script[src*="platform.twitter.com/widgets.js"]')) {
      var script = document.createElement('script');
      script.async = true;
      script.charset = 'utf-8';
      script.src = 'https://platform.twitter.com/widgets.js';
      script.onload = function () {
        if (window.twttr && window.twttr.widgets) {
          window.twttr.widgets.load(document.body);
        }
        setTimeout(syncTweetEmbeds, 1000);
      };
      document.body.appendChild(script);
    }

    setTimeout(syncTweetEmbeds, 2000);
    setTimeout(syncTweetEmbeds, 5000);
  }

  loadTwitterWidgets();
});
