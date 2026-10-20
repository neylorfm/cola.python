/**
 * CJOVEM - Prof Neylor FM | Modern Python Infographics Carousel
 * High-performance Touch Pinch-to-Zoom & Navigation Engine
 */

(function () {
  'use strict';

  // Infographics Dataset
  const SLIDES_DATA = [
    {
      id: 1,
      file: 'imgs/1.jpg',
      title: 'Input, Cast e Type em Python',
      subtitle: 'Lendo dados do usuário e convertendo tipos de dados com facilidade',
      tags: ['input()', 'cast int()', 'cast float()', 'type()']
    },
    {
      id: 2,
      file: 'imgs/2.jpg',
      title: 'Operadores de Atribuição Composta',
      subtitle: 'Mais praticidade e elegância no código: +=, -=, *=, /= e %=',
      tags: ['+= adição', '-= subtração', '*= multiplicação', '/= divisão', '%= módulo']
    },
    {
      id: 3,
      file: 'imgs/3.jpg',
      title: 'Comandos Condicionais',
      subtitle: 'Estruturas de decisão: if, if-else, if-elif-else e condicionais aninhadas',
      tags: ['if simples', 'if-else', 'if-elif-else', 'nested if']
    },
    {
      id: 4,
      file: 'imgs/4.jpg',
      title: 'Python range() com step',
      subtitle: 'Gerando sequências numéricas customizadas com passos positivo e negativo',
      tags: ['range(start, stop, step)', 'passo positivo', 'passo negativo']
    },
    {
      id: 5,
      file: 'imgs/5.jpg',
      title: 'Laço FOR em Python',
      subtitle: 'Estrutura de repetição definida com range() e controle com continue',
      tags: ['for loop', 'range()', 'continue', 'iteração']
    },
    {
      id: 6,
      file: 'imgs/6.jpg',
      title: 'Laço FOR com BREAK',
      subtitle: 'Interrompendo a repetição imediatamente assim que o objetivo for alcançado',
      tags: ['for loop', 'break', 'interrupção de fluxo']
    },
    {
      id: 7,
      file: 'imgs/7.jpg',
      title: 'Python WHILE Loop',
      subtitle: 'Repetição baseada em condição, controle de variáveis e incremento',
      tags: ['while loop', 'inicialização', 'incremento', 'continue']
    },
    {
      id: 8,
      file: 'imgs/8.jpg',
      title: 'Python WHILE com BREAK',
      subtitle: 'Como interromper loops indefinidos usando a instrução break',
      tags: ['while loop', 'break', 'parada de emergência']
    }
  ];

  // DOM Elements
  const carouselTrack = document.getElementById('carouselTrack');
  const carouselViewport = document.getElementById('carouselViewport');
  const thumbnailTrack = document.getElementById('thumbnailTrack');
  const slideProgressBar = document.getElementById('slideProgressBar');
  const autoplayTimerBar = document.getElementById('autoplayTimerBar');
  
  const slideCurrentPill = document.getElementById('slideCurrentPill');
  const activeSlideTitle = document.getElementById('activeSlideTitle');
  const activeSlideTags = document.getElementById('activeSlideTags');
  const headerSubtitle = document.getElementById('headerSubtitle');

  const btnPrev = document.getElementById('btnPrev');
  const btnNext = document.getElementById('btnNext');

  // Zoom HUD
  const zoomHud = document.getElementById('zoomHud');
  const btnZoomIn = document.getElementById('btnZoomIn');
  const btnZoomOut = document.getElementById('btnZoomOut');
  const btnZoomScale = document.getElementById('btnZoomScale');
  const zoomLevelText = document.getElementById('zoomLevelText');
  const btnResetZoom = document.getElementById('btnResetZoom');
  const btnDownloadImage = document.getElementById('btnDownloadImage');

  // Actions
  const btnGrid = document.getElementById('btnGrid');
  const btnAutoplay = document.getElementById('btnAutoplay');
  const autoplayText = document.getElementById('autoplayText');
  const playIcon = document.querySelector('.play-icon');
  const pauseIcon = document.querySelector('.pause-icon');
  const btnHelp = document.getElementById('btnHelp');
  const btnFullscreen = document.getElementById('btnFullscreen');
  const fsEnterIcon = document.querySelector('.fs-enter');
  const fsExitIcon = document.querySelector('.fs-exit');

  // Modals
  const gridModal = document.getElementById('gridModal');
  const btnCloseGrid = document.getElementById('btnCloseGrid');
  const modalGridContent = document.getElementById('modalGridContent');

  const helpModal = document.getElementById('helpModal');
  const btnCloseHelp = document.getElementById('btnCloseHelp');

  // Gesture Toast
  const gestureHintToast = document.getElementById('gestureHintToast');
  const btnCloseHint = document.getElementById('btnCloseHint');

  // State
  let currentIndex = 0;
  const totalSlides = SLIDES_DATA.length;

  // Zoom & Pan State for current active slide
  const zoomState = {
    scale: 1,
    minScale: 1,
    maxScale: 5,
    panX: 0,
    panY: 0,
    animating: false
  };

  // Autoplay State
  let isAutoplay = false;
  let autoplayInterval = null;
  const AUTOPLAY_SLIDE_DURATION = 7000; // 7 seconds per slide
  let autoplayStartTime = 0;
  let autoplayRaf = null;

  // Touch & Gesture Tracking
  const touchState = {
    isPinching: false,
    initialPinchDist: 0,
    startScale: 1,
    startPanX: 0,
    startPanY: 0,
    pinchCenterX: 0,
    pinchCenterY: 0,
    // Single touch pan / swipe
    isDragging: false,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    lastTouchTime: 0,
    lastTouchPos: { x: 0, y: 0 }
  };

  // Mouse drag tracking (Desktop)
  const mouseState = {
    isMouseDown: false,
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
    hasMoved: false
  };

  /**
   * Helper: Clamp number
   */
  function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
  }

  /**
   * Initialize Carousel DOM
   */
  function initCarousel() {
    carouselTrack.innerHTML = '';
    thumbnailTrack.innerHTML = '';
    modalGridContent.innerHTML = '';

    SLIDES_DATA.forEach((slide, idx) => {
      // 1. Create Slide Element
      const slideEl = document.createElement('div');
      slideEl.className = `carousel-slide ${idx === 0 ? 'active' : (idx === 1 ? 'next-slide' : '')}`;
      slideEl.setAttribute('data-index', idx);
      slideEl.setAttribute('role', 'group');
      slideEl.setAttribute('aria-roledescription', 'slide');
      slideEl.setAttribute('aria-label', `${idx + 1} de ${totalSlides}: ${slide.title}`);

      slideEl.innerHTML = `
        <div class="zoom-container" id="zoomContainer-${idx}">
          <img src="${slide.file}" 
               alt="${slide.title} - ${slide.subtitle}" 
               class="infographic-img" 
               id="slideImg-${idx}" 
               draggable="false" 
               loading="${idx < 2 ? 'eager' : 'lazy'}">
        </div>
      `;
      carouselTrack.appendChild(slideEl);

      // 2. Create Bottom Thumbnail
      const thumbBtn = document.createElement('button');
      thumbBtn.type = 'button';
      thumbBtn.className = `thumb-item ${idx === 0 ? 'active' : ''}`;
      thumbBtn.setAttribute('data-index', idx);
      thumbBtn.setAttribute('title', `${idx + 1}. ${slide.title}`);
      thumbBtn.setAttribute('aria-label', `Ir para slide ${idx + 1}`);

      thumbBtn.innerHTML = `
        <img src="${slide.file}" alt="${slide.title}" class="thumb-img" loading="lazy">
        <span class="thumb-badge">${idx + 1}</span>
      `;
      thumbBtn.addEventListener('click', () => goToSlide(idx));
      thumbnailTrack.appendChild(thumbBtn);

      // 3. Create Grid Modal Card
      const gridCard = document.createElement('div');
      gridCard.className = `grid-card ${idx === 0 ? 'current' : ''}`;
      gridCard.setAttribute('data-index', idx);
      gridCard.innerHTML = `
        <div class="grid-card-thumb-wrap">
          <img src="${slide.file}" alt="${slide.title}" class="grid-card-thumb" loading="lazy">
          <span class="grid-card-num">#${idx + 1}</span>
        </div>
        <div class="grid-card-info">
          <h4 class="grid-card-title">${slide.title}</h4>
          <p class="grid-card-subtitle">${slide.subtitle}</p>
        </div>
      `;
      gridCard.addEventListener('click', () => {
        goToSlide(idx);
        closeGridModal();
      });
      modalGridContent.appendChild(gridCard);
    });

    updateSlideMeta();
    bindZoomAndTouchEvents();
  }

  /**
   * Update Metadata UI (Header, tags, counter, download link)
   */
  function updateSlideMeta() {
    const cur = SLIDES_DATA[currentIndex];
    
    // Slide Counter
    slideCurrentPill.textContent = `${String(currentIndex + 1).padStart(2, '0')} / ${String(totalSlides).padStart(2, '0')}`;
    activeSlideTitle.textContent = cur.title;
    headerSubtitle.textContent = cur.subtitle;

    // Tags
    activeSlideTags.innerHTML = cur.tags.map(t => `<span class="tag">${t}</span>`).join('');

    // Global Progress Bar
    const progressPercent = ((currentIndex + 1) / totalSlides) * 100;
    slideProgressBar.style.width = `${progressPercent}%`;

    // Download / Open Full Resolution Link
    btnDownloadImage.href = cur.file;
    btnDownloadImage.setAttribute('download', `CJOVEM_Python_${cur.id}_${cur.title.replace(/\s+/g, '_')}.jpg`);

    // Thumbnails active state & auto-scroll into view
    const thumbs = thumbnailTrack.querySelectorAll('.thumb-item');
    thumbs.forEach((th, i) => {
      if (i === currentIndex) {
        th.classList.add('active');
        th.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      } else {
        th.classList.remove('active');
      }
    });

    // Grid modal active card
    const gridCards = modalGridContent.querySelectorAll('.grid-card');
    gridCards.forEach((card, i) => {
      card.classList.toggle('current', i === currentIndex);
    });
  }

  /**
   * Get Active Image Element
   */
  function getActiveImg() {
    return document.getElementById(`slideImg-${currentIndex}`);
  }

  /**
   * Get Active Zoom Container Element
   */
  function getActiveContainer() {
    return document.getElementById(`zoomContainer-${currentIndex}`);
  }

  /**
   * Apply Scale and Pan to active slide image
   */
  function applyTransform(animate = false) {
    const img = getActiveImg();
    if (!img) return;

    if (animate) {
      img.classList.add('animating');
      setTimeout(() => img.classList.remove('animating'), 320);
    } else {
      img.classList.remove('animating');
    }

    // Apply 3D transform for hardware acceleration
    img.style.transform = `translate3d(${zoomState.panX}px, ${zoomState.panY}px, 0) scale(${zoomState.scale})`;

    // Update HUD display
    const scalePercent = Math.round(zoomState.scale * 100);
    zoomLevelText.textContent = `${scalePercent}%`;

    // Toggle container cursor
    const container = getActiveContainer();
    if (container) {
      container.classList.toggle('zoomed', zoomState.scale > 1.05);
    }
  }

  /**
   * Calculate pan boundaries to keep image reasonably in view
   */
  function clampPanOffsets() {
    const img = getActiveImg();
    const container = getActiveContainer();
    if (!img || !container || zoomState.scale <= 1) {
      zoomState.panX = 0;
      zoomState.panY = 0;
      return;
    }

    const cRect = container.getBoundingClientRect();
    const iRect = img.getBoundingClientRect();

    // Natural scaled bounds
    const maxPanX = Math.max(0, (cRect.width * (zoomState.scale - 1)) / 2 + 60);
    const maxPanY = Math.max(0, (cRect.height * (zoomState.scale - 1)) / 2 + 60);

    zoomState.panX = clamp(zoomState.panX, -maxPanX, maxPanX);
    zoomState.panY = clamp(zoomState.panY, -maxPanY, maxPanY);
  }

  /**
   * Reset Zoom to 1x
   */
  function resetZoom(animate = true) {
    zoomState.scale = 1;
    zoomState.panX = 0;
    zoomState.panY = 0;
    applyTransform(animate);
  }

  /**
   * Set specific zoom scale, optionally centered at a point
   */
  function setZoom(newScale, focalX = null, focalY = null, animate = true) {
    const oldScale = zoomState.scale;
    const clampedScale = clamp(newScale, zoomState.minScale, zoomState.maxScale);

    if (clampedScale === 1) {
      resetZoom(animate);
      return;
    }

    const container = getActiveContainer();
    if (container && focalX !== null && focalY !== null) {
      const cRect = container.getBoundingClientRect();
      const originX = focalX - cRect.left - cRect.width / 2;
      const originY = focalY - cRect.top - cRect.height / 2;

      // Adjust pan to zoom into the focal point
      const scaleRatio = clampedScale / oldScale;
      zoomState.panX = (zoomState.panX - originX) * scaleRatio + originX;
      zoomState.panY = (zoomState.panY - originY) * scaleRatio + originY;
    }

    zoomState.scale = clampedScale;
    clampPanOffsets();
    applyTransform(animate);

    // If user zooms in, pause autoplay so they can study without interruption
    if (isAutoplay && clampedScale > 1.1) {
      pauseAutoplay();
    }
  }

  /**
   * Slide Navigation
   */
  function goToSlide(targetIndex) {
    if (targetIndex === currentIndex) return;

    const slides = carouselTrack.querySelectorAll('.carousel-slide');
    const oldSlide = slides[currentIndex];
    const newSlide = slides[targetIndex];

    if (!newSlide) return;

    // Reset zoom on previous slide
    resetZoom(false);

    // Animate slides transition
    slides.forEach((s, idx) => {
      s.classList.remove('active', 'prev-slide', 'next-slide');
      if (idx === targetIndex) {
        s.classList.add('active');
      } else if (idx < targetIndex) {
        s.classList.add('prev-slide');
      } else {
        s.classList.add('next-slide');
      }
    });

    currentIndex = targetIndex;
    updateSlideMeta();

    // Reset autoplay timer on manual slide change
    if (isAutoplay) {
      resetAutoplayCountdown();
    }
  }

  function nextSlide() {
    const nextIdx = (currentIndex + 1) % totalSlides;
    goToSlide(nextIdx);
  }

  function prevSlide() {
    const prevIdx = (currentIndex - 1 + totalSlides) % totalSlides;
    goToSlide(prevIdx);
  }

  /**
   * Touch & Pinch-to-zoom Engine
   */
  function bindZoomAndTouchEvents() {
    // Touch Events on Viewport
    carouselViewport.addEventListener('touchstart', onTouchStart, { passive: false });
    carouselViewport.addEventListener('touchmove', onTouchMove, { passive: false });
    carouselViewport.addEventListener('touchend', onTouchEnd, { passive: false });
    carouselViewport.addEventListener('touchcancel', onTouchEnd, { passive: false });

    // Desktop Mouse Wheel Zoom
    carouselViewport.addEventListener('wheel', onWheelZoom, { passive: false });

    // Desktop Mouse Drag to Pan or Swipe
    carouselViewport.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }

  /**
   * TOUCH START
   */
  function onTouchStart(e) {
    if (e.touches.length === 2) {
      // TWO FINGERS PINCH START
      e.preventDefault();
      touchState.isPinching = true;
      touchState.isDragging = false;

      const t1 = e.touches[0];
      const t2 = e.touches[1];

      touchState.initialPinchDist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      touchState.startScale = zoomState.scale;
      touchState.startPanX = zoomState.panX;
      touchState.startPanY = zoomState.panY;

      touchState.pinchCenterX = (t1.clientX + t2.clientX) / 2;
      touchState.pinchCenterY = (t1.clientY + t2.clientY) / 2;

      // Hide hint toast once user starts touching
      dismissGestureToast();

    } else if (e.touches.length === 1) {
      // ONE FINGER TOUCH START
      const t = e.touches[0];
      touchState.isPinching = false;
      touchState.isDragging = true;
      touchState.startX = t.clientX;
      touchState.startY = t.clientY;
      touchState.currentX = t.clientX;
      touchState.currentY = t.clientY;
      touchState.startPanX = zoomState.panX;
      touchState.startPanY = zoomState.panY;

      // Detect Double Tap
      const now = Date.now();
      const distFromLastTap = Math.hypot(t.clientX - touchState.lastTouchPos.x, t.clientY - touchState.lastTouchPos.y);

      if (now - touchState.lastTouchTime < 320 && distFromLastTap < 40) {
        // Double tap recognized!
        e.preventDefault();
        touchState.lastTouchTime = 0; // prevent triple tap

        if (zoomState.scale > 1.2) {
          resetZoom(true);
        } else {
          setZoom(2.4, t.clientX, t.clientY, true);
        }
        return;
      }

      touchState.lastTouchTime = now;
      touchState.lastTouchPos = { x: t.clientX, y: t.clientY };
    }
  }

  /**
   * TOUCH MOVE
   */
  function onTouchMove(e) {
    if (touchState.isPinching && e.touches.length === 2) {
      // PINCH-TO-ZOOM IN PROGRESS
      e.preventDefault();

      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const currentDist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);

      if (touchState.initialPinchDist > 0) {
        const pinchRatio = currentDist / touchState.initialPinchDist;
        const newScale = clamp(touchState.startScale * pinchRatio, zoomState.minScale, zoomState.maxScale);

        // Adjust Pan based on pinch center
        const container = getActiveContainer();
        if (container) {
          const cRect = container.getBoundingClientRect();
          const originX = touchState.pinchCenterX - cRect.left - cRect.width / 2;
          const originY = touchState.pinchCenterY - cRect.top - cRect.height / 2;
          const scaleRatio = newScale / touchState.startScale;

          zoomState.panX = (touchState.startPanX - originX) * scaleRatio + originX;
          zoomState.panY = (touchState.startPanY - originY) * scaleRatio + originY;
        }

        zoomState.scale = newScale;
        clampPanOffsets();
        applyTransform(false);
      }

    } else if (touchState.isDragging && e.touches.length === 1) {
      // SINGLE TOUCH MOVE
      const t = e.touches[0];
      const deltaX = t.clientX - touchState.startX;
      const deltaY = t.clientY - touchState.startY;

      touchState.currentX = t.clientX;
      touchState.currentY = t.clientY;

      if (zoomState.scale > 1.05) {
        // PANNING ZOOMED IMAGE
        e.preventDefault(); // Stop native page scrolling
        zoomState.panX = touchState.startPanX + deltaX;
        zoomState.panY = touchState.startPanY + deltaY;
        clampPanOffsets();
        applyTransform(false);
      } else {
        // SWIPING CAROUSEL SLIDE (Scale is 1x)
        // Check horizontal movement vs vertical
        if (Math.abs(deltaX) > 10 && Math.abs(deltaX) > Math.abs(deltaY)) {
          e.preventDefault(); // Stop native scroll so swipe is crisp
          const activeSlide = carouselTrack.querySelector('.carousel-slide.active');
          if (activeSlide) {
            // Subtle elastic drag feedback
            activeSlide.style.transform = `translateX(${deltaX * 0.4}px)`;
          }
        }
      }
    }
  }

  /**
   * TOUCH END
   */
  function onTouchEnd(e) {
    if (touchState.isPinching) {
      if (e.touches.length < 2) {
        touchState.isPinching = false;
        // Snap back if zoom was slightly below 1
        if (zoomState.scale < 1.05) {
          resetZoom(true);
        } else {
          clampPanOffsets();
          applyTransform(true);
        }
      }
    }

    if (touchState.isDragging) {
      touchState.isDragging = false;
      const deltaX = touchState.currentX - touchState.startX;

      if (zoomState.scale <= 1.05) {
        // Reset elastic drag
        const activeSlide = carouselTrack.querySelector('.carousel-slide.active');
        if (activeSlide) {
          activeSlide.style.transform = '';
        }

        // Check if swipe distance is enough to switch slides
        const SWIPE_THRESHOLD = 45;
        if (deltaX < -SWIPE_THRESHOLD) {
          nextSlide();
        } else if (deltaX > SWIPE_THRESHOLD) {
          prevSlide();
        }
      } else {
        // Snap back inside pan boundaries smoothly
        clampPanOffsets();
        applyTransform(true);
      }
    }
  }

  /**
   * MOUSE WHEEL ZOOM (Desktop)
   */
  function onWheelZoom(e) {
    e.preventDefault();

    const zoomStep = 0.25;
    const factor = e.deltaY < 0 ? 1 + zoomStep : 1 - zoomStep;
    const targetScale = zoomState.scale * factor;

    setZoom(targetScale, e.clientX, e.clientY, true);
  }

  /**
   * MOUSE DRAG TO PAN OR SWIPE (Desktop)
   */
  function onMouseDown(e) {
    if (e.button !== 0) return; // Left click only

    mouseState.isMouseDown = true;
    mouseState.startX = e.clientX;
    mouseState.startY = e.clientY;
    mouseState.lastX = e.clientX;
    mouseState.lastY = e.clientY;
    mouseState.hasMoved = false;

    const container = getActiveContainer();
    if (container) {
      container.classList.add('is-dragging');
    }
  }

  function onMouseMove(e) {
    if (!mouseState.isMouseDown) return;

    const deltaX = e.clientX - mouseState.startX;
    const deltaY = e.clientY - mouseState.startY;

    if (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4) {
      mouseState.hasMoved = true;
    }

    if (zoomState.scale > 1.05) {
      // Pan zoomed image
      const stepX = e.clientX - mouseState.lastX;
      const stepY = e.clientY - mouseState.lastY;

      zoomState.panX += stepX;
      zoomState.panY += stepY;
      clampPanOffsets();
      applyTransform(false);
    }

    mouseState.lastX = e.clientX;
    mouseState.lastY = e.clientY;
  }

  function onMouseUp(e) {
    if (!mouseState.isMouseDown) return;
    mouseState.isMouseDown = false;

    const container = getActiveContainer();
    if (container) {
      container.classList.remove('is-dragging');
    }

    if (zoomState.scale <= 1.05 && mouseState.hasMoved) {
      const deltaX = e.clientX - mouseState.startX;
      const SWIPE_THRESHOLD = 50;

      if (deltaX < -SWIPE_THRESHOLD) {
        nextSlide();
      } else if (deltaX > SWIPE_THRESHOLD) {
        prevSlide();
      }
    } else if (zoomState.scale > 1.05) {
      clampPanOffsets();
      applyTransform(true);
    }
  }

  /**
   * Autoplay Presentation Mode
   */
  function startAutoplay() {
    isAutoplay = true;
    btnAutoplay.classList.add('active');
    playIcon.classList.add('hide');
    pauseIcon.classList.remove('hide');
    autoplayText.textContent = 'Pausar';
    autoplayTimerBar.classList.add('running');

    resetAutoplayCountdown();
  }

  function pauseAutoplay() {
    isAutoplay = false;
    btnAutoplay.classList.remove('active');
    playIcon.classList.remove('hide');
    pauseIcon.classList.add('hide');
    autoplayText.textContent = 'Play';
    autoplayTimerBar.classList.remove('running');
    autoplayTimerBar.style.width = '0%';

    if (autoplayInterval) clearInterval(autoplayInterval);
    if (autoplayRaf) cancelAnimationFrame(autoplayRaf);
  }

  function toggleAutoplay() {
    if (isAutoplay) {
      pauseAutoplay();
    } else {
      // Reset zoom if starting autoplay
      resetZoom(true);
      startAutoplay();
    }
  }

  function resetAutoplayCountdown() {
    if (autoplayInterval) clearInterval(autoplayInterval);
    if (autoplayRaf) cancelAnimationFrame(autoplayRaf);

    autoplayStartTime = performance.now();

    function updateBar() {
      if (!isAutoplay) return;
      const elapsed = performance.now() - autoplayStartTime;
      const pct = Math.min((elapsed / AUTOPLAY_SLIDE_DURATION) * 100, 100);
      autoplayTimerBar.style.width = `${pct}%`;

      if (elapsed < AUTOPLAY_SLIDE_DURATION) {
        autoplayRaf = requestAnimationFrame(updateBar);
      }
    }

    autoplayRaf = requestAnimationFrame(updateBar);

    autoplayInterval = setInterval(() => {
      nextSlide();
    }, AUTOPLAY_SLIDE_DURATION);
  }

  /**
   * Fullscreen API Handling
   */
  function toggleFullscreen() {
    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
      const docEl = document.documentElement;
      if (docEl.requestFullscreen) {
        docEl.requestFullscreen();
      } else if (docEl.webkitRequestFullscreen) {
        docEl.webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  }

  function onFullscreenChange() {
    const isFs = !!(document.fullscreenElement || document.webkitFullscreenElement);
    btnFullscreen.classList.toggle('active', isFs);
    fsEnterIcon.classList.toggle('hide', isFs);
    fsExitIcon.classList.toggle('hide', !isFs);
  }

  /**
   * Modal Dialogs
   */
  function openGridModal() {
    gridModal.classList.remove('hide');
  }

  function closeGridModal() {
    gridModal.classList.add('hide');
  }

  function openHelpModal() {
    helpModal.classList.remove('hide');
  }

  function closeHelpModal() {
    helpModal.classList.add('hide');
  }

  function dismissGestureToast() {
    gestureHintToast.classList.add('dismissed');
    setTimeout(() => {
      gestureHintToast.style.display = 'none';
    }, 350);
  }

  /**
   * Keyboard Shortcuts
   */
  function onKeyDown(e) {
    // If active element is an input, don't hijack
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

    switch (e.key) {
      case 'ArrowLeft':
      case 'a':
      case 'A':
        prevSlide();
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        nextSlide();
        break;
      case '+':
      case '=':
        setZoom(zoomState.scale + 0.35, null, null, true);
        break;
      case '-':
      case '_':
        setZoom(zoomState.scale - 0.35, null, null, true);
        break;
      case '0':
      case 'Escape':
        if (!gridModal.classList.contains('hide')) {
          closeGridModal();
        } else if (!helpModal.classList.contains('hide')) {
          closeHelpModal();
        } else {
          resetZoom(true);
        }
        break;
      case 'f':
      case 'F':
        toggleFullscreen();
        break;
      case ' ':
        e.preventDefault();
        toggleAutoplay();
        break;
      case 'g':
      case 'G':
        if (gridModal.classList.contains('hide')) {
          openGridModal();
        } else {
          closeGridModal();
        }
        break;
      case '?':
        if (helpModal.classList.contains('hide')) {
          openHelpModal();
        } else {
          closeHelpModal();
        }
        break;
    }
  }

  /**
   * Wire UI Event Listeners
   */
  function setupUIListeners() {
    btnPrev.addEventListener('click', prevSlide);
    btnNext.addEventListener('click', nextSlide);

    // Zoom Controls
    btnZoomIn.addEventListener('click', () => setZoom(zoomState.scale + 0.4, null, null, true));
    btnZoomOut.addEventListener('click', () => setZoom(zoomState.scale - 0.4, null, null, true));
    btnResetZoom.addEventListener('click', () => resetZoom(true));
    btnZoomScale.addEventListener('click', () => resetZoom(true));

    // Autoplay
    btnAutoplay.addEventListener('click', toggleAutoplay);

    // Fullscreen
    btnFullscreen.addEventListener('click', toggleFullscreen);
    document.addEventListener('fullscreenchange', onFullscreenChange);
    document.addEventListener('webkitfullscreenchange', onFullscreenChange);

    // Modals
    btnGrid.addEventListener('click', openGridModal);
    btnCloseGrid.addEventListener('click', closeGridModal);
    gridModal.addEventListener('click', (e) => {
      if (e.target === gridModal) closeGridModal();
    });

    btnHelp.addEventListener('click', openHelpModal);
    btnCloseHelp.addEventListener('click', closeHelpModal);
    helpModal.addEventListener('click', (e) => {
      if (e.target === helpModal) closeHelpModal();
    });

    // Gesture Toast
    btnCloseHint.addEventListener('click', dismissGestureToast);
    // Auto fade toast after 7 seconds
    setTimeout(dismissGestureToast, 7000);

    // Keyboard
    window.addEventListener('keydown', onKeyDown);

    // Prevent default context menu on image for cleaner long-touch feel
    carouselViewport.addEventListener('contextmenu', (e) => {
      if (zoomState.scale > 1) e.preventDefault();
    });
  }

  // Self Initialization
  document.addEventListener('DOMContentLoaded', () => {
    initCarousel();
    setupUIListeners();
  });

})();
