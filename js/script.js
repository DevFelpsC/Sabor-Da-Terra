/**
 * EMPÓRIO SABOR DA TERRA — INTERACTIVE LANDING SCRIPT
 * High-performance frame-by-frame scroll animation, 3D card tilt & sensory blend engine
 */

// =========================================================================
// SCROLL FRAME ANIMATION CONFIGURATION
// Easily adjust parameters to fine-tune pacing, smoothness and frames
// =========================================================================
const SCROLL_FRAME_CONFIG = {
  totalFrames: 75,          // Number of frames to extract from video (40-90 recommended)
  lerpFactor: 0.12,         // Smoothness of scroll inertia (0.08 = floaty, 0.18 = snappy)
  videoSrc: 'assets/logo-animation.mp4?v=20261019174013',
  frameWidth: 1280,         // Frame extraction width
  frameHeight: 720          // Frame extraction height
};

document.addEventListener('DOMContentLoaded', () => {
  initParticleCanvas();
  initHeroTiltShowcase();
  initBlendSelector();
  initScrollNav();
  initHeroShelfExpandTransition();
  initHomepageCatalog();
  initCombos();
  initFaqAccordion();
  initNavDrawer();
  initQuickViewModal();
  initRewardAndStickyBars();
});

// =========================================================================
// 1. SCROLL-DRIVEN FRAME ANIMATION ENGINE (Apple/Awwwards Standard)
// Treats the video as discrete decoded frames for buttery 60fps scrubbing
// =========================================================================
function initScrollFrameAnimation() {
  const stage = document.getElementById('alquimia-scroll-stage');
  const canvas = document.getElementById('scroll-frames-canvas');
  if (!stage || !canvas) return;

  const ctx = canvas.getContext('2d', { alpha: false });
  let dpr = window.devicePixelRatio || 1;
  let canvasWidth, canvasHeight;

  function resizeCanvas() {
    canvasWidth = canvas.parentElement.offsetWidth;
    canvasHeight = canvas.parentElement.offsetHeight;
    canvas.width = canvasWidth * dpr;
    canvas.height = canvasHeight * dpr;
    ctx.scale(dpr, dpr);
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Pre-decoded frame cache
  const cachedFrames = [];
  let isExtracting = false;
  let targetProgress = 0;
  let currentProgress = 0;

  // Offscreen extractor video & canvas
  const offscreenVideo = document.createElement('video');
  offscreenVideo.src = SCROLL_FRAME_CONFIG.videoSrc;
  offscreenVideo.muted = true;
  offscreenVideo.playsInline = true;
  offscreenVideo.preload = 'auto';

  const offscreenCanvas = document.createElement('canvas');
  offscreenCanvas.width = SCROLL_FRAME_CONFIG.frameWidth;
  offscreenCanvas.height = SCROLL_FRAME_CONFIG.frameHeight;
  const offCtx = offscreenCanvas.getContext('2d');

  // Background frame extraction pipeline
  offscreenVideo.addEventListener('loadedmetadata', () => {
    extractFrames();
  });

  async function extractFrames() {
    if (isExtracting) return;
    isExtracting = true;

    const duration = offscreenVideo.duration;
    if (!duration || isNaN(duration)) return;

    const total = SCROLL_FRAME_CONFIG.totalFrames;
    const timeStep = duration / (total - 1);

    for (let i = 0; i < total; i++) {
      const seekTime = i * timeStep;
      await seekVideo(offscreenVideo, seekTime);

      // Draw current video frame to offscreen canvas
      offCtx.drawImage(offscreenVideo, 0, 0, offscreenCanvas.width, offscreenCanvas.height);

      if (window.createImageBitmap) {
        try {
          const bitmap = await createImageBitmap(offscreenCanvas);
          cachedFrames.push(bitmap);
        } catch (e) {
          cachedFrames.push(copyCanvas(offscreenCanvas));
        }
      } else {
        cachedFrames.push(copyCanvas(offscreenCanvas));
      }
    }
  }

  function copyCanvas(src) {
    const c = document.createElement('canvas');
    c.width = src.width;
    c.height = src.height;
    c.getContext('2d').drawImage(src, 0, 0);
    return c;
  }

  function seekVideo(video, time) {
    return new Promise((resolve) => {
      const onSeeked = () => {
        video.removeEventListener('seeked', onSeeked);
        resolve();
      };
      video.addEventListener('seeked', onSeeked);
      video.currentTime = Math.min(Math.max(time, 0), video.duration);
    });
  }

  // Calculate scroll progress through the stage
  function updateScrollProgress() {
    const stageRect = stage.getBoundingClientRect();
    const totalScrollable = stage.offsetHeight - window.innerHeight;
    if (totalScrollable <= 0) return;

    const scrolled = -stageRect.top;
    targetProgress = Math.min(Math.max(scrolled / totalScrollable, 0), 1);
  }

  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  updateScrollProgress();

  // Story Cards and Dots
  const card1 = document.getElementById('story-card-1');
  const card2 = document.getElementById('story-card-2');
  const card3 = document.getElementById('story-card-3');
  const dot1 = document.getElementById('dot-1');
  const dot2 = document.getElementById('dot-2');
  const dot3 = document.getElementById('dot-3');

  function updateStoryCards(progress) {
    // Card 1: 0% - 33%
    if (progress < 0.33) {
      card1?.classList.add('active');
      card2?.classList.remove('active');
      card3?.classList.remove('active');
      dot1?.classList.add('active');
      dot2?.classList.remove('active');
      dot3?.classList.remove('active');
    }
    // Card 2: 33% - 66% (Peak spice explosion)
    else if (progress >= 0.33 && progress < 0.66) {
      card1?.classList.remove('active');
      card2?.classList.add('active');
      card3?.classList.remove('active');
      dot1?.classList.remove('active');
      dot2?.classList.add('active');
      dot3?.classList.remove('active');
    }
    // Card 3: 66% - 100% (Branded seal on rustic wood)
    else {
      card1?.classList.remove('active');
      card2?.classList.remove('active');
      card3?.classList.add('active');
      dot1?.classList.remove('active');
      dot2?.classList.remove('active');
      dot3?.classList.add('active');
    }
  }

  // Draw current frame covering the canvas area (cover mode)
  function drawCover(source) {
    const sw = source.width;
    const sh = source.height;
    const dw = canvasWidth;
    const dh = canvasHeight;

    const sRatio = sw / sh;
    const dRatio = dw / dh;

    let renderW, renderH, offsetX, offsetY;

    if (dRatio > sRatio) {
      renderW = dw;
      renderH = dw / sRatio;
      offsetX = 0;
      offsetY = (dh - renderH) / 2;
    } else {
      renderH = dh;
      renderW = dh * sRatio;
      offsetX = (dw - renderW) / 2;
      offsetY = 0;
    }

    ctx.drawImage(source, offsetX, offsetY, renderW, renderH);
  }

  // Main Render Loop (60 FPS)
  function renderLoop() {
    // Smooth linear interpolation for inertia
    currentProgress += (targetProgress - currentProgress) * SCROLL_FRAME_CONFIG.lerpFactor;

    updateStoryCards(currentProgress);

    // If frames are ready in memory, render exact frame
    if (cachedFrames.length > 0) {
      const frameIdx = Math.min(
        Math.floor(currentProgress * (cachedFrames.length - 1)),
        cachedFrames.length - 1
      );
      const frame = cachedFrames[frameIdx];
      if (frame) {
        drawCover(frame);
      }
    } else if (offscreenVideo.readyState >= 2) {
      // Direct video preview fallback while frames decode
      drawCover(offscreenVideo);
    }

    requestAnimationFrame(renderLoop);
  }
  requestAnimationFrame(renderLoop);
}

// =========================================================================
// 2. AMBIENT SPICE DUST & GOLDEN AURA PARTICLE PHYSICS (Hero Atmosphere)
// =========================================================================
function initParticleCanvas() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const particleCount = 38;

  const mouse = { x: -1000, y: -1000, radius: 140 };

  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  function resize() {
    if (!canvas.parentElement) return;
    width = canvas.width = canvas.parentElement.offsetWidth;
    height = canvas.height = canvas.parentElement.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const spiceColors = [
    { r: 223, g: 164, b: 55, a: 0.55 }, // Saffron Gold
    { r: 244, g: 196, b: 94, a: 0.45 }, // Golden Pollen
    { r: 184, g: 72, b: 42, a: 0.40 },  // Terracotta Paprika
    { r: 200, g: 90, b: 50, a: 0.35 },  // Warm Chili
    { r: 255, g: 250, b: 240, a: 0.50 } // Ambient Light
  ];

  class SpiceParticle {
    constructor() {
      this.reset(true);
    }
    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : height + 15;
      this.radius = Math.random() * 2.2 + 0.8;
      this.colorObj = spiceColors[Math.floor(Math.random() * spiceColors.length)];
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = -(Math.random() * 0.6 + 0.25);
      this.angle = Math.random() * Math.PI * 2;
      this.pulseSpeed = Math.random() * 0.02 + 0.01;
    }
    update() {
      this.x += this.vx + Math.sin(this.angle) * 0.35;
      this.y += this.vy;
      this.angle += this.pulseSpeed;

      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < mouse.radius && dist > 0) {
        const force = (1 - dist / mouse.radius) * 1.8;
        this.x += (dx / dist) * force;
        this.y += (dy / dist) * force;
      }

      if (this.y < -15 || this.x < -20 || this.x > width + 20) {
        this.reset();
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.colorObj.r}, ${this.colorObj.g}, ${this.colorObj.b}, ${this.colorObj.a})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = `rgba(${this.colorObj.r}, ${this.colorObj.g}, ${this.colorObj.b}, 0.5)`;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new SpiceParticle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animate);
  }
  animate();
}

