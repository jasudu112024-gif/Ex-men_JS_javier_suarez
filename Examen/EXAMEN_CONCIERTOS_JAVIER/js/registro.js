/**
 * Módulo para el registro de contactos desde el formulario
 * y consulta de ventas en la vista pública.
 */

const REGISTRO_KEYS = {
  contactos: 'registro_contactos',
  ventas: 'conciertos_ventas'
};

/**
 * Parsea una cadena JSON de forma segura.
 * @param {string|null} value - Cadena JSON a parsear
 * @returns {*|null} Objeto parseado o null
 */
function parseJSON(value) {
  try {
    return value ? JSON.parse(value) : null;
  } catch (e) {
    return null;
  }
}

/**
 * Carga un array de registro desde localStorage.
 * @param {string} key - Clave en localStorage
 * @returns {Array} Array almacenado o []
 */
function loadRegistroArray(key) {
  const data = parseJSON(localStorage.getItem(key));
  return Array.isArray(data) ? data : [];
}

/**
 * Guarda un valor en localStorage para el módulo de registro.
 * @param {string} key - Clave en localStorage
 * @param {*} value - Valor a almacenar
 */
function saveRegistro(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

/**
 * Guarda los datos de un formulario de contacto.
 * Asigna un id único basado en timestamp y la fecha actual.
 * @param {Object} datos - Datos del formulario (nombre, email, asunto, mensaje)
 */
function guardarContacto(datos) {
  const contactos = loadRegistroArray(REGISTRO_KEYS.contactos);
  contactos.push({
    id: Date.now(),
    fecha: new Date().toISOString(),
    ...datos
  });
  saveRegistro(REGISTRO_KEYS.contactos, contactos);
}

/**
 * Obtiene todos los contactos registrados.
 * @returns {Array} Lista de contactos
 */
function obtenerContactos() {
  return loadRegistroArray(REGISTRO_KEYS.contactos);
}

/**
 * Obtiene las ventas registradas desde el módulo de registro.
 * @returns {Array} Lista de ventas
 */
function obtenerVentasRegistro() {
  return loadRegistroArray(REGISTRO_KEYS.ventas);
}

window.guardarContacto = guardarContacto;
window.obtenerContactos = obtenerContactos;
window.obtenerVentasRegistro = obtenerVentasRegistro;
