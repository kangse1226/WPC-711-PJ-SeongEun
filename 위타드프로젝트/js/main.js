// main.js
   // Hero Carousel with Drag/Swipe + Scroll Header
    (function() {
      const carousel = document.getElementById('heroCarousel');
      const slides = carousel.querySelectorAll('.hero__slide');
      const dots = document.querySelectorAll('.hero__nav-dot');
      const prevArrow = document.getElementById('prevArrow');
      const nextArrow = document.getElementById('nextArrow');
      const header = document.getElementById('header');
      
      let currentSlide = 0;
      let autoPlayInterval;
      let isHovered = false;
      let isDragging = false;
      let startX = 0;
      let currentX = 0;
      let startTime = 0;

      function updateCarousel() {
        carousel.style.transform = `translateX(-${currentSlide * 100}%)`;
        dots.forEach((dot, index) => {
          dot.classList.toggle('hero__nav-dot--active', index === currentSlide);
        });
      }

      function goToSlide(index) {
        currentSlide = (index + slides.length) % slides.length;
        updateCarousel();
      }

      function nextSlide() {
        if (!isHovered && !isDragging) {
          goToSlide(currentSlide + 1);
        }
      }

      function prevSlide() {
        goToSlide(currentSlide - 1);
      }

      function startAutoPlay() {
        autoPlayInterval = setInterval(nextSlide, 6000);
      }

      function stopAutoPlay() {
        clearInterval(autoPlayInterval);
      }

      // Dot navigation
      dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
          goToSlide(index);
          stopAutoPlay();
          startAutoPlay();
        });
      });

      // Arrow navigation
      prevArrow.addEventListener('click', () => {
        prevSlide();
        stopAutoPlay();
        startAutoPlay();
      });

      nextArrow.addEventListener('click', () => {
        nextSlide();
        stopAutoPlay();
        startAutoPlay();
      });

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

        // Threshold: 50px or fast swipe
        if (Math.abs(diff) > 50 || velocity > 0.5) {
          if (diff > 0) {
            prevSlide();
          } else {
            nextSlide();
          }
        }

        startAutoPlay();
      }

      // Mouse events
      carousel.addEventListener('mousedown', handleStart);
      document.addEventListener('mousemove', handleMove);
      document.addEventListener('mouseup', handleEnd);

      // Touch events
      carousel.addEventListener('touchstart', handleStart, { passive: true });
      carousel.addEventListener('touchmove', handleMove, { passive: false });
      carousel.addEventListener('touchend', handleEnd);

      // Scroll header background
      window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
          header.classList.add('header--scrolled');
        } else {
          header.classList.remove('header--scrolled');
        }
      });

      // Start carousel
      startAutoPlay();
    })();