/**
 * Módulo de administración: login, gestión de categorías, eventos,
 * ventas, mensajes de contacto y exportación de datos.
 */

const ADMIN_EMAIL = 'admin@mail';
const ADMIN_PASSWORD = '123456';

const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const logoutButton = document.getElementById('logout-button');
const navLinks = document.querySelectorAll('.sidebar-nav a');
const loginSection = document.getElementById('login-section');
const menuSection = document.getElementById('menu-section');
const dashboardSection = document.getElementById('dashboard-section');
const categoriasSection = document.getElementById('categorias-section');
const eventosSection = document.getElementById('eventos-section');
const ventasSection = document.getElementById('ventas-section');
const countCategories = document.getElementById('count-categories');
const countEvents = document.getElementById('count-events');
const countSales = document.getElementById('count-sales');
const countRevenue = document.getElementById('count-revenue');
const liveTime = document.getElementById('live-time');
const categoryForm = document.getElementById('category-form');
const categoriesBody = document.getElementById('categories-body');
const eventForm = document.getElementById('event-form');
const eventCategorySelect = eventForm?.querySelector('select[name="categoriaId"]');
const ciudadSelect = document.getElementById('ciudad-select');
const eventsBody = document.getElementById('events-body');
const salesBody = document.getElementById('sales-body');
const mensajesSection = document.getElementById('mensajes-section');
const messagesBody = document.getElementById('messages-body');

/**
 * Determina si la página actual es la de login.
 * @returns {boolean} True si existe el formulario de login
 */
function isLoginPage() {
  return !!loginForm;
}

/**
 * Determina si la página actual es la SPA de administración (eventos.html).
 * @returns {boolean} True si existen secciones de menú o eventos
 */
function isSpaPage() {
  return !!(menuSection || (eventosSection && !isLoginPage()));
}

/**
 * Obtiene la lista de categorías desde localStorage.
 * @returns {Array} Lista de categorías
 */
function getCategoriasAdmin() {
  return loadCategorias() || [];
}

/**
 * Obtiene la lista de eventos desde localStorage.
 * @returns {Array} Lista de eventos
 */
function getEventosAdmin() {
  return loadEventos() || [];
}

/**
 * Obtiene la lista de ventas desde localStorage.
 * @returns {Array} Lista de ventas
 */
function getVentasAdmin() {
  return loadVentas() || [];
}

/**
 * Actualiza los indicadores del panel de dashboard con los datos actuales.
 */
function updateDashboard() {
  const categorias = getCategoriasAdmin();
  const eventos = getEventosAdmin();
  const ventas = getVentasAdmin();
  const totalRevenue = ventas.reduce((sum, venta) => sum + Number(venta.total), 0);

  if (countCategories) countCategories.textContent = categorias.length;
  if (countEvents) countEvents.textContent = eventos.length;
  if (countSales) countSales.textContent = ventas.length;
  if (countRevenue) countRevenue.textContent = `$${totalRevenue}`;
  updateLiveTime();
}

/**
 * Actualiza el reloj en vivo en la interfaz con la hora actual.
 */
function updateLiveTime() {
  if (liveTime) {
    liveTime.textContent = new Date().toLocaleTimeString('es-CO');
  }
}

/**
 * Muestra la sección de login y oculta el resto de paneles.
 */
function showLogin() {
  if (loginSection) loginSection.classList.remove('hidden');
  if (dashboardSection) dashboardSection.classList.add('hidden');
  if (categoriasSection) categoriasSection.classList.add('hidden');
  if (eventosSection) eventosSection.classList.add('hidden');
  if (ventasSection) ventasSection.classList.add('hidden');
  if (mensajesSection) mensajesSection.classList.add('hidden');
  if (logoutButton) logoutButton.classList.add('hidden');
  navLinks.forEach(link => link.classList.remove('active'));
  if (loginError) {
    loginError.classList.add('hidden');
  }
}

/**
 * Muestra una sección del panel de administración y oculta las demás.
 * Verifica la sesión activa antes de mostrar contenido protegido.
 * @param {string} sectionId - Identificador de la sección (menu, dashboard, categorias, eventos, ventas, mensajes)
 */
