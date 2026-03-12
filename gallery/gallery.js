document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // 0. 브라우저 기본 이미지 드래그 원천 차단 (PC 슬라이드 먹통의 주범!)
  // ==========================================
  const allImages = document.querySelectorAll("img");
  allImages.forEach((img) => {
    img.addEventListener("dragstart", (e) => e.preventDefault());
  });

  // ==========================================
  // 1. 헤더 스크롤 이벤트
  // ==========================================
  const header = document.querySelector("header");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 150) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });

  // ==========================================
  // 2. 다국어 드롭다운 및 번역 로직
  // ==========================================
  const langBtn = document.querySelector(".lang-btn");
  const langMenu = document.querySelector(".lang-menu");

  if (langBtn && langMenu) {
    langBtn.addEventListener("click", (e) => {
      e.preventDefault();
      langMenu.classList.toggle("active");
    });
    document.addEventListener("click", (e) => {
      if (!langBtn.contains(e.target) && !langMenu.contains(e.target)) {
        langMenu.classList.remove("active");
      }
    });
  }

  const translations = {
    en: {
      home: "Home",
      about: "about",
      gallery: "Gallery",
      portfolio: "PolitPolio",
      language: "Language",
    },
    ko: {
      home: "홈",
      about: "소개",
      gallery: "갤러리",
      portfolio: "포트폴리오",
      language: "언어",
    },
    ja: {
      home: "ホーム",
      about: "紹介",
      gallery: "ギャラリー",
      portfolio: "ポートフォリオ",
      language: "言語",
    },
    zh: {
      home: "首页",
      about: "关于",
      gallery: "画廊",
      portfolio: "作品集",
      language: "语言",
    },
  };

  const langOptions = document.querySelectorAll(".lang-menu a");
  const i18nElements = document.querySelectorAll("[data-i18n]");

  function applyLanguage(lang) {
    i18nElements.forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (translations[lang] && translations[lang][key]) {
        el.textContent = translations[lang][key];
      }
    });
  }
  const savedLang = localStorage.getItem("selectedLang") || "en";
  applyLanguage(savedLang);

  langOptions.forEach((option) => {
    option.addEventListener("click", (e) => {
      e.preventDefault();
      const selectedLang = e.currentTarget.getAttribute("data-lang");
      localStorage.setItem("selectedLang", selectedLang);
      applyLanguage(selectedLang);
      if (langMenu) langMenu.classList.remove("active");
    });
  });

  // ==========================================
  // 3. 갤러리 다이렉트 드래그 & 팝업 패널 로직
  // ==========================================
  const slider = document.getElementById("projectContainer");
  const galleryItems = document.querySelectorAll(
    ".row img, .video-placeholder",
  );
  const panelOverlay = document.querySelector(".panel-overlay");
  const slidePanel = document.getElementById("galleryPanel");
  const closeBtn = document.querySelector(".close-btn");
  const panelImg = document.querySelector(".panel-img");
  const panelVideo = document.querySelector(".panel-video");

  let isDown = false;
  let isDragging = false;
  let startX;
  let scrollLeft;

  if (slider) {
    slider.addEventListener("mousedown", (e) => {
      isDown = true;
      isDragging = false;
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    });

    slider.addEventListener("mouseleave", () => {
      isDown = false;
      isDragging = false;
    });

    slider.addEventListener("mouseup", () => {
      isDown = false;
      // ✨ 핵심 수정: 마우스를 뗐을 때 클릭 이벤트가 먼저 실행될 수 있도록 0.05초(50ms) 기다려줌
      setTimeout(() => {
        isDragging = false;
      }, 50);
    });

    slider.addEventListener("mousemove", (e) => {
      if (!isDown) return;

      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 1.5;

      // 5px 이상 움직이면 드래그로 판정
      if (Math.abs(walk) > 5) {
        isDragging = true;
      }

      if (isDragging) {
        e.preventDefault();
        slider.scrollLeft = scrollLeft - walk;
      }
    });
  }

  // --- 패널 열기 엔진 (CSS 무시하고 무조건 강제로 띄움) ---
  function openGalleryPanel(src, isVideoItem) {
    if (!slidePanel) return;

    if (isVideoItem) {
      if (panelVideo) {
        panelVideo.src = src;
        panelVideo.style.display = "block"; // 무조건 보이게 강제 적용
      }
      if (panelImg) panelImg.style.display = "none";
    } else {
      if (panelImg) {
        panelImg.src = src;
        panelImg.style.display = "block"; // 무조건 보이게 강제 적용
      }
      if (panelVideo) panelVideo.style.display = "none";
    }

    if (panelOverlay) panelOverlay.classList.add("active");
    slidePanel.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeGalleryPanel() {
    if (panelOverlay) panelOverlay.classList.remove("active");
    if (slidePanel) slidePanel.classList.remove("active");
    document.body.style.overflow = "";

    if (panelVideo) {
      panelVideo.pause();
      panelVideo.src = "";
    }
  }

  galleryItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      if (isDragging) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      const isVideoItem = item.classList.contains("video-placeholder");
      let src = "";

      if (isVideoItem) {
        const sourceEl = item.querySelector("source");
        const videoEl = item.querySelector("video");
        src = sourceEl ? sourceEl.src : videoEl ? videoEl.src : "";
      } else {
        src = item.src;
      }

      openGalleryPanel(src, isVideoItem);
    });
  });

  if (closeBtn) closeBtn.addEventListener("click", closeGalleryPanel);
  if (panelOverlay) panelOverlay.addEventListener("click", closeGalleryPanel);
});
