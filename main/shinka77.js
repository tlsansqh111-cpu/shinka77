// ==========================================
// 1. 헤더 스크롤 이벤트 (가로 -> 세로 원형)
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
// 3. 카드 스택 넘기기 애니메이션 로직
// ==========================================
const stack = document.querySelector(".card-stack");
let startY = 0;
let currentCard = null;

if (stack) {
  stack.addEventListener("mousedown", (e) => {
    e.preventDefault();
    currentCard = stack.querySelector(".card:first-child");
    startY = e.clientY;
    currentCard.style.transition = "none";
    document.onmousemove = drag;
    document.onmouseup = stopDrag;
  });
}

function drag(e) {
  let move = e.clientY - startY;
  if (move < 0) {
    currentCard.style.transform = `translateY(${move}px)`;
  }
}

function stopDrag(e) {
  let move = e.clientY - startY;

  if (move < -100) {
    currentCard.style.transition =
      "transform 0.3s ease-out, opacity 0.3s ease-out";
    currentCard.style.opacity = "0";
    currentCard.style.transform = "translateY(-300px)";

    setTimeout(() => {
      currentCard.style.transition = "none";
      currentCard.style.opacity = "";
      currentCard.style.transform = "";
      stack.appendChild(currentCard);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          currentCard.style.transition =
            "transform 0.3s ease-out, opacity 0.3s ease-out, top 0.3s, left 0.3s";
        });
      });
    }, 300);
  } else {
    currentCard.style.transition = "transform 0.3s ease-out";
    currentCard.style.transform = "";
  }

  document.onmousemove = null;
  document.onmouseup = null;
}

// ==========================================
// 📱 모바일 터치 드래그 이벤트 (카드 날리기)
// ==========================================
if (stack) {
  stack.addEventListener(
    "touchstart",
    (e) => {
      currentCard = stack.querySelector(".card:first-child");
      startY = e.touches[0].clientY;
      currentCard.style.transition = "none";
    },
    { passive: true },
  );

  stack.addEventListener(
    "touchmove",
    (e) => {
      if (!currentCard) return;
      let move = e.touches[0].clientY - startY;
      // 위로 밀어 올릴 때만 반응
      if (move < 0) {
        currentCard.style.transform = `translateY(${move}px)`;
      }
    },
    { passive: true },
  );

  stack.addEventListener("touchend", (e) => {
    if (!currentCard) return;
    let move = e.changedTouches[0].clientY - startY;

    // 위로 100px 이상 쓸어 올렸을 때 다음 카드로 넘김
    if (move < -100) {
      currentCard.style.transition =
        "transform 0.3s ease-out, opacity 0.3s ease-out";
      currentCard.style.opacity = "0";
      currentCard.style.transform = "translateY(-300px)";

      setTimeout(() => {
        currentCard.style.transition = "none";
        currentCard.style.opacity = "";
        currentCard.style.transform = "";
        stack.appendChild(currentCard);

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            currentCard.style.transition =
              "transform 0.3s ease-out, opacity 0.3s ease-out, top 0.3s, left 0.3s";
          });
        });
      }, 300);
    } else {
      // 덜 올렸으면 원상복구
      currentCard.style.transition = "transform 0.3s ease-out";
      currentCard.style.transform = "";
    }
    currentCard = null; // 터치 종료 후 초기화
  });
}
