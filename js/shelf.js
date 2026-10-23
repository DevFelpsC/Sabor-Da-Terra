/**
 * EMPÓRIO SABOR DA TERRA — FULLSCREEN IMMERSIVE SHELF & PRODUCT MENU
 * Interactive jar crop hover animations & product listing menu with cart integration
 */

let currentModalCategory = 'especiarias';

document.addEventListener('DOMContentLoaded', () => {
  initFullscreenShelf();
});

function initFullscreenShelf() {
  const stage = document.getElementById('shelf-stage');
  const glowGroups = document.querySelectorAll('.jar-glow-group');
  const uiSlots = document.querySelectorAll('.jar-ui-slot');
  const modal = document.getElementById('jar-modal');
  const modalContent = document.getElementById('jar-modal-content');
  const modalClose = document.getElementById('jar-modal-close');
  const guidePrompt = document.getElementById('shelf-guide-prompt');

  if (!stage) return;

  // Seamless match-cut entrance if expanded from hero image
  try {
    if (sessionStorage.getItem('sabordaterra_expanded_from_hero')) {
      sessionStorage.removeItem('sabordaterra_expanded_from_hero');
      stage.classList.add('shelf-enter-anim');
      void stage.offsetWidth;
      requestAnimationFrame(() => {
        stage.classList.add('shelf-entered');
      });
    }
  } catch (e) {}

  function setJarActive(jarId, isActive) {
    if (isActive) {
      stage.classList.add('has-jar-hover');
      if (guidePrompt) {
        guidePrompt.style.opacity = '0.35';
        guidePrompt.style.transform = 'translate(-50%, 4px)';
      }
      glowGroups.forEach(g => {
        if (g.dataset.jar === jarId) g.classList.add('active');
        else g.classList.remove('active');
      });
      uiSlots.forEach(s => {
        if (s.dataset.jar === jarId) s.classList.add('active');
        else s.classList.remove('active');
      });
    } else {
      stage.classList.remove('has-jar-hover');
      if (guidePrompt && (!modal || modal.classList.contains('hidden'))) {
        guidePrompt.style.opacity = '1';
        guidePrompt.style.transform = 'translate(-50%, 0)';
      }
      glowGroups.forEach(g => g.classList.remove('active'));
      uiSlots.forEach(s => s.classList.remove('active'));
    }
  }

  // Welcoming onboarding ripple: gently pulses the 3 jars on load to signal interactivity
  setTimeout(() => {
    let delay = 0;
    glowGroups.forEach((group) => {
      setTimeout(() => {
        if (!stage.classList.contains('has-jar-hover')) {
          group.classList.add('active');
          setTimeout(() => {
            if (!stage.classList.contains('has-jar-hover')) {
              group.classList.remove('active');
            }
          }, 800);
        }
      }, delay);
      delay += 350;
    });
  }, 700);

  // Bind mouse and focus events on SVG glow groups
  glowGroups.forEach(group => {
    const jarId = group.dataset.jar;

    group.addEventListener('mouseenter', () => setJarActive(jarId, true));
    group.addEventListener('mouseleave', () => setJarActive(jarId, false));
    group.addEventListener('focus', () => setJarActive(jarId, true));
    group.addEventListener('blur', () => setJarActive(jarId, false));

    group.addEventListener('click', () => {
      openJarModal(jarId);
    });

    group.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openJarModal(jarId);
      }
    });
  });

  // Bind hover events on UI slots (tags & cards)
  uiSlots.forEach(slot => {
    const jarId = slot.dataset.jar;

    slot.addEventListener('mouseenter', () => setJarActive(jarId, true));
    slot.addEventListener('mouseleave', () => setJarActive(jarId, false));

    slot.addEventListener('click', () => {
      openJarModal(jarId);
    });

    const centerIndicator = slot.querySelector('.jar-center-click-indicator');
    if (centerIndicator) {
      centerIndicator.addEventListener('click', (e) => {
        e.stopPropagation();
        openJarModal(jarId);
      });
    }

    const openBtn = slot.querySelector('.open-menu-direct-btn');
    if (openBtn) {
      openBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openJarModal(jarId);
      });
    }
  });

  // Modal Open Function: opens menu for requested jar category
  window.openJarModal = function(jarId) {
    if (!PRODUCT_CATALOG[jarId]) jarId = 'especiarias';
    currentModalCategory = jarId;
    renderModalMenu();

    if (modal) {
      modal.classList.remove('hidden');
      modal.classList.add('flex');
      void modal.offsetWidth;
      modal.classList.add('modal-visible');
      document.body.style.overflow = 'hidden';
      if (guidePrompt) {
        guidePrompt.style.opacity = '0';
        guidePrompt.style.pointerEvents = 'none';
      }
    }
  };

  // Render the category menu inside the modal
  function renderModalMenu() {
    if (!modalContent) return;
    const catData = PRODUCT_CATALOG[currentModalCategory];
    if (!catData) return;

    const cart = window.CartApp;
    const items = catData.items;

    // Category Tabs Bar
    const categories = [
      { key: 'especiarias', label: 'Especiarias', icon: 'solar:leaf-bold-duotone', activeColor: '#B8482A' },
      { key: 'doces', label: 'Doces de Fazenda', icon: 'solar:cup-star-bold-duotone', activeColor: '#DFA437' },
      { key: 'conservas', label: 'Conservas', icon: 'fa6-solid:jar', activeColor: '#25D366' }
    ];

    const tabsHTML = `
      <div class="flex items-center gap-2 p-1.5 rounded-2xl bg-black/40 border border-white/10 mb-5 overflow-x-auto custom-drawer-scroll">
        ${categories.map(cat => {
          const isActive = cat.key === currentModalCategory;
          const activeStyle = isActive 
            ? `background-color: ${cat.activeColor}; color: #ffffff; font-weight: 700; border-color: ${cat.activeColor};` 
            : `color: rgba(255,255,255,0.7); border-color: transparent;`;
          return `
            <button class="jar-tab-btn flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm transition-all whitespace-nowrap border" 
                    data-cat-tab="${cat.key}" 
                    style="${activeStyle}">
              <iconify-icon icon="${cat.icon}" width="16"></iconify-icon>
              <span>${cat.label}</span>
              <span class="text-[10px] opacity-75">(${PRODUCT_CATALOG[cat.key].items.length})</span>
            </button>
          `;
        }).join('')}
      </div>
    `;

    // Items Listing
    const itemsListHTML = items.map(item => {
      const qty = cart ? cart.getItemQty(item.id) : 0;
      const formattedPrice = formatBRL(item.price);
      const itemSubtotal = formatBRL(item.price * qty);

      let stepperHTML = '';
      if (qty === 0) {
        stepperHTML = `
          <button data-cart-add="${item.id}" class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-[#DFA437] text-white hover:text-black font-bold text-xs transition-all shadow-sm active:scale-95 border border-white/10 hover:border-[#DFA437]">
            <iconify-icon icon="solar:add-circle-bold" width="15"></iconify-icon>
            <span>+ Adicionar</span>
          </button>
        `;
      } else {
        stepperHTML = `
          <div class="flex items-center gap-1.5 bg-black/60 p-1 rounded-xl border border-[#DFA437]/50 shadow-md">
            <button data-cart-remove="${item.id}" class="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 active:scale-95 text-white flex items-center justify-center transition-colors text-sm font-bold" title="Remover um">
              −
            </button>
            <span class="w-7 text-center text-xs font-bold text-[#DFA437]">${qty}</span>
            <button data-cart-add="${item.id}" class="w-7 h-7 rounded-lg bg-[#DFA437] hover:bg-[#C89028] text-black active:scale-95 flex items-center justify-center transition-colors text-sm font-bold" title="Adicionar mais um">
              +
            </button>
          </div>
          <span class="text-[11px] text-[#DFA437] font-semibold">${itemSubtotal}</span>
        `;
      }

      return `
        <div class="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/25 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <!-- Item info -->
          <div class="flex-1 min-w-0 pr-2">
            <div class="flex items-center gap-2 mb-1">
              <span class="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${catData.themeBg} ${catData.themeText} border border-current/20">
                <iconify-icon icon="${item.icon}" width="12"></iconify-icon>
                <span>${item.badge}</span>
              </span>
              <span class="text-xs text-gray-400 font-medium">${item.weight}</span>
            </div>

            <h4 class="font-heading font-bold text-base text-white tracking-tight leading-snug">
              ${item.name}
            </h4>

            <p class="text-xs text-gray-300 font-light mt-1 leading-relaxed line-clamp-2">
              ${item.description}
            </p>
          </div>

          <!-- Price & Stepper -->
          <div class="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
            <div class="text-left sm:text-right">
              <span class="text-[10px] uppercase tracking-wider text-gray-400 block font-medium">Preço</span>
              <span class="font-heading font-extrabold text-base sm:text-lg text-white">${formattedPrice}</span>
            </div>

            <div class="flex items-center gap-2">
              ${stepperHTML}
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Cart Mini Status Bar inside Modal
    const totalCartCount = cart ? cart.getTotalCount() : 0;
    const totalCartPrice = cart ? formatBRL(cart.getTotalPrice()) : 'R$ 0,00';

    modalContent.innerHTML = `
      <!-- Ambient Glow Behind Modal -->
      <div class="absolute -top-16 -right-16 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none" style="background-color: ${catData.themeColor};"></div>

      <!-- Modal Header -->
      <div class="mb-4 pb-3 border-b border-white/10 pr-10">
        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${catData.themeBg} ${catData.themeText} text-[11px] font-bold uppercase tracking-wider mb-2 font-serif-vintage">
          <iconify-icon icon="${catData.icon}" width="14"></iconify-icon>
          <span>${catData.categoryBadge}</span>
        </div>
        <h2 class="font-heading font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
          ${catData.categoryTitle}
        </h2>
        <p class="text-xs sm:text-sm text-gray-300 font-light mt-0.5">
          ${catData.categorySubtitle}
        </p>
      </div>

      <!-- Tabs -->
      ${tabsHTML}

      <!-- Scrollable Product List -->
      <div class="space-y-2.5 max-h-[46vh] sm:max-h-[50vh] overflow-y-auto custom-drawer-scroll pr-1.5 mb-5">
        ${itemsListHTML}
      </div>

      <!-- Sticky Modal Footer with Cart Status & Direct Checkout -->
      <div class="pt-3.5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#16100B]">
        <div class="flex items-center gap-3 text-xs sm:text-sm text-gray-300 w-full sm:w-auto">
          <div class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[#DFA437]">
            <iconify-icon icon="solar:bag-5-bold-duotone" width="18"></iconify-icon>
          </div>
          <div>
            <div class="font-bold text-white flex items-center gap-1.5">
              <span>No Carrinho:</span>
              <span class="text-[#DFA437]">${totalCartCount} ${totalCartCount === 1 ? 'item' : 'itens'}</span>
            </div>
            <div class="text-[11px] text-gray-400">Total: <strong>${totalCartPrice}</strong></div>
          </div>
        </div>

        <div class="flex items-center gap-2 w-full sm:w-auto">
          <button data-cart-open class="py-2.5 px-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all">
            <iconify-icon icon="solar:cart-large-minimalistic-broken" width="16"></iconify-icon>
            <span class="hidden sm:inline">Aba Rápida</span>
          </button>
          <a href="carrinho.html" class="flex-1 sm:flex-initial py-3 px-6 rounded-full bg-[#DFA437] hover:bg-[#C89028] text-[#1E130D] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-105">
            <iconify-icon icon="solar:bag-5-bold-duotone" width="18"></iconify-icon>
            <span>Ver Carrinho (${totalCartCount}) →</span>
          </a>
        </div>
      </div>
    `;

    // Bind tab clicks inside modal
    modalContent.querySelectorAll('[data-cat-tab]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const catKey = e.currentTarget.dataset.catTab;
        if (catKey && catKey !== currentModalCategory) {
          currentModalCategory = catKey;
          renderModalMenu();
        }
      });
    });
  }

  // Update modal menu items when cart updates
  window.addEventListener('sabordaterra:cart-updated', () => {
    if (modal && !modal.classList.contains('hidden')) {
      renderModalMenu();
    }
  });

  // Modal Close Function
  function closeJarModal() {
    if (!modal) return;
    modal.classList.remove('modal-visible');
    if (guidePrompt) {
      guidePrompt.style.opacity = '1';
      guidePrompt.style.pointerEvents = 'auto';
    }
    setTimeout(() => {
      if (!modal.classList.contains('modal-visible')) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        const drawer = document.getElementById('sabor-cart-drawer');
        if (!drawer || drawer.classList.contains('opacity-0')) {
          document.body.style.overflow = '';
        }
      }
    }, 320);
  }

  if (modalClose) {
    modalClose.addEventListener('click', closeJarModal);
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeJarModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
      closeJarModal();
    }
  });
}