// =========================================================================
// 3. HERO SHOWCASE 3D PERSPECTIVE TILT
// =========================================================================
function initHeroTiltShowcase() {
  const container = document.querySelector('.hero-showcase-container');
  const card = document.querySelector('.hero-3d-card');
  if (!container || !card) return;

  if (window.innerWidth < 1024) return;

  container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -7;
    const rotateY = ((x - centerX) / centerX) * 7;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.015, 1.015, 1.015)`;
  });

  container.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  });
}

// =========================================================================
// 4. SENSORY BLEND SELECTOR & WHATSAPP CONVERSION PERSONALIZATION
// =========================================================================
function initBlendSelector() {
  const tabs = document.querySelectorAll('.blend-tab');
  const previewBadge = document.getElementById('sensory-preview-badge');
  const previewDesc = document.getElementById('sensory-preview-desc');
  const heroWaBtn = document.getElementById('hero-wa-primary-btn');

  if (!tabs.length) return;

  const blendData = {
    temperos: {
      tag: '🌿 Linha de Temperos Selecionados',
      desc: 'Ervas nobres, pimentas puras, alho granulado e misturas artesanais moídas a frio sem adição de amido.',
      waText: 'Ol%C3%A1!%20Vim%20pelo%20site%20e%20gostaria%20de%20pedir%20informa%C3%A7%C3%B5es%20e%20pre%C3%A7os%20da%20Linha%20de%20Temperos%20do%20Emp%C3%B3rio%20Sabor%20da%20Terra.'
    },
    doces: {
      tag: '🍯 Doces & Compotas Tradicionais',
      desc: 'Doces de fazenda, compotas caseiras em calda, goiabada cascão, mel puro e geleias de frutas frescas.',
      waText: 'Ol%C3%A1!%20Vim%20pelo%20site%20e%20gostaria%20de%20pedir%20informa%C3%A7%C3%B5es%20e%20pre%C3%A7os%20da%20Linha%20de%20Doces%20do%20Emp%C3%B3rio%20Sabor%20da%20Terra.'
    },
    conservas: {
      tag: '🫒 Conservas Nobres & Azeites',
      desc: 'Azeitonas graúdas selecionadas, pimentas em conserva especial, palmitos nobres e azeites aromatizados em potes de vidro.',
      waText: 'Ol%C3%A1!%20Vim%20pelo%20site%20e%20gostaria%20de%20pedir%20informa%C3%A7%C3%B5es%20e%20pre%C3%A7os%20da%20Linha%20de%20Conservas%20do%20Emp%C3%B3rio%20Sabor%20da%20Terra.'
    }
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active', 'border-[#B8482A]', 'bg-white', 'shadow-sm'));
      tab.classList.add('active', 'border-[#B8482A]', 'bg-white', 'shadow-sm');

      const blendKey = tab.getAttribute('data-blend');
      const data = blendData[blendKey];
      if (!data) return;

      if (previewBadge) previewBadge.textContent = data.tag;
      if (previewDesc) previewDesc.textContent = data.desc;

      if (heroWaBtn) {
        heroWaBtn.href = `https://wa.me/5518991621203?text=${data.waText}`;
      }
    });
  });
}

