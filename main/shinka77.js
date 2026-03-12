// ==========================================
// 3. 카드 스택 넘기기 (PC 마우스 & 모바일 터치 통합)
// ==========================================
// 변수 선언은 여기서 딱 한 번만!
const stack = document.querySelector(".card-stack");
let startY = 0;
let currentCard = null;

if (stack) {
  // ----------------------------------------
  // [1] PC 환경: 마우스 드래그 이벤트
  // ----------------------------------------
  stack.addEventListener("mousedown", (e) => {
    e.preventDefault();
    currentCard = stack.querySelector(".card:first-child");
    startY = e.clientY;
    // touchmove 이벤트 안쪽
    currentCard.style.transform = `translateY(${move}px) rotate(${move / 30}deg)`;
    // touchend 이벤트 안쪽 (-80px 이상 올렸을 때)
    currentCard.style.transform = `translateY(-300px) scale(0.8) rotate(-15deg)`;
    document.onmousemove = drag;
    document.onmouseup = stopDrag;
  });

  // ----------------------------------------
  // [2] 모바일 환경: 터치 드래그 이벤트
  // ----------------------------------------
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

      if (move < 0) {
        if (e.cancelable) e.preventDefault(); // 스크롤 방지
        currentCard.style.transform = `translateY(${move}px) rotate(${move / 30}deg)`;
      }
    },
    { passive: false },
  );

  stack.addEventListener("touchend", (e) => {
    if (!currentCard) return;
    let move = e.changedTouches[0].clientY - startY;

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
      currentCard.style.transition =
        "transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
      currentCard.style.transform = "";
      currentCard = null;
    }
  });
}

// ----------------------------------------
// [3] PC 환경 전용 보조 함수들
// ----------------------------------------
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
