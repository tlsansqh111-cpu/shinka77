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