// =========================================================================
// 5. SCROLL NAV BLUR & ELEVATION
// =========================================================================
function initScrollNav() {
  const nav = document.getElementById('main-nav');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      nav.classList.add('shadow-md', 'bg-[#FAF6F0]/95', 'border-[#E8DCC8]');
      nav.classList.remove('bg-[#FAF6F0]/90', 'border-[#E8DCC8]/40');
    } else {
      nav.classList.remove('shadow-md', 'bg-[#FAF6F0]/95', 'border-[#E8DCC8]');
      nav.classList.add('bg-[#FAF6F0]/90', 'border-[#E8DCC8]/40');
    }
  });
}

// =========================================================================
// 6. CINEMATIC HERO-TO-SHELF EXPANDING TRANSITION ENGINE
// =========================================================================
function initHeroShelfExpandTransition() {
  const shelfTriggers = document.querySelectorAll('#hero-shelf-primary-btn, .hero-image-frame, a[href="prateleiras.html"]');
  const heroFrame = document.querySelector('.hero-image-frame');
  const overlay = document.getElementById('shelf-portal-overlay');
  const backdrop = document.getElementById('shelf-portal-backdrop');
  const portalBox = document.getElementById('shelf-portal-box');
  const heroStartImg = document.getElementById('portal-hero-start-img');
  const shelfFadeImg = document.getElementById('portal-shelf-fade-img');
  const seal = document.getElementById('portal-seal-indicator');

  if (!heroFrame || !overlay || !portalBox) return;

  let isTransitioning = false;

  function runExpandTransition(e) {
    if (isTransitioning) return;
    if (e) e.preventDefault();
    isTransitioning = true;

    // Get current screen coordinates of hero image frame
    const rect = heroFrame.getBoundingClientRect();
    const computedStyle = window.getComputedStyle(heroFrame);
    const radius = computedStyle.borderRadius || '1.5rem';

    // 1. Initial State: Box exactly matches the hero frame on screen
    portalBox.style.transition = 'none';
    portalBox.style.top = `${rect.top}px`;
    portalBox.style.left = `${rect.left}px`;
    portalBox.style.width = `${rect.width}px`;
    portalBox.style.height = `${rect.height}px`;
    portalBox.style.borderRadius = radius;

    if (heroStartImg) {
      heroStartImg.style.transition = 'none';
      heroStartImg.style.transform = 'scale(1)';
      heroStartImg.style.opacity = '1';
    }

    if (shelfFadeImg) {
      shelfFadeImg.style.transition = 'none';
      shelfFadeImg.style.opacity = '0';
      shelfFadeImg.style.transform = 'scale(1.06)';
    }

    if (backdrop) {
      backdrop.style.opacity = '0';
    }

    if (seal) {
      seal.style.transition = 'none';
      seal.style.opacity = '0';
      seal.style.transform = 'scale(0.92)';
    }

    // Activate overlay container immediately (no ghosting or initial opacity ramp on portalBox)
    overlay.classList.add('active');

    // Force browser reflow to commit initial coordinates
    void portalBox.offsetWidth;

    // 2. Animate expanding outward with natural physical motion & organic cross-dissolve
    requestAnimationFrame(() => {
      // Step A: Natural physical viewport expansion
      portalBox.style.transition = 'all 880ms cubic-bezier(0.22, 1, 0.36, 1)';
      portalBox.style.top = '0px';
      portalBox.style.left = '0px';
      portalBox.style.width = '100vw';
      portalBox.style.height = '100vh';
      portalBox.style.borderRadius = '0px';

      // Step B: Backdrop smoothly darkens behind portal box
      if (backdrop) {
        backdrop.style.opacity = '1';
      }

      // Step C: Hero image gently eases depth and dissolves softly
      if (heroStartImg) {
        heroStartImg.style.transition = 'transform 880ms cubic-bezier(0.22, 1, 0.36, 1), opacity 700ms cubic-bezier(0.4, 0, 0.2, 1) 120ms';
        heroStartImg.style.transform = 'scale(1.04)';
        heroStartImg.style.opacity = '0.15';
      }

      // Step D: Shelf image dissolves in with natural S-curve and settling optical zoom
      if (shelfFadeImg) {
        shelfFadeImg.style.transition = 'opacity 750ms cubic-bezier(0.4, 0, 0.2, 1) 100ms, transform 880ms cubic-bezier(0.22, 1, 0.36, 1)';
        shelfFadeImg.style.opacity = '1';
        shelfFadeImg.style.transform = 'scale(1)';
      }

      // Step E: Seal indicator reveals gently midway through the expansion
      if (seal) {
        setTimeout(() => {
          seal.style.transition = 'opacity 450ms cubic-bezier(0.4, 0, 0.2, 1), transform 450ms cubic-bezier(0.16, 1, 0.3, 1)';
          seal.style.opacity = '1';
          seal.style.transform = 'scale(1)';
        }, 320);
      }
    });

    // 3. Save session flag for prateleiras.html smooth entrance
    try {
      sessionStorage.setItem('sabordaterra_expanded_from_hero', '1');
    } catch (err) {}

    // 4. Navigate to prateleiras.html when full screen expansion is settled
    setTimeout(() => {
      window.location.href = 'prateleiras.html';
    }, 920);
  }

  // Make hero image frame feel interactive
  heroFrame.style.cursor = 'pointer';
  heroFrame.setAttribute('title', 'Clique para ver a prateleira');

  shelfTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      if (e.ctrlKey || e.metaKey) return; // Allow opening in new tab
      runExpandTransition(e);
    });
  });
}

