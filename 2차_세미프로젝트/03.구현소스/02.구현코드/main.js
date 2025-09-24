let currentPage = 1;
let isTransitioning = false;
let touchStartX = 0;
let touchStartY = 0;
let touchStartTime = 0;
const isMobile = window.innerWidth <= 768;

const mainArea = document.querySelector(".main-area");
const topArea = document.querySelector(".top-area");
const pageDots = document.querySelectorAll(".page-dot");

// 모바일 터치 이벤트
if (isMobile) {
  // 터치 시작
  document.addEventListener(
    "touchstart",
    (e) => {
      if (isTransitioning) return;

      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      touchStartTime = Date.now();
    },
    { passive: true }
  );

  // 터치 이동 (기본 스크롤 방지)
  document.addEventListener(
    "touchmove",
    (e) => {
      e.preventDefault();
    },
    { passive: false }
  );

  // 터치 종료 (스와이프 감지)
  document.addEventListener(
    "touchend",
    (e) => {
      if (isTransitioning) return;

      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const touchDuration = Date.now() - touchStartTime;

      const touchDistanceX = Math.abs(touchEndX - touchStartX);
      const touchDistanceY = Math.abs(touchEndY - touchStartY);

      // 세로 스와이프가 가로 스와이프보다 클 때만 반응
      if (
        touchDistanceY > touchDistanceX &&
        touchDistanceY > 50 &&
        touchDuration < 400
      ) {
        if (touchStartY > touchEndY && currentPage === 1) {
          // 위로 스와이프 - 두 번째 페이지로
          goToPage(2);
        } else if (touchStartY < touchEndY && currentPage === 2) {
          // 아래로 스와이프 - 첫 번째 페이지로
          goToPage(1);
        }
      }
    },
    { passive: true }
  );
} else {
  // 데스크톱 휠 이벤트
  let wheelTimeout;
  window.addEventListener(
    "wheel",
    (e) => {
      if (isTransitioning) return;

      clearTimeout(wheelTimeout);
      wheelTimeout = setTimeout(() => {
        if (e.deltaY > 0 && currentPage === 1) {
          // 아래로 스크롤 - 두 번째 페이지로
          goToPage(2);
        } else if (e.deltaY < 0 && currentPage === 2) {
          // 위로 스크롤 - 첫 번째 페이지로
          goToPage(1);
        }
      }, 100);
    },
    { passive: true }
  );
}

// 페이지 전환 함수
function goToPage(page) {
  if (isTransitioning || currentPage === page) return;

  isTransitioning = true;
  currentPage = page;

  // 페이지 인디케이터 업데이트
  pageDots.forEach((dot, index) => {
    dot.classList.toggle("active", index + 1 === page);
  });

  if (page === 2) {
    mainArea.classList.add("page-2");
    topArea.classList.add("hidden");
  } else {
    mainArea.classList.remove("page-2");
    topArea.classList.remove("hidden");
  }

  // 전환 애니메이션 완료 후
  setTimeout(() => {
    isTransitioning = false;
  }, 400);
}

// 키보드 테스트용 (개발 시에만)
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp" && currentPage === 2) {
    goToPage(1);
  } else if (e.key === "ArrowDown" && currentPage === 1) {
    goToPage(2);
  }
});

// 윈도우 리사이즈 시 새로고침 (모바일/데스크톱 전환)
window.addEventListener("resize", () => {
  if (window.innerWidth <= 768 !== isMobile) {
    location.reload();
  }
});
