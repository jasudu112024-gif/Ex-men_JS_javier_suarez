/**
 * Módulo de carrito de compras y proceso de checkout para la vista pública.
 * Gestiona la adición, eliminación y compra de eventos desde localStorage.
 */

const cartKey = 'conciertos_carrito';
const salesKey = 'conciertos_ventas';

/**
 * Carga los items del carrito desde localStorage.
 * @returns {Array} Items almacenados en el carrito
 */
function loadCart() {
  const raw = localStorage.getItem(cartKey);
  return raw ? JSON.parse(raw) : [];
}

/**
 * Guarda el carrito en localStorage.
 * @param {Array} cart - Items del carrito a persistir
 */
function saveCart(cart) {
  localStorage.setItem(cartKey, JSON.stringify(cart));
}

/**
 * Agrega un evento al carrito si no existe ya.
 * @param {Object} event - Evento a agregar
 */
function addToCart(event) {
  const cart = loadCart();
  cart.push(event);
  saveCart(cart);
  updateCartCount();
  showCartToast(event.nombre || 'Evento');
}

function showCartToast(nombre) {
  const existing = document.getElementById('cart-toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.id = 'cart-toast';
  toast.textContent = nombre + ' agregado al carrito';
  Object.assign(toast.style, {
    position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: '9999',
    background: 'rgba(0,0,0,0.85)', color: '#f7d34e', padding: '0.75rem 1.25rem',
    borderRadius: '0.5rem', fontSize: '0.9rem', border: '1px solid rgba(247,211,78,0.25)',
    opacity: '0', transform: 'translateY(1rem)', transition: 'opacity 0.3s, transform 0.3s'
  });
  document.body.appendChild(toast);
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  });
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(1rem)';
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}

/**
 * Elimina un evento del carrito por su id.
 * @param {number|string} id - Identificador del evento a remover
 */
function removeFromCart(id) {
  const cart = loadCart();
  const index = cart.findIndex(item => item.id === id);
  if (index !== -1) cart.splice(index, 1);
  saveCart(cart);
  renderCart();
  updateCartCount();
}

/**
 * Vacía el carrito por completo.
 */
function clearCart() {
  saveCart([]);
  updateCartCount();
}

/**
 * Actualiza el contador visual del carrito en la interfaz.
 */
function updateCartCount() {
  const count = loadCart().length;
  const cartCount = document.getElementById('cart-count');
  if (cartCount) cartCount.textContent = count;
}

/**
 * Renderiza los items del carrito en el panel lateral.
 * Muestra el total acumulado y un mensaje si está vacío.
 */
function renderCart() {
  const cartItems = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  if (!cartItems || !cartTotal) return;

  const cart = loadCart();
  cartItems.innerHTML = '';

  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="empty-cart">No hay eventos en el carrito.</p>';
    cartTotal.textContent = '$0';
    return;
  }

  let total = 0;
  cart.forEach(item => {
    total += Number(item.precio);
    const card = document.createElement('article');
    card.className = 'cart-item';
    card.innerHTML = `
      <div>
        <strong>${item.nombre}</strong>
        <span>${item.ciudad} · ${item.fecha} ${item.hora}</span>
      </div>
      <button class="icon-button" type="button" data-remove="${item.id}">Eliminar</button>
    `;
    cartItems.appendChild(card);
  });

  cartTotal.textContent = `$${total}`;
}

/**
 * Maneja clics dentro del contenedor del carrito (delegación de eventos).
 * Identifica botones de eliminar por su atributo data-remove.
 * @param {Event} event - Evento de clic
 */
function handleCartButtons(event) {
  const target = event.target;
  const removeId = target.dataset.remove;
  if (removeId) {
    removeFromCart(Number(removeId));
  }
}

/**
 * Abre el panel lateral del carrito y renderiza su contenido.
 */
function openCartPanel() {
  document.getElementById('cart-panel')?.classList.remove('hidden');
  document.getElementById('cart-backdrop')?.classList.add('active');
  renderCart();
}

/**
 * Cierra el panel lateral del carrito y oculta el backdrop.
 */
function closeCartPanel() {
  document.getElementById('cart-panel')?.classList.add('hidden');
  document.getElementById('cart-backdrop')?.classList.remove('active');
}

/**
 * Procesa el envío del formulario de checkout.
 * Crea un registro de venta, lo persiste y limpia el carrito.
 * @param {Event} event - Evento de submit del formulario
 */
function handleCheckoutSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  const cart = loadCart();
  if (!cart.length) return;

  const total = cart.reduce((sum, item) => sum + Number(item.precio), 0);
  const sale = {
    id: Date.now(),
    fecha: new Date().toISOString(),
    cliente: {
      identificacion: data.identificacion,
      nombre: data.nombre,
      direccion: data.direccion,
      telefono: data.telefono,
      email: data.email
    },
    ciudad: data.ciudad,
    items: cart,
    total
  };

  const sales = loadSales();
  sales.unshift(sale);
  saveSales(sales);
  clearCart();
  form.reset();
  form.classList.add('hidden');
  document.getElementById('checkout-button')?.classList.remove('hidden');
  renderCart();
  updateCartCount();
  const msg = document.getElementById('checkout-message');
  if (msg) {
    msg.textContent = 'Compra registrada con éxito.';
    msg.classList.remove('hidden');
  }
  setTimeout(() => {
    if (msg) msg.classList.add('hidden');
    closeCartPanel();
  }, 1500);
}

/**
 * Carga las ventas almacenadas en localStorage.
 * @returns {Array} Lista de ventas
 */
function loadSales() {
  const raw = localStorage.getItem(salesKey);
  return raw ? JSON.parse(raw) : [];
}

/**
 * Guarda las ventas en localStorage.
 * @param {Array} sales - Lista de ventas a persistir
 */
function saveSales(sales) {
  localStorage.setItem(salesKey, JSON.stringify(sales));
}

/**
 * Inicializa el módulo del carrito: registra event listeners
 * para abrir/cerrar panel, botones de eliminar y formulario de checkout.
 */
function initCartModule() {
  document.getElementById('open-cart')?.addEventListener('click', openCartPanel);
  document.getElementById('close-cart')?.addEventListener('click', closeCartPanel);
  document.getElementById('cart-backdrop')?.addEventListener('click', closeCartPanel);
  document.getElementById('cart-items')?.addEventListener('click', handleCartButtons);
  document.getElementById('checkout-button')?.addEventListener('click', () => {
    document.getElementById('checkout-form')?.classList.remove('hidden');
  });
  document.getElementById('checkout-form')?.addEventListener('submit', handleCheckoutSubmit);
  updateCartCount();
}

window.initCartModule = initCartModule;