function showSection(sectionId) {
  if (!loadSesionAdmin()) {
    window.location.href = 'admin.html';
    return;
  }

  if (isSpaPage()) {
    if (menuSection) menuSection.classList.add('hidden');
    if (dashboardSection) dashboardSection.classList.add('hidden');
    if (categoriasSection) categoriasSection.classList.add('hidden');
    if (eventosSection) eventosSection.classList.add('hidden');
    if (ventasSection) ventasSection.classList.add('hidden');
    if (mensajesSection) mensajesSection.classList.add('hidden');
  }

  const section = document.getElementById(`${sectionId}-section`);
  if (section) section.classList.remove('hidden');

  if (logoutButton) logoutButton.classList.remove('hidden');

  navLinks.forEach(link => {
    link.classList.toggle('active', link.dataset.section === sectionId);
  });

  if (sectionId === 'menu' || sectionId === 'dashboard') {
    updateDashboard();
  }

  if (sectionId === 'categorias') {
    renderCategorias();
    fillEventCategorySelect();
  }

  if (sectionId === 'eventos') {
    renderEventos();
    fillEventCategorySelect();
  }

  if (sectionId === 'ventas') {
    renderVentas();
  }

  if (sectionId === 'mensajes') {
    renderMensajes();
  }
}

/**
 * Persiste la lista de categorías.
 * @param {Array} categorias - Lista de categorías a guardar
 */
function saveCategoryList(categorias) {
  saveCategorias(categorias);
}

/**
 * Persiste la lista de eventos.
 * @param {Array} eventos - Lista de eventos a guardar
 */
function saveEventList(eventos) {
  saveEventos(eventos);
}

/**
 * Persiste la lista de ventas.
 * @param {Array} ventas - Lista de ventas a guardar
 */
function saveSaleList(ventas) {
  saveVentas(ventas);
}

/**
 * Renderiza la tabla de categorías con opciones de editar y eliminar.
 */
function renderCategorias() {
  const categorias = getCategoriasAdmin();
  if (!categoriesBody) return;

  if (!categorias.length) {
    categoriesBody.innerHTML = '<tr><td colspan="3">No hay categorías registradas.</td></tr>';
    return;
  }

  categoriesBody.innerHTML = categorias
    .map(categoria => `
      <tr>
        <td>${categoria.nombre}</td>
        <td>${categoria.descripcion}</td>
        <td>
          <button class="action-button edit" data-action="edit-category" data-id="${categoria.id}">Editar</button>
          <button class="action-button delete" data-action="delete-category" data-id="${categoria.id}">Eliminar</button>
        </td>
      </tr>
    `)
    .join('');
}

/**
 * Llena el select de categorías en el formulario de eventos.
 */
function fillEventCategorySelect() {
  if (!eventCategorySelect) return;
  const categorias = getCategoriasAdmin();
  eventCategorySelect.innerHTML = '<option value="">Selecciona categoría</option>';

  categorias.forEach(categoria => {
    const option = document.createElement('option');
    option.value = categoria.id;
    option.textContent = categoria.nombre;
    eventCategorySelect.appendChild(option);
  });
}

/**
 * Reinicia el formulario de categorías y limpia el campo oculto de id.
 */
function resetCategoryForm() {
  if (!categoryForm) return;
  categoryForm.reset();
  const idInput = categoryForm.querySelector('input[name="id"]');
  if (idInput) idInput.value = '';
}

/**
 * Reinicia el formulario de eventos, limpia selects y el campo oculto de id.
 */
function resetEventForm() {
  if (!eventForm) return;
  eventForm.reset();
  const idInput = eventForm.querySelector('input[name="id"]');
  if (idInput) idInput.value = '';
}

/**
 * Renderiza la tabla de eventos con datos de categoría, ciudad y acciones.
 */
