// ==========================================
// 1. 헤더 & 다국어 로직 (동일 유지)
// ==========================================
const header = document.querySelector("header");
window.addEventListener("scroll", () => {
  if (window.scrollY > 150) header.classList.add("scrolled");
  else header.classList.remove("scrolled");
});

const langBtn = document.querySelector(".lang-btn");
const langMenu = document.querySelector(".lang-menu");
if (langBtn && langMenu) {
  langBtn.addEventListener("click", (e) => {
    e.preventDefault();
    langMenu.classList.toggle("active");
  });
  document.addEventListener("click", (e) => {
    if (!langBtn.contains(e.target) && !langMenu.contains(e.target))
      langMenu.classList.remove("active");
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
};
const langOptions = document.querySelectorAll(".lang-menu a");
const i18nElements = document.querySelectorAll("[data-i18n]");

function applyLanguage(lang) {
  i18nElements.forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (translations[lang] && translations[lang][key])
      el.textContent = translations[lang][key];
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
// 3. ✨ 드래그 & 클릭 충돌 방지 로직
// ==========================================
const slider = document.getElementById("projectContainer");
const galleryItems = document.querySelectorAll(".row img, .video-placeholder");
const panelOverlay = document.querySelector(".panel-overlay");
const slidePanel = document.getElementById("galleryPanel");
const closeBtn = document.querySelector(".close-btn");
const panelImg = document.querySelector(".panel-img");
const panelVideo = document.querySelector(".panel-video");

let isDown = false;
let isDragging = false;
let startX;
let scrollLeft;

// --- 드래그 엔진 ---
if (slider) {
  slider.addEventListener("mousedown", (e) => {
    isDown = true;
    isDragging = false; // 누를 땐 아직 클릭으로 간주!
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

    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 1.5;

    // 💡 손떨림 방지: 5px 이상 끌었을 때만 '드래그'로 인정!
    if (Math.abs(walk) > 5) {
      isDragging = true;
    }

    e.preventDefault();
    slider.scrollLeft = scrollLeft - walk;
  });
}

// --- 패널 열기/닫기 ---
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

// 개별 이미지/비디오 클릭 제어
galleryItems.forEach((item) => {
  item.addEventListener("click", (e) => {
    // 💡 5px 이상 드래그했다면 클릭을 씹고 무시함!
    if (isDragging) {
      e.preventDefault();
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
