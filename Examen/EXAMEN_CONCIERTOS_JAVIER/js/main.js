/**
 * Punto de entrada de la vista pública.
 * Gestiona la carga de datos, filtros, búsqueda y renderizado de eventos.
 */

let dataCategorias = [];
let dataEventos = [];

/**
 * Intenta cargar datos desde un archivo JSON remoto.
 * Si falla la petición, recurre a los datos en localStorage.
 * @returns {Promise<void>}
 */
async function loadDataFromJSON() {
  try {
    const res = await fetch('data/eventos.json');
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const json = await res.json();
    dataCategorias = json.categorias || [];
    dataEventos = json.eventos || [];
  } catch {
    dataCategorias = (typeof loadCategorias === 'function' && loadCategorias()) || [];
    dataEventos = (typeof loadEventos === 'function' && loadEventos()) || [];
  }
}

const eventsContainer = document.getElementById('events');
const searchInput = document.getElementById('search-input');
const categoryFilter = document.getElementById('category-filter');
const cityFilter = document.getElementById('city-filter');

/**
 * Formatea un valor numérico como moneda colombiana (COP).
 * @param {number} value - Precio a formatear
 * @returns {string} Precio formateado (ej. $120.000)
 */
function formatPrice(value) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(value);
}

/**
 * Obtiene las ciudades únicas a partir de una lista de eventos, ordenadas alfabéticamente.
 * @param {Array} eventos - Lista de eventos
 * @returns {string[]} Array de nombres de ciudades sin duplicados
 */
function getUniqueCities(eventos) {
  return [...new Set(eventos.map(evento => evento.ciudad))].sort();
}

/**
 * Retorna las categorías disponibles, priorizando datos cargados desde JSON.
 * @returns {Array} Lista de categorías
 */
function getCategorias() {
  return dataCategorias.length ? dataCategorias : (loadCategorias() || []);
}

/**
 * Retorna los eventos disponibles, priorizando datos cargados desde JSON.
 * @returns {Array} Lista de eventos
 */
function getEventos() {
  return dataEventos.length ? dataEventos : (loadEventos() || []);
}

/**
 * Llena un elemento select con opciones a partir de un array de valores.
 * @param {HTMLSelectElement|null} select - Elemento select a llenar
 * @param {string[]} values - Valores para las opciones
 * @param {string} defaultLabel - Texto para la opción por defecto
 */
function renderSelectOptions(select, values, defaultLabel) {
  if (!select) return;
  select.innerHTML = `<option value="">${defaultLabel}</option>`;
  values.forEach(value => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = value;
    select.appendChild(option);
  });
}

/**
 * Renderiza los filtros de categoría y ciudad en la interfaz pública.
 */
function renderFilters() {
  const categorias = getCategorias();
  renderSelectOptions(categoryFilter, categorias.map(c => c.nombre), 'Todas');

  const ciudades = getUniqueCities(getEventos());
  renderSelectOptions(cityFilter, ciudades, 'Todas');
}

/**
 * Filtra los eventos según los criterios de búsqueda, categoría y ciudad.
 * @returns {Array} Lista de eventos que coinciden con los filtros activos
 */
function filterEventos() {
  const eventos = getEventos();
  const search = searchInput?.value.trim().toLowerCase() || '';
  const category = categoryFilter?.value || '';
  const city = cityFilter?.value || '';

  return eventos.filter(evento => {
    const matchesSearch = evento.nombre.toLowerCase().includes(search);
    const matchesCategory = category ? getCategorias().find(cat => cat.id === Number(evento.categoriaId))?.nombre === category : true;
    const matchesCity = city ? evento.ciudad === city : true;
    return matchesSearch && matchesCategory && matchesCity;
  });
}

/**
 * Renderiza una lista de eventos como componentes <evento-card> en el contenedor.
 * @param {Array} eventos - Lista de eventos a mostrar
 */
function renderEvents(eventos) {
  if (!eventsContainer) return;
  eventsContainer.innerHTML = '';

  if (!eventos.length) {
    eventsContainer.innerHTML = '<p class="empty-results">No se encontraron eventos.</p>';
    return;
  }

  eventos.forEach(evento => {
    const card = document.createElement('evento-card');
    card.setAttribute('data-id', evento.id);
    card.setAttribute('nombre', evento.nombre);
    card.setAttribute('ciudad', evento.ciudad);
    card.setAttribute('fecha', evento.fecha);
    card.setAttribute('hora', evento.hora);
    card.setAttribute('precio', formatPrice(evento.precio));
    card.setAttribute('imagen', evento.imagen);
    card.setAttribute('categoria', getCategorias().find(c => c.id === Number(evento.categoriaId))?.nombre || 'General');
    card.setAttribute('descripcion', evento.descripcion);
    eventsContainer.appendChild(card);
  });
}

/**
 * Maneja el evento personalizado 'add-to-cart' disparado por cada tarjeta.
 * @param {CustomEvent} event - Evento con el id del evento en event.detail.id
 */
function handleAddToCart(event) {
  const payload = event.detail;
  if (!payload || !payload.id) return;

  const evento = getEventos().find(item => Number(item.id) === Number(payload.id));
  if (!evento) return;

  addToCart(evento);
}

/**
 * Aplica los filtros actuales y vuelve a renderizar los eventos.
 */
function applyFilters() {
  const filteredEventos = filterEventos();
  renderEvents(filteredEventos);
}

/**
 * Inicializa el formulario de contacto: guarda los datos al enviar
 * y muestra un mensaje de confirmación temporal.
 */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const msg = document.getElementById('contact-message');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    if (typeof guardarContacto === 'function') {
      guardarContacto(data);
    }
    form.reset();
    msg.textContent = 'Mensaje enviado con exito. Te contactaremos pronto.';
    msg.classList.remove('hidden');
    setTimeout(() => msg.classList.add('hidden'), 4000);
  });
}

/**
 * Inicializa la vista pública: carga datos, renderiza filtros y eventos,
 * y vincula los event listeners de búsqueda, filtros, carrito y contacto.
 * @returns {Promise<void>}
 */
async function initPublicView() {
  await loadDataFromJSON();
  renderFilters();
  renderEvents(getEventos());
  eventsContainer?.addEventListener('add-to-cart', handleAddToCart);
  searchInput?.addEventListener('input', applyFilters);
  categoryFilter?.addEventListener('change', applyFilters);
  cityFilter?.addEventListener('change', applyFilters);
  if (typeof initCartModule === 'function') {
    initCartModule();
  }
  initContactForm();
}

document.addEventListener('DOMContentLoaded', initPublicView);

