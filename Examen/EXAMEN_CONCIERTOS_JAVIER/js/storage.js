/**
 * Módulo de almacenamiento local para la aplicación de conciertos.
 * Proporciona funciones CRUD sobre localStorage con parseo seguro de JSON.
 */

const STORAGE_KEYS = {
  categorias: 'conciertos_categorias',
  eventos: 'conciertos_eventos',
  ventas: 'conciertos_ventas',
  carrito: 'conciertos_carrito',
  sesionAdmin: 'conciertos_sesion_admin',
};

/**
 * Parsea una cadena JSON de forma segura, retornando null ante cualquier error.
 * @param {string|null} value - Cadena JSON a parsear
 * @returns {*|null} Objeto parseado o null
 */
function parseJSON(value) {
  try {
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.warn('storage.js parseJSON error:', error);
    return null;
  }
}

/**
 * Carga un array desde localStorage. Si no existe o no es array, retorna vacío.
 * @param {string} key - Clave en localStorage
 * @returns {Array} Array almacenado o []
 */
function loadArray(key) {
  const data = parseJSON(localStorage.getItem(key));
  return Array.isArray(data) ? data : [];
}

/**
 * Carga un objeto desde localStorage. Si no existe o no es objeto, retorna null.
 * @param {string} key - Clave en localStorage
 * @returns {Object|null} Objeto almacenado o null
 */
function loadObject(key) {
  const data = parseJSON(localStorage.getItem(key));
  return data && typeof data === 'object' ? data : null;
}

/**
 * Guarda un valor serializado como JSON en localStorage.
 * @param {string} key - Clave en localStorage
 * @param {*} value - Valor a almacenar
 */
function saveItem(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

/**
 * Obtiene la lista de categorías almacenadas.
 * @returns {Array} Lista de categorías
 */
function loadCategorias() {
  return loadArray(STORAGE_KEYS.categorias);
}

/**
 * Guarda la lista de categorías.
 * @param {Array} categorias - Lista de categorías a persistir
 */
function saveCategorias(categorias) {
  saveItem(STORAGE_KEYS.categorias, categorias);
}

/**
 * Obtiene la lista de eventos almacenados.
 * @returns {Array} Lista de eventos
 */
function loadEventos() {
  return loadArray(STORAGE_KEYS.eventos);
}

/**
 * Guarda la lista de eventos.
 * @param {Array} eventos - Lista de eventos a persistir
 */
function saveEventos(eventos) {
  saveItem(STORAGE_KEYS.eventos, eventos);
}

/**
 * Obtiene la lista de ventas almacenadas.
 * @returns {Array} Lista de ventas
 */
function loadVentas() {
  return loadArray(STORAGE_KEYS.ventas);
}

/**
 * Guarda la lista de ventas.
 * @param {Array} ventas - Lista de ventas a persistir
 */
function saveVentas(ventas) {
  saveItem(STORAGE_KEYS.ventas, ventas);
}

/**
 * Obtiene el contenido actual del carrito.
 * @returns {Array} Items en el carrito
 */
function loadCarrito() {
  return loadArray(STORAGE_KEYS.carrito);
}

/**
 * Guarda el contenido del carrito.
 * @param {Array} carrito - Items del carrito a persistir
 */
function saveCarrito(carrito) {
  saveItem(STORAGE_KEYS.carrito, carrito);
}

/**
 * Obtiene los datos de la sesión activa del administrador.
 * @returns {Object|null} Sesión del admin o null
 */
function loadSesionAdmin() {
  return loadObject(STORAGE_KEYS.sesionAdmin);
}

/**
 * Guarda los datos de la sesión del administrador.
 * @param {Object} sesion - Datos de sesión a persistir
 */
function saveSesionAdmin(sesion) {
  saveItem(STORAGE_KEYS.sesionAdmin, sesion);
}

/**
 * Elimina la sesión del administrador de localStorage.
 */
function clearSesionAdmin() {
  localStorage.removeItem(STORAGE_KEYS.sesionAdmin);
}

window.loadCategorias = loadCategorias;
window.saveCategorias = saveCategorias;
window.loadEventos = loadEventos;
window.saveEventos = saveEventos;
window.loadVentas = loadVentas;
window.saveVentas = saveVentas;
window.loadCarrito = loadCarrito;
window.saveCarrito = saveCarrito;
window.loadSesionAdmin = loadSesionAdmin;
window.saveSesionAdmin = saveSesionAdmin;
