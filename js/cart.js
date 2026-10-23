/**
 * EMPÓRIO SABOR DA TERRA — SHOPPING CART & ORDER ENGINE
 * Universal shopping cart available across all pages (prateleiras, landing page, etc.)
 * Persists in localStorage and integrates directly with WhatsApp ordering.
 */

class CartManager {
  constructor() {
    this.storageKey = 'sabordaterra_cart_v2';
    this.items = this.loadCart();
    this.init();
  }

  loadCart() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      console.warn('Erro ao carregar carrinho:', e);
      return {};
    }
  }

  saveCart() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.items));
    } catch (e) {
      console.warn('Erro ao salvar carrinho:', e);
    }
    this.notifyUpdate();
  }

  notifyUpdate() {
    const detail = {
      items: this.getItemsList(),
      totalCount: this.getTotalCount(),
      totalPrice: this.getTotalPrice()
    };

    window.dispatchEvent(new CustomEvent('sabordaterra:cart-updated', { detail }));
    this.updateBadges();
    this.renderDrawer();
  }

  addItem(productId) {
    const product = typeof getProductById === 'function' ? getProductById(productId) : null;
    if (!product) return;

    if (!this.items[productId]) {
      this.items[productId] = {
        id: product.id,
        name: product.name,
        price: product.price,
        weight: product.weight,
        category: product.categoryKey || 'especiarias',
        categoryName: product.categoryName || 'Empório',
        icon: product.icon || 'solar:leaf-bold-duotone',
        qty: 1
      };
    } else {
      this.items[productId].qty += 1;
    }

    this.saveCart();
    this.showToast(`Adicionado: ${product.name}`, 'add');
  }

  removeItem(productId) {
    if (!this.items[productId]) return;

    const name = this.items[productId].name;
    this.items[productId].qty -= 1;

    if (this.items[productId].qty <= 0) {
      delete this.items[productId];
      this.showToast(`Removido: ${name}`, 'remove');
    }

    this.saveCart();
  }

  deleteItem(productId) {
    if (!this.items[productId]) return;
    const name = this.items[productId].name;
    delete this.items[productId];
    this.saveCart();
    this.showToast(`Removido do carrinho: ${name}`, 'remove');
  }

  clearCart() {
    this.items = {};
    this.saveCart();
    this.showToast('Carrinho esvaziado', 'remove');
  }

  getItemQty(productId) {
    return this.items[productId] ? this.items[productId].qty : 0;
  }

  getItemsList() {
    return Object.values(this.items);
  }

  getTotalCount() {
    return Object.values(this.items).reduce((sum, item) => sum + item.qty, 0);
  }

  getTotalPrice() {
    return Object.values(this.items).reduce((sum, item) => sum + (item.price * item.qty), 0);
  }

  getWhatsAppCheckoutUrl() {
    const items = this.getItemsList();
    if (items.length === 0) {
      return 'https://wa.me/5518991621203?text=Ol%C3%A1!%20Gostaria%20de%20conhecer%20os%20produtos%20do%20Emp%C3%B3rio%20Sabor%20da%20Terra.';
    }

    let text = `*PEDIDO — EMPÓRIO SABOR DA TERRA*\n`;
    text += `Olá! Gostaria de encomendar os seguintes itens selecionados:\n\n`;

    items.forEach((item, index) => {
      const itemSubtotal = formatBRL(item.price * item.qty);
      text += `${index + 1}. *${item.qty}x* ${item.name} (${item.weight})\n`;
      text += `   ↳ Preço unit.: ${formatBRL(item.price)} | Subtotal: ${itemSubtotal}\n\n`;
    });

    const totalStr = formatBRL(this.getTotalPrice());
    const countStr = this.getTotalCount();

    text += `━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `🛒 *TOTAL DO PEDIDO:* ${totalStr} (${countStr} ${countStr === 1 ? 'item' : 'itens'})\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━\n\n`;
    text += `Por favor, como combinamos o pagamento e a entrega para meu endereço?`;

    return `https://wa.me/5518991621203?text=${encodeURIComponent(text)}`;
  }

  init() {
    this.injectCartDrawer();
    this.bindEvents();
    this.updateBadges();

    // Listen for storage events across other tabs
    window.addEventListener('storage', (e) => {
      if (e.key === this.storageKey) {
        this.items = this.loadCart();
        this.notifyUpdate();
      }
    });
  }

  injectCartDrawer() {
    if (document.getElementById('sabor-cart-drawer')) return;

    const drawerHTML = `
      <!-- CART BACKDROP & SLIDE-OVER DRAWER -->
      <div id="sabor-cart-drawer" class="fixed inset-0 z-[100] hidden pointer-events-none transition-opacity duration-300 opacity-0">
        <!-- Backdrop Dimmer -->
        <div id="sabor-cart-backdrop" class="absolute inset-0 bg-black/75 backdrop-blur-sm cursor-pointer"></div>

        <!-- Right Side Panel -->
        <div id="sabor-cart-panel" class="absolute top-0 right-0 bottom-0 w-full max-w-md bg-[#16100B] border-l border-white/15 text-white shadow-2xl flex flex-col transform translate-x-full transition-transform duration-300 ease-out">
          
          <!-- Drawer Header -->
          <div class="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between bg-black/30">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-2xl bg-[#DFA437]/15 border border-[#DFA437]/30 flex items-center justify-center text-[#DFA437]">
                <iconify-icon icon="solar:bag-5-bold-duotone" width="22"></iconify-icon>
              </div>
              <div>
                <h3 class="font-heading font-extrabold text-lg sm:text-xl text-white tracking-tight flex items-center gap-2">
                  <span>Carrinho de Compras</span>
                  <span id="drawer-header-count" class="text-xs font-bold px-2 py-0.5 rounded-full bg-[#B8482A] text-white">0</span>
                </h3>
                <p class="text-[11px] text-gray-400 font-light">Empório Sabor da Terra • Feito no WhatsApp</p>
              </div>
            </div>

            <!-- Close Button -->
            <button id="sabor-cart-close-btn" class="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors text-base" title="Fechar carrinho">
              ✕
            </button>
          </div>

          <!-- Drawer Body (Items List or Empty State) -->
          <div id="sabor-cart-items-container" class="flex-1 overflow-y-auto p-5 sm:p-6 space-y-3.5 custom-drawer-scroll">
            <!-- Dynamically populated -->
          </div>

          <!-- Drawer Footer (Summary & Checkout CTA) -->
          <div id="sabor-cart-footer" class="p-5 sm:p-6 border-t border-white/10 bg-black/40">
            <div class="space-y-2 mb-4">
              <div class="flex items-center justify-between text-xs text-gray-400">
                <span>Subtotal dos produtos</span>
                <span id="drawer-subtotal" class="font-semibold text-white">R$ 0,00</span>
              </div>
              <div class="flex items-center justify-between text-xs text-gray-400">
                <span>Entrega / Envio</span>
                <span class="text-[#25D366] font-medium flex items-center gap-1">
                  <iconify-icon icon="logos:whatsapp-icon" width="13"></iconify-icon>
                  <span>Combinar no WhatsApp</span>
                </span>
              </div>
              <div class="pt-2 border-t border-white/10 flex items-center justify-between text-base sm:text-lg font-bold text-white">
                <span class="font-heading">Total Previsto:</span>
                <span id="drawer-grand-total" class="font-heading text-xl sm:text-2xl text-[#DFA437]">R$ 0,00</span>
              </div>
            </div>

            <!-- WhatsApp Checkout CTA Button -->
            <a id="drawer-checkout-btn" href="#" target="_blank" rel="noopener noreferrer" class="w-full py-4 px-6 rounded-2xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-3 shadow-xl transition-all duration-200 hover:-translate-y-0.5 mb-2">
              <iconify-icon icon="logos:whatsapp-icon" width="22"></iconify-icon>
              <span>Finalizar Pedido no WhatsApp</span>
            </a>

            <!-- Full Cart Page Link -->
            <a href="carrinho.html" class="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-[#DFA437] hover:text-[#1E130D] text-white text-xs font-bold flex items-center justify-center gap-2 border border-white/15 hover:border-transparent transition-all mb-3">
              <iconify-icon icon="solar:bag-5-bold-duotone" width="16"></iconify-icon>
              <span>Ver Página Completa do Carrinho →</span>
            </a>

            <div class="flex items-center justify-between text-[11px] text-gray-400 pt-1">
              <button id="drawer-clear-btn" class="text-gray-500 hover:text-red-400 transition-colors flex items-center gap-1">
                <iconify-icon icon="solar:trash-bin-trash-bold" width="13"></iconify-icon>
                <span>Limpar carrinho</span>
              </button>
              <span class="flex items-center gap-1 text-gray-400">
                <iconify-icon icon="solar:shield-check-bold" width="13" class="text-[#25D366]"></iconify-icon>
                <span>Pedido 100% seguro</span>
              </span>
            </div>
          </div>

        </div>
      </div>

      <!-- FLOATING TOAST NOTIFICATION -->
      <div id="sabor-cart-toast" class="fixed bottom-6 left-6 z-[110] transform translate-y-12 opacity-0 pointer-events-none transition-all duration-300 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-[#1E130D]/95 text-white border border-[#DFA437]/50 shadow-2xl backdrop-blur-md text-xs font-semibold">
        <div id="toast-icon" class="w-6 h-6 rounded-full bg-[#25D366]/20 text-[#25D366] flex items-center justify-center">
          <iconify-icon icon="solar:check-circle-bold" width="16"></iconify-icon>
        </div>
        <span id="toast-message">Item atualizado!</span>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', drawerHTML);
  }

  bindEvents() {
    // Backdrop click
    const backdrop = document.getElementById('sabor-cart-backdrop');
    if (backdrop) {
      backdrop.addEventListener('click', () => this.closeCart());
    }

    // Close button
    const closeBtn = document.getElementById('sabor-cart-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeCart());
    }

    // Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.closeCart();
    });

    // Clear cart
    const clearBtn = document.getElementById('drawer-clear-btn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (confirm('Deseja realmente limpar todos os itens do carrinho?')) {
          this.clearCart();
        }
      });
    }

    // Universal cart trigger buttons
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('[data-cart-open], .cart-trigger-btn');
      if (trigger) {
        e.preventDefault();
        this.openCart();
      }
    });

    // Stepper buttons inside drawer or elsewhere
    document.addEventListener('click', (e) => {
      const addBtn = e.target.closest('[data-cart-add]');
      if (addBtn) {
        e.preventDefault();
        const id = addBtn.dataset.cartAdd;
        this.addItem(id);
        return;
      }

      const removeBtn = e.target.closest('[data-cart-remove]');
      if (removeBtn) {
        e.preventDefault();
        const id = removeBtn.dataset.cartRemove;
        this.removeItem(id);
        return;
      }

      const deleteBtn = e.target.closest('[data-cart-delete]');
      if (deleteBtn) {
        e.preventDefault();
        const id = deleteBtn.dataset.cartDelete;
        this.deleteItem(id);
        return;
      }
    });
  }

  openCart() {
    const drawer = document.getElementById('sabor-cart-drawer');
    const panel = document.getElementById('sabor-cart-panel');
    const backdrop = document.getElementById('sabor-cart-backdrop');
    if (!drawer || !panel) return;

    this.renderDrawer();
    clearTimeout(this._closeTimeout);
    drawer.classList.remove('hidden');
    // Force browser reflow so transition executes smoothly
    void drawer.offsetWidth;
    drawer.classList.remove('pointer-events-none', 'opacity-0');
    drawer.classList.add('opacity-100', 'pointer-events-auto');
    if (backdrop) backdrop.classList.add('pointer-events-auto');
    if (panel) panel.classList.add('pointer-events-auto');
    panel.classList.remove('translate-x-full');
    panel.classList.add('translate-x-0');
    document.body.style.overflow = 'hidden';
  }

  closeCart() {
    const drawer = document.getElementById('sabor-cart-drawer');
    const panel = document.getElementById('sabor-cart-panel');
    const backdrop = document.getElementById('sabor-cart-backdrop');
    if (!drawer || !panel) return;

    drawer.classList.remove('opacity-100', 'pointer-events-auto');
    drawer.classList.add('opacity-0', 'pointer-events-none');
    if (backdrop) backdrop.classList.remove('pointer-events-auto');
    if (panel) panel.classList.remove('pointer-events-auto');
    panel.classList.remove('translate-x-0');
    panel.classList.add('translate-x-full');
    
    // Completely hide with display:none after 320ms transition so it can NEVER intercept clicks
    clearTimeout(this._closeTimeout);
    this._closeTimeout = setTimeout(() => {
      if (drawer.classList.contains('opacity-0')) {
        drawer.classList.add('hidden');
      }
    }, 320);

    // Only restore body overflow if no modal is open
    const modal = document.getElementById('jar-modal');
    if (!modal || modal.classList.contains('hidden')) {
      document.body.style.overflow = '';
    }
  }

  updateBadges() {
    const count = this.getTotalCount();
    const total = this.getTotalPrice();
    const formattedTotal = formatBRL(total);

    // Update all badge elements with .cart-count-badge
    document.querySelectorAll('.cart-count-badge').forEach(el => {
      el.textContent = count;
      if (count > 0) {
        el.classList.remove('hidden');
        el.classList.add('flex');
        el.classList.add('badge-pop');
        setTimeout(() => el.classList.remove('badge-pop'), 300);
      } else {
        el.classList.add('hidden');
        el.classList.remove('flex');
      }
    });

    // Update all total elements with .cart-total-badge
    document.querySelectorAll('.cart-total-badge').forEach(el => {
      el.textContent = formattedTotal;
    });

    // Update header count in drawer
    const headerCount = document.getElementById('drawer-header-count');
    if (headerCount) {
      headerCount.textContent = `${count} ${count === 1 ? 'item' : 'itens'}`;
    }
  }

  renderDrawer() {
    const container = document.getElementById('sabor-cart-items-container');
    const subtotalEl = document.getElementById('drawer-subtotal');
    const grandTotalEl = document.getElementById('drawer-grand-total');
    const checkoutBtn = document.getElementById('drawer-checkout-btn');
    const footerEl = document.getElementById('sabor-cart-footer');

    if (!container) return;

    const items = this.getItemsList();
    const totalCount = this.getTotalCount();
    const totalPrice = this.getTotalPrice();
    const formattedTotal = formatBRL(totalPrice);

    if (subtotalEl) subtotalEl.textContent = formattedTotal;
    if (grandTotalEl) grandTotalEl.textContent = formattedTotal;
    if (checkoutBtn) checkoutBtn.href = this.getWhatsAppCheckoutUrl();

    if (items.length === 0) {
      container.innerHTML = `
        <div class="h-full flex flex-col items-center justify-center text-center p-6 text-gray-400">
          <div class="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-gray-500">
            <iconify-icon icon="solar:cart-large-minimalistic-broken" width="40"></iconify-icon>
          </div>
          <h4 class="font-heading font-bold text-lg text-white mb-2">Seu carrinho está vazio</h4>
          <p class="text-xs text-gray-400 font-light max-w-xs mb-6">
            Explore as prateleiras do nosso empório e adicione especiarias, doces ou conservas artesanais.
          </p>
          <a href="prateleiras.html" class="px-5 py-3 rounded-full bg-[#DFA437] hover:bg-[#C89028] text-[#1E130D] text-xs font-bold tracking-tight shadow-lg transition-transform hover:scale-105 flex items-center gap-2">
            <iconify-icon icon="solar:box-minimalistic-bold-duotone" width="16"></iconify-icon>
            <span>Explorar Prateleiras</span>
          </a>
        </div>
      `;
      if (footerEl) footerEl.classList.add('opacity-40', 'pointer-events-none');
    } else {
      if (footerEl) footerEl.classList.remove('opacity-40', 'pointer-events-none');

      container.innerHTML = items.map(item => {
        const itemSubtotal = formatBRL(item.price * item.qty);
        const itemPrice = formatBRL(item.price);

        let categoryTagColor = 'bg-[#B8482A]/20 text-[#B8482A] border-[#B8482A]/30';
        if (item.category === 'doces') {
          categoryTagColor = 'bg-[#DFA437]/20 text-[#DFA437] border-[#DFA437]/30';
        } else if (item.category === 'conservas') {
          categoryTagColor = 'bg-[#25D366]/20 text-[#25D366] border-[#25D366]/30';
        }

        return `
          <div class="p-3.5 sm:p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all flex items-center justify-between gap-3">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${categoryTagColor}">
                  ${item.categoryName || item.category}
                </span>
                <span class="text-[11px] text-gray-400">${item.weight}</span>
              </div>
              <h5 class="text-sm font-bold text-white truncate" title="${item.name}">${item.name}</h5>
              <div class="text-xs text-gray-400 mt-0.5">
                <span class="text-[#DFA437] font-semibold">${itemPrice}</span> / un.
              </div>
            </div>

            <!-- Controls: Minus, Qty, Plus, Delete -->
            <div class="flex flex-col items-end gap-2 shrink-0">
              <div class="flex items-center gap-1.5 bg-black/50 p-1 rounded-xl border border-white/10">
                <button data-cart-remove="${item.id}" class="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 active:scale-95 text-white flex items-center justify-center transition-colors text-sm font-bold" title="Diminuir quantidade">
                  −
                </button>
                <span class="w-7 text-center text-xs font-bold text-white">${item.qty}</span>
                <button data-cart-add="${item.id}" class="w-7 h-7 rounded-lg bg-[#DFA437]/20 hover:bg-[#DFA437]/30 text-[#DFA437] active:scale-95 flex items-center justify-center transition-colors text-sm font-bold" title="Aumentar quantidade">
                  +
                </button>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-xs font-bold text-white">${itemSubtotal}</span>
                <button data-cart-delete="${item.id}" class="text-gray-500 hover:text-red-400 transition-colors p-0.5" title="Remover item">
                  <iconify-icon icon="solar:trash-bin-trash-linear" width="14"></iconify-icon>
                </button>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  showToast(message, type = 'add') {
    const toast = document.getElementById('sabor-cart-toast');
    const msgEl = document.getElementById('toast-message');
    const iconEl = document.getElementById('toast-icon');

    if (!toast || !msgEl) return;

    msgEl.textContent = message;

    if (type === 'add') {
      iconEl.className = 'w-6 h-6 rounded-full bg-[#25D366]/20 text-[#25D366] flex items-center justify-center';
      iconEl.innerHTML = '<iconify-icon icon="solar:check-circle-bold" width="16"></iconify-icon>';
    } else {
      iconEl.className = 'w-6 h-6 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center';
      iconEl.innerHTML = '<iconify-icon icon="solar:trash-bin-trash-bold" width="16"></iconify-icon>';
    }

    toast.classList.remove('translate-y-12', 'opacity-0', 'pointer-events-none');
    toast.classList.add('translate-y-0', 'opacity-100');

    clearTimeout(this._toastTimeout);
    this._toastTimeout = setTimeout(() => {
      toast.classList.remove('translate-y-0', 'opacity-100');
      toast.classList.add('translate-y-12', 'opacity-0', 'pointer-events-none');
    }, 2500);
  }
}

// Global Cart Instance
window.CartApp = new CartManager();
