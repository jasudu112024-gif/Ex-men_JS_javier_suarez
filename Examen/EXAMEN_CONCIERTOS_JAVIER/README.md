<img width="1828" height="949" alt="Captura desde 2026-07-06 16-27-29" src="https://github.com/user-attachments/assets/2001206f-ace1-4390-b126-4a5623062f12" />
<img width="1828" height="949" alt="Captura desde 2026-07-06 16-27-37" src="https://github.com/user-attachments/assets/3176a892-c04c-4fff-b4ae-99fdc349a79f" />
<img width="1828" height="949" alt="Captura desde 2026-07-06 16-27-47" src="https://github.com/user-attachments/assets/f6b50e2d-ff83-4a71-b90c-062fd32adb82" />
<img width="1828" height="949" alt="Captura desde 2026-07-06 16-27-54" src="https://github.com/user-attachments/assets/d257829d-e046-444f-9577-695db98f18b3" />
<img width="1828" height="949" alt="Captura desde 2026-07-06 16-27-59" src="https://github.com/user-attachments/assets/2a576227-8e4c-479a-8a54-7e8085f33608" />
# PROYECTO CONCIERTOS - Infernal Management

Sistema de gestión y venta de entradas para conciertos con panel administrativo y vista pública. Desarrollado únicamente con HTML, CSS y JavaScript (sin frameworks, sin librerías externas).

## Características

### Vista Publica (index.html)
- Exploracion de eventos con tarjetas visuales (imagen, categoria, precio, fecha, ciudad)
- Busqueda por nombre, filtros por categoria, pais y ciudad
- Filtro dinamico: al seleccionar un pais, las ciudades se actualizan automaticamente
- Carga de datos desde `data/eventos.json` (todos los usuarios ven los mismos eventos)
- Web Component personalizado `<evento-card>` con Shadow DOM
- Carrito de compras como ventana flotante con total y eliminacion de items
- Checkout con formulario de datos del comprador
- Formulario de contacto con almacenamiento en localStorage

### Panel Administrativo (admin/)
- **Autenticacion**: Login con credenciales fijas y sesion en localStorage
- **Dashboard**: Metricas en tiempo real (categorias, eventos, ventas, ingresos) + reloj en vivo
- **CRUD de Categorias**: Crear, editar, eliminar (eliminacion en cascada de eventos asociados)
- **CRUD de Eventos**: Formulario con selector dinamico pais -> ciudad, fecha, hora, precio, imagen
- **Gestion de Ventas**: Tabla de ventas ordenadas por fecha con detalle de cada compra
- **Buzon de Mensajes**: Visualizacion de mensajes del formulario de contacto
- **Exportar JSON**: Descarga de respaldo completo (categorias, paises, eventos, ventas, contactos)
- **Publicar cambios**: Descarga `eventos.json` para reemplazar el archivo publico y compartir los cambios con todos los usuarios
- **Navegacion**: SPA en `eventos.html` + paginas independientes para Dashboard, Categorias y Reportes

## Tecnologias

- HTML5 semantico
- CSS3 con tema oscuro "Infernal" (variables CSS, glassmorphism, animaciones)
- JavaScript vanilla (ES6+)
- localStorage para persistencia de datos administrativos
- Custom Elements (Web Components) con Shadow DOM para tarjetas de eventos
- Fetch API para carga asincrona de datos publicos
- Responsive Design con `responsive.css`

## Instalacion y Uso

1. Abre `index.html` en tu navegador para la vista publica.
2. Accede al panel admin desde el enlace "Administracion" o ve a `admin/admin.html`
3. **Email:** `admin@gmail.com` | **Contrasena:** `123456`

> No requiere servidor ni dependencias. Funciona directamente desde el sistema de archivos.

## Estructura del Proyecto

