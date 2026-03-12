const slider = document.getElementById("projectContainer");
let isDown = false;
let startX;
let scrollLeft;

// 마우스 누를 때
slider.addEventListener("mousedown", (e) => {
  isDown = true;
  slider.style.cursor = "grabbing";
  // 클릭한 X 좌표 기록
  startX = e.pageX - slider.offsetLeft;
  // 현재 스크롤 위치 기록
  scrollLeft = slider.scrollLeft;
});

// 마우스가 영역을 벗어날 때
slider.addEventListener("mouseleave", () => {
  isDown = false;
  slider.style.cursor = "grab";
});

// 마우스를 뗄 때
slider.addEventListener("mouseup", () => {
  isDown = false;
  slider.style.cursor = "grab";
});

// 마우스를 움직일 때 (드래그)
slider.addEventListener("mousemove", (e) => {
  if (!isDown) return; // 클릭하지 않은 상태면 무시
  e.preventDefault();
  // 이동한 거리 계산
  const x = e.pageX - slider.offsetLeft;
  const walk = (x - startX) * 2; // 스크롤 속도 조절 (2배속)
  // 실제 스크롤 이동 적용
  slider.scrollLeft = scrollLeft - walk;
});
// ==========================================
// ✨ 갤러리 슬라이드 패널 로직 (드래그 vs 클릭 완벽 구분 + MP4 지원)
// ==========================================
const galleryMedia = document.querySelectorAll(".row img, .row video");
const panelOverlay = document.querySelector(".panel-overlay");
const slidePanel = document.querySelector(".slide-panel");
const closeBtn = document.querySelector(".close-btn");
const panelTitle = document.querySelector(".panel-title");
const panelImg = document.querySelector(".panel-img");
const panelVideo = document.querySelector(".panel-video");
const panelText = document.getElementById("panel-text");

// 패널 열기 함수
function openPanel(titleText, mediaSrc, mediaType) {
  if (!slidePanel) return; // HTML이 없으면 에러 방지

  panelTitle.textContent = titleText;
  panelText.textContent =
    titleText +
    " 프로젝트의 상세 설명입니다. 멋진 비하인드 스토리를 적어보세요!";

  // 미디어가 비디오(MP4)일 때
  if (mediaType === "VIDEO") {
    if (panelImg) panelImg.style.display = "none"; // 이미지 숨김
    if (panelVideo) {
      panelVideo.src = mediaSrc;
      panelVideo.style.display = "block"; // 비디오 켬
      panelVideo.play();
    }
  }
  // 미디어가 이미지(JPG, PNG 등)일 때
  else {
    if (panelVideo) {
      panelVideo.style.display = "none"; // 비디오 숨김
      panelVideo.pause();
    }
    if (panelImg) {
      panelImg.src = mediaSrc;
      panelImg.style.display = "block"; // 이미지 켬
    }
  }

  // 패널 화면에 등장
  panelOverlay.classList.add("active");
  slidePanel.classList.add("active");
  document.body.style.overflow = "hidden"; // 배경 스크롤 방지
}

// 패널 닫기 함수
function closePanel() {
  if (panelOverlay) panelOverlay.classList.remove("active");
  if (slidePanel) slidePanel.classList.remove("active");
  document.body.style.overflow = "";
  if (panelVideo) panelVideo.pause(); // 닫을 때 영상 정지
}

// 마우스(터치) 시작 좌표를 저장할 변수
let clickStartX = 0;
let clickStartY = 0;

galleryMedia.forEach((media) => {
  // 드래그 시 고스트 이미지 생기는 것 방지
  media.addEventListener("dragstart", (e) => e.preventDefault());

  // 1. 마우스를 누르는 순간의 좌표 기억!
  media.addEventListener("mousedown", (e) => {
    clickStartX = e.clientX;
    clickStartY = e.clientY;
  });

  // 2. 마우스를 뗄 때(클릭) 좌표 비교
  media.addEventListener("click", (e) => {
    // 누른 곳과 뗀 곳의 거리 차이 계산
    const diffX = Math.abs(e.clientX - clickStartX);
    const diffY = Math.abs(e.clientY - clickStartY);

    // ✨ 핵심: 마우스가 5픽셀 이상 미끄러졌으면 '드래그'로 간주하고 무시!
    if (diffX > 5 || diffY > 5) {
      return;
    }

    // 진짜 클릭일 때만 아래 코드 실행
    const mediaType = media.tagName;
    const title = media.getAttribute("alt") || "Gallery Project";

    let mediaSrc = media.src;
    if (!mediaSrc && mediaType === "VIDEO") {
      const sourceTag = media.querySelector("source");
      if (sourceTag) mediaSrc = sourceTag.src;
    }

    openPanel(title, mediaSrc, mediaType);
  });
});

// X 버튼이나 어두운 배경 누르면 닫기
if (closeBtn) closeBtn.addEventListener("click", closePanel);
if (panelOverlay) panelOverlay.addEventListener("click", closePanel);
// ==========================================
// 1. 헤더 스크롤 이벤트 (갤러리 페이지)
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
// 2. 다국어 드롭다운 및 번역 로직 (갤러리 페이지)
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

// 번역 데이터 (메인과 동일)
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
