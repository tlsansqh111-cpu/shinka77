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
// 3. 갤러리 하단 커스텀 터치 바 & 팝업 패널 로직
// ==========================================
const slider = document.getElementById("projectContainer");
const scrollTrack = document.querySelector(".custom-scrollbar-track");
const scrollThumb = document.querySelector(".custom-scrollbar-thumb");
const galleryItems = document.querySelectorAll(".row img, .row video");
const panelOverlay = document.querySelector(".panel-overlay");
const slidePanel = document.getElementById("galleryPanel");
const closeBtn = document.querySelector(".close-btn");
const panelImg = document.querySelector(".panel-img");
const panelVideo = document.querySelector(".panel-video");

let isDraggingThumb = false;
let startX;
let startScrollLeft;

// --- 커스텀 스크롤 막대 드래그 엔진 ---
if (scrollThumb && slider && scrollTrack) {
  // 마우스 클릭 시
  scrollThumb.addEventListener("mousedown", (e) => {
    isDraggingThumb = true;
    startX = e.clientX;
    startScrollLeft = slider.scrollLeft;
    document.body.style.userSelect = "none";
  });

  // 모바일 터치 시
  scrollThumb.addEventListener(
    "touchstart",
    (e) => {
      isDraggingThumb = true;
      startX = e.touches[0].clientX;
      startScrollLeft = slider.scrollLeft;
    },
    { passive: true },
  );

  // 이동 처리
  const handleMove = (e) => {
    if (!isDraggingThumb) return;
    e.preventDefault();

    const clientX = e.type.includes("mouse") ? e.clientX : e.touches[0].clientX;
    const walk = clientX - startX;

    const trackWidth = scrollTrack.clientWidth - scrollThumb.clientWidth;
    const scrollableWidth = slider.scrollWidth - slider.clientWidth;

    const walkPercentage = walk / trackWidth;
    slider.scrollLeft = startScrollLeft + walkPercentage * scrollableWidth;
  };

  document.addEventListener("mousemove", handleMove);
  document.addEventListener("touchmove", handleMove, { passive: false });

  // 드래그 종료
  const handleUp = () => {
    isDraggingThumb = false;
    document.body.style.userSelect = "";
  };

  document.addEventListener("mouseup", handleUp);
  document.addEventListener("touchend", handleUp);

  // 스크롤 위치에 맞춰 막대기 위치 동기화
  const updateThumbPosition = () => {
    const scrollPercentage =
      slider.scrollLeft / (slider.scrollWidth - slider.clientWidth);
    const maxThumbLeft = scrollTrack.clientWidth - scrollThumb.clientWidth;
    scrollThumb.style.transform = `translateX(${scrollPercentage * maxThumbLeft}px)`;
  };

  slider.addEventListener("scroll", updateThumbPosition);
  window.addEventListener("resize", updateThumbPosition);
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

// 개별 이미지/비디오 클릭 이벤트
galleryItems.forEach((item) => {
  item.addEventListener("click", () => {
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