```
├── index.html                          # Pagina publica (cliente)
├── admin.html                          # Redireccionador a admin/
├── eventos.html                        # Redireccionador a admin/
├── admin/
│   ├── admin.html                      # Login
│   ├── eventos.html                    # SPA principal (dashboard, categorias, eventos, ventas, mensajes)
│   ├── dashboard.html                  # Dashboard independiente
│   ├── categorias.html                 # CRUD de categorias independiente
│   └── reportes.html                   # Reportes independiente
├── css/
│   ├── styles.css                      # Estilos generales + tema Infernal
│   └── responsive.css                  # Adaptacion responsive
├── js/
│   ├── storage.js                      # Capa de persistencia (localStorage)
│   ├── registro.js                     # Modulo de contactos y ventas
│   ├── data-seed.js                    # Datos semilla (197 paises, 9 categorias, 4 eventos)
│   ├── components.js                   # Web Component <evento-card>
│   ├── cart.js                         # Modulo del carrito de compras
│   ├── main.js                         # Controlador de la vista publica
│   └── admin.js                        # Controlador del panel administrativo
├── data/
│   └── eventos.json                    # Datos publicos (categorias, paises, eventos)
├── assets/img/                         # Imagenes del tema
└── README.md
```

## Web Component `<evento-card>`

### Archivo: `js/components.js`

Componente personalizado con Shadow DOM que renderiza tarjetas de eventos.

### Atributos

| Atributo     | Descripcion                         |
|--------------|-------------------------------------|
| `data-id`    | ID unico del evento                 |
| `nombre`     | Nombre del evento                   |
| `ciudad`     | Ciudad del evento                   |
| `fecha`      | Fecha (YYYY-MM-DD)                  |
| `hora`       | Hora (HH:MM)                        |
| `precio`     | Precio formateado (incluye simbolo) |
| `imagen`     | URL de la imagen                    |
| `categoria`  | Nombre de la categoria              |
| `descripcion`| Descripcion del evento              |

### Shadow DOM Structure

```
<article class="card">
  <img class="card-image" src="..." alt="..." loading="lazy" />
  <span class="card-category">Categoria</span>
  <div class="card-body">
    <h3 class="card-title">Nombre</h3>
    <p class="card-desc">Descripcion</p>
    <div class="card-meta">
      <span class="meta-date">Fecha</span>
      <span class="meta-time">Hora</span>
      <span class="meta-city">Ciudad</span>
    </div>
    <div class="card-footer">
      <span class="card-price">Precio</span>
      <button class="card-button">Agregar al carrito</button>
    </div>
  </div>
</article>
```

### Eventos

El boton "Agregar al carrito" dispara un `CustomEvent('add-to-cart')` con `detail: { id }` que burbujea hasta el contenedor principal.

## Datos Publicos vs Locales

### Carga de datos (`main.js`)

1. Al cargar la pagina, se intenta obtener `data/eventos.json` via `fetch()`
2. Si el fetch es exitoso, se usan esos datos (categorias, paises, eventos)
3. Si falla (archivo no encontrado), se cae en localStorage como respaldo
4. Los paises del JSON se guardan en localStorage si no existen

### Flujo de publicacion

1. El admin edita eventos en el panel
2. Hace clic en "Publicar cambios"
3. Se descarga un archivo `eventos.json` con las categorias, Colombia con sus ciudades y los eventos actuales
4. Reemplaza manualmente `data/eventos.json` con el archivo descargado
5. Todos los usuarios ven los cambios al recargar la pagina

## localStorage

| Clave                      | Contenido                                  |
|----------------------------|--------------------------------------------|
| `conciertos_categorias`    | Array de categorias                        |
| `conciertos_paises`        | Array de paises con ciudades               |
| `conciertos_eventos`       | Array de eventos                           |
| `conciertos_carrito`       | Array del carrito de compras               |
| `conciertos_ventas`        | Array de ventas realizadas                 |
| `conciertos_sesion_admin`  | Objeto `{ email }` de sesion activa        |
| `registro_contactos`       | Array de mensajes de contacto              |

## Flujo de Scripts

### Vista publica (index.html)

```
storage.js  (define load/save para localStorage)
    ->
registro.js  (contactos y ventas)
    ->
data-seed.js  (datos semilla si localStorage vacio)
    ->
components.js  (define <evento-card>)
    ->
cart.js  (carrito y checkout)
    ->
main.js  (controlador principal, async: fetch JSON -> render)
```

### Panel admin (admin/*.html)

```
storage.js -> registro.js -> data-seed.js -> admin.js
```

## Países Incluidos

197 paises con sus principales ciudades. Se cargan automaticamente desde `data-seed.js` si no existen en localStorage. Para restablecerlos:

```js
localStorage.removeItem('conciertos_paises');
location.reload();
```

## Credenciales Admin

- **Email:** `admin@mail`
- **Contrasena:** `123456`

## Creditos

Proyecto desarrollado por Alvaro y Javier como sistema de gestion de conciertos.
