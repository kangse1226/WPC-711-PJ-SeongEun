// 헤더 스크롤 효과 및 모바일 메뉴
(function() {
  const header = document.getElementById('header');
  const mobileToggle = document.getElementById('mobileToggle');
  const headerNav = document.getElementById('headerNav');
  const headerOverlay = document.getElementById('headerOverlay');
  const navItems = document.querySelectorAll('.header__nav-item');

  // 스크롤 시 헤더 배경 변경
  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
  });

  // 모바일 메뉴 토글
  function toggleMobileMenu() {
    mobileToggle.classList.toggle('active');
    headerNav.classList.toggle('active');
    headerOverlay.classList.toggle('active');
    document.body.style.overflow = headerNav.classList.contains('active') ? 'hidden' : '';
  }

  // 모바일 메뉴 닫기
  function closeMobileMenu() {
    mobileToggle.classList.remove('active');
    headerNav.classList.remove('active');
    headerOverlay.classList.remove('active');
    document.body.style.overflow = '';
    
    // 모든 드롭다운 닫기
    navItems.forEach(item => {
      item.classList.remove('active');
    });
  }

  // 모바일 토글 버튼 클릭
  if (mobileToggle) {
    mobileToggle.addEventListener('click', toggleMobileMenu);
  }

  // 오버레이 클릭 시 메뉴 닫기
  if (headerOverlay) {
    headerOverlay.addEventListener('click', closeMobileMenu);
  }

  // 모바일 드롭다운 토글
  navItems.forEach(item => {
    const link = item.querySelector('.header__nav-link');
    const megaMenu = item.querySelector('.header__mega-menu');
    
    if (megaMenu) {
      link.addEventListener('click', (e) => {
        // 모바일에서만 드롭다운 토글
        if (window.innerWidth <= 768) {
          e.preventDefault();
          
          // 다른 아이템들 닫기
          navItems.forEach(otherItem => {
            if (otherItem !== item) {
              otherItem.classList.remove('active');
            }
          });
          
          // 현재 아이템 토글
          item.classList.toggle('active');
        }
      });
    }
  });

  // 윈도우 리사이즈 시 모바일 메뉴 초기화
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.innerWidth > 768) {
        closeMobileMenu();
      }
    }, 250);
  });

  // 메가 메뉴 내부 링크 클릭 시 모바일 메뉴 닫기
  const megaMenuLinks = document.querySelectorAll('.header__mega-menu-link a');
  megaMenuLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        setTimeout(closeMobileMenu, 300);
      }
    });
  });

  // 직접 링크(드롭다운 없는 메뉴) 클릭 시 모바일 메뉴 닫기
  navItems.forEach(item => {
    const link = item.querySelector('.header__nav-link');
    const hasMegaMenu = item.querySelector('.header__mega-menu');
    
    if (!hasMegaMenu) {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          setTimeout(closeMobileMenu, 300);
        }
      });
    }
  });
})();

// Hero Carousel (기존 코드 유지)
(function() {
  const carousel = document.getElementById('heroCarousel');
  if (!carousel) return;

  const slides = Array.from(carousel.querySelectorAll('.hero__slide:not(.hero__slide--clone)'));
  const dots = document.querySelectorAll('.hero__nav-dot');
  const prevArrow = document.getElementById('prevArrow');
  const nextArrow = document.getElementById('nextArrow');
  
  const totalSlides = slides.length;
  let currentSlide = 0;
  let autoPlayInterval;
  let isHovered = false;
  let isDragging = false;
  let startX = 0;
  let currentX = 0;
  let startTime = 0;
  let isTransitioning = false;

  // Clone first slide for infinite loop
  const firstClone = slides[0].cloneNode(true);
  firstClone.classList.add('hero__slide--clone');
  carousel.appendChild(firstClone);

  function updateCarousel(immediate = false) {
    const offset = -currentSlide * 100;
    if (immediate) {
      carousel.style.transition = 'none';
    } else {
      // ease-in-out으로 부드러운 전환
      carousel.style.transition = 'transform 1s ease-in-out';
    }
    carousel.style.transform = `translateX(${offset}%)`;
    
    dots.forEach((dot, index) => {
      dot.classList.toggle('hero__nav-dot--active', index === currentSlide % totalSlides);
    });
  }

  function goToSlide(index, immediate = false) {
    if (isTransitioning) return;
    isTransitioning = true;
    
    currentSlide = index;
    updateCarousel(immediate);
    
          setTimeout(() => {
      if (currentSlide === totalSlides) {
        currentSlide = 0;
        updateCarousel(true);
      } else if (currentSlide < 0) {
        currentSlide = totalSlides - 1;
        updateCarousel(true);
      }
      isTransitioning = false;
    }, immediate ? 0 : 1000); // 1초로 변경
  }

  function nextSlide() {
    if (!isHovered && !isDragging && !isTransitioning) {
      goToSlide(currentSlide + 1);
    }
  }

  function prevSlide() {
    if (!isTransitioning) {
      goToSlide(currentSlide - 1);
    }
  }

  function startAutoPlay() {
    autoPlayInterval = setInterval(nextSlide, 5000); // 5초로 변경 (더 여유있게)
  }

  function stopAutoPlay() {
    clearInterval(autoPlayInterval);
  }

  // Dot navigation
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      if (!isTransitioning) {
        goToSlide(index);
        stopAutoPlay();
        startAutoPlay();
      }
    });
  });

  // Arrow navigation
  if (prevArrow) {
    prevArrow.addEventListener('click', () => {
      prevSlide();
      stopAutoPlay();
      startAutoPlay();
    });
  }

  if (nextArrow) {
    nextArrow.addEventListener('click', () => {
      nextSlide();
      stopAutoPlay();
      startAutoPlay();
    });
  }

  // Hover pause
  carousel.addEventListener('mouseenter', () => {
    isHovered = true;
    stopAutoPlay();
  });

  carousel.addEventListener('mouseleave', () => {
    isHovered = false;
    if (!isDragging) startAutoPlay();
  });

  // Drag/Swipe functionality
  function handleStart(e) {
    if (isTransitioning) return;
    isDragging = true;
    startX = e.type === 'mousedown' ? e.pageX : e.touches[0].pageX;
    currentX = startX;
    startTime = Date.now();
    stopAutoPlay();
  }

  function handleMove(e) {
    if (!isDragging) return;
    e.preventDefault();
    currentX = e.type === 'mousemove' ? e.pageX : e.touches[0].pageX;
  }

  function handleEnd() {
    if (!isDragging) return;
    isDragging = false;
    
    const diff = currentX - startX;
    const timeDiff = Date.now() - startTime;
    const velocity = Math.abs(diff) / timeDiff;

    if (Math.abs(diff) > 50 || velocity > 0.5) {
      if (diff > 0) {
        prevSlide();
      } else {
        nextSlide();
      }
    }

    startAutoPlay();
  }

  carousel.addEventListener('mousedown', handleStart);
  document.addEventListener('mousemove', handleMove);
  document.addEventListener('mouseup', handleEnd);

  carousel.addEventListener('touchstart', handleStart, { passive: true });
  carousel.addEventListener('touchmove', handleMove, { passive: false });
  carousel.addEventListener('touchend', handleEnd);

  // Initialize
  goToSlide(0, true);
  startAutoPlay();
})();