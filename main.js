/* Kayla Rodriguez portfolio — small, dependency-free interactions */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.remove('no-js');

  /* Mobile menu */
  var btn = document.querySelector('.menu-btn');
  var list = document.querySelector('.nav ul');
  if (btn && list) {
    btn.addEventListener('click', function () {
      var open = list.classList.toggle('open');
      btn.setAttribute('aria-expanded', open);
    });
    list.addEventListener('click', function (e) { if (e.target.closest('a')) list.classList.remove('open'); });
  }

  /* Scroll progress bar */
  var bar = document.querySelector('.progress');
  function onScroll() {
    if (!bar) return;
    var h = document.documentElement;
    var p = h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight);
    bar.style.width = (p * 100) + '%';
  }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* Reveal on scroll */
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0.12 });
    items.forEach(function (el, i) { el.style.transitionDelay = (i % 4) * 70 + 'ms'; io.observe(el); });
  } else { items.forEach(function (el) { el.classList.add('in'); }); }

  /* Typing rotator in hero */
  var rot = document.querySelector('.rotator');
  if (rot) {
    var words = (rot.getAttribute('data-words') || '').split('|').filter(Boolean);
    if (reduce || !words.length) { rot.textContent = words[0] || ''; }
    else {
      var w = 0, c = 0, del = false;
      (function tick() {
        var word = words[w];
        rot.textContent = word.slice(0, c);
        if (!del && c < word.length) { c++; setTimeout(tick, 70); }
        else if (!del) { del = true; setTimeout(tick, 1500); }
        else if (c > 0) { c--; setTimeout(tick, 35); }
        else { del = false; w = (w + 1) % words.length; setTimeout(tick, 250); }
      })();
    }
  }

  /* Duplicate marquee content for seamless loop */
  var track = document.querySelector('.marquee-track');
  if (track) track.innerHTML += track.innerHTML;

  /* 3D tilt on project cards */
  if (!reduce && window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.card').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = 'perspective(900px) rotateX(' + (-y * 6) + 'deg) rotateY(' + (x * 7) + 'deg) translateY(-6px)';
      });
      card.addEventListener('mouseleave', function () { card.style.transform = ''; });
    });

    /* Custom cursor */
    var cur = document.createElement('div');
    cur.className = 'cursor'; cur.setAttribute('aria-hidden', 'true');
    document.body.appendChild(cur);
    var tx = 0, ty = 0, cx = 0, cy = 0;
    window.addEventListener('mousemove', function (e) { tx = e.clientX; ty = e.clientY; cur.classList.add('on'); });
    (function loop() {
      cx += (tx - cx) * 0.5; cy += (ty - cy) * 0.5;
      cur.style.left = cx + 'px'; cur.style.top = cy + 'px';
      requestAnimationFrame(loop);
    })();
    document.addEventListener('mouseover', function (e) {
      cur.classList.toggle('big', !!e.target.closest('a, button, .card'));
    });
  }

  /* Lightbox for gallery images */
  var lb = document.createElement('div');
  lb.className = 'lightbox'; lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-label', 'Image viewer');
  lb.innerHTML = '<button type="button" aria-label="Close">close ✕</button><img alt="">';
  document.body.appendChild(lb);
  var lbImg = lb.querySelector('img');
  function closeLb() { lb.classList.remove('open'); }
  lb.addEventListener('click', closeLb);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeLb(); });
  document.querySelectorAll('.gallery button').forEach(function (b) {
    b.addEventListener('click', function () {
      var img = b.querySelector('img');
      lbImg.src = b.getAttribute('data-full') || img.src; lbImg.alt = img.alt;
      lb.classList.add('open');
    });
  });

  /* Footer year */
  var yr = document.getElementById('year'); if (yr) yr.textContent = new Date().getFullYear();

  /* Headshot fallback if image is missing */
  document.querySelectorAll('img[data-fallback]').forEach(function (img) {
    img.addEventListener('error', function () {
      img.replaceWith(Object.assign(document.createElement('div'), {
        textContent: 'K', style: 'display:grid;place-items:center;height:100%;font:italic 8rem Georgia,serif;color:#d2549a;background:#1e1e23'
      }));
    });
  });
})();
