/**
 * Golden Morn Swipeable Gallery
 * Handles touch & mouse swipe events to traverse historical packs.
 */
(function() {
  const slides = [
    {
      yearId: '1986_',
      packId: '1986pack',
      textId: 'carton',
      padlockId: null,
      checkId: 'grreenCheck',
      packLeft: 49,
      textLeft: 71,
      yearLeft: 142,
      packTop: 113
    },
    {
      yearId: '1990',
      packId: '1990pack',
      textId: '90',
      padlockId: 'Padlock1',
      checkId: 'grreenCheck_1',
      packLeft: 66,
      textLeft: 84,
      yearLeft: 142,
      packTop: 128
    },
    {
      yearId: '2000',
      packId: 'Goldenrocher',
      textId: 'rocher',
      padlockId: 'Padlock2',
      checkId: 'grreenCheck_2',
      packLeft: 68.5,
      textLeft: 71,
      yearLeft: 142,
      packTop: 128
    },
    {
      yearId: '2000_1',
      packId: 'NOURISHMENT_PACK',
      textId: 'nourish',
      padlockId: 'Padlock3',
      checkId: 'grreenCheck_3',
      packLeft: 68.5,
      textLeft: 71,
      yearLeft: 142,
      packTop: 128
    },
    {
      yearId: '2010_',
      packId: 'Extra_Nourishment_Pack',
      textId: 'extranourish',
      padlockId: 'Padlock4',
      checkId: 'grreenCheck_4',
      packLeft: 68.5,
      textLeft: 71,
      yearLeft: 142,
      packTop: 128
    },
    {
      yearId: '2021',
      packId: 'Heritage_pack',
      textId: 'heritage',
      padlockId: 'Padlock5',
      checkId: 'grreenCheck_5',
      packLeft: 100.5,
      textLeft: 71,
      yearLeft: 142,
      packTop: 163
    },
    {
      yearId: '2025',
      packId: 'ecofriendly',
      textId: 'ecofriend',
      padlockId: 'Padlock6',
      checkId: 'grreenCheck_6',
      packLeft: 59.5,
      textLeft: 71,
      yearLeft: 142,
      packTop: 128
    }
  ];

  let activeIndex = 0;
  let isDragging = false;
  let isDragInit = false;
  let isHorizontalSwipe = false;
  let startX = 0;
  let startY = 0;
  let currentX = 0;
  let currentY = 0;
  let transitionTriggered = false;

  const unlocked = [true, false, false, false, false, false, false];

  function injectStyles() {
    if (document.getElementById('gallery-custom-styles')) return;
    const style = document.createElement('style');
    style.id = 'gallery-custom-styles';
    style.textContent = `
      /* Confetti Celebration Styles */
      .confetti-container {
        position: absolute;
        left: 0;
        top: 0;
        width: 320px;
        height: 480px;
        pointer-events: none;
        overflow: hidden;
        z-index: 3 !important;
      }
      .confetti-piece {
        position: absolute;
        opacity: 0.85;
        will-change: transform;
        pointer-events: none;
      }

      @keyframes confetti-fall-1 {
        0% {
          transform: translateY(-20px) translateX(0) rotate(0deg);
        }
        100% {
          transform: translateY(510px) translateX(35px) rotate(720deg);
        }
      }
      @keyframes confetti-fall-2 {
        0% {
          transform: translateY(-20px) translateX(0) rotate(0deg);
        }
        100% {
          transform: translateY(510px) translateX(-35px) rotate(-360deg);
        }
      }
      @keyframes confetti-fall-3 {
        0% {
          transform: translateY(-20px) translateX(0) rotate(0deg);
        }
        100% {
          transform: translateY(510px) translateX(15px) rotate(540deg);
        }
      }

      /* Pack Reveal Animations for page1_3 */
      @keyframes packIntro {
        0% {
          opacity: 0;
          transform: translateY(60px) scale(0.8) rotate(0deg) translateX(0);
        }
        100% {
          opacity: 1;
          transform: translateY(0) scale(1) rotate(0deg) translateX(0);
        }
      }

      @keyframes packDance {
        0%, 100% {
          transform: translateY(0) scale(1) rotate(0deg) translateX(0);
        }
        25% {
          transform: translateY(0) scale(1) rotate(-3.5deg) translateX(-7px);
        }
        75% {
          transform: translateY(0) scale(1) rotate(3.5deg) translateX(7px);
        }
      }

      /* Floating Background Elements (Millet and Corn) on page1_2 */
      #Millet {
        z-index: 1 !important;
        animation: floatMillet 16s ease-in-out infinite !important;
        pointer-events: none !important;
        transform-origin: center center;
      }
      #Corn {
        z-index: 1 !important;
        animation: floatCorn 18s ease-in-out infinite !important;
        pointer-events: none !important;
        transform-origin: center center;
      }

      @keyframes floatMillet {
        0%, 100% {
          transform: translate(0, 0) rotate(0deg);
        }
        25% {
          transform: translate(-30px, 35px) rotate(15deg);
        }
        50% {
          transform: translate(-10px, 70px) rotate(-10deg);
        }
        75% {
          transform: translate(-35px, 25px) rotate(8deg);
        }
      }

      @keyframes floatCorn {
        0%, 100% {
          transform: translate(0, 0) rotate(0deg);
        }
        30% {
          transform: translate(35px, -35px) rotate(-12deg);
        }
        60% {
          transform: translate(15px, -70px) rotate(10deg);
        }
        85% {
          transform: translate(40px, -25px) rotate(-5deg);
        }
      }

      /* Learn More Button Reveal, Pulsating, and Hover Animations */
      #learn_more {
        transition: transform 0.22s ease-in-out, opacity 0.6s ease-in-out !important;
        opacity: 0;
        cursor: pointer !important;
        transform-origin: center center !important;
      }
      #learn_more.btn-reveal {
        opacity: 1 !important;
        animation: pulsate 1.8s ease-in-out infinite !important;
      }
      #learn_more:hover {
        animation-play-state: paused !important;
        transform: scale(1.08) !important;
      }
      #reveal_40 {
        transform-origin: center center !important;
        animation: pulsate 1.8s ease-in-out infinite !important;
      }

      @keyframes pulsate {
        0%, 100% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.06);
        }
      }
    `;
    document.head.appendChild(style);
  }

  function init() {
    injectStyles();

    // Apply initial setup for all elements to override stylesheet rules
    slides.forEach(slide => {
      const pack = document.getElementById(slide.packId);
      const text = document.getElementById(slide.textId);
      const year = document.getElementById(slide.yearId);

      if (pack) {
        pack.style.position = 'absolute';
        pack.style.left = slide.packLeft + 'px';
        pack.style.top = slide.packTop + 'px';
        pack.style.transformOrigin = 'center center';
        pack.setAttribute('draggable', 'false');
        pack.style.pointerEvents = 'none';
        pack.style.zIndex = '2';
      }
      if (text) {
        text.style.position = 'absolute';
        text.style.left = slide.textLeft + 'px';
        text.style.top = '70px';
        text.style.transformOrigin = 'center center';
        text.setAttribute('draggable', 'false');
        text.style.pointerEvents = 'none';
        text.style.zIndex = '3';
      }
      if (year) {
        year.style.position = 'absolute';
        year.style.left = slide.yearLeft + 'px';
        year.style.top = '112px';
        year.style.transformOrigin = 'center center';
        year.setAttribute('draggable', 'false');
        year.style.pointerEvents = 'none';
        year.style.zIndex = '3';
      }

      // Initialize indicators (padlocks and green checks)
      if (slide.padlockId) {
        const padlock = document.getElementById(slide.padlockId);
        if (padlock) {
          padlock.style.transition = 'opacity 0.3s ease, transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
          padlock.style.transform = 'scale(1)';
          padlock.style.opacity = '1';
          padlock.style.zIndex = '10';
        }
      }
      if (slide.checkId) {
        const check = document.getElementById(slide.checkId);
        if (check) {
          check.style.transition = 'opacity 0.3s ease, transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
          check.style.zIndex = '10';
          if (slide.checkId === 'grreenCheck') {
            check.style.transform = 'scale(1)';
            check.style.opacity = '1';
          } else {
            check.style.transform = 'scale(0)';
            check.style.opacity = '0';
          }
        }
      }
    });

    const page1_2 = document.getElementById('page1_2');
    if (page1_2) {
      // Add pageactivated listener to handle GWD transitions
      page1_2.addEventListener('pageactivated', () => {
        activeIndex = 0;
        transitionTriggered = false;

        // Reset unlock states except first
        for (let i = 1; i < unlocked.length; i++) {
          unlocked[i] = false;
          const padlock = document.getElementById(slides[i].padlockId);
          const check = document.getElementById(slides[i].checkId);
          if (padlock) {
            padlock.style.transform = 'scale(1)';
            padlock.style.opacity = '1';
          }
          if (check) {
            check.style.transform = 'scale(0)';
            check.style.opacity = '0';
          }
        }

        // Show hand cursor guide
        const cursor = document.getElementById('cursor');
        if (cursor) {
          cursor.style.display = 'block';
          cursor.style.opacity = '1';
        }

        updateSlidePositions(0);
      });

      // Attach touch event listeners
      page1_2.addEventListener('touchstart', (e) => {
        if (e.touches.length > 0) {
          onDragStart(e.touches[0].clientX, e.touches[0].clientY);
        }
      }, { passive: true });

      page1_2.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
          onDragMove(e.touches[0].clientX, e.touches[0].clientY, e);
        }
      }, { passive: false });

      page1_2.addEventListener('touchend', () => {
        onDragEnd();
      });

      // Attach mouse event listeners for testing in desktop browsers
      page1_2.addEventListener('mousedown', (e) => {
        e.preventDefault(); // Stop default browser image/drag behavior
        onDragStart(e.clientX, e.clientY);
      });

      page1_2.addEventListener('mousemove', (e) => {
        onDragMove(e.clientX, e.clientY, e);
      });

      page1_2.addEventListener('mouseup', () => {
        onDragEnd();
      });

      page1_2.addEventListener('mouseleave', () => {
        onDragEnd();
      });
    }

    // Initialize Page1_3 reveal animations
    const page1_3 = document.getElementById('page1_3');
    if (page1_3) {
      page1_3.addEventListener('pageactivated', () => {
        // 1. Animate 2025 pack on page 1_3 with inline styling to bypass GWD resets
        const finalPack = document.getElementById('ecofriendly_1');
        if (finalPack) {
          finalPack.style.position = 'absolute';
          finalPack.style.left = '56px';
          finalPack.style.top = '218px';
          finalPack.style.zIndex = '100'; // Enforce on top of Reveal_Page background
          finalPack.style.transformOrigin = 'center bottom';
          finalPack.style.opacity = '0';
          finalPack.style.animation = 'none';
          
          finalPack.offsetHeight; // Force reflow

          // Combined: elastic intro slide-in, followed by continuous dancing sway loop
          finalPack.style.animation = 'packIntro 1.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards, packDance 2.6s ease-in-out 1.3s infinite';
        }

        // 2. Spawn confetti
        startConfetti(page1_3);

        // 3. Fade in Learn More button beautifully
        const learnMore = document.getElementById('learn_more');
        if (learnMore) {
          learnMore.style.position = 'absolute';
          learnMore.style.left = '80px';
          learnMore.style.top = '450px';
          learnMore.style.width = '160px';
          learnMore.style.height = '37px';
          learnMore.style.zIndex = '100';
          learnMore.classList.remove('btn-reveal');
          learnMore.offsetHeight; // force reflow
          learnMore.classList.add('btn-reveal');
        }
      });
    }

    // Set up initial positions
    updateSlidePositions(0);
  }

  function startConfetti(parent) {
    const oldContainer = parent.querySelector('.confetti-container');
    if (oldContainer) {
      oldContainer.remove();
    }

    const container = document.createElement('div');
    container.className = 'confetti-container';
    parent.appendChild(container);

    const colors = [
      '#FFC107', // Gold
      '#FF5722', // Red-Orange
      '#4CAF50', // Green
      '#00BCD4', // Cyan
      '#E91E63', // Pink
      '#9C27B0', // Purple
      '#3F51B5'  // Blue
    ];

    const shapes = ['square', 'circle', 'rectangle'];

    for (let i = 0; i < 75; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';

      const color = colors[Math.floor(Math.random() * colors.length)];
      piece.style.backgroundColor = color;

      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      if (shape === 'circle') {
        piece.style.borderRadius = '50%';
      }

      const width = Math.floor(Math.random() * 6) + 6; // 6 to 11px
      const height = shape === 'rectangle' ? width * 1.5 : width;
      piece.style.width = width + 'px';
      piece.style.height = height + 'px';

      const left = Math.random() * 100;
      piece.style.left = left + '%';

      // Use a negative delay to pre-populate the screen with falling confetti instantly
      const delay = -Math.random() * 4; 
      const duration = Math.random() * 2 + 2.5; // 2.5s to 4.5s
      const type = Math.floor(Math.random() * 3) + 1;

      piece.style.animation = `confetti-fall-${type} ${duration}s linear ${delay}s infinite`;

      container.appendChild(piece);
    }

    // Automatically fade out and remove confetti after 10 seconds
    setTimeout(() => {
      container.style.transition = 'opacity 1s ease';
      container.style.opacity = '0';
      setTimeout(() => {
        container.remove();
      }, 1000);
    }, 10000);
  }

  function updateSlidePositions(dragOffset = 0) {
    slides.forEach((slide, idx) => {
      const isCurrent = idx === activeIndex;
      const isPrev = idx === activeIndex - 1;
      const isNext = idx === activeIndex + 1;

      const pack = document.getElementById(slide.packId);
      const text = document.getElementById(slide.textId);
      const year = document.getElementById(slide.yearId);

      if (!pack || !text || !year) return;

      if (isCurrent || isPrev || isNext) {
        pack.style.display = 'block';
        text.style.display = 'block';
        year.style.display = 'block';

        // Dynamically enforce layout positions to prevent GWD page transitions from resetting them
        pack.style.position = 'absolute';
        pack.style.left = slide.packLeft + 'px';
        pack.style.top = slide.packTop + 'px';
        pack.setAttribute('draggable', 'false');
        pack.style.pointerEvents = 'none';
        pack.style.zIndex = '2';

        text.style.position = 'absolute';
        text.style.left = slide.textLeft + 'px';
        text.style.top = '70px';
        text.setAttribute('draggable', 'false');
        text.style.pointerEvents = 'none';
        text.style.zIndex = '3';

        year.style.position = 'absolute';
        year.style.left = slide.yearLeft + 'px';
        year.style.top = '112px';
        year.setAttribute('draggable', 'false');
        year.style.pointerEvents = 'none';
        year.style.zIndex = '3';

        let baseOffset = 0;
        if (isPrev) baseOffset = -320;
        if (isNext) baseOffset = 320;

        const totalOffset = baseOffset + dragOffset;
        
        // Parallax factors
        const packOffset = totalOffset;
        const textOffset = totalOffset * 1.12;
        const yearOffset = totalOffset * 1.25;

        const transStr = isDragging ? 'none' : 'transform 0.45s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.45s ease';

        let opacity = 0;
        if (isCurrent) {
          opacity = 1 - Math.min(Math.abs(dragOffset) / 320, 1);
        } else {
          opacity = Math.min(Math.abs(dragOffset) / 320, 1);
        }

        [pack, text, year].forEach(el => {
          el.style.transition = transStr;
        });

        pack.style.transform = `translate3d(${packOffset}px, 0, 0)`;
        text.style.transform = `translate3d(${textOffset}px, 0, 0)`;
        year.style.transform = `translate3d(${yearOffset}px, 0, 0)`;

        if (isDragging) {
          pack.style.opacity = isCurrent ? (opacity * 0.4 + 0.6) : opacity;
          text.style.opacity = isCurrent ? (opacity * 0.4 + 0.6) : opacity;
          year.style.opacity = isCurrent ? (opacity * 0.4 + 0.6) : opacity;
        } else {
          pack.style.opacity = isCurrent ? 1 : 0;
          text.style.opacity = isCurrent ? 1 : 0;
          year.style.opacity = isCurrent ? 1 : 0;
        }
      } else {
        pack.style.display = 'none';
        text.style.display = 'none';
        year.style.display = 'none';
      }
    });
  }

  function onDragStart(x, y) {
    if (transitionTriggered) return;
    isDragging = true;
    isDragInit = true;
    isHorizontalSwipe = false;
    startX = x;
    startY = y;
    currentX = x;
    currentY = y;

    const cursor = document.getElementById('cursor');
    if (cursor) {
      cursor.style.display = 'none';
    }
  }

  function onDragMove(x, y, event) {
    if (!isDragging) return;
    currentX = x;
    currentY = y;

    const diffX = Math.abs(currentX - startX);
    const diffY = Math.abs(currentY - startY);

    if (isDragInit) {
      if (diffX > 10 || diffY > 10) {
        isDragInit = false;
        if (diffX > diffY) {
          isHorizontalSwipe = true;
        } else {
          isDragging = false;
          return;
        }
      }
    }

    if (isHorizontalSwipe) {
      if (event && event.cancelable) {
        event.preventDefault();
      }

      const dragOffset = currentX - startX;
      let limitedDragOffset = dragOffset;

      if (activeIndex === 0 && dragOffset > 0) {
        limitedDragOffset = dragOffset * 0.3;
      } else if (activeIndex === slides.length - 1 && dragOffset < 0) {
        limitedDragOffset = dragOffset * 0.3;
      }

      updateSlidePositions(limitedDragOffset);
    }
  }

  function onDragEnd() {
    if (!isDragging) return;
    isDragging = false;

    const dragOffset = currentX - startX;
    const threshold = 60;

    let targetIndex = activeIndex;
    if (dragOffset < -threshold && activeIndex < slides.length - 1) {
      targetIndex = activeIndex + 1;
    } else if (dragOffset > threshold && activeIndex > 0) {
      targetIndex = activeIndex - 1;
    }

    activeIndex = targetIndex;

    if (activeIndex > 0 && !unlocked[activeIndex]) {
      unlockSlide(activeIndex);
    }

    updateSlidePositions(0);
  }

  function unlockSlide(idx) {
    if (idx <= 0 || idx >= slides.length) return;
    if (unlocked[idx]) return;
    unlocked[idx] = true;

    const slide = slides[idx];
    const padlock = document.getElementById(slide.padlockId);
    const check = document.getElementById(slide.checkId);

    if (padlock) {
      padlock.style.transition = 'opacity 0.35s ease, transform 0.35s cubic-bezier(0.6, -0.28, 0.735, 0.045)';
      padlock.style.transform = 'scale(0)';
      padlock.style.opacity = '0';
    }

    if (check) {
      check.style.transform = 'scale(0)';
      check.style.opacity = '0';
      check.offsetHeight;
      check.style.transition = 'opacity 0.45s ease, transform 0.45s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
      check.style.transform = 'scale(1)';
      check.style.opacity = '1';
    }

    checkAllUnlocked();
  }

  function checkAllUnlocked() {
    if (unlocked.every(val => val === true) && !transitionTriggered) {
      transitionTriggered = true;
      setTimeout(() => {
        if (window.gwd && gwd.actions && gwd.actions.gwdPagedeck) {
          gwd.actions.gwdPagedeck.goToPage('pagedeck', 'page1_3', 'slide', 800, 'linear', 'left');
        } else {
          const pagedeck = document.getElementById('pagedeck');
          if (pagedeck && typeof pagedeck.goToPage === 'function') {
            pagedeck.goToPage('page1_3', 'slide', 800, 'linear', 'left');
          }
        }
      }, 2000);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