// =========================================================================
// 7. HOMEPAGE INTERACTIVE PRODUCT CATALOG ENGINE
// =========================================================================
let currentCatalogFilter = 'all';
let currentSearchQuery = '';

function initHomepageCatalog() {
  const container = document.getElementById('homepage-products-grid');
  if (!container || typeof PRODUCT_CATALOG === 'undefined') return;

  const filterBtns = document.querySelectorAll('.catalog-filter-btn');
  const searchInput = document.getElementById('catalog-search-input');
  const resultCount = document.getElementById('catalog-results-count');

  // Filter Buttons
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCatalogFilter = btn.dataset.category || 'all';
      renderCatalogGrid();
    });
  });

  // Search Input
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearchQuery = e.target.value.toLowerCase().trim();
      renderCatalogGrid();
    });
  }

  // Listen to cart updates to refresh steppers in real time
  window.addEventListener('sabordaterra:cart-updated', () => {
    renderCatalogGrid();
  });

  renderCatalogGrid();

  function renderCatalogGrid() {
    let allItems = [];

    // Categories to include
    const categoriesToScan = currentCatalogFilter === 'all'
      ? ['especiarias', 'doces', 'conservas']
      : [currentCatalogFilter];

    categoriesToScan.forEach(catKey => {
      if (PRODUCT_CATALOG[catKey] && PRODUCT_CATALOG[catKey].items) {
        PRODUCT_CATALOG[catKey].items.forEach(item => {
          allItems.push({
            ...item,
            categoryKey: catKey,
            categoryName: PRODUCT_CATALOG[catKey].categoryName,
            themeColor: PRODUCT_CATALOG[catKey].themeColor,
            themeBg: PRODUCT_CATALOG[catKey].themeBg,
            themeText: PRODUCT_CATALOG[catKey].themeText
          });
        });
      }
    });

    // Apply Search Filter
    if (currentSearchQuery) {
      allItems = allItems.filter(item => {
        return item.name.toLowerCase().includes(currentSearchQuery) ||
               item.description.toLowerCase().includes(currentSearchQuery) ||
               (item.badge && item.badge.toLowerCase().includes(currentSearchQuery));
      });
    }

    if (resultCount) {
      resultCount.textContent = `${allItems.length} ${allItems.length === 1 ? 'produto encontrado' : 'produtos encontrados'}`;
    }

    if (allItems.length === 0) {
      container.innerHTML = `
        <div class="col-span-full py-16 text-center bg-white rounded-3xl border border-[#E5DFD5]">
          <div class="w-16 h-16 rounded-full bg-[#FAF8F5] border border-[#E5DFD5] flex items-center justify-center mx-auto mb-4 text-[#B23B1E]">
            <iconify-icon icon="solar:magnifer-linear" width="32"></iconify-icon>
          </div>
          <h3 class="font-heading font-bold text-xl text-[#18120E] mb-2">Nenhum produto encontrado</h3>
          <p class="text-sm text-gray-600 max-w-md mx-auto mb-5">
            Não encontramos resultados para "${currentSearchQuery}". Tente buscar por outros termos como "páprica", "pimenta", "doce" ou "alho".
          </p>
          <button id="clear-search-btn" class="px-5 py-2.5 rounded-full bg-[#18120E] text-white text-xs font-bold hover:bg-[#B23B1E] transition-colors cursor-pointer">
            Limpar Busca
          </button>
        </div>
      `;
      const clearBtn = document.getElementById('clear-search-btn');
      if (clearBtn && searchInput) {
        clearBtn.addEventListener('click', () => {
          searchInput.value = '';
          currentSearchQuery = '';
          renderCatalogGrid();
        });
      }
      return;
    }

    const cart = window.CartApp;

    container.innerHTML = allItems.map(item => {
      const qty = cart ? cart.getItemQty(item.id) : 0;
      const formattedPrice = formatBRL(item.price);
      const isSweet = item.categoryKey === 'doces';
      const isPreserve = item.categoryKey === 'conservas';

      let categoryBadgeClass = 'bg-[#B23B1E]/10 text-[#B23B1E] border-[#B23B1E]/20';
      if (isSweet) categoryBadgeClass = 'bg-[#C88D25]/15 text-[#9E6E16] border-[#C88D25]/30';
      if (isPreserve) categoryBadgeClass = 'bg-[#1A3628]/10 text-[#1A3628] border-[#1A3628]/20';

      const waDirectText = encodeURIComponent(
        `Olá! Gostaria de pedir o produto "${item.name} (${item.weight})" por ${formattedPrice} do Empório Sabor da Terra.`
      );

      let stepperHTML = '';
      if (qty === 0) {
        stepperHTML = `
          <button type="button" data-catalog-add="${item.id}"
            class="product-stepper-btn w-full py-2.5 px-3 rounded-xl bg-[#18120E] hover:bg-[#B23B1E] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer">
            <iconify-icon icon="solar:cart-plus-bold" width="15"></iconify-icon>
            <span>+ Adicionar</span>
          </button>
        `;
      } else {
        const subtotal = formatBRL(item.price * qty);
        stepperHTML = `
          <div class="flex items-center justify-between w-full p-1 rounded-xl bg-[#FAF8F5] border border-[#E5DFD5]">
            <div class="flex items-center gap-1">
              <button type="button" data-catalog-remove="${item.id}"
                class="product-stepper-btn w-7 h-7 rounded-lg bg-white hover:bg-gray-200 text-[#18120E] flex items-center justify-center font-bold text-xs border border-[#E5DFD5] transition-colors cursor-pointer" title="Remover um">
                −
              </button>
              <span class="w-6 text-center font-extrabold text-xs text-[#18120E]">${qty}</span>
              <button type="button" data-catalog-add="${item.id}"
                class="product-stepper-btn w-7 h-7 rounded-lg bg-[#B23B1E] hover:bg-[#8F2B13] text-white flex items-center justify-center font-bold text-xs transition-colors cursor-pointer" title="Adicionar mais um">
                +
              </button>
            </div>
            <span class="text-xs font-extrabold text-[#B23B1E] pr-2">${subtotal}</span>
          </div>
        `;
      }

      return `
        <div class="product-card-v2 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <!-- Header Badges -->
            <div class="flex items-center justify-between gap-2 mb-3">
              <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border ${categoryBadgeClass}">
                <iconify-icon icon="${item.icon}" width="12"></iconify-icon>
                <span>${item.badge}</span>
              </span>
              <span class="text-[11px] font-bold text-gray-500 bg-[#FAF8F5] px-2.5 py-0.5 rounded-full border border-[#E5DFD5]">
                ${item.weight}
              </span>
            </div>

            <!-- Product Title -->
            <h4 class="font-heading font-extrabold text-base sm:text-lg text-[#18120E] tracking-tight leading-snug mb-1 hover:text-[#B23B1E] transition-colors cursor-pointer"
              data-quickview-id="${item.id}" title="Clique para ver a ficha técnica e harmonização">
              ${item.name}
            </h4>

            <!-- Culinary Info Link -->
            <button type="button" data-quickview-id="${item.id}"
              class="mb-3 text-[11px] font-bold text-[#B23B1E] hover:text-[#8F2B13] flex items-center gap-1 group/qv cursor-pointer transition-colors text-left"
              title="Ver Ficha Técnica & Harmonização">
              <iconify-icon icon="solar:chef-hat-bold-duotone" width="13"></iconify-icon>
              <span class="underline decoration-dotted underline-offset-2">Ficha &amp; Harmonização</span>
              <iconify-icon icon="solar:arrow-right-linear" width="10" class="group-hover/qv:translate-x-0.5 transition-transform"></iconify-icon>
            </button>

            <!-- Sensory Description -->
            <p class="text-xs text-gray-600 font-light leading-relaxed mb-4 line-clamp-2">
              ${item.description}
            </p>
          </div>

          <!-- Footer: Price, Stepper & WhatsApp Quick Inquire -->
          <div class="pt-3 border-t border-[#E5DFD5]/60 mt-auto">
            <div class="flex items-baseline justify-between mb-3">
              <span class="text-[10px] uppercase tracking-wider text-gray-400 font-medium">Preço</span>
              <div class="flex items-baseline gap-1">
                <span class="text-xs font-medium text-gray-500">R$</span>
                <span class="font-heading font-extrabold text-lg text-[#18120E]">${Number(item.price).toFixed(2).replace('.', ',')}</span>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <div class="flex-1">
                ${stepperHTML}
              </div>
              <a href="https://wa.me/5518991621203?text=${waDirectText}" target="_blank" rel="noopener noreferrer"
                class="w-9 h-9 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366] text-[#25D366] hover:text-white flex items-center justify-center border border-[#25D366]/30 transition-colors shrink-0"
                title="Pedir este produto direto no WhatsApp">
                <iconify-icon icon="logos:whatsapp-icon" width="16"></iconify-icon>
              </a>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Bind click events on quickview triggers
    container.querySelectorAll('[data-quickview-id]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const id = btn.getAttribute('data-quickview-id');
        openProductQuickView(id);
      });
    });

    // Bind click events on buttons
    container.querySelectorAll('[data-catalog-add]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const id = btn.getAttribute('data-catalog-add');
        if (window.CartApp) {
          window.CartApp.addItem(id);
          const item = getProductById(id);
          if (item) showAddedToast(item);
        }
      });
    });

    container.querySelectorAll('[data-catalog-remove]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const id = btn.getAttribute('data-catalog-remove');
        if (window.CartApp) window.CartApp.removeItem(id);
      });
    });
  }
}

// =========================================================================
// 8. COMBOS & KITS QUICK ADD ENGINE
// =========================================================================
function initCombos() {
  document.querySelectorAll('[data-combo-add]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const comboId = btn.getAttribute('data-combo-add');
      if (window.CartApp) {
        window.CartApp.addItem(comboId);
        const item = getProductById(comboId);
        if (item) showAddedToast(item);
      }
    });
  });
}

// =========================================================================
// 9. FAQ ACCORDION ENGINE
// =========================================================================
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-accordion-item');
  faqItems.forEach(item => {
    const header = item.querySelector('.faq-accordion-header');
    if (header) {
      header.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        faqItems.forEach(i => i.classList.remove('open'));
        if (!isOpen) {
          item.classList.add('open');
        }
      });
    }
  });
}

// =========================================================================
// 10. EXPANDABLE NAVIGATION DRAWER ENGINE
// =========================================================================
function initNavDrawer() {
  const toggleBtn = document.getElementById('nav-menu-toggle-btn');
  const closeBtn = document.getElementById('nav-drawer-close-btn');
  const backdrop = document.getElementById('nav-drawer-backdrop');
  const drawer = document.getElementById('nav-drawer');

  if (!toggleBtn || !drawer) return;

  function openDrawer() {
    drawer.classList.add('open');
    if (backdrop) backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
    updateDrawerCartState();
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    if (backdrop) backdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', (e) => {
    e.preventDefault();
    openDrawer();
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      closeDrawer();
    });
  }

  if (backdrop) {
    backdrop.addEventListener('click', () => {
      closeDrawer();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeDrawer();
    }
  });

  // Handle category triggers inside drawer
  document.querySelectorAll('.drawer-filter-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.getAttribute('data-category') || 'all';
      closeDrawer();
      
      // Update catalog filter
      const filterBtns = document.querySelectorAll('.catalog-filter-btn');
      filterBtns.forEach(b => {
        if (b.dataset.category === category) {
          b.classList.add('active');
        } else {
          b.classList.remove('active');
        }
      });
      currentCatalogFilter = category;
      const searchInput = document.getElementById('catalog-search-input');
      if (searchInput) searchInput.value = '';
      currentSearchQuery = '';
      
      const grid = document.getElementById('homepage-products-grid');
      if (grid && typeof renderCatalogGrid === 'function') {
        const target = document.getElementById('produtos');
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
        setTimeout(() => {
          renderCatalogGrid();
        }, 150);
      }
    });
  });

  // Handle standard anchor links inside drawer
  document.querySelectorAll('.drawer-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });

  function updateDrawerCartState() {
    const countEl = document.querySelector('.drawer-cart-count');
    const totalEl = document.querySelector('.drawer-cart-total');
    if (window.CartApp && countEl && totalEl) {
      const count = window.CartApp.getTotalCount();
      const total = window.CartApp.getTotalPrice();
      countEl.textContent = `(${count} ${count === 1 ? 'item' : 'itens'})`;
      totalEl.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    }
  }

  window.addEventListener('sabordaterra:cart-updated', updateDrawerCartState);
}

// =========================================================================
// 11. QUICK VIEW MODAL (FICHA TÉCNICA & HARMONIZAÇÃO CULINÁRIA)
// =========================================================================
let currentQuickViewProductId = null;

function initQuickViewModal() {
  const modal = document.getElementById('product-quickview-modal');
  const closeBtn = document.getElementById('quickview-close-btn');
  const addBtn = document.getElementById('quickview-add-cart-btn');

  if (!modal) return;

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      closeModal();
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });

  if (addBtn) {
    addBtn.addEventListener('click', () => {
      if (!currentQuickViewProductId) return;
      if (window.CartApp) {
        window.CartApp.addItem(currentQuickViewProductId);
        const item = getProductById(currentQuickViewProductId);
        if (item) showAddedToast(item);
      }
      closeModal();
    });
  }
}

function openProductQuickView(productId) {
  const modal = document.getElementById('product-quickview-modal');
  if (!modal) return;

  const item = getProductById(productId);
  if (!item) return;

  currentQuickViewProductId = productId;
  const culinary = (typeof getProductCulinaryDetails === 'function')
    ? getProductCulinaryDetails(productId)
    : null;

  const titleEl = document.getElementById('quickview-title');
  const descEl = document.getElementById('quickview-desc');
  const badgeEl = document.getElementById('quickview-badge');
  const weightEl = document.getElementById('quickview-weight');
  const priceEl = document.getElementById('quickview-price');
  const pairingEl = document.getElementById('quickview-pairing');
  const purityEl = document.getElementById('quickview-purity');
  const intensityEl = document.getElementById('quickview-intensity');
  const tipEl = document.getElementById('quickview-tip');
  const waBtn = document.getElementById('quickview-wa-btn');

  if (titleEl) titleEl.textContent = item.name;
  if (descEl) descEl.textContent = item.description;
  if (badgeEl) badgeEl.textContent = item.badge || 'Artesanal';
  if (weightEl) weightEl.textContent = item.weight || 'Pote';
  if (priceEl) priceEl.textContent = `R$ ${Number(item.price).toFixed(2).replace('.', ',')}`;

  if (culinary) {
    if (pairingEl) pairingEl.textContent = culinary.pairing;
    if (purityEl) purityEl.textContent = culinary.purity;
    if (intensityEl) intensityEl.textContent = culinary.intensity;
    if (tipEl) tipEl.textContent = culinary.tip;
  }

  if (waBtn) {
    const waText = encodeURIComponent(
      `Olá! Estive vendo a ficha do produto "${item.name} (${item.weight})" no site e gostaria de pedir mais informações.`
    );
    waBtn.href = `https://wa.me/5518991621203?text=${waText}`;
  }

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

// =========================================================================
// 12. TOAST NOTIFICATION ENGINE
// =========================================================================
function showAddedToast(item) {
  const container = document.getElementById('cart-toast-container');
  if (!container || !item) return;

  const toast = document.createElement('div');
  toast.className = 'cart-toast';
  toast.innerHTML = `
    <div class="flex items-center gap-2.5">
      <div class="w-6 h-6 rounded-full bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-xs">
        <iconify-icon icon="solar:check-circle-bold" width="16"></iconify-icon>
      </div>
      <div class="text-left">
        <span class="font-bold text-white block text-xs leading-tight">${item.name}</span>
        <span class="text-[10px] text-gray-300">Adicionado ao pedido • R$ ${Number(item.price).toFixed(2).replace('.', ',')}</span>
      </div>
    </div>
    <a href="carrinho.html"
      class="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white text-xs font-bold text-[#C88D25] hover:text-[#18120E] transition-colors whitespace-nowrap ml-2">
      Ver Carrinho →
    </a>
  `;

  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 350);
  }, 2800);
}