function renderEventos() {
  const eventos = getEventosAdmin();
  if (!eventsBody) return;

  if (!eventos.length) {
    eventsBody.innerHTML = '<tr><td colspan="6">No hay eventos registrados.</td></tr>';
    return;
  }

  eventsBody.innerHTML = eventos
    .map(evento => {
      const categoria = getCategoriasAdmin().find(cat => cat.id === Number(evento.categoriaId));
      return `
        <tr>
          <td>${evento.codigo}</td>
          <td>${evento.nombre}</td>
          <td>${categoria?.nombre || 'Sin categoría'}</td>
          <td>${evento.ciudad}</td>
          <td>$${evento.precio}</td>
          <td>
            <button class="action-button edit" data-action="edit-event" data-id="${evento.id}">Editar</button>
            <button class="action-button delete" data-action="delete-event" data-id="${evento.id}">Eliminar</button>
          </td>
        </tr>
      `;
    })
    .join('');
}

/**
 * Renderiza la tabla de mensajes de contacto, ordenados por fecha descendente.
 */
function renderMensajes() {
  const contactos = typeof obtenerContactos === 'function' ? obtenerContactos() : [];
  if (!messagesBody) return;

  if (!contactos.length) {
    messagesBody.innerHTML = '<tr><td colspan="5">No hay mensajes de contacto.</td></tr>';
    return;
  }

  const ordenados = contactos.slice().sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

  messagesBody.innerHTML = ordenados
    .map(msg => `
      <tr>
        <td>${new Date(msg.fecha).toLocaleString('es-CO')}</td>
        <td>${msg.nombre}</td>
        <td>${msg.email}</td>
        <td>${msg.asunto}</td>
        <td>${msg.mensaje}</td>
      </tr>
    `)
    .join('');
}

/**
 * Renderiza la tabla de ventas, ordenadas por fecha descendente.
 */
function renderVentas() {
  const ventas = getVentasAdmin();
  if (!salesBody) return;

  if (!ventas.length) {
    salesBody.innerHTML = '<tr><td colspan="5">No hay ventas registradas.</td></tr>';
    return;
  }

  const ventasOrdenadas = ventas.slice().sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

  salesBody.innerHTML = ventasOrdenadas
    .map(venta => `
      <tr>
        <td>${new Date(venta.fecha).toLocaleString('es-CO')}</td>
        <td>${venta.cliente.nombre}</td>
        <td>${venta.ciudad}</td>
        <td>$${venta.total}</td>
        <td><button class="action-button edit" data-action="view-sale" data-id="${venta.id}">Detalle</button></td>
      </tr>
    `)
    .join('');
}

/**
 * Rellena el formulario de categorías con los datos de una categoría existente.
 * @param {number|string} categoriaId - Id de la categoría a editar
 */
function fillCategoryForm(categoriaId) {
  const categorias = getCategoriasAdmin();
  const categoria = categorias.find(c => Number(c.id) === Number(categoriaId));
  if (!categoria) return;

  const idInput = categoryForm?.querySelector('input[name="id"]');
  const nombreInput = categoryForm?.querySelector('input[name="nombre"]');
  const descripcionInput = categoryForm?.querySelector('input[name="descripcion"]');

  if (idInput) idInput.value = categoria.id;
  if (nombreInput) nombreInput.value = categoria.nombre;
  if (descripcionInput) descripcionInput.value = categoria.descripcion;
}

/**
 * Rellena el formulario de eventos con los datos de un evento existente.
 * @param {number|string} eventoId - Id del evento a editar
 */
function fillEventForm(eventoId) {
  const eventos = getEventosAdmin();
  const evento = eventos.find(e => Number(e.id) === Number(eventoId));
  if (!evento) return;

  const idInput = eventForm?.querySelector('input[name="id"]');
  const codigoInput = eventForm?.querySelector('input[name="codigo"]');
  const nombreInput = eventForm?.querySelector('input[name="nombre"]');
  const categoriaSelect = eventForm?.querySelector('select[name="categoriaId"]');
  const ciudadInput = eventForm?.querySelector('select[name="ciudad"]');
  const precioInput = eventForm?.querySelector('input[name="precio"]');
  const fechaInput = eventForm?.querySelector('input[name="fecha"]');
  const horaInput = eventForm?.querySelector('input[name="hora"]');
  const imagenInput = eventForm?.querySelector('input[name="imagen"]');
  const descripcionInput = eventForm?.querySelector('textarea[name="descripcion"]');

  if (idInput) idInput.value = evento.id;
  if (codigoInput) codigoInput.value = evento.codigo;
  if (nombreInput) nombreInput.value = evento.nombre;
  if (categoriaSelect) categoriaSelect.value = evento.categoriaId;
  if (precioInput) precioInput.value = evento.precio;
  if (fechaInput) fechaInput.value = evento.fecha;
  if (horaInput) horaInput.value = evento.hora;
  if (imagenInput) imagenInput.value = evento.imagen;
  if (descripcionInput) descripcionInput.value = evento.descripcion;
}

