/**
 * EMPÓRIO SABOR DA TERRA — PÁGINA DO CARRINHO DE COMPRAS
 * Renderização dinâmica da lista de itens, cálculo de totais e finalização via WhatsApp.
 */

document.addEventListener('DOMContentLoaded', () => {
  initCartPage();
});

function initCartPage() {
  const container = document.getElementById('cart-page-items');
  const emptyState = document.getElementById('cart-page-empty');
  const tableWrapper = document.getElementById('cart-page-content');
  const summarySubtotal = document.getElementById('cart-summary-subtotal');
  const summaryTotal = document.getElementById('cart-summary-total');
  const summaryCount = document.getElementById('cart-summary-count');
  const checkoutBtn = document.getElementById('cart-whatsapp-checkout-btn');
  const clearCartBtn = document.getElementById('cart-clear-page-btn');

  const inputName = document.getElementById('customer-name');
  const inputCity = document.getElementById('customer-city');
  const inputNotes = document.getElementById('customer-notes');

  // Load saved draft customer info if available
  try {
    if (inputName) inputName.value = sessionStorage.getItem('sabordaterra_draft_name') || '';
    if (inputCity) inputCity.value = sessionStorage.getItem('sabordaterra_draft_city') || '';
    if (inputNotes) inputNotes.value = sessionStorage.getItem('sabordaterra_draft_notes') || '';
  } catch (e) {}

  function saveDraftInfo() {
    try {
      if (inputName) sessionStorage.setItem('sabordaterra_draft_name', inputName.value);
      if (inputCity) sessionStorage.setItem('sabordaterra_draft_city', inputCity.value);
      if (inputNotes) sessionStorage.setItem('sabordaterra_draft_notes', inputNotes.value);
    } catch (e) {}
    updateCheckoutUrl();
  }

  if (inputName) inputName.addEventListener('input', saveDraftInfo);
  if (inputCity) inputCity.addEventListener('input', saveDraftInfo);
  if (inputNotes) inputNotes.addEventListener('input', saveDraftInfo);

  function updateCheckoutUrl() {
    if (!checkoutBtn) return;
    const cart = window.CartApp;
    if (!cart) return;

    const items = cart.getItemsList();
    if (items.length === 0) {
      checkoutBtn.href = 'https://wa.me/5518991621203?text=Ol%C3%A1!%20Gostaria%20de%20conhecer%20os%20produtos%20do%20Emp%C3%B3rio%20Sabor%20da%20Terra.';
      return;
    }

    const name = inputName ? inputName.value.trim() : '';
    const city = inputCity ? inputCity.value.trim() : '';
    const notes = inputNotes ? inputNotes.value.trim() : '';

    let text = `*PEDIDO — EMPÓRIO SABOR DA TERRA*\n`;
    text += `Olá! Gostaria de confirmar o pedido dos seguintes itens:\n\n`;

    if (name || city) {
      text += `👤 *DADOS PARA ENTREGA:*\n`;
      if (name) text += `• *Nome:* ${name}\n`;
      if (city) text += `• *Localização/Cidade:* ${city}\n`;
      if (notes) text += `• *Observações:* ${notes}\n`;
      text += `\n`;
    }

    text += `🛒 *ITENS SELECIONADOS:*\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━━━━━\n`;

    items.forEach((item, index) => {
      const itemSubtotal = formatBRL(item.price * item.qty);
      text += `${index + 1}. *${item.qty}x* ${item.name} (${item.weight})\n`;
      text += `   ↳ Valor unit.: ${formatBRL(item.price)} | Subtotal: *${itemSubtotal}*\n`;
    });

    const totalCount = cart.getTotalCount();
    const totalPriceNum = cart.getTotalPrice();
    const totalPrice = formatBRL(totalPriceNum);

    if (totalPriceNum >= 80.00) {
      text += `🎁 *BRINDE DESBLOQUEADO:* Parabéns! Seu pedido atingiu R$ 80 e tem direito a 1 sachê de tempero caipira de brinde!\n`;
    }

    text += `━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    text += `💰 *TOTAL DO PEDIDO:* ${totalPrice} (${totalCount} ${totalCount === 1 ? 'item' : 'itens'})\n\n`;
    text += `Por favor, como combinamos a forma de pagamento (Pix / Cartão) e a entrega?`;

    checkoutBtn.href = `https://wa.me/5518991621203?text=${encodeURIComponent(text)}`;
  }

  function renderPage() {
    const cart = window.CartApp;
    if (!cart) return;

    const items = cart.getItemsList();
    const totalCount = cart.getTotalCount();
    const totalPrice = cart.getTotalPrice();
    const formattedTotal = formatBRL(totalPrice);

    if (summarySubtotal) summarySubtotal.textContent = formattedTotal;
    if (summaryTotal) summaryTotal.textContent = formattedTotal;
    if (summaryCount) summaryCount.textContent = `${totalCount} ${totalCount === 1 ? 'item' : 'itens'}`;

    // Update Free Gift Reward Progress Bar
    const rewardFill = document.getElementById('cart-reward-progress-fill');
    const rewardText = document.getElementById('cart-reward-text');
    const rewardBadge = document.getElementById('cart-reward-badge');
    const threshold = 80.00;

    if (rewardFill && rewardText) {
      const pct = Math.min(100, (totalPrice / threshold) * 100);
      rewardFill.style.width = `${pct}%`;
      if (totalPrice >= threshold) {
        rewardFill.classList.add('unlocked');
        if (rewardBadge) {
          rewardBadge.textContent = 'Desbloqueado! 🎉';
          rewardBadge.className = 'text-[10px] font-bold text-[#25D366] bg-[#25D366]/15 px-2 py-0.5 rounded-full';
        }
        rewardText.innerHTML = '🎉 <strong>Parabéns!</strong> Você ganhou 1 sachê de tempero caipira de brinde no seu pedido!';
      } else {
        rewardFill.classList.remove('unlocked');
        const diff = threshold - totalPrice;
        if (rewardBadge) {
          rewardBadge.textContent = `Meta R$ ${threshold.toFixed(0)}`;
          rewardBadge.className = 'text-[10px] font-bold text-[#B23B1E] bg-[#B23B1E]/10 px-2 py-0.5 rounded-full';
        }
        rewardText.innerHTML = `Adicione mais <strong class="text-[#B23B1E] font-bold">R$ ${diff.toFixed(2).replace('.', ',')}</strong> para ganhar 1 sachê de tempero de brinde!`;
      }
    }

    if (items.length === 0) {
      if (emptyState) emptyState.classList.remove('hidden');
      if (tableWrapper) tableWrapper.classList.add('hidden');
    } else {
      if (emptyState) emptyState.classList.add('hidden');
      if (tableWrapper) tableWrapper.classList.remove('hidden');

      if (container) {
        container.innerHTML = items.map(item => {
          const itemSubtotal = formatBRL(item.price * item.qty);
          const itemPrice = formatBRL(item.price);

          let categoryBadgeColor = 'bg-[#B8482A]/15 text-[#B8482A] border-[#B8482A]/30';
          if (item.category === 'doces') {
            categoryBadgeColor = 'bg-[#DFA437]/20 text-[#DFA437] border-[#DFA437]/30';
          } else if (item.category === 'conservas') {
            categoryBadgeColor = 'bg-[#25D366]/15 text-[#1A3628] border-[#25D366]/30';
          }

          return `
            <div class="p-4 sm:p-5 rounded-2xl bg-white border border-[#E8DCC8] shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <!-- Item Details -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1.5">
                  <span class="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full border ${categoryBadgeColor} font-serif-vintage">
                    ${item.categoryName || item.category}
                  </span>
                  <span class="text-xs text-gray-500 font-semibold bg-gray-100 px-2 py-0.5 rounded-md">
                    ${item.weight}
                  </span>
                </div>
                <h4 class="font-heading font-bold text-base sm:text-lg text-[#1E130D] leading-snug">
                  ${item.name}
                </h4>
                <div class="text-xs text-gray-500 mt-1">
                  Preço unitário: <strong class="text-[#B8482A]">${itemPrice}</strong>
                </div>
              </div>

              <!-- Stepper Controls & Subtotal -->
              <div class="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#E8DCC8]/60">
                <!-- Stepper -->
                <div class="flex items-center gap-2 bg-[#FAF6F0] p-1.5 rounded-2xl border border-[#E8DCC8]">
                  <button data-cart-remove="${item.id}"
                    class="w-8 h-8 rounded-xl bg-white hover:bg-gray-200 active:scale-95 text-[#1E130D] flex items-center justify-center transition-all text-base font-bold shadow-2xs border border-[#E8DCC8]/60"
                    title="Diminuir quantidade">
                    −
                  </button>
                  <span class="w-8 text-center text-sm font-extrabold text-[#1E130D]">${item.qty}</span>
                  <button data-cart-add="${item.id}"
                    class="w-8 h-8 rounded-xl bg-[#DFA437] hover:bg-[#C89028] active:scale-95 text-[#1E130D] flex items-center justify-center transition-all text-base font-bold shadow-2xs"
                    title="Aumentar quantidade">
                    +
                  </button>
                </div>

                <!-- Subtotal -->
                <div class="text-right min-w-[90px]">
                  <span class="text-[10px] uppercase tracking-wider text-gray-400 block font-medium">Subtotal</span>
                  <span class="font-heading font-extrabold text-base sm:text-lg text-[#1E130D]">${itemSubtotal}</span>
                </div>

                <!-- Delete Trash Button -->
                <button data-cart-delete="${item.id}"
                  class="w-8 h-8 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors flex items-center justify-center"
                  title="Remover produto do carrinho">
                  <iconify-icon icon="solar:trash-bin-trash-bold" width="18"></iconify-icon>
                </button>
              </div>
            </div>
          `;
        }).join('');
      }
    }

    updateCheckoutUrl();
  }

  // Clear Cart Button
  if (clearCartBtn) {
    clearCartBtn.addEventListener('click', () => {
      if (confirm('Tem certeza que deseja esvaziar todos os itens do carrinho?')) {
        window.CartApp.clearCart();
      }
    });
  }

  // Re-render whenever cart updates
  window.addEventListener('sabordaterra:cart-updated', () => {
    renderPage();
  });

  renderPage();
}