// =========================================================================
// 13. DYNAMIC REWARD & MOBILE STICKY CART ENGINE
// =========================================================================
function initRewardAndStickyBars() {
  updateRewardAndStickyBars();
  window.addEventListener('sabordaterra:cart-updated', updateRewardAndStickyBars);
}

function updateRewardAndStickyBars() {
  const threshold = 80.00;
  let subtotal = 0;
  let totalCount = 0;

  if (window.CartApp) {
    subtotal = window.CartApp.getTotalPrice();
    totalCount = window.CartApp.getTotalCount();
  }

  // Update Drawer Reward Bar
  const drawerFill = document.getElementById('drawer-reward-progress-fill');
  const drawerText = document.getElementById('drawer-reward-text');
  const drawerBadge = document.getElementById('drawer-reward-badge');

  if (drawerFill && drawerText) {
    const pct = Math.min(100, (subtotal / threshold) * 100);
    drawerFill.style.width = `${pct}%`;
    if (subtotal >= threshold) {
      drawerFill.classList.add('unlocked');
      if (drawerBadge) {
        drawerBadge.textContent = 'Desbloqueado! 🎉';
        drawerBadge.className = 'text-[10px] font-bold text-[#25D366] bg-[#25D366]/15 px-2 py-0.5 rounded-full';
      }
      drawerText.innerHTML = '🎉 <strong>Parabéns!</strong> Você ganhou 1 sachê de tempero caipira de brinde!';
    } else {
      drawerFill.classList.remove('unlocked');
      const diff = threshold - subtotal;
      if (drawerBadge) {
        drawerBadge.textContent = `Meta R$ ${threshold.toFixed(0)}`;
        drawerBadge.className = 'text-[10px] font-bold text-[#B23B1E] bg-[#B23B1E]/10 px-2 py-0.5 rounded-full';
      }
      drawerText.innerHTML = `Adicione mais <strong class="text-[#B23B1E] font-bold">R$ ${diff.toFixed(2).replace('.', ',')}</strong> para ganhar 1 sachê artesanal de brinde!`;
    }
  }

  // Update Mobile Sticky Cart Bar
  const stickyBar = document.getElementById('mobile-sticky-cart-bar');
  const stickyCount = document.getElementById('mobile-sticky-count');
  const stickyTotal = document.getElementById('mobile-sticky-total');

  if (stickyBar) {
    if (totalCount > 0) {
      stickyBar.classList.remove('translate-y-full');
      if (stickyCount) stickyCount.textContent = `${totalCount} ${totalCount === 1 ? 'item' : 'itens'}`;
      if (stickyTotal) stickyTotal.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
    } else {
      stickyBar.classList.add('translate-y-full');
    }
  }
}



