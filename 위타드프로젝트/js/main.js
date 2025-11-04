// main.js
    // Hero Carousel with Infinite Loop + Drag/Swipe + Scroll Header
    (function() {
      const carousel = document.getElementById('heroCarousel');
      const slides = Array.from(carousel.querySelectorAll('.hero__slide:not(.hero__slide--clone)'));
      const dots = document.querySelectorAll('.hero__nav-dot');
      const prevArrow = document.getElementById('prevArrow');
      const nextArrow = document.getElementById('nextArrow');
      const header = document.getElementById('header');
      
      const totalSlides = slides.length; // 3 slides
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
          carousel.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        }
        carousel.style.transform = `translateX(${offset}%)`;
        
        // Update dots
        dots.forEach((dot, index) => {
          dot.classList.toggle('hero__nav-dot--active', index === currentSlide % totalSlides);
        });
      }

      function goToSlide(index, immediate = false) {
        if (isTransitioning) return;
        isTransitioning = true;
        
        currentSlide = index;
        updateCarousel(immediate);
        
        // Handle infinite loop
        setTimeout(() => {
          if (currentSlide === totalSlides) {
            currentSlide = 0;
            updateCarousel(true);
          } else if (currentSlide < 0) {
            currentSlide = totalSlides - 1;
            updateCarousel(true);
          }
          isTransitioning = false;
        }, immediate ? 0 : 600);
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
        autoPlayInterval = setInterval(nextSlide, 6000);
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

      // Initialize
      goToSlide(0, true);
      startAutoPlay();
    })();