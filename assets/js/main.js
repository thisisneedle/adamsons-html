(() => {
  /* =========================
   * Mobile drawer (slide-in + accessible)
   * ========================= */
  const openBtn = document.querySelector("[data-drawer-open]");
  const closeBtn = document.querySelector("[data-drawer-close]");
  const drawer = document.querySelector("[data-drawer]");
  const overlay = document.querySelector("[data-overlay]");

  if (openBtn && closeBtn && drawer && overlay) {
    let lastFocusedEl = null;
    const TRANSITION_MS = 280;

    const getFocusable = (root) =>
      Array.from(
        root.querySelectorAll(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      );

    const openDrawer = () => {
      lastFocusedEl = document.activeElement;

      drawer.hidden = false;
      overlay.hidden = false;

      drawer.setAttribute("aria-hidden", "false");
      openBtn.setAttribute("aria-expanded", "true");

      document.body.style.overflow = "hidden";

      requestAnimationFrame(() => {
        drawer.classList.add("is-open");
        overlay.classList.add("is-open");
      });

      const focusables = getFocusable(drawer);
      (focusables[0] || closeBtn).focus();
    };

    const closeDrawer = () => {
      drawer.classList.remove("is-open");
      overlay.classList.remove("is-open");

      drawer.setAttribute("aria-hidden", "true");
      openBtn.setAttribute("aria-expanded", "false");

      document.body.style.overflow = "";

      window.setTimeout(() => {
        drawer.hidden = true;
        overlay.hidden = true;

        if (lastFocusedEl && typeof lastFocusedEl.focus === "function") {
          lastFocusedEl.focus();
        }
      }, TRANSITION_MS);
    };

    const trapFocus = (e) => {
      if (drawer.hidden) return;
      if (e.key !== "Tab") return;

      const focusables = getFocusable(drawer);
      if (!focusables.length) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    openBtn.addEventListener("click", openDrawer);
    closeBtn.addEventListener("click", closeDrawer);
    overlay.addEventListener("click", closeDrawer);

    document.addEventListener("keydown", (e) => {
      if (!drawer.hidden && e.key === "Escape") closeDrawer();
      trapFocus(e);
    });
  }

  /* =========================
   * Search overlay
   * ========================= */
  const searchOpeners = document.querySelectorAll("[data-search-open]");
  const searchOverlay = document.querySelector("[data-search-overlay]");
  const searchClose = document.querySelector("[data-search-close]");
  const searchInput = document.querySelector("[data-search-input]");

  if (searchOpeners.length && searchOverlay && searchClose) {
    let lastFocusedEl = null;
    const TRANSITION_MS = 220;

    const getFocusable = (root) =>
      Array.from(
        root.querySelectorAll(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      );

    const openSearch = () => {
      lastFocusedEl = document.activeElement;
      searchOverlay.hidden = false;
      document.body.style.overflow = "hidden";

      requestAnimationFrame(() => {
        searchOverlay.classList.add("is-open");
        if (searchInput) searchInput.focus();
      });
    };

    const closeSearch = () => {
      searchOverlay.classList.remove("is-open");
      document.body.style.overflow = "";

      window.setTimeout(() => {
        searchOverlay.hidden = true;
        if (lastFocusedEl && typeof lastFocusedEl.focus === "function") {
          lastFocusedEl.focus();
        }
      }, TRANSITION_MS);
    };

    const trapFocus = (e) => {
      if (searchOverlay.hidden) return;
      if (e.key !== "Tab") return;

      const focusables = getFocusable(searchOverlay);
      if (!focusables.length) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    searchOpeners.forEach((btn) => btn.addEventListener("click", openSearch));
    searchClose.addEventListener("click", closeSearch);
    searchOverlay.addEventListener("click", (e) => {
      if (e.target === searchOverlay) closeSearch();
    });

    document.addEventListener("keydown", (e) => {
      if (!searchOverlay.hidden && e.key === "Escape") closeSearch();
      trapFocus(e);
    });
  }

  /* =========================
   * Testimonial slider (+ mobile swipe)
   * ========================= */
  document.querySelectorAll("[data-slider]").forEach((slider) => {
    const textEl = slider.querySelector("[data-quote-text]");
    const metaEl = slider.querySelector("[data-quote-meta]");
    const prevBtn = slider.querySelector("[data-prev]");
    const nextBtn = slider.querySelector("[data-next]");
    const dots = Array.from(slider.querySelectorAll("[data-dot]"));
    const viewport = slider.querySelector(".slider__viewport") || slider;

    const slides = [
      {
        text:
          "Pore elitectur min renteniatem solo et evendania dolorum rest quo doluptios essuscis asim elen quunt. Altitistis cus. Que vel elit elent es cusant et modi si doluptatem.",
        meta: "Name, job title and company",
      },
      {
        text:
          "Sae quibus, ulparis autem. Onsequi apis simus rest, autem nonsero. Que vel elit elent es cusant et modi si doluptatem.",
        meta: "Name, title — Company",
      },
      {
        text:
          "Orit lacidest est quis maiso inimet liciscii ipsaperiate. Sae quibus, ulparis autem. Altitistis cus.",
        meta: "Name, role — Organisation",
      },
      {
        text:
          "Obis mi, to event, eumquas nullandus preped quo tem resstni iamsuae ninporectat. Onsequi apis simus rest.",
        meta: "Name, position — Firm",
      },
      {
        text:
          "Providing in-house & law firm clients around the Globe exceptional service for 40 years. Altitistis cus. Que vel elit elent.",
        meta: "Name, job title and company",
      },
    ];

    let index = 0;

    const render = (i) => {
      index = (i + slides.length) % slides.length;

      if (textEl) textEl.textContent = slides[index].text;
      if (metaEl) metaEl.textContent = slides[index].meta;

      dots.forEach((d) => d.removeAttribute("aria-current"));
      const active = dots.find((d) => Number(d.dataset.dot) === index);
      if (active) active.setAttribute("aria-current", "true");
    };

    const goPrev = () => render(index - 1);
    const goNext = () => render(index + 1);

    prevBtn?.addEventListener("click", goPrev);
    nextBtn?.addEventListener("click", goNext);
    dots.forEach((d) =>
      d.addEventListener("click", () => render(Number(d.dataset.dot)))
    );

    /* ---- Mobile swipe support ----
     * Uses Pointer Events so it works for both touch + mouse.
     * Threshold avoids accidental navigation on small scrolls.
     */
    const SWIPE_THRESHOLD_PX = 40;
    const MAX_VERTICAL_SLOP_PX = 60;

    let pointerId = null;
    let startX = 0;
    let startY = 0;
    let lastX = 0;
    let isSwiping = false;

    const onPointerDown = (e) => {
      // Only left click for mouse; allow touch/pen
      if (e.pointerType === "mouse" && e.button !== 0) return;

      pointerId = e.pointerId;
      startX = e.clientX;
      startY = e.clientY;
      lastX = e.clientX;
      isSwiping = false;

      // Capture so we still receive events even if pointer leaves element
      viewport.setPointerCapture?.(pointerId);
    };

    const onPointerMove = (e) => {
      if (pointerId !== e.pointerId) return;

      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      lastX = e.clientX;

      // If user is scrolling vertically, don't treat as swipe
      if (Math.abs(dy) > MAX_VERTICAL_SLOP_PX && Math.abs(dy) > Math.abs(dx)) {
        return;
      }

      // Once horizontal movement is notable, consider it a swipe gesture
      if (Math.abs(dx) > 10) {
        isSwiping = true;
        // Prevent the page from also interpreting as scroll (especially iOS)
        // Only safe to preventDefault on non-passive listeners; we use pointer events.
        e.preventDefault?.();
      }
    };

    const onPointerUp = (e) => {
      if (pointerId !== e.pointerId) return;

      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      // Reset
      pointerId = null;

      // Ignore if it was mostly vertical or too small
      if (Math.abs(dy) > MAX_VERTICAL_SLOP_PX && Math.abs(dy) > Math.abs(dx)) {
        return;
      }

      if (!isSwiping) return;

      if (dx <= -SWIPE_THRESHOLD_PX) {
        // swipe left => next
        goNext();
      } else if (dx >= SWIPE_THRESHOLD_PX) {
        // swipe right => prev
        goPrev();
      }
    };

    // Make horizontal panning explicit for better touch behavior
    viewport.style.touchAction = "pan-y";

    viewport.addEventListener("pointerdown", onPointerDown, { passive: true });
    viewport.addEventListener("pointermove", onPointerMove, { passive: false });
    viewport.addEventListener("pointerup", onPointerUp, { passive: true });
    viewport.addEventListener("pointercancel", onPointerUp, { passive: true });

    render(0);
  });

  /* =========================
   * About "In this section" details: close on click
   * ========================= */
  document.querySelectorAll("[data-section-menu]").forEach((details) => {
    details.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        details.open = false;
      });
    });
  });

  /* =========================
   * About tabs + timeline logic (only runs when those elements exist)
   * ========================= */
  const tabsRoot = document.querySelector("[data-about-tabs]");
  const panelsRoot = document.querySelector("[data-about-panels]");

  const setActiveTab = (key, { focusPanel = false } = {}) => {
    if (!tabsRoot || !panelsRoot) return;

    const tabs = Array.from(
      tabsRoot.querySelectorAll("[role='tab'][data-tab]")
    );
    const panels = Array.from(
      panelsRoot.querySelectorAll("[role='tabpanel'][data-panel]")
    );

    tabs.forEach((t) => {
      const isActive = t.dataset.tab === key;
      t.classList.toggle("is-active", isActive);
      t.setAttribute("aria-selected", isActive ? "true" : "false");
      t.tabIndex = isActive ? 0 : -1;
    });

    panels.forEach((p) => {
      const isActive = p.dataset.panel === key;
      if (isActive) p.removeAttribute("hidden");
      else p.setAttribute("hidden", "");
    });

    const activePanel = panels.find((p) => p.dataset.panel === key);
    if (focusPanel && activePanel) activePanel.focus({ preventScroll: false });
  };

  if (tabsRoot && panelsRoot) {
    tabsRoot.addEventListener("click", (e) => {
      const btn = e.target.closest("[role='tab'][data-tab]");
      if (!btn) return;
      setActiveTab(btn.dataset.tab, { focusPanel: true });
    });

    tabsRoot.addEventListener("keydown", (e) => {
      const tabs = Array.from(
        tabsRoot.querySelectorAll("[role='tab'][data-tab]")
      );
      const current = document.activeElement.closest("[role='tab'][data-tab]");
      if (!current) return;

      const idx = tabs.indexOf(current);
      const last = tabs.length - 1;

      let nextIdx = null;

      switch (e.key) {
        case "ArrowLeft":
          nextIdx = idx <= 0 ? last : idx - 1;
          break;
        case "ArrowRight":
          nextIdx = idx >= last ? 0 : idx + 1;
          break;
        case "Home":
          nextIdx = 0;
          break;
        case "End":
          nextIdx = last;
          break;
        case "Enter":
        case " ":
          e.preventDefault();
          setActiveTab(current.dataset.tab, { focusPanel: true });
          return;
        default:
          return;
      }

      if (nextIdx !== null) {
        e.preventDefault();
        tabs[nextIdx].focus();
        setActiveTab(tabs[nextIdx].dataset.tab);
      }
    });

    document.querySelectorAll("[data-tab-link]").forEach((a) => {
      a.addEventListener("click", (e) => {
        const key = a.getAttribute("data-tab-link");
        setActiveTab(key, { focusPanel: true });
        const details = a.closest("details");
        if (details) details.open = false;
      });
    });

    setActiveTab("story");
  }

  document.querySelectorAll("[data-timeline]").forEach((timeline) => {
    const yearEl = timeline.querySelector("[data-history-year]");
    const textEl = timeline.querySelector("[data-history-text]");
    const yearBtns = Array.from(timeline.querySelectorAll("[data-year]"));

    const data = {
      "1985":
        "Stuart Adamson founds the business in Leeds, establishing a specialist executive search firm focused on delivering high-quality talent solutions.",
      "2003":
        "The firm establishes its London office, cementing its position as a global player in executive search and advisory services with a key presence in the UK capital.",
      "2006":
        "Expansion into new practice areas and sectors, strengthening client partnerships and broadening international capability.",
      "2014":
        "A new chapter of growth: strategic hires and continued investment in research and delivery excellence.",
      "2017":
        "Further global reach through networks and cross-border search experience, supporting increasingly complex mandates.",
      "2018":
        "Services evolve alongside market needs, with deeper advisory and leadership support for clients and candidates.",
      "2023":
        "Modernisation and refreshed positioning to reflect the firm’s established reputation and forward-looking approach.",
      "2024":
        "Continued momentum: new relationships, new roles, and a sustained focus on quality outcomes.",
    };

    const setActiveYear = (y) => {
      const year = String(y);

      yearBtns.forEach((btn) => {
        const isActive = btn.dataset.year === year;
        btn.classList.toggle("is-active", isActive);
        if (isActive) btn.setAttribute("aria-current", "true");
        else btn.removeAttribute("aria-current");
      });

      if (yearEl) yearEl.textContent = year;
      if (textEl) textEl.textContent = data[year] || "";
    };

    const onActivate = (btn) => {
      if (!btn) return;
      setActiveYear(btn.dataset.year);
    };

    yearBtns.forEach((btn) => {
      btn.addEventListener("click", () => onActivate(btn));
      btn.addEventListener("mouseenter", () => onActivate(btn));
      btn.addEventListener("focus", () => onActivate(btn));
    });

    const initial =
      yearBtns.find((b) => b.classList.contains("is-active")) || yearBtns[0];
    if (initial) setActiveYear(initial.dataset.year);
  });
})();