/**
 * Procesa el envío del formulario de categorías: crea o actualiza según exista id.
 * @param {Event} event - Evento de submit del formulario
 */
function handleCategorySubmit(event) {
  event.preventDefault();
  const formData = new FormData(categoryForm);
  const id = formData.get('id');
  const nombre = formData.get('nombre')?.toString().trim();
  const descripcion = formData.get('descripcion')?.toString().trim();
  const categorias = getCategoriasAdmin();

  if (!nombre || !descripcion) {
    return;
  }

  if (id) {
    const updated = categorias.map(categoria => {
      if (String(categoria.id) === String(id)) {
        return { ...categoria, nombre, descripcion };
      }
      return categoria;
    });
    saveCategoryList(updated);
  } else {
    categorias.push({ id: Date.now(), nombre, descripcion });
    saveCategoryList(categorias);
  }

  resetCategoryForm();
  fillEventCategorySelect();
  renderCategorias();
  updateDashboard();
}

/**
 * Procesa el envío del formulario de eventos: crea o actualiza según exista id.
 * @param {Event} event - Evento de submit del formulario
 */
function handleEventSubmit(event) {
  event.preventDefault();
  const formData = new FormData(eventForm);
  const id = formData.get('id');
  const codigo = formData.get('codigo')?.toString().trim();
  const nombre = formData.get('nombre')?.toString().trim();
  const categoriaId = formData.get('categoriaId');
  const precio = Number(formData.get('precio'));
  const fecha = formData.get('fecha')?.toString();
  const hora = formData.get('hora')?.toString();
  const ciudad = formData.get('ciudad')?.toString().trim();
  const imagen = formData.get('imagen')?.toString().trim();
  const descripcion = formData.get('descripcion')?.toString().trim();
  const eventos = getEventosAdmin();

  if (!codigo || !nombre || !categoriaId || !precio || !fecha || !hora || !ciudad || !imagen || !descripcion) {
    return;
  }

  if (id) {
    const updated = eventos.map(evento => {
      if (String(evento.id) === String(id)) {
        return {
          ...evento,
          codigo,
          nombre,
          categoriaId: Number(categoriaId),
          precio,
          fecha,
          hora,
          ciudad,
          imagen,
          descripcion
        };
      }
      return evento;
    });
    saveEventList(updated);
  } else {
    eventos.push({
      id: Date.now(),
      codigo,
      nombre,
      categoriaId: Number(categoriaId),
      precio,
      fecha,
      hora,
      ciudad,
      imagen,
      descripcion
    });
    saveEventList(eventos);
  }

  resetEventForm();
  renderEventos();
  updateDashboard();
}

/**
 * Maneja los clics en las tablas mediante delegación de eventos.
 * Identifica la acción (editar, eliminar, ver detalle) por el atributo data-action.
 * @param {Event} event - Evento de clic
 */
function handleTableClick(event) {
  const button = event.target.closest('button');
  if (!button) return;

  const action = button.dataset.action;
  const id = Number(button.dataset.id);

  if (action === 'edit-category') {
    fillCategoryForm(id);
    return;
  }

  if (action === 'delete-category') {
    if (!confirm('¿Eliminar esta categoría? También se eliminarán todos los eventos asociados.')) return;
    const categorias = getCategoriasAdmin().filter(categoria => Number(categoria.id) !== id);
    saveCategoryList(categorias);
    const eventos = getEventosAdmin().filter(evento => Number(evento.categoriaId) !== id);
    saveEventList(eventos);
    fillEventCategorySelect();
    renderCategorias();
    renderEventos();
    updateDashboard();
    return;
  }

  if (action === 'edit-event') {
    fillEventForm(id);
    return;
  }

  if (action === 'delete-event') {
    if (!confirm('¿Eliminar este evento?')) return;
    const eventos = getEventosAdmin().filter(evento => Number(evento.id) !== id);
    saveEventList(eventos);
    renderEventos();
    updateDashboard();
    return;
  }

  if (action === 'view-sale') {
    const ventas = getVentasAdmin();
    const venta = ventas.find(item => Number(item.id) === id);
    if (!venta) return;
    showSaleModal(venta);
  }
}

