document.addEventListener("DOMContentLoaded", () => {
  const logoBox = document.querySelector(".sticky-logo"); // กล่อง
  const mediaText = document.querySelector(".logo-media"); // h1 ชั้นบน
  if (!logoBox || !mediaText) return;

  const medias = [
    document.querySelector(".hero"),
    document.querySelector(".new-media"),
    document.querySelector(".best-sell-media"),
    ...document.querySelectorAll(".collection-media"), // ดึงทุก collection
    document.querySelector(".ticker"),
    document.querySelector(".faq"),


  ].filter(Boolean);

  function intersect(a, b) {
    const left = Math.max(a.left, b.left);
    const top = Math.max(a.top, b.top);
    const right = Math.min(a.right, b.right);
    const bottom = Math.min(a.bottom, b.bottom);
    if (right <= left || bottom <= top) return null;
    return { left, top, right, bottom };
  }

  function updateClip() {
    const textRect = mediaText.getBoundingClientRect();

    let best = null;
    let bestArea = 0;

    for (const el of medias) {
      const r = el.getBoundingClientRect();
      const hit = intersect(textRect, r);
      if (!hit) continue;

      const area = (hit.right - hit.left) * (hit.bottom - hit.top);
      if (area > bestArea) {
        bestArea = area;
        best = hit;
      }
    }

    if (!best) {
      mediaText.style.clipPath = "inset(0 0 100% 0)";
      return;
    }

    const topInset = best.top - textRect.top;
    const leftInset = best.left - textRect.left;
    const rightInset = textRect.right - best.right;
    const bottomInset = textRect.bottom - best.bottom;

    mediaText.style.clipPath =
      `inset(${topInset}px ${rightInset}px ${bottomInset}px ${leftInset}px)`;
  }

  updateClip();
  window.addEventListener("scroll", updateClip, { passive: true });
  window.addEventListener("resize", updateClip);
});



document.addEventListener("DOMContentLoaded", () => {
  const item = document.querySelector(".menu-item.editorial");
  if (!item) return;

  const link = item.querySelector("a"); 
  const box = item.querySelector(".editorial-box");

  const place = () => {
    const r = link.getBoundingClientRect();

    // วางกล่องให้ "กึ่งกลางตรงกับคำ EDITORIAL" และชิดบน navbar
    const boxWidth = box.offsetWidth || 220;
    const left = r.left + (r.width / 2) - (boxWidth / 2);

    box.style.position = "fixed";
    box.style.top = `${r.top}px`;
    box.style.left = `${Math.max(12, left)}px`; // กันหลุดขอบซ้าย
  };

  item.addEventListener("mouseenter", place);
  window.addEventListener("resize", place);
  window.addEventListener("scroll", place, { passive: true });
});



document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".nav-toggle");
  const closeBtn = document.querySelector(".nav-close");
  const mobileMenu = document.querySelector(".mobile-menu");

  const editorial = document.querySelector(".mobile-editorial");
  const editorialBtn = document.querySelector(".mobile-editorial-btn");

  function openMenu() {
    document.body.classList.add("menu-open");
    toggle?.setAttribute("aria-expanded", "true");
    mobileMenu?.setAttribute("aria-hidden", "false");
  }

  function closeMenu() {
    document.body.classList.remove("menu-open");
    toggle?.setAttribute("aria-expanded", "false");
    mobileMenu?.setAttribute("aria-hidden", "true");

    // ปิด dropdown ด้วย
    editorial?.classList.remove("is-open");
    editorialBtn?.setAttribute("aria-expanded", "false");
  }

  toggle?.addEventListener("click", openMenu);
  closeBtn?.addEventListener("click", closeMenu);

  // กดพื้นที่ว่างเพื่อปิด (ถ้าต้องการ)
  mobileMenu?.addEventListener("click", (e) => {
    if (e.target === mobileMenu) closeMenu();
  });

  // ESC ปิด
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  // dropdown editorial
  editorialBtn?.addEventListener("click", () => {
    const isOpen = editorial.classList.toggle("is-open");
    editorialBtn.setAttribute("aria-expanded", String(isOpen));
  });
});


document.addEventListener("DOMContentLoaded", () => {
  const hero = document.querySelector(".collection-hero");
  const video = hero?.querySelector("video");
  if (!hero || !video) return;

  hero.addEventListener("mouseenter", async () => {
    try {
      video.currentTime = 0;
      await video.play();
    } catch (e) {
      // บางเครื่องอาจ block play แต่ส่วนใหญ่จะได้เพราะ muted
    }
  });

  hero.addEventListener("mouseleave", () => {
    video.pause();
    video.currentTime = 0; // กลับไปเฟรมแรก
  });
});



document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".faq-tab[data-tab]");
  const panels = document.querySelectorAll(".faq-panel");

  function setTab(name){
    tabs.forEach(t => {
      const active = t.dataset.tab === name;
      t.classList.toggle("is-active", active);
      t.setAttribute("aria-selected", String(active));
    });

    panels.forEach(p => {
      const show = p.dataset.panel === name;
      p.classList.toggle("is-active", show);
      p.hidden = !show;

      // เปิดข้อแรกของแต่ละแท็บให้เหมือนในรูป
      if (show) {
        const details = p.querySelectorAll("details");
        details.forEach((d, i) => d.open = (i === 0));
      }
    });
  }

  tabs.forEach(tab => {
    tab.addEventListener("click", () => setTab(tab.dataset.tab));
  });

  // default = shipping (เหมือนรูปที่ 2)
  setTab("shipping");
});