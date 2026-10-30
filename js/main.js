(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /* ---------- Data ---------- */
  const IMG = "assets/img/";
  const onHome = !!$("#productTrack");

  const CATEGORIES = [
    { id: "all", label: "All" },
    { id: "extinguishers", label: "Fire Extinguishers" },
    { id: "hydrant", label: "Hydrant & Hose" },
    { id: "equipment", label: "Safety Equipment" },
    { id: "breathing", label: "Breathing Solutions" },
  ];

  // Items with an icon instead of src have no photo yet and are left out of the lightbox.
  const PRODUCTS = [
    { cat: "extinguishers", src: "p-portable.jpg", title: "Portable fire extinguishers (AFFF, DCP, ABC, water, clean agent)" },
    { cat: "extinguishers", src: "p-abc3kg.jpg", title: "VSafe ABC 3kg fire extinguisher", cutout: true },
    { cat: "extinguishers", src: "s-storage.jpg", title: "Fire extinguisher spares" },
    { cat: "hydrant", src: "p-hydrant.jpg", title: "Fire hydrant" },
    { cat: "hydrant", src: "p-hosereel.jpg", title: "Hose reel drum set", cutout: true },
    { cat: "hydrant", src: "p-hosebinding.jpg", title: "Hose binding" },
    { cat: "hydrant", src: "p-adaptors.jpg", title: "Adaptors, couplings & connectors for fire systems", cutout: true },
    { cat: "equipment", src: "p-smoke.jpg", title: "Smoke alarm", cutout: true },
    { cat: "equipment", src: "p-blanket.jpg", title: "Fire blanket", cutout: true },
    { cat: "equipment", src: "p-gloves.jpg", title: "Heat resistant Kevlar gloves", cutout: true },
    { cat: "equipment", src: "p-eebd.jpg", title: "Emergency escape breathing device (EEBD)", cutout: true },
    { cat: "breathing", brand: "Vision Air", src: "p-scba.jpg", title: "SCBA, EN 137 self contained breathing apparatus", cutout: true },
    { cat: "breathing", brand: "Vision Air", src: "p-papr-s100.jpg", title: "PAPR, NIOSH approved powered air purifying respirator", cutout: true },
    { cat: "breathing", brand: "Vision Air", icon: "fa-dolly", title: "BA trolley, mobile breathing air supply" },
    { cat: "breathing", brand: "Vision Air", src: "s-scba-refill.jpg", title: "Refilling of breathing cylinders" },
    { cat: "breathing", brand: "VSafe", icon: "fa-head-side-mask", title: "N95 masks, SITRA / CE mark" },
    { cat: "breathing", brand: "VSafe", icon: "fa-mask-face", title: "3 ply masks, SITRA / CE mark" },
  ];

  // Entries without a logo file show a text tile.
  const LOGOS = {
    certs: [
      { name: "Fire & Security Association of India (FSAI)", logo: "certs/fsai.png" },
      { name: "National Fire Protection Association (NFPA)", logo: "certs/nfpa.png" },
      { name: "National Safety Council of India", logo: "certs/nsc.png" },
      { name: "UL Approved", logo: "certs/ul.png" },
      { name: "FM Approved" },
      { name: "CE Mark", logo: "certs/ce.png" },
      { name: "NIOSH Approved", logo: "certs/niosh.png" },
      { name: "PESO Tested" },
      { name: "EN 3 Approved" },
      { name: "SITRA Certified" },
    ],
    hotels: [
      { name: "Oberoi Hotels & Resorts", logo: "clients/oberoi.png" },
      { name: "Hilton", logo: "clients/hilton.png" },
      { name: "Novotel", logo: "clients/novotel.png" },
      { name: "Taj", logo: "clients/taj.png" },
      { name: "ITC Hotels", logo: "clients/itc.png" },
      { name: "Beleza by the Beach" },
      { name: "Beleza by the River" },
      { name: "Club Mahindra", logo: "clients/club-mahindra.png" },
      { name: "Radisson Blu", logo: "clients/radisson-blu.png" },
    ],
    industrial: [
      { name: "EPL Limited", logo: "clients/epl.svg" },
      { name: "Molbio Diagnostics", logo: "clients/molbio.png" },
      { name: "Lankhorst Euronete" },
      { name: "Chowgule and Company", logo: "clients/chowgule.jpg" },
      { name: "Unichem" },
      { name: "Brilliant Printers", logo: "clients/brilliant.png" },
      { name: "Coca-Cola", logo: "clients/coca-cola.png" },
      { name: "Procter & Gamble", logo: "clients/pg.png" },
      { name: "Concept Hygiene" },
      { name: "Indian Oil", logo: "clients/indian-oil.png" },
      { name: "Hyundai", logo: "clients/hyundai.png" },
      { name: "JMJ Hospital" },
    ],
  };

  const FARM = [
    { src: "csr/farm-stream3.jpg", title: "Monsoon stream at Neturlem", cls: "is-wide is-tall" },
    { src: "csr/farm-coconut.jpg", title: "Coconut plantation" },
    { src: "csr/farm-plantation.jpg", title: "Betelnut plantation" },
    { src: "csr/farm-stream1.jpg", title: "Stream through the farm", cls: "is-tall" },
    { src: "csr/farm-river.jpg", title: "River and fields" },
    { src: "csr/farm-woods.jpg", title: "Woods" },
    { src: "csr/farm-stream2.jpg", title: "Stream" },
    { src: "csr/farm-stream4.jpg", title: "Stream" },
  ];

  /* ---------- Helpers ---------- */
  function setOverlay(open) {
    document.body.classList.toggle("overlay-open", open);
    document.body.classList.toggle("no-scroll", open);
  }

  function scrollToId(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  }

  function addSwipe(el, cb) {
    let x0 = null, y0 = null;
    el.addEventListener("touchstart", (e) => {
      x0 = e.touches[0].clientX;
      y0 = e.touches[0].clientY;
    }, { passive: true });
    el.addEventListener("touchend", (e) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      const dy = e.changedTouches[0].clientY - y0;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) cb(dx < 0 ? 1 : -1);
      x0 = y0 = null;
    }, { passive: true });
  }

  $$("#year").forEach((el) => (el.textContent = new Date().getFullYear()));

  /* ---------- Header ---------- */
  const header = $("#siteHeader");
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 40);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const dropToggle = $(".nav-drop-toggle");
  const dropParent = $(".has-dropdown");
  const closeDropdown = () => {
    dropParent.classList.remove("is-open");
    dropToggle.setAttribute("aria-expanded", "false");
  };
  dropToggle.addEventListener("click", () => {
    const open = !dropParent.classList.contains("is-open");
    dropParent.classList.toggle("is-open", open);
    dropToggle.setAttribute("aria-expanded", String(open));
  });
  document.addEventListener("click", (e) => {
    if (!dropParent.contains(e.target)) closeDropdown();
  });

  /* ---------- Category lists (header dropdown + phone menu) ---------- */
  $$("[data-category-list]").forEach((list) => {
    CATEGORIES.forEach((c) => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = onHome ? "#products" : `index.html?cat=${c.id}#products`;
      a.dataset.category = c.id;
      a.textContent = c.label;
      li.appendChild(a);
      list.appendChild(li);
    });
  });

  $(".dropdown").addEventListener("click", (e) => {
    const link = e.target.closest("a[data-category]");
    if (!link || !onHome) return;
    e.preventDefault();
    filterProducts(link.dataset.category);
    closeDropdown();
    link.blur();
    scrollToId("products");
  });

  /* ---------- Phone menu ---------- */
  const menu = $("#mobileMenu");
  const menuOpenBtn = $("#menuOpen");
  const menuCloseBtn = $("#menuClose");

  function openMenu() {
    menu.hidden = false;
    menuOpenBtn.setAttribute("aria-expanded", "true");
    setOverlay(true);
    menuCloseBtn.focus();
  }
  function closeMenu() {
    if (menu.hidden) return;
    menu.hidden = true;
    menuOpenBtn.setAttribute("aria-expanded", "false");
    setOverlay(false);
  }
  menuOpenBtn.addEventListener("click", openMenu);
  menuCloseBtn.addEventListener("click", () => { closeMenu(); menuOpenBtn.focus(); });

  menu.addEventListener("click", (e) => {
    const link = e.target.closest("a");
    if (!link) return;
    closeMenu();
    const href = link.getAttribute("href");
    if (!href.startsWith("#")) return;
    e.preventDefault();
    if (link.dataset.category) {
      filterProducts(link.dataset.category);
      scrollToId("products");
    } else {
      scrollToId(href.slice(1));
    }
  });

  window.matchMedia("(min-width: 993px)").addEventListener("change", (e) => {
    if (e.matches) closeMenu();
  });

  /* ---------- Lightbox ---------- */
  const lb = $("#lightbox");
  let lbItems = [];
  let lbIndex = 0;
  let lbReturnFocus = null;

  function showLb(i) {
    lbIndex = (i + lbItems.length) % lbItems.length;
    const item = lbItems[lbIndex];
    $("#lbImg").src = IMG + item.src;
    $("#lbImg").alt = item.title;
    $("#lbCaption").textContent = item.title;
  }
  function openLightbox(items, item, trigger) {
    lbItems = items.filter((x) => x.src);
    lbReturnFocus = trigger;
    showLb(lbItems.indexOf(item));
    lb.hidden = false;
    setOverlay(true);
    $(".lb-close", lb).focus();
  }
  function closeLightbox() {
    lb.hidden = true;
    setOverlay(false);
    if (lbReturnFocus) lbReturnFocus.focus();
  }

  if (lb) {
    $(".lb-close", lb).addEventListener("click", closeLightbox);
    $(".lb-prev", lb).addEventListener("click", () => showLb(lbIndex - 1));
    $(".lb-next", lb).addEventListener("click", () => showLb(lbIndex + 1));
    lb.addEventListener("click", (e) => { if (e.target === lb) closeLightbox(); });
    addSwipe(lb, (dir) => showLb(lbIndex + dir));
  }

  document.addEventListener("keydown", (e) => {
    if (lb && !lb.hidden) {
      if (e.key === "Escape") closeLightbox();
      else if (e.key === "ArrowRight") showLb(lbIndex + 1);
      else if (e.key === "ArrowLeft") showLb(lbIndex - 1);
    } else if (!menu.hidden && e.key === "Escape") {
      closeMenu();
      menuOpenBtn.focus();
    }
  });

  function galleryItem(item, items) {
    if (!item.src) {
      const div = document.createElement("div");
      div.className = "gallery-item is-icon";
      div.innerHTML =
        `<i class="fa-solid ${item.icon}" aria-hidden="true"></i>` +
        `<span class="gallery-caption">${item.brand ? `<em>${item.brand}</em>` : ""}${item.title}</span>`;
      return div;
    }
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "gallery-item" + (item.cutout ? " is-cutout" : "") + (item.cls ? " " + item.cls : "");
    btn.setAttribute("aria-label", `View ${item.title}`);
    btn.innerHTML =
      `<img src="${IMG}${item.src}" alt="${item.title}" loading="lazy">` +
      `<span class="gallery-caption">${item.brand ? `<em>${item.brand}</em>` : ""}${item.title}</span>`;
    btn.addEventListener("click", () => openLightbox(items, item, btn));
    return btn;
  }

  function renderGallery(container, items) {
    if (!container) return;
    container.innerHTML = "";
    items.forEach((item) => container.appendChild(galleryItem(item, items)));
  }

  /* ---------- Sliders (products + services) ---------- */
  function initSlider(slider) {
    const track = $(".slider-track", slider);
    const step = () => {
      const slide = $(".slide", track);
      return slide ? slide.getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap || 0) : track.clientWidth;
    };
    const atEnd = () => track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
    const go = (dir) => {
      const behavior = reduceMotion ? "auto" : "smooth";
      if (dir > 0 && atEnd()) track.scrollTo({ left: 0, behavior });
      else if (dir < 0 && track.scrollLeft <= 4) track.scrollTo({ left: track.scrollWidth, behavior });
      else track.scrollBy({ left: dir * step(), behavior });
    };
    $$(".slider-btn", slider).forEach((b) => b.addEventListener("click", () => { go(Number(b.dataset.dir)); restart(); }));

    let timer = null;
    let paused = false;
    let inView = false;
    function restart() {
      clearInterval(timer);
      if (reduceMotion || !("autoplay" in slider.dataset)) return;
      timer = setInterval(() => { if (!paused && inView) go(1); }, 4000);
    }
    slider.addEventListener("mouseenter", () => (paused = true));
    slider.addEventListener("mouseleave", () => (paused = false));
    slider.addEventListener("focusin", () => (paused = true));
    slider.addEventListener("focusout", () => (paused = false));
    track.addEventListener("touchstart", () => { paused = true; }, { passive: true });
    track.addEventListener("touchend", () => { setTimeout(() => (paused = false), 3000); }, { passive: true });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(([en]) => (inView = en.isIntersecting), { threshold: 0.3 }).observe(slider);
    } else {
      inView = true;
    }
    restart();
    slider.resetPosition = () => track.scrollTo({ left: 0 });
  }
  $$("[data-slider]").forEach(initSlider);

  /* ---------- Products ---------- */
  const filtersWrap = $("#productFilters");
  const productTrack = $("#productTrack");

  function filterProducts(cat) {
    if (!productTrack) return;
    const items = cat === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.cat === cat);
    $$(".pill", filtersWrap).forEach((p) => p.setAttribute("aria-pressed", String(p.dataset.category === cat)));
    productTrack.innerHTML = "";
    items.forEach((item) => {
      const li = document.createElement("li");
      li.className = "slide product-slide";
      li.appendChild(galleryItem(item, items));
      productTrack.appendChild(li);
    });
    productTrack.closest("[data-slider]").resetPosition();
  }

  if (productTrack) {
    CATEGORIES.forEach((c) => {
      const pill = document.createElement("button");
      pill.type = "button";
      pill.className = "pill";
      pill.dataset.category = c.id;
      pill.textContent = c.label;
      pill.addEventListener("click", () => filterProducts(c.id));
      filtersWrap.appendChild(pill);
    });
    const startCat = new URLSearchParams(location.search).get("cat");
    filterProducts(CATEGORIES.some((c) => c.id === startCat) ? startCat : "all");
  }

  /* ---------- Hero slider ---------- */
  const slides = $$(".hero-slide");
  if (slides.length) {
    const dotsWrap = $("#heroDots");
    let current = 0;
    let timer = null;

    slides.forEach((slide, i) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "hero-dot";
      dot.setAttribute("aria-label", `Slide ${i + 1}`);
      dot.addEventListener("click", () => { goTo(i); restart(); });
      dotsWrap.appendChild(dot);
    });
    const dots = $$(".hero-dot", dotsWrap);

    function goTo(i) {
      current = (i + slides.length) % slides.length;
      slides.forEach((s, idx) => s.classList.toggle("is-active", idx === current));
      dots.forEach((d, idx) => d.setAttribute("aria-current", String(idx === current)));
      $("#heroTitle").textContent = slides[current].dataset.title;
      $("#heroLine").textContent = slides[current].dataset.line;
    }
    function restart() {
      if (reduceMotion) return;
      clearInterval(timer);
      timer = setInterval(() => goTo(current + 1), 6000);
    }

    $(".hero-prev").addEventListener("click", () => { goTo(current - 1); restart(); });
    $(".hero-next").addEventListener("click", () => { goTo(current + 1); restart(); });
    addSwipe($(".hero"), (dir) => { goTo(current + dir); restart(); });
    goTo(0);
    restart();
  }

  /* ---------- Stats count-up ---------- */
  const formatNum = (n) => n.toLocaleString("en-IN");
  const counters = $$("[data-count]");
  if (!reduceMotion && "IntersectionObserver" in window) {
    counters.forEach((c) => (c.textContent = "0"));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        io.unobserve(entry.target);
        const el = entry.target;
        const end = Number(el.dataset.count);
        const start = performance.now();
        const tick = (now) => {
          const p = Math.min((now - start) / 2000, 1);
          el.textContent = formatNum(Math.round(end * (1 - Math.pow(1 - p, 3))));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.4 });
    counters.forEach((c) => io.observe(c));
  } else {
    counters.forEach((c) => (c.textContent = formatNum(Number(c.dataset.count))));
  }

  /* ---------- Logo marquees (certifications + clients) ---------- */
  function logoTile(c, isClone) {
    const li = document.createElement("li");
    li.className = "logo-tile";
    if (isClone) li.setAttribute("aria-hidden", "true");
    if (c.logo) {
      const img = document.createElement("img");
      img.src = IMG + c.logo;
      img.alt = isClone ? "" : c.name;
      img.title = c.name;
      img.loading = "lazy";
      li.appendChild(img);
    } else {
      const span = document.createElement("span");
      span.className = "logo-text";
      span.textContent = c.name;
      li.appendChild(span);
    }
    return li;
  }

  $$(".logo-carousel").forEach((carousel) => {
    const list = LOGOS[carousel.dataset.logos] || [];
    const track = $(".logo-track", carousel);
    list.forEach((c) => track.appendChild(logoTile(c, false)));
    if (reduceMotion) return;

    // A second copy makes the -50% keyframe loop seamlessly.
    list.forEach((c) => track.appendChild(logoTile(c, true)));
    track.style.setProperty("--duration", `${list.length * 3.5}s`);
  });

  renderGallery($("#csrGallery"), FARM);

  /* ---------- Video gallery ---------- */
  const vgPlayer = $("#vgPlayer");
  if (vgPlayer) {
    const VIDEO_CATS = [
      { id: "all", label: "All" },
      { id: "breathing", label: "Breathing (PAPR)" },
      { id: "tests", label: "Fire Rating Tests" },
      { id: "company", label: "Company" },
    ];
    const CAT_LABEL = { breathing: "Breathing", tests: "Fire Rating Test", company: "Company" };

    const VIDEOS = [
      { id: "yt-ACypldmJVsQ", yt: "ACypldmJVsQ", cat: "breathing", title: "Shine by VSafe Powered Air Purifying Respirator", desc: "How to wear and use our PAPR." },
      { id: "yt-O9ElKeA5e7k", yt: "O9ElKeA5e7k", cat: "breathing", title: "How a PAPR works", desc: "Inside the working of the Shine by VSafe PAPR." },
      { id: "vm-1006549257", vimeo: "1006549257", hash: "41e69c0700", cat: "company", title: "Celebrating 25 years", desc: "A thank-you to our clients, suppliers and partners." },
      { id: "yt-Ffw9rLH5eAM", yt: "Ffw9rLH5eAM", cat: "company", title: "MOBIAK, Greece presentation", desc: "Our partner for quality fire extinguishers." },
      { id: "yt-B5xwX3YfB2o", yt: "B5xwX3YfB2o", cat: "tests", title: "6 kg powder extinguisher, 21A fire test", desc: "VSI09-060PA-DF tackling a 21A class A fire." },
      { id: "yt-ptZg6I2sk4M", yt: "ptZg6I2sk4M", cat: "tests", title: "6 kg powder extinguisher, 113B fire test", desc: "VSI09-060PA-DF tackling a 113B class B fire." },
      { id: "yt-_sb85I2QAIE", yt: "_sb85I2QAIE", cat: "tests", title: "9 L foam extinguisher, 183B fire test", desc: "VSI07-090AF-P1D tackling a 183B class B fire." },
      { id: "yt-Y2pMLR40IPM", yt: "Y2pMLR40IPM", cat: "tests", title: "9 L foam extinguisher, 13A fire test", desc: "VSI07-090AF-P1D tackling a 13A class A fire." },
      { id: "yt-u-liCFP57U4", yt: "u-liCFP57U4", cat: "tests", title: "1 kg powder extinguisher, 21B fire test", desc: "VSI09-010PA-P1D tackling a 21B class B fire." },
      { id: "yt-GG3Vgj2bc4k", yt: "GG3Vgj2bc4k", cat: "tests", title: "1 kg powder extinguisher, 5A fire test", desc: "MBK09-010PA-P1D tackling a 5A class A fire." },
    ];

    const vgPoster = $("#vgPoster");
    const vgList = $("#vgList");
    const vgFilters = $("#videoFilters");
    let vgCurrent = VIDEOS[0];

    const thumbOf = (v) => `${IMG}videos/${v.id}.jpg`;
    const watchUrl = (v) => (v.yt ? `https://www.youtube.com/watch?v=${v.yt}` : `https://vimeo.com/${v.vimeo}/${v.hash}`);
    const embedUrl = (v) => (v.yt
      ? `https://www.youtube-nocookie.com/embed/${v.yt}?rel=0&autoplay=1`
      : `https://player.vimeo.com/video/${v.vimeo}?h=${v.hash}&autoplay=1&title=0&byline=0&portrait=0`);

    const selectVideo = (v, play) => {
      vgCurrent = v;
      $("iframe", vgPlayer)?.remove();
      vgPoster.hidden = false;
      $("#vgPosterImg").src = thumbOf(v);
      $("#vgPosterImg").alt = v.title;
      vgPoster.setAttribute("aria-label", `Play ${v.title}`);
      $("#vgTag").textContent = CAT_LABEL[v.cat];
      $("#vgTitle").textContent = v.title;
      $("#vgDesc").textContent = v.desc;
      $("#vgLink").href = watchUrl(v);
      $("#vgLinkText").textContent = v.yt ? "Watch on YouTube" : "Watch on Vimeo";
      $$(".vg-item", vgList).forEach((b) => b.setAttribute("aria-current", String(b.dataset.id === v.id)));
      if (play) playVideo();
    };

    const playVideo = () => {
      const iframe = document.createElement("iframe");
      iframe.src = embedUrl(vgCurrent);
      iframe.title = vgCurrent.title;
      iframe.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
      iframe.allowFullscreen = true;
      iframe.referrerPolicy = "strict-origin-when-cross-origin";
      vgPoster.hidden = true;
      vgPlayer.appendChild(iframe);
    };
    vgPoster.addEventListener("click", playVideo);

    const renderVideoList = (cat) => {
      vgList.innerHTML = "";
      VIDEOS.filter((v) => cat === "all" || v.cat === cat).forEach((v) => {
        const li = document.createElement("li");
        li.innerHTML =
          `<button type="button" class="vg-item" data-id="${v.id}" aria-current="${v.id === vgCurrent.id}">` +
          `<span class="vg-thumb"><img src="${thumbOf(v)}" alt="" loading="lazy"><i class="fa-solid fa-play" aria-hidden="true"></i></span>` +
          `<span><span class="vg-item-tag">${CAT_LABEL[v.cat]}</span><span class="vg-item-title">${v.title}</span></span>` +
          `</button>`;
        $("button", li).addEventListener("click", () => {
          selectVideo(v, true);
          if (window.innerWidth < 993) vgPlayer.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
        });
        vgList.appendChild(li);
      });
      $$(".pill", vgFilters).forEach((p) => p.setAttribute("aria-pressed", String(p.dataset.category === cat)));
    };

    VIDEO_CATS.forEach((c) => {
      const pill = document.createElement("button");
      pill.type = "button";
      pill.className = "pill";
      pill.dataset.category = c.id;
      pill.textContent = c.label;
      pill.addEventListener("click", () => {
        renderVideoList(c.id);
        const first = VIDEOS.find((v) => c.id === "all" || v.cat === c.id);
        if (first && vgCurrent.cat !== c.id && c.id !== "all") selectVideo(first, false);
      });
      vgFilters.appendChild(pill);
    });

    renderVideoList("all");
    selectVideo(VIDEOS[0], false);
  }
})();
