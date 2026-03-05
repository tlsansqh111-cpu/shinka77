// 드래그할 래퍼 요소 선택
const dragWrapper = document.getElementById("dragWrapper");

// 드래그 상태 및 좌표 변수
let isDragging = false;
let startY;
let currentTransform = -50; // 초기 CSS transform: translateY(-50%) 에 맞춤
let currentY = 0;

// 1. 마우스를 눌렀을 때 (드래그 시작)
dragWrapper.addEventListener("mousedown", (e) => {
  isDragging = true;
  // 클릭한 순간의 Y 좌표 저장
  startY = e.clientY;

  // 드래그 중 부드러운 움직임을 위해 transition 제거
  dragWrapper.style.transition = "none";
});

// 2. 마우스 버튼을 뗐을 때 (드래그 종료)
window.addEventListener("mouseup", () => {
  if (!isDragging) return;
  isDragging = false;

  // 드래그가 끝난 위치를 새로운 기준점으로 저장
  currentTransform = currentTransform + currentY;
  currentY = 0;

  // 다시 부드러운 효과 복구
  dragWrapper.style.transition = "transform 0.3s ease-out";
});

// 3. 마우스를 움직일 때 (드래그 진행 중)
window.addEventListener("mousemove", (e) => {
  if (!isDragging) return; // 드래그 상태가 아니면 무시

  // 브라우저 기본 드래그 동작 방지
  e.preventDefault();

  // 마우스가 이동한 거리 계산 (위아래)
  const moveY = e.clientY - startY;

  // 이동 속도 조절 (픽셀 단위를 % 단위 느낌으로 변환하여 부드럽게)
  currentY = moveY * 0.2;

  // 이동 범위를 제한하고 싶다면 아래 주석을 해제하고 값을 조정하세요.
  // const totalMove = currentTransform + currentY;
  // if (totalMove > 0) currentY = -currentTransform; // 너무 밑으로 안 내려가게
  // if (totalMove < -100) currentY = -100 - currentTransform; // 너무 위로 안 올라가게

  // 화면에 실시간으로 위치 적용
  dragWrapper.style.transform = `translateY(calc(${currentTransform}% + ${moveY}px))`;
});