function showSaleModal(venta) {
  const existing = document.getElementById('sale-modal');
  if (existing) existing.remove();
  const backdrop = document.createElement('div');
  backdrop.id = 'sale-modal';
  Object.assign(backdrop.style, {
    position: 'fixed', inset: '0', zIndex: '10000',
    background: 'rgba(0,0,0,0.7)', display: 'flex',
    alignItems: 'center', justifyContent: 'center'
  });
  backdrop.addEventListener('click', (e) => { if (e.target === backdrop) backdrop.remove(); });
  const modal = document.createElement('div');
  Object.assign(modal.style, {
    background: '#1a1a1a', border: '1px solid rgba(247,211,78,0.2)',
    borderRadius: '1rem', padding: '2rem', maxWidth: '500px',
    width: '90%', color: '#e0d6c8', maxHeight: '80vh', overflowY: 'auto'
  });
  const itemsHtml = venta.items.map(item =>
    `<tr><td style="padding:0.25rem 0">${item.nombre}</td><td style="padding:0.25rem 0;text-align:right">$${item.precio}</td></tr>`
  ).join('');
  modal.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:1rem">
      <h3 style="margin:0;color:#f7d34e">Detalle de Venta</h3>
      <button id="sale-modal-close" style="background:none;border:none;color:#999;font-size:1.5rem;cursor:pointer">&times;</button>
    </div>
    <p style="margin:0 0 0.25rem;color:#999;font-size:0.85rem">${new Date(venta.fecha).toLocaleString('es-CO')}</p>
    <p style="margin:0 0 0.25rem"><strong>Cliente:</strong> ${venta.cliente.nombre}</p>
    <p style="margin:0 0 0.25rem"><strong>Documento:</strong> ${venta.cliente.identificacion}</p>
    <p style="margin:0 0 0.25rem"><strong>Email:</strong> ${venta.cliente.email}</p>
    <p style="margin:0 0 0.25rem"><strong>Telefono:</strong> ${venta.cliente.telefono}</p>
    <p style="margin:0 0 0.25rem"><strong>Direccion:</strong> ${venta.cliente.direccion}</p>
    <p style="margin:0 0 1rem"><strong>Ciudad:</strong> ${venta.ciudad}</p>
    <hr style="border-color:rgba(255,255,255,0.1);margin:1rem 0">
    <table style="width:100%;border-collapse:collapse">
      <thead><tr><th style="text-align:left;color:#f7d34e;padding-bottom:0.5rem">Item</th><th style="text-align:right;color:#f7d34e;padding-bottom:0.5rem">Precio</th></tr></thead>
      <tbody>${itemsHtml}</tbody>
    </table>
    <hr style="border-color:rgba(255,255,255,0.1);margin:1rem 0">
    <p style="text-align:right;font-size:1.1rem;margin:0"><strong>Total: <span style="color:#f7d34e">$${venta.total}</span></strong></p>
  `;
  backdrop.appendChild(modal);
  document.body.appendChild(backdrop);
  document.getElementById('sale-modal-close')?.addEventListener('click', () => backdrop.remove());
}

/**
 * Maneja la navegación entre secciones del panel SPA.
 * @param {Event} event - Evento de clic en enlace de navegación
 */
function handleNavClick(event) {
  event.preventDefault();
  const section = event.currentTarget.dataset.section;
  if (!section) return;
  if (!loadSesionAdmin()) {
    showLogin();
    return;
  }
  showSection(section);
}

/**
 * Procesa el inicio de sesión del administrador.
 * Verifica credenciales y redirige al panel si son correctas.
 * @param {Event} event - Evento de submit del formulario de login
 */
function handleLogin(event) {
  event.preventDefault();
  const data = new FormData(loginForm);
  const email = data.get('email')?.toString().trim();
  const password = data.get('password')?.toString().trim();

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    saveSesionAdmin({ email });
    if (loginError) loginError.classList.add('hidden');
    window.location.href = 'dashboard.html';
  } else {
    if (loginError) loginError.classList.remove('hidden');
  }
}

/**
 * Cierra la sesión del administrador y redirige al login.
 */
function handleLogout() {
  clearSesionAdmin();
  window.location.href = 'admin.html';
}

/**
 * Inicializa la página de login: vincula eventos y redirige si ya hay sesión activa.
 */
function initLoginPage() {
  loginForm.addEventListener('submit', handleLogin);
  loginForm.addEventListener('input', () => {
    if (loginError) loginError.classList.add('hidden');
  });

  if (loadSesionAdmin()) {
    window.location.href = 'dashboard.html';
    return;
  }

  showLogin();
}

/**
 * Exporta todos los datos (categorías, eventos, ventas, contactos)
 * a un archivo JSON descargable con respaldo de la fecha actual.
 */
function exportJSON() {
  const data = {
    categorias: loadCategorias(),
    eventos: loadEventos(),
    ventas: loadVentas(),
    contactos: typeof obtenerContactos === 'function' ? obtenerContactos() : []
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `conciertos_backup_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Inicializa la vista SPA de administración con navegación, formularios y exportación.
 */
function initSpaPage() {
  logoutButton.addEventListener('click', handleLogout);
  navLinks.forEach(link => link.addEventListener('click', handleNavClick));
  if (categoryForm) categoryForm.addEventListener('submit', handleCategorySubmit);
  if (eventForm) {
    eventForm.addEventListener('submit', handleEventSubmit);
  }
  if (categoriesBody) categoriesBody.addEventListener('click', handleTableClick);
  if (eventsBody) eventsBody.addEventListener('click', handleTableClick);
  if (salesBody) salesBody.addEventListener('click', handleTableClick);

  if (loadSesionAdmin()) {
    showSection('eventos');
    updateDashboard();
  } else {
    window.location.href = 'admin.html';
  }

  if (liveTime) {
    updateLiveTime();
    setInterval(updateLiveTime, 1000);
  }
}

/**
 * Inicializa páginas administrativas independientes (no SPA)
 * con sus tablas, formularios y botones de exportación.
 */
function initStandalonePage() {
  if (!loadSesionAdmin()) {
    window.location.href = 'admin.html';
    return;
  }

  logoutButton.addEventListener('click', handleLogout);

  document.querySelectorAll('.metric-card[data-href]').forEach(card => {
    card.addEventListener('click', () => {
      window.location.href = card.dataset.href;
    });
  });

  if (categoriesBody) {
    categoriesBody.addEventListener('click', handleTableClick);
    renderCategorias();
  }

  if (eventsBody) {
    eventsBody.addEventListener('click', handleTableClick);
    renderEventos();
  }

  if (salesBody) {
    salesBody.addEventListener('click', handleTableClick);
    renderVentas();
  }

  if (messagesBody) {
    renderMensajes();
  }

  if (categoryForm) {
    categoryForm.addEventListener('submit', handleCategorySubmit);
    fillEventCategorySelect();
  }

  if (eventForm) {
    eventForm.addEventListener('submit', handleEventSubmit);
    fillEventCategorySelect();
  }

  updateDashboard();

  if (liveTime) {
    updateLiveTime();
    setInterval(updateLiveTime, 1000);
  }
}

/**
 * Punto de entrada principal de la administración.
 * Detecta el tipo de página (login, SPA o independiente) e inicializa lo correspondiente.
 */
function initAdminApp() {
  if (isLoginPage()) {
    initLoginPage();
    return;
  }

  if (isSpaPage()) {
    initSpaPage();
    return;
  }

  initStandalonePage();
}

document.addEventListener('DOMContentLoaded', initAdminApp);
