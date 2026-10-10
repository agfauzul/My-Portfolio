/* ==========================================================================
   Anik G Fauzul — Portfolio interactions
   Libraries (CDN): GSAP + ScrollTrigger, Lenis
   ========================================================================== */
(() => {
  'use strict';

  const doc = document.documentElement;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const media = (q) => window.matchMedia(q);
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  const REDUCED = media('(prefers-reduced-motion: reduce)').matches;
  const FINE = media('(hover: hover) and (pointer: fine)').matches;
  const isDesktop = () => media('(min-width: 900px)').matches;
  const isPortrait = () => window.innerWidth / window.innerHeight < 1;

  const safe = (name, fn) => {
    try { return fn(); } catch (err) { console.warn(`[portfolio] ${name} failed:`, err); }
  };

  /* ------------------------------------------------------------------
     Project data (used by the case-study modal)
     ------------------------------------------------------------------ */
  const IMG = 'assets/img/';
  const PROJECTS = {
    laju: {
      title: 'Laju Order', kicker: 'SaaS · Digital product checkout', tint: '#1d5fe0',
      role: 'UI/UX Designer & Developer',
      scope: ['Landing page', 'Checkout builder', 'Order dashboard', 'Responsive UI'],
      link: { href: 'https://lajuorder.com', label: 'lajuorder.com' },
      body: [
        'Laju Order helps Indonesian creators sell digital products without the busywork — checkout pages, landing pages, order records, WhatsApp follow-ups and ad tracking live in one dashboard, and buyers pay straight into the seller’s own bank account.',
        'I designed the landing page and the product UI around one promise: “jualan produk digital, tanpa ribet.” A checkout builder with packages, order bumps, coupons and countdowns; a dashboard that shows revenue, orders and conversion at a glance — clean, bright and mobile-first.'
      ],
      hero: { src: IMG + 'work/laju-web.webp', w: 1600, h: 1100, alt: 'Laju Order website on a browser window and a phone' },
      gallery: [{ src: IMG + 'work/laju-page.webp', w: 1600, h: 3311, alt: 'The full Laju Order landing page' }],
      wide: true
    },
    kasq: {
      title: 'KasQ', kicker: 'Personal finance · Web app', tint: '#1fa85e',
      role: 'Designer & Fullstack Developer', year: '2026',
      scope: ['Product design', 'Frontend & PWA', 'Supabase backend', '8 visual themes'],
      link: { href: 'https://kasq.agfauzul.com', label: 'kasq.agfauzul.com' },
      body: [
        'KasQ — “Mengelola Keuanganku” — is a personal finance app that runs in the browser with nothing to install. Accounts sync through Supabase, so the same books open on any phone or laptop.',
        'I designed and built it end to end: income and expense tracking with fully custom categories, savings goals with an always-on Emergency Fund, leftover budget swept into savings automatically, a calculator that logs straight to a transaction, 12-month reports — and eight switchable visual themes, each with its own light and dark face.'
      ],
      hero: { src: IMG + 'work/kasq-app.webp', w: 1600, h: 1100, alt: 'KasQ personal finance app on three phones' },
      gallery: [{ src: IMG + 'work/kasq-screens.webp', w: 1640, h: 859, alt: 'KasQ dashboard, transactions, savings and reports screens' }],
      wide: true
    },
    kai: {
      title: 'Karyawan.AI', kicker: 'Webinar · AI for business & creators', tint: '#e0b400',
      role: 'Designer & Meta Ads Specialist',
      scope: ['Landing page', 'Campaign posters', 'Meta Ads'],
      link: { href: 'https://webinar.karyawan.ai/batch-oct24', label: 'webinar.karyawan.ai' },
      body: [
        'Karyawan.AI teaches business owners and creators to build digital products, content and marketing with AI — no coding and no tech background required.',
        'For the October batch webinar I designed the landing page: a loud yellow, sticker-and-ticker look built to turn scrollers into sign-ups. I also designed the campaign posters and ran the Meta Ads that sent traffic to it.'
      ],
      hero: { src: IMG + 'work/kai-lp.webp', w: 1600, h: 1100, alt: 'Karyawan.AI webinar landing page on a browser window and a phone' },
      gallery: [{ src: IMG + 'work/kai-page.webp', w: 1600, h: 3556, alt: 'The Karyawan.AI webinar landing page, top section' }],
      wide: true
    },
    aip: {
      title: 'AIPreneur', kicker: 'Masterclass · AI for Business', tint: '#2563eb',
      role: 'Designer & Meta Ads Specialist',
      scope: ['Landing page', 'Campaign posters', 'Meta Ads'],
      link: { href: 'https://aipreneuracademy.id/masterclass/', label: 'aipreneuracademy.id' },
      body: [
        'AIPreneur Academy’s AI for Business masterclass shows founders how to grow toward billion-rupiah monthly revenue with AI — without adding headcount or learning to code.',
        'I designed the masterclass landing page — dark, cinematic and stage-lit around the mentor — along with the campaign posters, and ran the Meta Ads campaigns that brought buyers to it.'
      ],
      hero: { src: IMG + 'work/aip-lp.webp', w: 1600, h: 1100, alt: 'AIPreneur masterclass landing page on a browser window and a phone' },
      gallery: [{ src: IMG + 'work/aip-page.webp', w: 1600, h: 3556, alt: 'The AIPreneur masterclass landing page, top section' }],
      wide: true
    },
    jas: {
      title: 'Jastip.ID', kicker: 'Webinar · Personal-shopper business', tint: '#f59e0b',
      role: 'Designer & Meta Ads Specialist',
      scope: ['Landing page', 'Campaign posters', 'Meta Ads'],
      link: { href: 'https://event.jastip.id/webinar-online', label: 'event.jastip.id' },
      body: [
        'Jastip.ID’s online webinar teaches the RTL formula — Riset, Traffic, Logistik — for running a jastip (personal-shopper) business across borders, straight from your phone.',
        'I designed the landing page in a bold travel-poster style, with a country ticker, ticket-style pricing and a live countdown. I also made the campaign posters and ran the Meta Ads behind it.'
      ],
      hero: { src: IMG + 'work/jas-lp.webp', w: 1600, h: 1100, alt: 'Jastip.ID webinar landing page on a phone and a browser window' },
      gallery: [{ src: IMG + 'work/jas-page.webp', w: 1600, h: 3556, alt: 'The Jastip.ID webinar landing page, top section' }],
      wide: true
    },
    amg: {
      title: 'Makam Al-Azhar', kicker: 'Memorial park · Karawang', tint: '#1f7a55',
      role: 'Designer & Meta Ads Specialist',
      scope: ['Landing page', 'Campaign posters', 'Meta Ads'],
      link: { href: 'https://makamalazharindonesia.id/', label: 'makamalazharindonesia.id' },
      body: [
        'Al-Azhar Memorial Garden is a Muslim memorial park in East Karawang, West Java, run according to Islamic law and ISO 9001 standards together with the Al-Azhar Islamic Boarding School Foundation (YPIA).',
        'For an official sales agency I designed a landing page that feels calm and trustworthy yet easy to act on — plot types, promos and a clear path to WhatsApp — plus the posters and Meta Ads campaigns that brought families to it.'
      ],
      hero: { src: IMG + 'work/amg-lp.webp', w: 1600, h: 1100, alt: 'Al-Azhar Memorial Garden landing page on a browser window and a phone' },
      gallery: [{ src: IMG + 'work/amg-page.webp', w: 1600, h: 3556, alt: 'The Al-Azhar Memorial Garden landing page, top section' }],
      wide: true
    },
    // earlier case studies — not on the page right now; add the id back to ORDER and a card to bring one back
    zeuss: {
      title: 'Zeuss', kicker: 'Telecommunications · Indonesia', tint: '#0d6f7c',
      role: 'UI/UX & Graphic Designer', year: '2021 — 2022',
      scope: ['Website UI/UX', 'Company profile', 'Desk calendar', 'ID card & lanyard', 'Flyers'],
      link: { href: 'https://zeuss.id', label: 'zeuss.id' },
      body: [
        'ZEUSS is a telecommunications company offering high-speed internet, plus electronics & gadget repair and maintenance for residential and business customers.',
        'I designed the website for desktop and mobile — with a clear breakdown of its fibre, wireless, VSAT and cloud services — then carried the same visual language into a full set of printed collateral: company profile, desk calendar, ID cards, lanyards and product flyers.'
      ],
      hero: { src: IMG + 'work/zeuss-web.webp', w: 1600, h: 974, alt: 'Zeuss website on a laptop and phone' },
      gallery: [{ src: IMG + 'work/zeuss-print.webp', w: 1600, h: 1024, alt: 'Zeuss company profile, calendar, lanyard, ID card and flyer' }],
      wide: true
    },
    hause: {
      title: 'Hause Rooftop', kicker: 'Hospitality · Jakarta', tint: '#b5492f',
      role: 'UI/UX & Graphic Designer', year: '2020 — 2022',
      scope: ['Website UI/UX', 'Event package booklet', 'Menus', 'Business cards', 'Promo table tents'],
      link: { href: 'https://hausemade.com', label: 'hausemade.com' },
      body: [
        'HAUSE is a haven in the heart of buzzing Jakarta — a cozy nook where you can unwind and let the wind sway you into a dimension of comfort food and smiling faces.',
        'I designed its website — illustrated, warm and booking-first — and the printed pieces guests actually hold: event package booklets, menus, weekday lunch promos and business cards.'
      ],
      hero: { src: IMG + 'work/hause-web.webp', w: 1600, h: 1041, alt: 'Hause Rooftop website on a laptop and phone' },
      gallery: [{ src: IMG + 'work/hause-print.webp', w: 1600, h: 1034, alt: 'Hause event package booklet, business cards, lunch promo and menus' }],
      wide: true
    },
    visualkreatif: {
      title: 'Visual Kreatif', kicker: 'Digital invitations · Indonesia', tint: '#2c64c9',
      role: 'UI/UX Designer (team)',
      scope: ['Landing page', 'Invitation UI', 'Theme catalogue'],
      link: { href: 'https://visualkreatif.id', label: 'visualkreatif.id' },
      award: 'Top 10 “Best Digital Masterpiece” — ID Camp by Indosat Ooredoo (team).',
      body: [
        'Visual Kreatif creates digital website invitations — share your happy news right from your phone, made fast, beautiful and affordable.',
        'I designed the product experience: a landing page that sells the switch to digital, a catalogue of invitation themes from Monochrome to Dark Majestic and Moonlight, and the invitation itself. Our team’s work earned a Top 10 “Best Digital Masterpiece” award from ID Camp (Indosat Ooredoo).'
      ],
      hero: { src: IMG + 'work/vk-web.webp', w: 1587, h: 1095, alt: 'Visual Kreatif landing page, invitation and theme catalogue on phones' }
    },
    ricebowl: {
      title: 'Rice Bowl', kicker: 'Cookbook · Elin Sulivan', tint: '#3a302b',
      role: 'Book Designer',
      scope: ['Cover design', 'Interior layout', 'Typesetting'],
      body: [
        'The first recipe book from Elin Sulivan — Top 3 MasterChef Indonesia — gathering 50+ tasty, must-try recipes for best-selling online food menus.',
        'The layout balances big, appetising photography with step-by-step clarity, from the kitchen tools you need to the knife cuts you’ll use. I’ve also designed Elin’s Locals’ Street Food.'
      ],
      hero: { src: IMG + 'work/ricebowl.webp', w: 1600, h: 1014, alt: 'Rice Bowl cookbook cover and interior spreads' },
      gallery: [
        { src: IMG + 'covers/rice-bowl.webp', w: 508, h: 731, alt: 'Rice Bowl book cover' },
        { src: IMG + 'covers/street-food.webp', w: 328, h: 460, alt: 'Locals’ Street Food book cover' }
      ]
    },
    menularis: {
      title: '45 Menu Laris', kicker: 'Cookbook · Tenny Daud', tint: '#8c1f1f',
      role: 'Book Designer',
      scope: ['Cover design', 'Interior layout', '2nd edition'],
      body: [
        'The second edition of the recipe book from Tenny Daud, founder of CRbox Indonesia — 45 best-selling menus from her culinary business: easy to make, easy to sell.',
        'Alongside it sits a catering business handbook packed with standardised recipes and step-by-step operations. Bold, appetising spreads designed to make readers hungry — and ready to sell.'
      ],
      hero: { src: IMG + 'work/menularis.webp', w: 1600, h: 1085, alt: '45 Menu Laris recipe book covers and spreads' }
    },
    supercrete: {
      title: 'Super Crete', kicker: 'Building materials · Indonesia', tint: '#2f7d32',
      role: 'Graphic Designer',
      scope: ['Company profile', 'PRIME 28 product catalogue', 'Fleet livery'],
      body: [
        'PT Super Crete Indonesia provides building materials and solutions for sustainable living.',
        'I designed the company profile, the PRIME 28 product catalogue and the livery for its concrete-mixer trucks — fresh greens that read clearly from a brochure all the way to the highway.'
      ],
      hero: { src: IMG + 'work/supercrete.webp', w: 1600, h: 994, alt: 'Super Crete company profile, product catalogue and concrete mixer truck livery' }
    },
    ichiban: {
      title: 'Ichiban Paint', kicker: 'Spray paint · Social media', tint: '#b3151b',
      role: 'Social Media Designer',
      scope: ['Instagram feed', 'Carousels', 'Product content'],
      body: [
        'Ichiban Paint is a magical paint made with high-quality ingredients to create a premium, long-lasting look.',
        'Under #SprayTheMagic I designed colour face-offs, monochrome palettes, product hero shots and how-to posts — content that makes a spray can look as good as the finish it leaves.'
      ],
      hero: { src: IMG + 'work/ichiban.webp', w: 1392, h: 1154, alt: 'Grid of Ichiban Paint Instagram posts' }
    },
    bluesg: {
      title: 'BlueSG', kicker: 'EV car-sharing · Singapore', tint: '#1859c7',
      role: 'Social Media Designer',
      scope: ['Campaign key visuals', 'Promo posts', 'Seasonal campaigns'],
      body: [
        'BlueSG is a Singaporean company providing electric car-sharing and electric car-charging services.',
        'I designed promotional and seasonal campaigns — from “Drive Green” and “Go Electric, Stay Lucky” to Chinese New Year and holiday rides — each built around one clear offer and an easy-to-spot promo code.'
      ],
      hero: { src: IMG + 'work/bluesg.webp', w: 1600, h: 766, alt: 'Grid of BlueSG campaign designs' }
    }
  };
  const ORDER = ['laju', 'kasq', 'kai', 'aip', 'jas', 'amg'];

  /* ------------------------------------------------------------------
     Small helpers that work with or without GSAP
     ------------------------------------------------------------------ */
  const probe = document.createElement('div');
  probe.setAttribute('aria-hidden', 'true');
  probe.style.cssText = 'position:fixed;left:0;top:0;width:1px;visibility:hidden;pointer-events:none;z-index:-1;height:100vh';
  probe.style.height = '100svh';
  document.body.appendChild(probe);
  const svh = () => probe.offsetHeight || window.innerHeight;

  // Live Bandung clock (WIB)
  const clockEls = $$('[data-clock]');
  const clockFmt = (() => {
    try {
      return new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    } catch (_) { return null; }
  })();
  const tickClock = () => {
    if (!clockFmt) return;
    const t = clockFmt.format(new Date());
    clockEls.forEach((el) => { el.textContent = t; });
  };
  tickClock();
  setInterval(tickClock, 1000);

  // Hero video source (portrait screens get the tall crop)
  const video = $('.hero__video');
  if (video) {
    // phones get the tall 540×720 crop; tablets and up keep the sharper 1280×720 master
    const portrait = isPortrait() && window.innerWidth < 700;
    video.poster = portrait ? video.dataset.posterM : video.dataset.poster;
    video.defaultPlaybackRate = 1.15;
    if (!REDUCED) {
      video.src = portrait ? video.dataset.srcM : video.dataset.src;
      video.load();
    }
  }

  let lenis = null;
  let menuOpen = false;
  let toastTimer = 0;

  function toast(msg) {
    const t = $('.toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('is-show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('is-show'), 2400);
  }

  function rollify(root = document) {
    $$('.btn', root).forEach((btn) => {
      Array.from(btn.childNodes).forEach((node) => {
        if (node.nodeType !== 3 || !node.textContent.trim()) return;
        const text = node.textContent.trim();
        const roll = document.createElement('span');
        roll.className = 'btn__roll';
        const a = document.createElement('span');
        const b = document.createElement('span');
        a.textContent = text;
        b.textContent = text;
        b.setAttribute('aria-hidden', 'true');
        roll.append(a, b);
        node.replaceWith(roll);
      });
    });
  }

  function scrollToTarget(target) {
    if (target == null) return;
    if (lenis) {
      lenis.scrollTo(target, { duration: 1.5, easing: (t) => 1 - Math.pow(1 - t, 4) });
      return;
    }
    const y = typeof target === 'number' ? target : target.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: y, behavior: REDUCED ? 'auto' : 'smooth' });
  }

  function toggleMenu(force) {
    const open = typeof force === 'boolean' ? force : !menuOpen;
    if (open === menuOpen) return;
    menuOpen = open;
    const menu = $('#menu');
    const burger = $('.nav__burger');
    if (!menu || !burger) return;
    menu.classList.toggle('is-open', open);
    doc.classList.toggle('is-menu-open', open);
    menu.setAttribute('aria-hidden', String(!open));
    burger.setAttribute('aria-expanded', String(open));
    const label = $('.nav__burger-text', burger);
    if (label) label.textContent = open ? 'Close' : 'Menu';
    if ('inert' in menu) menu.inert = !open;
    if (lenis) { open ? lenis.stop() : lenis.start(); } else { doc.style.overflow = open ? 'hidden' : ''; }
    if (open) $('.nav')?.classList.remove('is-hidden');
  }

  function initMenu() {
    const menu = $('#menu');
    const burger = $('.nav__burger');
    if (!menu || !burger) return;
    if ('inert' in menu) menu.inert = true;
    burger.addEventListener('click', () => toggleMenu());
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && menuOpen) toggleMenu(false); });
    media('(min-width: 900px)').addEventListener?.('change', (e) => { if (e.matches) toggleMenu(false); });
  }

  function initAnchors() {
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const hash = a.getAttribute('href');
      if (!hash || hash === '#') return;
      const target = hash === '#top' ? 0 : $(hash);
      if (target == null) return;
      e.preventDefault();
      if (a.closest('.modal')) {
        closeModal();
        setTimeout(() => scrollToTarget(target), 120);
        return;
      }
      if (menuOpen) toggleMenu(false);
      scrollToTarget(target);
    });
  }

  function initCopy() {
    $$('[data-copy]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const text = btn.dataset.copy;
        let ok = false;
        try {
          await navigator.clipboard.writeText(text);
          ok = true;
        } catch (_) {
          const ta = document.createElement('textarea');
          ta.value = text;
          ta.setAttribute('readonly', '');
          ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;pointer-events:none';
          document.body.appendChild(ta);
          ta.select();
          try { ok = document.execCommand('copy'); } catch (__) { ok = false; }
          ta.remove();
        }
        btn.classList.add('is-copied');
        toast(ok ? 'Email copied — talk soon!' : text);
        setTimeout(() => btn.classList.remove('is-copied'), 2200);
      });
    });
  }

  // the portrait in About is swept in when it scrolls into view
  function initSketch() {
    const img = $('[data-sketch] img');
    if (!img || REDUCED || !window.gsap || !window.ScrollTrigger) return;
    gsap.fromTo(img, { '--rv': 1, opacity: 0.4 }, {
      '--rv': 0, opacity: 1, duration: 2.4, ease: 'power2.inOut',
      scrollTrigger: { trigger: img, start: 'top 80%', once: true }
    });
  }

  // 3D laptop in the Website card — three.js is only fetched when the card gets close
  function initLaptop() {
    const host = $('[data-laptop]');
    if (!host || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      import('./laptop3d.js')
        .then((m) => m.createLaptop(host, { reduced: REDUCED }))
        .catch((err) => console.warn('[portfolio] 3D laptop unavailable, showing the static mockup:', err));
    }, { rootMargin: '700px 0px' });
    io.observe(host);
  }

  // Lazy images inside transformed / horizontally scrolled areas can miss the browser's
  // own lazy-load check, so start loading them once their section gets close.
  // Hero video drawn through a small WebGL shader: gentle sharpening + colour grade so the
  // footage reads crisp, and a liquid lens with RGB split that reacts to cursor speed (desktop)
  // or scroll speed (touch). When nothing moves the picture is perfectly clean.
  // Falls back to the plain <video> if WebGL is unavailable.
  function heroFx() {
    const media = $('.hero__media');
    const hero = $('.hero');
    if (!media || !hero || !video || REDUCED) return;
    const canvas = document.createElement('canvas');
    canvas.className = 'hero__fx';
    canvas.setAttribute('aria-hidden', 'true');
    const gl = canvas.getContext('webgl', { alpha: false, antialias: false, depth: false, powerPreference: 'high-performance' });
    if (!gl) return;

    const VS = 'attribute vec2 p; varying vec2 vUv; void main(){ vUv = p * 0.5 + 0.5; gl_Position = vec4(p, 0.0, 1.0); }';
    const FS = [
      'precision highp float;',
      'varying vec2 vUv;',
      'uniform sampler2D uTex;',
      'uniform vec2 uRes, uTexSize, uMouse, uVel;',
      'uniform float uPower, uScroll, uTime;',
      // object-fit: cover, centred horizontally and anchored to the top like the <video>
      'vec2 cover(vec2 uv) {',
      '  float rs = uRes.x / uRes.y; float rt = uTexSize.x / uTexSize.y;',
      '  vec2 s = rs > rt ? vec2(1.0, rt / rs) : vec2(rs / rt, 1.0);',
      '  return vec2(uv.x * s.x + (1.0 - s.x) * 0.5, uv.y * s.y + (1.0 - s.y));',
      '}',
      'vec3 tex(vec2 uv) { return texture2D(uTex, cover(uv)).rgb; }',
      'void main() {',
      '  vec2 uv = vUv;',
      '  vec2 d = uv * uRes - uMouse;',
      '  float dist = length(d);',
      '  float radius = 0.24 * max(uRes.x, uRes.y);',
      '  float fall = smoothstep(radius, 0.0, dist) * uPower;',
      '  vec2 dir = d / (dist + 1.0);',
      // lens: bulge towards the cursor, drag along the motion, ripple outwards
      '  uv -= dir * (radius / uRes) * 0.06 * fall * fall;',
      '  uv -= uVel / uRes * 1.3 * fall;',
      '  uv += dir * sin(dist * 0.05 - uTime * 7.0) * 0.0028 * fall;',
      // liquid wobble while scrolling
      '  float sv = clamp(abs(uScroll) / 40.0, 0.0, 1.0);',
      '  uv.x += sin(uv.y * 12.0 + uTime * 3.0) * 0.0035 * sv;',
      // chromatic split along the motion
      '  vec2 sd = length(uVel) > 0.01 ? normalize(uVel) : vec2(1.0, 0.0);',
      '  vec2 sp = sd / uRes * (fall * 16.0 + sv * 8.0);',
      '  vec3 c = vec3(tex(uv + sp).r, tex(uv).g, tex(uv - sp).b);',
      // unsharp mask for clarity
      '  vec2 t = 1.0 / uRes;',
      '  vec3 blur = (tex(uv + vec2(t.x, 0.0)) + tex(uv - vec2(t.x, 0.0)) + tex(uv + vec2(0.0, t.y)) + tex(uv - vec2(0.0, t.y))) * 0.25;',
      '  c += (c - blur) * 0.55;',
      // grade: a touch more contrast and colour
      '  c = (c - 0.5) * 1.06 + 0.5;',
      '  float l = dot(c, vec3(0.299, 0.587, 0.114));',
      '  c = mix(vec3(l), c, 1.12);',
      '  gl_FragColor = vec4(clamp(c, 0.0, 1.0), 1.0);',
      '}'
    ].join('\n');

    const compile = (type, src) => {
      const sh = gl.createShader(type);
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(sh));
      return sh;
    };
    const prog = gl.createProgram();
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VS));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const U = {};
    ['uRes', 'uTexSize', 'uMouse', 'uVel', 'uPower', 'uScroll', 'uTime'].forEach((n) => { U[n] = gl.getUniformLocation(prog, n); });

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    let hasFrame = false;
    const upload = () => {
      if (video.readyState < 2) return;
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, video);
      hasFrame = true;
    };

    // canvas resolution: never more than the 1080p footage can feed
    const resize = () => {
      const w = media.clientWidth;
      const h = media.clientHeight;
      const scale = Math.min(window.devicePixelRatio || 1, 1.5, 2200 / Math.max(w, h, 1));
      canvas.width = Math.max(1, Math.round(w * scale));
      canvas.height = Math.max(1, Math.round(h * scale));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener('resize', resize);
    video.insertAdjacentElement('afterend', canvas);

    // input — cursor position/speed in canvas pixels (origin bottom-left)
    let mx = -1e4; let my = -1e4; let lastX = null; let lastY = null;
    let vx = 0; let vy = 0; let power = 0; let targetPower = 0;
    hero.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      const r = canvas.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width * canvas.width;
      const y = (1 - (e.clientY - r.top) / r.height) * canvas.height;
      if (lastX !== null) {
        vx += ((x - lastX) - vx) * 0.5;
        vy += ((y - lastY) - vy) * 0.5;
        targetPower = Math.min(1, Math.hypot(x - lastX, y - lastY) / (canvas.width * 0.012));
      }
      lastX = x; lastY = y; mx = x; my = y;
    });
    hero.addEventListener('pointerleave', () => { lastX = null; targetPower = 0; });

    let lastScroll = window.scrollY;
    let scrollV = 0;
    let running = false;
    let raf = 0;
    let shown = false;
    const t0 = performance.now();

    const frame = () => {
      raf = requestAnimationFrame(frame);
      if (!video.paused || !hasFrame) upload();
      if (!hasFrame) return;
      if (!shown) { shown = true; media.classList.add('fx-on'); }
      const sy = window.scrollY;
      scrollV += ((sy - lastScroll) - scrollV) * 0.2;
      lastScroll = sy;
      power += (targetPower - power) * (targetPower > power ? 0.25 : 0.06);
      targetPower *= 0.9;
      vx *= 0.9; vy *= 0.9;
      gl.uniform2f(U.uRes, canvas.width, canvas.height);
      gl.uniform2f(U.uTexSize, video.videoWidth || 1920, video.videoHeight || 1080);
      gl.uniform2f(U.uMouse, mx, my);
      gl.uniform2f(U.uVel, vx, vy);
      gl.uniform1f(U.uPower, power);
      gl.uniform1f(U.uScroll, scrollV);
      gl.uniform1f(U.uTime, (performance.now() - t0) / 1000);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    const start = () => { if (!running) { running = true; raf = requestAnimationFrame(frame); } };
    const stop = () => { running = false; cancelAnimationFrame(raf); };
    let inView = true;
    // only take over once the intro actually plays, so the poster stays up if autoplay is blocked
    const arm = () => {
      new IntersectionObserver(([e]) => { inView = e.isIntersecting; if (inView) start(); else stop(); }).observe(hero);
      document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); else if (inView) start(); });
    };
    if (!video.paused) arm(); else video.addEventListener('playing', arm, { once: true });
  }

  function warmImages() {
    if (!('IntersectionObserver' in window)) return;
    ['.about__grid', '.work', '.wall'].forEach((sel) => {
      const zone = $(sel);
      if (!zone) return;
      new IntersectionObserver(([e], obs) => {
        if (!e.isIntersecting) return;
        $$('img[loading="lazy"]', zone).forEach((img) => { img.loading = 'eager'; });
        obs.disconnect();
      }, { rootMargin: '1200px 0px' }).observe(zone);
    });
  }

  /* ------------------------------------------------------------------
     Project modal
     ------------------------------------------------------------------ */
  let modalOpen = false;
  let lastFocus = null;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  function projectHTML(id) {
    const p = PROJECTS[id];
    const i = ORDER.indexOf(id);
    const nextId = ORDER[(i + 1) % ORDER.length];
    const meta = [['Role', p.role], ['Year', p.year], ['Scope', (p.scope || []).join(' · ')]].filter(([, v]) => v);
    const gallery = (p.gallery || []).map((g) => `<img src="${g.src}" alt="${esc(g.alt || '')}" width="${g.w}" height="${g.h}" loading="lazy" decoding="async">`).join('');
    return `
      <article class="pm" style="--tint:${p.tint}">
        <header class="pm__head">
          <p class="label"><i>(${String(i + 1).padStart(2, '0')})</i> ${esc(p.kicker)}</p>
          <h2 class="pm__title" id="modal-title">${esc(p.title)}</h2>
          <dl class="pm__meta">${meta.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
        </header>
        <figure class="pm__hero"><img src="${p.hero.src}" alt="${esc(p.hero.alt)}" width="${p.hero.w}" height="${p.hero.h}" decoding="async"></figure>
        <div class="pm__body">
          <div class="pm__text">${p.body.map((t) => `<p>${esc(t)}</p>`).join('')}</div>
          <aside class="pm__aside">
            ${p.award ? `<div class="pm__award"><b>Award</b>${esc(p.award)}</div>` : ''}
            ${p.link ? `<a class="btn btn--accent" href="${p.link.href}" target="_blank" rel="noopener">Visit ${esc(p.link.label)} ↗</a>` : ''}
            <a class="btn btn--line btn--light" href="#contact">Start a similar project</a>
          </aside>
        </div>
        ${gallery ? `<div class="pm__gallery${p.wide ? ' pm__gallery--wide' : ''}">${gallery}</div>` : ''}
        <button class="pm__next" type="button" data-next="${nextId}">
          <span class="mono">Next project</span>
          <strong>${esc(PROJECTS[nextId].title)} →</strong>
        </button>
      </article>`;
  }

  function openModal(id, trigger) {
    const modal = $('#modal');
    if (!modal || !PROJECTS[id]) return;
    const panel = $('.modal__panel', modal);
    const content = $('.modal__content', modal);
    content.innerHTML = projectHTML(id);
    rollify(content);
    panel.scrollTop = 0;
    if (modalOpen) return;
    modalOpen = true;
    lastFocus = trigger || document.activeElement;
    modal.hidden = false;
    requestAnimationFrame(() => requestAnimationFrame(() => modal.classList.add('is-open')));
    if (lenis) lenis.stop(); else doc.style.overflow = 'hidden';
    setTimeout(() => panel.focus({ preventScroll: true }), 60);
  }

  function closeModal() {
    const modal = $('#modal');
    if (!modal || !modalOpen) return;
    modalOpen = false;
    modal.classList.remove('is-open');
    if (lenis) lenis.start(); else doc.style.overflow = '';
    setTimeout(() => {
      if (modalOpen) return;
      modal.hidden = true;
      $('.modal__content', modal).innerHTML = '';
    }, 750);
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }

  function initModal() {
    const modal = $('#modal');
    if (!modal) return;
    document.addEventListener('click', (e) => {
      const card = e.target.closest('[data-project]');
      if (card) { e.preventDefault(); openModal(card.dataset.project, card); return; }
      const next = e.target.closest('[data-next]');
      if (next) { openModal(next.dataset.next); return; }
      if (e.target.closest('[data-close]')) closeModal();
    });
    document.addEventListener('keydown', (e) => {
      if (!modalOpen) return;
      if (e.key === 'Escape') { closeModal(); return; }
      if (e.key !== 'Tab') return;
      const focusables = $$('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])', modal).filter((el) => el.offsetParent !== null);
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }

  // "View More" on the service cards → full-screen "page is being updated" notice
  function initUpdatePopup() {
    const pop = $('#upd');
    if (!pop) return;
    let open = false;
    let from = null;
    const show = (trigger) => {
      if (open || modalOpen) return;
      open = true; from = trigger;
      pop.hidden = false;
      requestAnimationFrame(() => requestAnimationFrame(() => pop.classList.add('is-open')));
      if (lenis) lenis.stop(); else doc.style.overflow = 'hidden';
      setTimeout(() => $('.upd__body', pop).focus({ preventScroll: true }), 60);
    };
    const hide = () => {
      if (!open) return;
      open = false;
      pop.classList.remove('is-open');
      if (lenis) lenis.start(); else doc.style.overflow = '';
      setTimeout(() => { if (!open) pop.hidden = true; }, 480);
      if (from && from.focus) from.focus({ preventScroll: true });
    };
    document.addEventListener('click', (e) => {
      const t = e.target.closest('[data-update]');
      if (t) { e.preventDefault(); show(t); return; }
      if (open && (e.target.closest('[data-upd-close]') || e.target === pop)) hide();
    });
    document.addEventListener('keydown', (e) => { if (open && e.key === 'Escape') hide(); });
  }

  /* ------------------------------------------------------------------
     Fallback when GSAP is unavailable (CDN blocked / offline)
     ------------------------------------------------------------------ */
  const hasGSAP = !!(window.gsap && window.ScrollTrigger);
  if (!hasGSAP) {
    doc.classList.remove('js');
    $('.loader')?.remove();
    if (video && !REDUCED) { const p = video.play(); if (p && p.catch) p.catch(() => {}); }
    safe('buttons', () => rollify());
    safe('menu', initMenu);
    safe('anchors', initAnchors);
    safe('copy', initCopy);
    safe('images', warmImages);
    safe('heroFx', heroFx);
    safe('laptop', initLaptop);
    safe('modal', initModal);
    return;
  }

  /* ==================================================================
     Full experience
     ================================================================== */
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });

  if (window.Lenis && !REDUCED) {
    lenis = new window.Lenis({ lerp: 0.1, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  // Scroll velocity / direction (drives the marquees)
  let lastScrollY = window.scrollY;
  let velocity = 0;
  let scrollDir = 1;
  gsap.ticker.add(() => {
    const y = window.scrollY;
    const d = y - lastScrollY;
    lastScrollY = y;
    velocity = lerp(velocity, d, 0.18);
    if (Math.abs(d) > 0.6) scrollDir = d > 0 ? 1 : -1;
  });

  /* ---------- Text helpers ---------- */
  function splitLines(el) {
    if (el.dataset.split) return $$('.line__in', el);
    const parts = el.innerHTML.split(/<br\s*\/?>/i);
    el.innerHTML = parts.map((p) => `<span class="line"><span class="line__in">${p.trim()}</span></span>`).join('');
    el.dataset.split = 'lines';
    return $$('.line__in', el);
  }

  function splitWords(el, cls) {
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => {
      if (!node.textContent.trim()) return;
      if (node.parentElement && node.parentElement.closest('.pill')) return;
      const frag = document.createDocumentFragment();
      node.textContent.split(/(\s+)/).forEach((part) => {
        if (!part) return;
        if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
        const s = document.createElement('span');
        s.className = cls;
        s.textContent = part;
        frag.appendChild(s);
      });
      node.parentNode.replaceChild(frag, node);
    });
    return $$(`.${cls}`, el);
  }

  /* ---------- Fit giant type to its container ---------- */
  function fitHero() {
    const h1 = $('.hero__name');
    const inner = $('.hero__name-in');
    if (!h1 || !inner) return;
    h1.style.fontSize = '100px';
    const avail = h1.clientWidth;
    const w = inner.offsetWidth;
    if (!avail || !w) return;
    const lines = isPortrait() ? 2 : 1;
    const maxH = (isPortrait() ? 0.36 : 0.27) * svh();
    const size = Math.min((100 * avail) / w, maxH / (0.82 * lines));
    h1.style.fontSize = `${size.toFixed(2)}px`;
  }

  function fitFooter() {
    const box = $('.footer__giant');
    const span = $('[data-fit-footer]');
    if (!box || !span) return;
    box.style.fontSize = '100px';
    const w = span.offsetWidth;
    if (!w) return;
    box.style.fontSize = `${((100 * box.clientWidth) / w * 0.985).toFixed(2)}px`;
  }

  const fitAll = () => { fitHero(); fitFooter(); };

  /* ---------- Preloader + hero intro ---------- */
  let heroStarted = false;

  function playHero() {
    if (!video || REDUCED) return;
    const go = () => {
      heroStarted = true;
      video.playbackRate = 1.15;
      const p = video.play();
      if (p && p.catch) p.catch(() => {});
    };
    if (video.readyState >= 2) { go(); return; }
    const onReady = () => { clearTimeout(timer); go(); };
    const timer = setTimeout(() => video.removeEventListener('canplay', onReady), 3200);
    video.addEventListener('canplay', onReady, { once: true });
  }

  function revealHero() {
    const tl = gsap.timeline();
    tl.to('.hero__name .ch', { yPercent: 0, duration: 1.5, ease: 'expo.out', stagger: 0.045 }, 0)
      .to('[data-hero-fade]', { autoAlpha: 1, y: 0, duration: 1.1, ease: 'power3.out', stagger: 0.1 }, 0.35)
      .to('.nav', { autoAlpha: 1, y: 0, duration: 1.1, ease: 'power3.out', clearProps: 'transform,opacity,visibility' }, 0.4)
      .fromTo('.hero__video, .hero__fx', { scale: 1.14 }, { scale: 1, duration: 2.8, ease: 'expo.out' }, 0);
    return tl;
  }

  function initIntro() {
    const loader = $('.loader');
    gsap.set('.hero__name .ch', { yPercent: 118 });
    gsap.set('[data-hero-fade]', { autoAlpha: 0, y: 28 });
    gsap.set('.nav', { autoAlpha: 0, y: -24 });

    if (REDUCED) {
      loader?.remove();
      gsap.set('.hero__name .ch', { yPercent: 0 });
      gsap.set('[data-hero-fade]', { autoAlpha: 1, y: 0 });
      gsap.set('.nav', { clearProps: 'transform,opacity,visibility' });
      return;
    }
    if (!loader) {
      playHero();
      revealHero();
      return;
    }

    doc.classList.add('is-loading');
    lenis?.stop();
    window.scrollTo(0, 0);

    const letters = $$('.loader__line > span', loader);
    const out = $('[data-count-out]', loader);
    const bar = $('.loader__bar i', loader);
    const state = { v: 0 };
    const render = () => {
      out.textContent = Math.round(state.v);
      bar.style.transform = `scaleX(${(state.v / 100).toFixed(3)})`;
    };

    // y:0 overrides the CSS translateY(110%) that hides the letters before JS runs
    gsap.fromTo(letters, { y: 0, yPercent: 110 }, { y: 0, yPercent: 0, duration: 1.15, ease: 'expo.out', stagger: 0.045, delay: 0.1 });
    const pre = gsap.to(state, { v: 88, duration: 2.6, ease: 'power2.out', onUpdate: render });

    const fontsReady = document.fonts ? Promise.race([document.fonts.ready, wait(2500)]) : Promise.resolve();
    const videoReady = new Promise((resolve) => {
      if (!video || video.readyState >= 3) { resolve(); return; }
      const done = () => resolve();
      video.addEventListener('canplaythrough', done, { once: true });
      video.addEventListener('canplay', () => setTimeout(done, 250), { once: true });
      video.addEventListener('error', done, { once: true });
      setTimeout(done, 3200);
      // iOS only buffers once playback is requested: start muted behind the loader, then rewind
      const prime = video.play();
      if (prime && prime.then) {
        prime.then(() => { if (!heroStarted) { video.pause(); video.currentTime = 0; } }).catch(() => {});
      }
    });

    Promise.all([fontsReady, videoReady, wait(1500)]).then(() => {
      fitAll();
      pre.kill();
      gsap.to(state, { v: 100, duration: 0.5, ease: 'power2.inOut', onUpdate: render, onComplete: leave });
    });

    function leave() {
      gsap.timeline({
        onComplete: () => {
          loader.remove();
          doc.classList.remove('is-loading');
          lenis?.start();
          ScrollTrigger.refresh();
        }
      })
        .to(letters, { yPercent: -110, duration: 0.6, ease: 'power3.in', stagger: 0.025 })
        .to(loader, { clipPath: 'inset(0% 0% 100% 0%)', duration: 1.1, ease: 'expo.inOut' }, '-=0.2')
        .add(revealHero, '-=0.8')
        .add(playHero, '-=0.45');
    }
  }

  function initHeroScroll() {
    const wrap = $('.hero-wrap');
    if (!wrap) return;
    gsap.timeline({ scrollTrigger: { trigger: wrap, start: 'top top', end: 'bottom bottom', scrub: true } })
      .to('.hero__media', { scale: 1.1, yPercent: -3, ease: 'none' }, 0)
      .to('.hero__shade', { '--dim': 0.7, ease: 'none' }, 0)
      .to('.hero__inner', { yPercent: -7, ease: 'none' }, 0);

    ScrollTrigger.create({
      trigger: '.about',
      start: 'top top',
      onEnter: () => video && video.pause(),
      onLeaveBack: () => {
        if (video && heroStarted && !video.ended) { const p = video.play(); if (p && p.catch) p.catch(() => {}); }
      }
    });

    if (FINE) {
      $$('.hero__name .ch').forEach((ch) => {
        if (ch.classList.contains('ch--sp')) return;
        ch.addEventListener('mouseenter', () => {
          if (gsap.isTweening(ch)) return;
          gsap.timeline()
            .to(ch, { yPercent: -16, duration: 0.22, ease: 'power2.out' })
            .to(ch, { yPercent: 0, duration: 0.9, ease: 'elastic.out(1, 0.35)' });
        });
      });
    }
  }

  /* ---------- About ---------- */
  function initStatement() {
    const el = $('[data-fill]');
    if (!el) return;
    splitWords(el, 'w');
    const tokens = $$('.w, .pill', el);
    const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 82%', end: 'bottom 55%', scrub: 0.6 } });
    tokens.forEach((t, i) => {
      if (t.classList.contains('pill')) {
        tl.fromTo(t, { scale: 0, rotate: -16 }, { scale: 1, rotate: 0, duration: 1.4, ease: 'back.out(2.2)' }, i * 0.45);
      } else {
        tl.fromTo(t, { opacity: 0.13 }, { opacity: 1, duration: 0.5, ease: 'none' }, i * 0.45);
      }
    });
  }

  function initReveals() {
    $$('.reveal-lines').forEach((el) => {
      if (/<br/i.test(el.innerHTML)) {
        const lines = splitLines(el);
        gsap.from(lines, { yPercent: 108, duration: 1.3, ease: 'expo.out', stagger: 0.1, scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
      } else {
        const words = splitWords(el, 'rw');
        gsap.from(words, { autoAlpha: 0, y: 16, duration: 0.9, ease: 'power3.out', stagger: 0.016, scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
      }
    });
    $$('.reveal-up').forEach((el) => {
      gsap.from(el, { y: 40, autoAlpha: 0, duration: 1.15, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 92%', once: true } });
    });
  }

  function initCounters() {
    $$('[data-count]').forEach((el) => {
      const end = Number(el.dataset.count) || 0;
      const o = { v: 0 };
      el.textContent = '0';
      ScrollTrigger.create({
        trigger: el, start: 'top 92%', once: true,
        onEnter: () => gsap.to(o, { v: end, duration: 2.2, ease: 'power3.out', onUpdate: () => { el.textContent = Math.round(o.v); } })
      });
    });
  }

  /* ---------- Client marquees (react to scroll speed & direction) ---------- */
  function initMarquees() {
    $$('.marquee').forEach((m) => {
      const track = $('.marquee__track', m);
      if (!track) return;
      const speed = parseFloat(m.dataset.speed) || 0.5;
      Array.from(track.children).forEach((li) => {
        const c = li.cloneNode(true);
        c.setAttribute('aria-hidden', 'true');
        const img = $('img', c);
        if (img) img.alt = '';
        track.appendChild(c);
      });
      let setW = track.scrollWidth / 2;
      let x = 0;
      let visible = false;
      const measure = () => { setW = track.scrollWidth / 2; };
      window.addEventListener('resize', measure);
      new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(m);
      // start loading logos a little before they are needed
      new IntersectionObserver(([e], obs) => {
        if (!e.isIntersecting) return;
        $$('img', track).forEach((img) => { img.loading = 'eager'; });
        obs.disconnect();
      }, { rootMargin: '800px 0px' }).observe(m);

      gsap.ticker.add((time, dt) => {
        if (!visible || !setW) return;
        const boost = 1 + Math.min(Math.abs(velocity) * 0.14, 8);
        x -= speed * boost * scrollDir * (dt / 16.67);
        if (x <= -setW) x += setW;
        if (x > 0) x -= setW;
        track.style.transform = `translate3d(${x.toFixed(2)}px,0,0)`;
      });
    });
  }

  /* ---------- Services: sticky stacked cards ---------- */
  function initStack() {
    const cards = $$('.disc');
    if (!cards.length) return;
    const inners = cards.map((c) => $('.disc__inner', c));
    const videos = cards.map((c) => $('video', c));
    // lift the veil only once a real frame has been painted (iOS reports "playing" before that)
    const reveal = (v) => v.parentElement.classList.add('is-on');
    videos.forEach((v) => {
      if (!v) return;
      v.addEventListener('playing', () => {
        if (v.requestVideoFrameCallback) { v.requestVideoFrameCallback(() => reveal(v)); return; }
        const tick = () => { if (v.currentTime > 0.05) { v.removeEventListener('timeupdate', tick); reveal(v); } };
        v.addEventListener('timeupdate', tick);
      }, { once: true });
    });
    let tops = [];
    let active = -1;

    const navH = () => parseFloat(getComputedStyle(doc).getPropertyValue('--nav-h')) || 72;

    function layout() {
      const vh = svh();
      const step = isDesktop() ? 14 : 8;
      tops = cards.map((c, i) => {
        const want = navH() + 10 + i * step;
        const t = Math.min(want, vh - c.offsetHeight - 12);
        c.style.top = `${Math.round(t)}px`;
        return t;
      });
    }

    function setActive(idx) {
      active = idx;
      videos.forEach((v, i) => {
        if (!v) return;
        if (i === idx) {
          if (!v.getAttribute('src')) v.src = v.dataset.src;
          // each clip plays once and then rests on its last frame
          if (v.ended) return;
          const p = v.play();
          // autoplay blocked (e.g. low-power mode): show the still frame instead of a blank card
          if (p && p.catch) p.catch(() => reveal(v));
        } else {
          if (!v.paused) v.pause();
          if (i === idx + 1 && !v.getAttribute('src')) { v.preload = 'auto'; v.src = v.dataset.src; }
        }
      });
    }

    function update() {
      const vh = window.innerHeight;
      for (let i = 0; i < cards.length - 1 && !REDUCED; i++) {
        const r = cards[i + 1].getBoundingClientRect();
        const p = clamp((vh - r.top) / Math.max(1, vh - tops[i + 1]), 0, 1);
        inners[i].style.transform = p > 0 ? `scale(${(1 - p * 0.07).toFixed(4)})` : '';
        inners[i].style.setProperty('--veil', (p * 0.55).toFixed(3));
      }
      let idx = -1;
      cards.forEach((c, i) => {
        const r = c.getBoundingClientRect();
        if (r.top < vh * 0.62 && r.bottom > vh * 0.28) idx = i;
      });
      if (idx !== active) setActive(idx);
    }

    layout();
    ScrollTrigger.addEventListener('refreshInit', layout);
    ScrollTrigger.create({
      trigger: '.stack', start: 'top bottom', end: 'bottom top',
      onUpdate: update,
      onToggle: (self) => { if (self.isActive) update(); else setActive(-1); }
    });
  }

  /* ---------- Work: horizontal gallery (pinned on desktop, swipe on touch) ---------- */
  function initWork() {
    const pin = $('.work__pin');
    const viewport = $('.work__viewport');
    const track = $('.work__track');
    if (!pin || !viewport || !track) return;
    const total = $$('.proj[data-project]', track).length;
    const countEl = $('.work__count b');
    const prog = $('.work__progress i');
    const setBar = (p) => {
      const q = clamp(p, 0, 1);
      if (prog) prog.style.transform = `scaleX(${q.toFixed(4)})`;
      if (countEl) countEl.textContent = String(clamp(Math.round(q * (total - 1)) + 1, 1, total)).padStart(2, '0');
    };

    const mm = gsap.matchMedia();
    mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
      const dist = () => Math.max(0, track.scrollWidth - viewport.clientWidth);
      const tween = gsap.to(track, {
        x: () => -dist(),
        ease: 'none',
        scrollTrigger: {
          trigger: pin, start: 'top top', end: () => `+=${dist()}`,
          pin: true, scrub: 0.9, invalidateOnRefresh: true, anticipatePin: 1,
          onUpdate: (self) => setBar(self.progress)
        }
      });
      $$('.proj__media img', track).forEach((img) => {
        gsap.set(img, { scale: 1.16 });
        gsap.fromTo(img, { xPercent: -5 }, {
          xPercent: 5, ease: 'none',
          scrollTrigger: { trigger: img.closest('.proj'), containerAnimation: tween, start: 'left right', end: 'right left', scrub: true }
        });
        const card = img.closest('.proj');
        card.addEventListener('mouseenter', () => gsap.to(img, { scale: 1.24, duration: 1.1, ease: 'expo.out' }));
        card.addEventListener('mouseleave', () => gsap.to(img, { scale: 1.16, duration: 1.1, ease: 'expo.out' }));
      });
      return () => gsap.set($$('.proj__media img', track), { clearProps: 'all' });
    });
    mm.add('(max-width: 899px), (prefers-reduced-motion: reduce)', () => {
      const onScroll = () => setBar(viewport.scrollLeft / Math.max(1, viewport.scrollWidth - viewport.clientWidth));
      viewport.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
      return () => viewport.removeEventListener('scroll', onScroll);
    });
  }

  /* ---------- "And many more" 3D wall ---------- */
  function initWall() {
    const wall = $('.wall');
    if (wall) {
      $$('.wall__row', wall).forEach((row) => {
        Array.from(row.children).forEach((img) => row.appendChild(img.cloneNode(true)));
        const dir = Number(row.dataset.dir) || 1;
        gsap.fromTo(row, { xPercent: dir < 0 ? -4 : -34 }, {
          xPercent: dir < 0 ? -34 : -4, ease: 'none',
          scrollTrigger: { trigger: wall, start: 'top bottom', end: 'bottom top', scrub: 0.6 }
        });
      });
    }
    const title = $('[data-blur-title]');
    if (title) {
      gsap.fromTo(title, { filter: 'blur(26px)', autoAlpha: 0, scaleX: 1.18 }, {
        filter: 'blur(0px)', autoAlpha: 1, scaleX: 1, ease: 'none',
        scrollTrigger: { trigger: title, start: 'top 96%', end: 'top 52%', scrub: true }
      });
    }
  }

  /* ---------- Journey ---------- */
  function initYears() {
    $$('.tl__year[data-year]').forEach((el) => {
      const roll = $('.roll', el);
      const digits = (el.dataset.year || '').split('');
      if (!roll || !digits.length) return;
      roll.setAttribute('aria-hidden', 'true');
      roll.innerHTML = digits.map(() => `<span class="roll__col"><span class="roll__strip">${'0123456789'.split('').map((n) => `<span>${n}</span>`).join('')}</span></span>`).join('');
      const strips = $$('.roll__strip', roll);
      ScrollTrigger.create({
        trigger: el, start: 'top 88%', once: true,
        onEnter: () => strips.forEach((s, i) => gsap.to(s, { yPercent: -10 * Number(digits[i]), duration: 1.8 + i * 0.3, ease: 'expo.out' }))
      });
    });
    $$('.tl').forEach((c) => {
      gsap.from(c, {
        y: 70, autoAlpha: 0, rotate: c.dataset.side === 'left' ? -2.5 : 2.5,
        duration: 1.3, ease: 'expo.out',
        scrollTrigger: { trigger: c, start: 'top 90%', once: true }
      });
    });
  }

  function initTimeline() {
    const root = $('[data-timeline]');
    if (!root) return;
    const svg = $('.timeline__svg', root);
    const path = $('.timeline__path', svg);
    const ghost = $('.timeline__ghost', svg);
    const cards = $$('.tl', root);
    const NS = 'http://www.w3.org/2000/svg';
    let dots = [];
    let anchors = [];
    let table = [];
    let len = 0;
    let H = 1;

    function catmull(points) {
      let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
      for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[i - 1] || points[i];
        const p1 = points[i];
        const p2 = points[i + 1];
        const p3 = points[i + 2] || p2;
        const c1x = p1.x + (p2.x - p0.x) / 6;
        const c1y = p1.y + (p2.y - p0.y) / 6;
        const c2x = p2.x - (p3.x - p1.x) / 6;
        const c2y = p2.y - (p3.y - p1.y) / 6;
        d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
      }
      return d;
    }

    function build() {
      const W = root.clientWidth;
      H = root.clientHeight || 1;
      svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
      const desk = isDesktop();
      anchors = cards.map((c) => {
        const x = c.offsetLeft;
        const y = c.offsetTop;
        const w = c.offsetWidth;
        if (!desk) return { x: 12, y: y + 44 };
        return { x: c.dataset.side === 'left' ? x + w : x, y: y + 74 };
      });
      let d;
      if (desk) {
        const pts = [{ x: W / 2, y: 0 }];
        anchors.forEach((a, i) => {
          if (i > 0) {
            const prev = anchors[i - 1];
            // swing out between cards so the line weaves instead of zig-zagging
            const swing = (i % 2 ? 1 : -1) * W * 0.16;
            pts.push({ x: (prev.x + a.x) / 2 + swing, y: (prev.y + a.y) / 2 });
          }
          pts.push(a);
        });
        d = catmull(pts);
      } else {
        d = `M 12 0 L 12 ${H}`;
      }
      path.setAttribute('d', d);
      ghost.setAttribute('d', d);
      len = path.getTotalLength();
      path.style.strokeDasharray = `${len}`;
      // lookup table: path length -> y, so the drawn tip follows the viewport line
      table = [];
      const N = 240;
      for (let i = 0; i <= N; i++) {
        const l = (len * i) / N;
        table.push({ l, y: path.getPointAtLength(l).y });
      }
      dots.forEach((dt) => dt.remove());
      dots = anchors.map((a) => {
        const c = document.createElementNS(NS, 'circle');
        c.setAttribute('cx', a.x);
        c.setAttribute('cy', a.y);
        c.setAttribute('r', desk ? 7 : 6);
        c.setAttribute('class', 'timeline__dot');
        svg.appendChild(c);
        return c;
      });
      draw(lastProgress);
    }

    let lastProgress = 0;
    function draw(p) {
      lastProgress = p;
      const targetY = p * H;
      let l = 0;
      for (let i = 0; i < table.length; i++) {
        if (table[i].y <= targetY) l = table[i].l; else break;
      }
      if (p >= 0.999) l = len;
      path.style.strokeDashoffset = `${(len - l).toFixed(1)}`;
      anchors.forEach((a, i) => dots[i] && dots[i].classList.toggle('is-on', a.y <= targetY + 2));
    }

    build();
    ScrollTrigger.addEventListener('refresh', build);
    if (REDUCED) { lastProgress = 1; draw(1); return; }
    ScrollTrigger.create({
      trigger: root, start: 'top 72%', end: 'bottom 72%',
      onUpdate: (self) => draw(self.progress),
      onLeave: () => draw(1),
      onLeaveBack: () => draw(0)
    });
  }

  /* ---------- Toolkit ---------- */
  function initTools() {
    $$('.tool').forEach((tool, i) => {
      const lvl = Number(tool.dataset.level) || 0;
      const meter = $('.meter', tool);
      const num = $('.tool__val b', tool);
      if (!meter || !num) return;
      meter.style.setProperty('--v', String(lvl / 100));
      meter.style.setProperty('--p', '0');
      num.textContent = '0';
      const o = { p: 0 };
      ScrollTrigger.create({
        trigger: tool, start: 'top 92%', once: true,
        onEnter: () => gsap.to(o, {
          p: 1, duration: 1.9, ease: 'expo.out', delay: (i % 3) * 0.08,
          onUpdate: () => { meter.style.setProperty('--p', o.p.toFixed(4)); num.textContent = Math.round(lvl * o.p); }
        })
      });
      if (FINE) {
        tool.addEventListener('pointermove', (e) => {
          const r = tool.getBoundingClientRect();
          const rx = ((e.clientY - r.top) / r.height - 0.5) * -6;
          const ry = ((e.clientX - r.left) / r.width - 0.5) * 8;
          gsap.to(tool, { rotateX: rx, rotateY: ry, transformPerspective: 700, duration: 0.6, ease: 'power3.out' });
        });
        tool.addEventListener('pointerleave', () => gsap.to(tool, { rotateX: 0, rotateY: 0, duration: 0.9, ease: 'elastic.out(1, 0.5)' }));
      }
    });
    gsap.from('.ai__app', { y: 24, autoAlpha: 0, duration: 0.9, ease: 'power3.out', stagger: 0.07, clearProps: 'transform,opacity,visibility', scrollTrigger: { trigger: '.ai', start: 'top 92%', once: true } });
  }

  /* ---------- Things I love doing (bento) ---------- */
  // tiles carry small looping CSS animations; they only run while the grid is on screen
  function initLove() {
    const grid = $('[data-love]');
    if (!grid) return;
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([e]) => grid.classList.toggle('is-live', e.isIntersecting), { threshold: 0.05 }).observe(grid);
    } else {
      grid.classList.add('is-live');
    }
    if (REDUCED || !window.gsap || !window.ScrollTrigger) return;
    gsap.from($$('.love__tile', grid), {
      y: 40, autoAlpha: 0, duration: 1, ease: 'power3.out', stagger: 0.06,
      scrollTrigger: { trigger: grid, start: 'top 88%', once: true }
    });
  }

  /* ---------- Contact ---------- */
  function initContact() {
    const script = $('.contact__script');
    if (script) {
      gsap.fromTo(script, { clipPath: 'inset(-30% 100% -30% 0%)' }, {
        clipPath: 'inset(-30% 0% -30% 0%)', duration: 1.9, ease: 'power2.inOut',
        scrollTrigger: { trigger: script, start: 'top 88%', once: true }
      });
    }
    const lines = $$('.contact__title .line');
    lines.forEach((l) => { l.innerHTML = `<span class="line__in">${l.innerHTML}</span>`; });
    gsap.from($$('.contact__title .line__in'), {
      yPercent: 110, duration: 1.4, ease: 'expo.out', stagger: 0.12,
      scrollTrigger: { trigger: '.contact__title', start: 'top 88%', once: true }
    });

    const tp = $('.arc textPath');
    if (tp) {
      gsap.fromTo(tp, { attr: { startOffset: '0%' } }, {
        attr: { startOffset: '-38%' }, ease: 'none',
        scrollTrigger: { trigger: '.arc', start: 'top bottom', end: 'bottom top', scrub: 0.5 }
      });
    }

    const giant = $('[data-fit-footer]');
    if (giant) {
      const text = giant.textContent;
      giant.textContent = '';
      text.split('').forEach((ch) => {
        const s = document.createElement('span');
        s.className = 'gch';
        s.textContent = ch;
        giant.appendChild(s);
      });
      giant.classList.add('is-split');
      fitFooter();
      gsap.from($$('.gch', giant), {
        yPercent: 100, duration: 1.5, ease: 'expo.out', stagger: 0.06,
        scrollTrigger: { trigger: '.footer__giant', start: 'top bottom', once: true }
      });
    }
  }

  /* ---------- Nav ---------- */
  function initNav() {
    const nav = $('.nav');
    if (!nav) return;
    const links = $$('.nav__pill a');
    const ind = $('.nav__indicator');
    const prog = $('.nav__progress i');
    const papers = $$('.sheet--paper');
    let current;

    const setActive = (id) => {
      if (id === current) return;
      current = id;
      let found = null;
      links.forEach((a) => {
        const on = a.dataset.link === id;
        a.classList.toggle('is-active', on);
        if (on) found = a;
      });
      if (!ind) return;
      if (found) {
        ind.style.opacity = '1';
        ind.style.width = `${found.offsetWidth}px`;
        ind.style.transform = `translateX(${found.offsetLeft}px)`;
      } else {
        ind.style.opacity = '0';
      }
    };

    $$('[data-section]').forEach((sec) => {
      ScrollTrigger.create({
        trigger: sec, start: 'top 55%', end: 'bottom 55%',
        onToggle: (self) => { if (self.isActive) setActive(sec.dataset.section); }
      });
    });
    ScrollTrigger.create({
      trigger: '.hero-wrap', start: 'top top', end: () => `+=${Math.round(svh() * 0.45)}`,
      onToggle: (self) => { if (self.isActive) setActive(null); }
    });

    ScrollTrigger.create({
      start: 0, end: 'max',
      onUpdate: (self) => {
        const y = self.scroll();
        if (prog) prog.style.transform = `scaleX(${self.progress.toFixed(4)})`;
        const hero = $('.hero');
        nav.classList.toggle('is-past-hero', !!hero && y > hero.offsetHeight - nav.offsetHeight);
        // hide-on-scroll is desktop only; on mobile the header stays pinned
        nav.classList.toggle('is-hidden', isDesktop() && self.direction === 1 && y > svh() * 0.9 && !menuOpen && !modalOpen);
        const mid = 36;
        nav.classList.toggle('is-light', papers.some((p) => {
          const r = p.getBoundingClientRect();
          return r.top <= mid && r.bottom >= mid;
        }));
      }
    });
  }

  /* ---------- Cursor & magnetic ---------- */
  function initCursor() {
    if (!FINE) return;
    const cur = $('.cursor');
    const dot = $('.cursor__dot');
    const ring = $('.cursor__ring');
    const label = $('.cursor__label');
    if (!cur || !dot || !ring || !label) return;
    let mx = -100; let my = -100; let rx = -100; let ry = -100;
    cur.classList.add('is-hidden');
    window.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
      cur.classList.remove('is-hidden');
    }, { passive: true });
    gsap.ticker.add(() => {
      rx = lerp(rx, mx, 0.2); ry = lerp(ry, my, 0.2);
      ring.style.transform = `translate3d(${rx.toFixed(1)}px, ${ry.toFixed(1)}px, 0)`;
    });
    document.addEventListener('pointerover', (e) => {
      const t = e.target.closest('[data-cursor]');
      if (t) {
        label.textContent = t.dataset.cursor;
        cur.classList.add('is-label');
        cur.classList.remove('is-link');
        return;
      }
      cur.classList.remove('is-label');
      cur.classList.toggle('is-link', !!e.target.closest('a, button, .chipx, [role="button"]'));
    });
    doc.addEventListener('mouseleave', () => cur.classList.add('is-hidden'));
  }

  // hero tagline cycles through roles with a short glitch + scramble
  function initRoles() {
    if (REDUCED) return;
    const wrap = $('[data-role]');
    const a = $('[data-role-a]');
    const b = $('[data-role-b]');
    if (!wrap || !a || !b) return;
    const roles = [['Creative', 'Designer'], ['Graphic', 'Designer'], ['Meta Ads', 'Specialist'], ['UI/UX', 'Designer'], ['Fullstack', 'Developer']];
    const noise = 'ABCDEFGHJKLMNPRSTUVXYZ#/%&*<>';
    const scramble = (s) => s.replace(/\S/g, (c) => (Math.random() < 0.45 ? noise[(Math.random() * noise.length) | 0] : c));
    let i = 0;
    const next = () => {
      i = (i + 1) % roles.length;
      const [ra, rb] = roles[i];
      wrap.classList.remove('is-glitch');
      void wrap.offsetWidth;
      wrap.classList.add('is-glitch');
      let n = 0;
      const t = setInterval(() => {
        n++;
        if (n < 4) { a.textContent = scramble(ra); b.textContent = scramble(rb); return; }
        clearInterval(t);
        a.textContent = ra; b.textContent = rb;
        $('.hero__tagline').setAttribute('aria-label', ra + ' ' + rb);
      }, 90);
    };
    setInterval(() => { if (!document.hidden) next(); }, 2600);
  }

  function initMagnetic() {
    if (!FINE) return;
    $$('.magnetic').forEach((el) => {
      const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' });
      const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' });
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - r.left - r.width / 2) * 0.28);
        yTo((e.clientY - r.top - r.height / 2) * 0.36);
      });
      el.addEventListener('pointerleave', () => { xTo(0); yTo(0); });
    });
  }

  /* ---------- Boot ---------- */
  safe('buttons', () => rollify());
  safe('menu', initMenu);
  safe('anchors', initAnchors);
  safe('fit', fitAll);
  safe('intro', initIntro);
  safe('sketch', initSketch);
  safe('images', warmImages);
  safe('heroFx', heroFx);
  safe('laptop', initLaptop);
  safe('stack', initStack);
  safe('work', initWork);
  safe('modal', initModal);
  safe('updatePopup', initUpdatePopup);
  safe('timeline', initTimeline);
  safe('copy', initCopy);
  safe('nav', initNav);
  safe('cursor', initCursor);
  safe('roles', initRoles);

  // purely decorative motion — skipped when the visitor asks for reduced motion
  if (!REDUCED) {
    safe('heroScroll', initHeroScroll);
    safe('statement', initStatement);
    safe('reveals', initReveals);
    safe('counters', initCounters);
    safe('marquee', initMarquees);
    safe('wall', initWall);
    safe('years', initYears);
    safe('tools', initTools);
    safe('love', initLove);
    safe('contact', initContact);
    safe('magnetic', initMagnetic);
  }

  ScrollTrigger.addEventListener('refreshInit', fitAll);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => { fitAll(); ScrollTrigger.refresh(); });
  }
  window.addEventListener('load', () => ScrollTrigger.refresh());
})();
