// ==========================================
// 1. 헤더 스크롤 이벤트 (가로 -> 세로 원형 캡슐)
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
// 3. 포트폴리오 슬라이드 패널 로직
// ==========================================
const portfolioItems = document.querySelectorAll(".portfolio-grid .item");
const panelOverlay = document.querySelector(".panel-overlay");
const slidePanel = document.querySelector(".slide-panel");
const closeBtn = document.querySelector(".close-btn");
const panelTitle = document.querySelector(".panel-title");
const panelImg = document.querySelector(".panel-img");
const panelText = document.getElementById("panel-text");

// 각 카테고리별 설명 데이터
const portfolioDetails = {
  "WEB UX/UI":
    "사용자의 동선과 경험(UX)을 최우선으로 고려한 웹 인터페이스 설계입니다. 직관적인 네비게이션과 시각적 계층 구조를 통해 정보 전달력을 극대화했습니다.",
  "AI 역량":
    "AI 툴(Midjourney, ChatGPT 등)을 활용한 디자인 프로세스 개선 및 프롬프트 엔지니어링 역량을 보여주는 프로젝트로, 작업 효율을 획기적으로 높였습니다.",
  "제품 디자인":
    "사용자의 실생활에 스며드는 실용적이고 심미적인 제품 디자인입니다. 형태와 기능의 완벽한 조화를 이루는 데 집중했습니다.",
  "캐릭터 디자인":
    "캐릭터의 서사와 본질을 탐구하여 독창적인 성격을 부여했습니다. 입체적이고 독립적인 1%의 매력을 빚어내는 과정을 담았습니다.",
  "편집 디자인":
    "타이포그래피와 그리드 시스템을 정교하게 활용하여, 가독성과 심미성을 동시에 만족시키는 레이아웃 디자인 작업물입니다.",
};

function openPanel(titleText, imgSrc) {
  if (!slidePanel) return; // 패널 HTML이 없으면 에러 방지

  panelTitle.textContent = titleText;
  panelImg.src = imgSrc;

  if (portfolioDetails[titleText]) {
    panelText.textContent = portfolioDetails[titleText];
  } else {
    panelText.textContent = "상세 설명 업데이트 예정입니다.";
  }

  panelOverlay.classList.add("active");
  slidePanel.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closePanel() {
  if (panelOverlay) panelOverlay.classList.remove("active");
  if (slidePanel) slidePanel.classList.remove("active");
  document.body.style.overflow = "";
}

portfolioItems.forEach((item) => {
  item.addEventListener("click", () => {
    const title = item.querySelector(".item-text").textContent;
    const imgSrc = item.querySelector("img").src;
    openPanel(title, imgSrc);
  });
});

if (closeBtn) closeBtn.addEventListener("click", closePanel);
if (panelOverlay) panelOverlay.addEventListener("click", closePanel);

// ==========================================
// 4. 카드 스택 넘기기 (PC 마우스 & 모바일 터치 통합 완벽판)
// ==========================================
const stack = document.querySelector(".card-stack");
let startY = 0;
let currentCard = null;

if (stack) {
  // [1] PC 환경: 마우스 드래그 시작
  stack.addEventListener("mousedown", (e) => {
    e.preventDefault();
    currentCard = stack.querySelector(".card:first-child");
    startY = e.clientY;
    currentCard.style.transition = "none";
    document.onmousemove = drag;
    document.onmouseup = stopDrag;
  });

  // [2] 모바일 환경: 터치 드래그 시작
  stack.addEventListener(
    "touchstart",
    (e) => {
      currentCard = stack.querySelector(".card:first-child");
      startY = e.touches[0].clientY;
      currentCard.style.transition = "none";
    },
    { passive: true },
  );

  // 모바일: 터치로 움직일 때
  stack.addEventListener(
    "touchmove",
    (e) => {
      if (!currentCard) return;
      let move = e.touches[0].clientY - startY;

      if (move < 0) {
        if (e.cancelable) e.preventDefault(); // 스크롤 방지
        currentCard.style.transform = `translateY(${move}px) rotate(${move / 30}deg)`;
      }
    },
    { passive: false },
  );

  // 모바일: 터치 끝났을 때
  stack.addEventListener("touchend", (e) => {
    if (!currentCard) return;
    let move = e.changedTouches[0].clientY - startY;
    handleCardRelease(move);
  });
}

// [3] PC 환경 전용 보조 함수들 (마우스 이동 및 놓기)
function drag(e) {
  let move = e.clientY - startY;
  if (move < 0) {
    currentCard.style.transform = `translateY(${move}px) rotate(${move / 30}deg)`;
  }
}

function stopDrag(e) {
  let move = e.clientY - startY;
  handleCardRelease(move);
  document.onmousemove = null;
  document.onmouseup = null;
}

// [4] 공통 로직: 손(마우스)을 놓았을 때의 애니메이션 처리
function handleCardRelease(move) {
  // -80px 이상 위로 쓸어올리면 카드가 완전히 날아감
  if (move < -80) {
    currentCard.style.transition =
      "transform 0.4s ease-out, opacity 0.3s ease-out";
    currentCard.style.opacity = "0";
    currentCard.style.transform = `translateY(-300px) scale(0.8) rotate(-15deg)`;

    setTimeout(() => {
      stack.appendChild(currentCard);
      currentCard.style.transition = "none";
      currentCard.style.opacity = "";
      currentCard.style.transform = "";

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          currentCard.style.transition =
            "transform 0.3s ease-out, opacity 0.3s ease-out, top 0.3s, left 0.3s";
        });
      });
      currentCard = null;
    }, 350);
  } else {
    // 살짝만 올리다가 놓으면 제자리로 고무줄처럼 튕겨서 돌아옴
    currentCard.style.transition =
      "transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
    currentCard.style.transform = "";
    currentCard = null;
  }
}
