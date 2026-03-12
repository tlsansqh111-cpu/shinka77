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
const galleryItems = document.querySelectorAll(".row img, .row video");
const panelOverlay = document.querySelector(".panel-overlay");
const slidePanel = document.getElementById("galleryPanel");
const closeBtn = document.querySelector(".close-btn");
const panelImg = document.querySelector(".panel-img");
const panelVideo = document.querySelector(".panel-video");

let isDown = false;
let isDragging = false;
let startX;
let scrollLeft;

// --- 다이렉트 드래그 엔진 (PC 마우스 전용, 모바일은 CSS로 부드럽게 자동 스크롤) ---
if (slider) {
  slider.addEventListener("mousedown", (e) => {
    isDown = true;
    isDragging = false;
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
  });

  slider.addEventListener("mouseleave", () => {
    isDown = false;
  });

  slider.addEventListener("mouseup", () => {
    isDown = false;
  });

  slider.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    isDragging = true;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 1.5;
    slider.scrollLeft = scrollLeft - walk;
  });
}

// --- 우측 팝업 패널 열기/닫기 기능 ---
function openGalleryPanel(src, isVideoItem) {
  if (!slidePanel) return;

  if (isVideoItem) {
    panelVideo.src = src;
    panelVideo.classList.add("active");
    panelImg.classList.remove("active");
  } else {
    panelImg.src = src;
    panelImg.classList.add("active");
    panelVideo.classList.remove("active");
  }

  panelOverlay.classList.add("active");
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

// 개별 이미지/비디오를 클릭했을 때
galleryItems.forEach((item) => {
  item.addEventListener("click", (e) => {
    // 마우스를 끌고 있는 중이었다면 패널이 열리지 않도록 차단
    if (isDragging) {
      e.preventDefault();
      return;
    }

    const isVideoItem = item.tagName.toLowerCase() === "video";
    let src = "";

    if (isVideoItem) {
      const source = item.querySelector("source");
      src = source ? source.src : item.src;
    } else {
      src = item.src;
    }

    openGalleryPanel(src, isVideoItem);
  });
});

if (closeBtn) closeBtn.addEventListener("click", closeGalleryPanel);
if (panelOverlay) panelOverlay.addEventListener("click", closeGalleryPanel);
