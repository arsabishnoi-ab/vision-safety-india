(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /* ---------- Data ---------- */
  const IMG = "assets/img/";

  const CATEGORIES = [
    { id: "all", label: "All" },
    { id: "extinguishers", label: "Fire Extinguishers" },
    { id: "hydrant", label: "Hydrant & Hose" },
    { id: "equipment", label: "Safety Equipment" },
  ];

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
  ];

  const BREATHING = [
    { src: "p-scba.jpg", title: "Self contained breathing apparatus (SCBA)", cutout: true },
    { src: "p-papr-s100.jpg", title: "VSI/S/100 powered air purifying respirator", cutout: true },
    { src: "s-scba.jpg", title: "Servicing of SCBA" },
    { src: "s-scba-refill.jpg", title: "Servicing & refilling of SCBA" },
  ];

  /* ---------- Overlay helpers ---------- */
  function setOverlay(open) {
    document.body.classList.toggle("overlay-open", open);
    document.body.classList.toggle("no-scroll", open);
  }

  function scrollToId(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  }

  /* ---------- Header ---------- */
  const header = $("#siteHeader");
  function onScroll() {
    header.classList.toggle("is-visible", window.scrollY > 40);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const dropToggle = $(".nav-drop-toggle");
  const dropParent = $(".has-dropdown");
  dropToggle.addEventListener("click", () => {
    const open = !dropParent.classList.contains("is-open");
    dropParent.classList.toggle("is-open", open);
    dropToggle.setAttribute("aria-expanded", String(open));
  });
  document.addEventListener("click", (e) => {
    if (!dropParent.contains(e.target)) {
      dropParent.classList.remove("is-open");
      dropToggle.setAttribute("aria-expanded", "false");
    }
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
    const link = e.target.closest("a[href^='#']");
    if (!link) return;
    e.preventDefault();
    closeMenu();
    const cat = link.dataset.category;
    if (cat) {
      filterProducts(cat);
      scrollToId("products");
    } else {
      scrollToId(link.getAttribute("href").slice(1));
    }
  });

  window.matchMedia("(min-width: 993px)").addEventListener("change", (e) => {
    if (e.matches) closeMenu();
  });

  /* ---------- Hero slider ---------- */
  const slides = $$(".hero-slide");
  const dotsWrap = $("#heroDots");
  const heroTitle = $("#heroTitle");
  const heroLine = $("#heroLine");
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
    heroTitle.textContent = slides[current].dataset.title;
    heroLine.textContent = slides[current].dataset.line;
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

  /* ---------- Swipe helper ---------- */
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

  /* ---------- Stats count-up ---------- */
  $("#year").textContent = new Date().getFullYear();

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
        const step = (now) => {
          const p = Math.min((now - start) / 2000, 1);
          el.textContent = formatNum(Math.round(end * (1 - Math.pow(1 - p, 3))));
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
    }, { threshold: 0.4 });
    counters.forEach((c) => io.observe(c));
  } else {
    counters.forEach((c) => (c.textContent = formatNum(Number(c.dataset.count))));
  }

  /* ---------- Client logo carousels ---------- */
  // Brands without a usable official logo file show a text wordmark (no logo key).
  const CLIENTS = {
    hotels: [
      { name: "Oberoi Hotels & Resorts", logo: "oberoi.png" },
      { name: "Hilton", logo: "hilton.png" },
      { name: "Novotel", logo: "novotel.png" },
      { name: "Taj", logo: "taj.png" },
      { name: "ITC Hotels", logo: "itc.png" },
      { name: "Beleza by the Beach" },
      { name: "Beleza by the River" },
      { name: "Club Mahindra", logo: "club-mahindra.png" },
      { name: "Radisson Blu", logo: "radisson-blu.png" },
    ],
    industrial: [
      { name: "EPL Limited", logo: "epl.svg" },
      { name: "Molbio Diagnostics", logo: "molbio.png" },
      { name: "Lankhorst Euronete" },
      { name: "Chowgule and Company", logo: "chowgule.jpg" },
      { name: "Unichem" },
      { name: "Brilliant Printers", logo: "brilliant.png" },
      { name: "Coca-Cola", logo: "coca-cola.png" },
      { name: "Procter & Gamble", logo: "pg.png" },
      { name: "Concept Hygiene" },
      { name: "Indian Oil", logo: "indian-oil.png" },
      { name: "Hyundai", logo: "hyundai.png" },
      { name: "JMJ Hospital" },
    ],
  };

  function clientTile(c, isClone) {
    const li = document.createElement("li");
    li.className = "logo-tile";
    if (isClone) li.setAttribute("aria-hidden", "true");
    if (c.logo) {
      const img = document.createElement("img");
      img.src = IMG + "clients/" + c.logo;
      img.alt = isClone ? "" : c.name;
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
    const list = CLIENTS[carousel.dataset.clients] || [];
    const track = $(".logo-track", carousel);
    list.forEach((c) => track.appendChild(clientTile(c, false)));
    if (reduceMotion) return;

    // A second copy makes the -50% keyframe loop seamlessly.
    list.forEach((c) => track.appendChild(clientTile(c, true)));
    track.style.setProperty("--duration", `${list.length * 3.5}s`);
  });

  /* ---------- Category lists (header dropdown + phone menu) ---------- */
  $$("[data-category-list]").forEach((list) => {
    CATEGORIES.forEach((c) => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = "#products";
      a.dataset.category = c.id;
      a.textContent = c.label;
      li.appendChild(a);
      list.appendChild(li);
    });
  });

  $(".dropdown").addEventListener("click", (e) => {
    const link = e.target.closest("a[data-category]");
    if (!link) return;
    e.preventDefault();
    filterProducts(link.dataset.category);
    dropParent.classList.remove("is-open");
    dropToggle.setAttribute("aria-expanded", "false");
    link.blur();
    scrollToId("products");
  });

  /* ---------- Gallery rendering ---------- */
  function renderGallery(container, items) {
    container.innerHTML = "";
    items.forEach((item, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "gallery-item" + (item.cutout ? " is-cutout" : "") + (item.cls ? " " + item.cls : "");
      btn.setAttribute("aria-label", `View ${item.title}`);
      btn.innerHTML =
        `<img src="${IMG}${item.src}" alt="${item.title}" loading="lazy">` +
        `<span class="gallery-caption">${item.title}</span>`;
      btn.addEventListener("click", () => openLightbox(items, i, btn));
      container.appendChild(btn);
    });
  }

  const filtersWrap = $("#productFilters");
  const productGallery = $("#productGallery");

  CATEGORIES.forEach((c) => {
    const pill = document.createElement("button");
    pill.type = "button";
    pill.className = "pill";
    pill.dataset.category = c.id;
    pill.textContent = c.label;
    pill.addEventListener("click", () => filterProducts(c.id));
    filtersWrap.appendChild(pill);
  });

  function filterProducts(cat) {
    let items;
    if (cat === "all") {
      items = CATEGORIES.slice(1).flatMap((c) => PRODUCTS.filter((p) => p.cat === c.id).slice(0, 10));
    } else {
      items = PRODUCTS.filter((p) => p.cat === cat);
    }
    $$(".pill", filtersWrap).forEach((p) => p.setAttribute("aria-pressed", String(p.dataset.category === cat)));
    renderGallery(productGallery, items);
  }

  filterProducts("all");
  renderGallery($("#breathingGallery"), BREATHING);

  const ROOMS = [
    { src: "csr-rooms/room-training1.jpg", title: "Training hall" },
    { src: "csr-rooms/room-training2.jpg", title: "Training hall, classroom layout" },
    { src: "csr-rooms/room-conference.jpg", title: "Meeting room" },
    { src: "csr-rooms/room-training3.jpg", title: "Conference hall" },
    { src: "csr-rooms/reception.jpg", title: "Reception" },
  ];
  renderGallery($("#roomsGallery"), ROOMS);

  const FARM = [
    { src: "csr-rooms/farm-stream3.jpg", title: "Monsoon stream at Neturlem", cls: "is-wide is-tall" },
    { src: "csr-rooms/farm-coconut.jpg", title: "Coconut plantation" },
    { src: "csr-rooms/farm-plantation.jpg", title: "Betelnut plantation" },
    { src: "csr-rooms/farm-stream1.jpg", title: "Stream through the farm", cls: "is-tall" },
    { src: "csr-rooms/farm-river.jpg", title: "River and fields" },
    { src: "csr-rooms/farm-woods.jpg", title: "Woods" },
    { src: "csr-rooms/farm-stream2.jpg", title: "Stream" },
    { src: "csr-rooms/farm-stream4.jpg", title: "Stream" },
  ];
  renderGallery($("#csrGallery"), FARM);

  /* ---------- Video gallery ---------- */
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
    { id: "vm-1025082556", vimeo: "1025082556", hash: "09ee32f284", cat: "company", title: "Virtual tour: training & conference rooms", desc: "A walk through the rooms available for rent at our Verna facility." },
    { id: "yt-Ffw9rLH5eAM", yt: "Ffw9rLH5eAM", cat: "company", title: "MOBIAK, Greece presentation", desc: "Our partner for quality fire extinguishers." },
    { id: "yt-B5xwX3YfB2o", yt: "B5xwX3YfB2o", cat: "tests", title: "6 kg powder extinguisher, 21A fire test", desc: "VSI09-060PA-DF tackling a 21A class A fire." },
    { id: "yt-ptZg6I2sk4M", yt: "ptZg6I2sk4M", cat: "tests", title: "6 kg powder extinguisher, 113B fire test", desc: "VSI09-060PA-DF tackling a 113B class B fire." },
    { id: "yt-_sb85I2QAIE", yt: "_sb85I2QAIE", cat: "tests", title: "9 L foam extinguisher, 183B fire test", desc: "VSI07-090AF-P1D tackling a 183B class B fire." },
    { id: "yt-Y2pMLR40IPM", yt: "Y2pMLR40IPM", cat: "tests", title: "9 L foam extinguisher, 13A fire test", desc: "VSI07-090AF-P1D tackling a 13A class A fire." },
    { id: "yt-u-liCFP57U4", yt: "u-liCFP57U4", cat: "tests", title: "1 kg powder extinguisher, 21B fire test", desc: "VSI09-010PA-P1D tackling a 21B class B fire." },
    { id: "yt-GG3Vgj2bc4k", yt: "GG3Vgj2bc4k", cat: "tests", title: "1 kg powder extinguisher, 5A fire test", desc: "MBK09-010PA-P1D tackling a 5A class A fire." },
  ];

  const vgPlayer = $("#vgPlayer");
  const vgPoster = $("#vgPoster");
  const vgList = $("#vgList");
  const vgFilters = $("#videoFilters");
  let vgCurrent = VIDEOS[0];

  const thumbOf = (v) => `${IMG}videos/${v.id}.jpg`;
  const watchUrl = (v) => (v.yt ? `https://www.youtube.com/watch?v=${v.yt}` : `https://vimeo.com/${v.vimeo}/${v.hash}`);
  const embedUrl = (v) => (v.yt
    ? `https://www.youtube-nocookie.com/embed/${v.yt}?rel=0&autoplay=1`
    : `https://player.vimeo.com/video/${v.vimeo}?h=${v.hash}&autoplay=1&title=0&byline=0&portrait=0`);

  function selectVideo(v, play) {
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
  }

  function playVideo() {
    const iframe = document.createElement("iframe");
    iframe.src = embedUrl(vgCurrent);
    iframe.title = vgCurrent.title;
    iframe.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = "strict-origin-when-cross-origin";
    vgPoster.hidden = true;
    vgPlayer.appendChild(iframe);
  }
  vgPoster.addEventListener("click", playVideo);

  function renderVideoList(cat) {
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
  }

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

  $$("[data-play-video]").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const v = VIDEOS.find((x) => x.id === link.dataset.playVideo);
      if (!v) return;
      renderVideoList("all");
      selectVideo(v, false);
      scrollToId("videos");
    });
  });

  /* ---------- Lightbox ---------- */
  const lb = $("#lightbox");
  const lbImg = $("#lbImg");
  const lbCaption = $("#lbCaption");
  let lbItems = [];
  let lbIndex = 0;
  let lbReturnFocus = null;

  function showLb(i) {
    lbIndex = (i + lbItems.length) % lbItems.length;
    const item = lbItems[lbIndex];
    lbImg.src = IMG + item.src;
    lbImg.alt = item.title;
    lbCaption.textContent = item.title;
  }
  function openLightbox(items, i, trigger) {
    lbItems = items;
    lbReturnFocus = trigger;
    showLb(i);
    lb.hidden = false;
    setOverlay(true);
    $(".lb-close", lb).focus();
  }
  function closeLightbox() {
    lb.hidden = true;
    setOverlay(false);
    if (lbReturnFocus) lbReturnFocus.focus();
  }

  $(".lb-close", lb).addEventListener("click", closeLightbox);
  $(".lb-prev", lb).addEventListener("click", () => showLb(lbIndex - 1));
  $(".lb-next", lb).addEventListener("click", () => showLb(lbIndex + 1));
  lb.addEventListener("click", (e) => { if (e.target === lb) closeLightbox(); });
  addSwipe(lb, (dir) => showLb(lbIndex + dir));

  document.addEventListener("keydown", (e) => {
    if (!lb.hidden) {
      if (e.key === "Escape") closeLightbox();
      else if (e.key === "ArrowRight") showLb(lbIndex + 1);
      else if (e.key === "ArrowLeft") showLb(lbIndex - 1);
    } else if (!menu.hidden && e.key === "Escape") {
      closeMenu();
      menuOpenBtn.focus();
    }
  });
})();
