/**
 * Datos iniciales para poblar la aplicación al primer uso.
 * Se ejecuta al cargar la página y siembra categorías y eventos
 * de ejemplo cuando el almacenamiento local está vacío.
 */



const initialCategories = [
  { id: Date.now() + 1, nombre: 'Rock', descripcion: 'Conciertos de rock y metal' },
  { id: Date.now() + 2, nombre: 'Electrónica', descripcion: 'Eventos con DJs y música electrónica' },
  { id: Date.now() + 3, nombre: 'Pop', descripcion: 'Conciertos comerciales y festivales pop' },
  { id: Date.now() + 4, nombre: 'Jazz', descripcion: 'Música jazz y blues en vivo' },
  { id: Date.now() + 5, nombre: 'Clásica', descripcion: 'Conciertos de música clásica y orquestal' },
  { id: Date.now() + 6, nombre: 'Reguetón', descripcion: 'Artistas de reguetón y trap latino' },
  { id: Date.now() + 7, nombre: 'Salsa', descripcion: 'Salsa, bachata y ritmos caribeños' },
  { id: Date.now() + 8, nombre: 'Indie', descripcion: 'Bandas independientes y alternativas' },
  { id: Date.now() + 9, nombre: 'Festival', descripcion: 'Festivales multigénero al aire libre' }
];

/**
 * Inicializa los datos semilla si el almacenamiento local está vacío.
 * Carga países, categorías, eventos de ejemplo y vacía carrito/ventas.
 */
function ensureSeedData() {
  const categorias = loadCategorias();
  if (!categorias.length) {
    saveCategorias(initialCategories);
  }

  const eventos = loadEventos();
  if (eventos.length < 13) {
    const storedCategorias = loadCategorias();
    const seedEvents = [
      {
        id: Date.now() + 11, codigo: 'EVT001', nombre: 'Infernal Rock Night',
        categoriaId: storedCategorias[0]?.id || initialCategories[0].id,
        precio: 120000, fecha: '2026-11-10', hora: '20:00',
        ciudad: 'Bogotá', imagen: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?fit=crop&w=800&q=80',
        descripcion: 'Una noche de rock con bandas nacionales y sonido potente.'
      },
      {
        id: Date.now() + 12, codigo: 'EVT002', nombre: 'Electro Vibes',
        categoriaId: storedCategorias[1]?.id || initialCategories[1].id,
        precio: 95000, fecha: '2026-12-05', hora: '22:00',
        ciudad: 'Medellín', imagen: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?fit=crop&w=800&q=80',
        descripcion: 'Festival con DJs, luces láser y ambiente nocturno.'
      },
      {
        id: Date.now() + 13, codigo: 'EVT003', nombre: 'Pop Dreams',
        categoriaId: storedCategorias[2]?.id || initialCategories[2].id,
        precio: 108000, fecha: '2026-10-18', hora: '19:30',
        ciudad: 'Cali', imagen: 'https://images.unsplash.com/photo-1512362856338-5405fbe5e443?fit=crop&w=800&q=80',
        descripcion: 'Un show pop con artistas emergentes y sonidos energéticos.'
      },
      {
        id: Date.now() + 14, codigo: 'EVT004', nombre: 'Digital Circus',
        categoriaId: storedCategorias[8]?.id || initialCategories[8].id,
        precio: 150000, fecha: '2026-12-20', hora: '21:00',
        ciudad: 'Bogotá', imagen: 'https://images.unsplash.com/photo-1516559828984-fef4973811b9?fit=crop&w=800&q=80',
        descripcion: 'Un espectáculo circense digital con visuals, luces y música electrónica en vivo.'
      },
      {
        id: Date.now() + 15, codigo: 'EVT005', nombre: 'Rock Sinfónico',
        categoriaId: storedCategorias[0]?.id || initialCategories[0].id,
        precio: 135000, fecha: '2026-11-25', hora: '19:00',
        ciudad: 'Medellín', imagen: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?fit=crop&w=800&q=80',
        descripcion: 'Rock sinfónico con orquesta en vivo y coro gospel.'
      },
      {
        id: Date.now() + 16, codigo: 'EVT006', nombre: 'Reggaeton Nights',
        categoriaId: storedCategorias[5]?.id || initialCategories[5].id,
        precio: 85000, fecha: '2026-12-12', hora: '23:00',
        ciudad: 'Barranquilla', imagen: 'https://images.unsplash.com/photo-1619983081563-430f63602796?fit=crop&w=800&q=80',
        descripcion: 'La noche más esperada con los mejores artistas del reguetón.'
      },
      {
        id: Date.now() + 17, codigo: 'EVT007', nombre: 'Salsa Brava',
        categoriaId: storedCategorias[6]?.id || initialCategories[6].id,
        precio: 75000, fecha: '2026-11-05', hora: '21:00',
        ciudad: 'Cali', imagen: 'https://images.unsplash.com/photo-1504609813442-a8924e83f76e?fit=crop&w=800&q=80',
        descripcion: 'Noche de salsa brava con las mejores orquestas de la ciudad.'
      },
      {
        id: Date.now() + 18, codigo: 'EVT008', nombre: 'Jazz & Blues',
        categoriaId: storedCategorias[3]?.id || initialCategories[3].id,
        precio: 90000, fecha: '2026-10-30', hora: '20:00',
        ciudad: 'Bogotá', imagen: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?fit=crop&w=800&q=80',
        descripcion: 'Una velada íntima con jazz fusión y blues en vivo.'
      },
      {
        id: Date.now() + 19, codigo: 'EVT009', nombre: 'Concierto Clásico',
        categoriaId: storedCategorias[4]?.id || initialCategories[4].id,
        precio: 110000, fecha: '2026-12-15', hora: '18:00',
        ciudad: 'Bogotá', imagen: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?fit=crop&w=800&q=80',
        descripcion: 'Orquesta filarmónica interpretando las obras maestras de la música clásica.'
      },
      {
        id: Date.now() + 20, codigo: 'EVT010', nombre: 'Indie Underground',
        categoriaId: storedCategorias[7]?.id || initialCategories[7].id,
        precio: 70000, fecha: '2026-11-20', hora: '21:30',
        ciudad: 'Medellín', imagen: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?fit=crop&w=800&q=80',
        descripcion: 'Bandas independientes emergentes con sonidos frescos y alternativos.'
      },
      {
        id: Date.now() + 21, codigo: 'EVT011', nombre: 'Techno Rave',
        categoriaId: storedCategorias[1]?.id || initialCategories[1].id,
        precio: 100000, fecha: '2027-01-15', hora: '23:00',
        ciudad: 'Cartagena', imagen: 'https://images.unsplash.com/photo-1574169208507-84376144848b?fit=crop&w=800&q=80',
        descripcion: 'Rave al aire libre con DJs internacionales y producción audiovisual.'
      },
      {
        id: Date.now() + 22, codigo: 'EVT012', nombre: 'Pop Star',
        categoriaId: storedCategorias[2]?.id || initialCategories[2].id,
        precio: 98000, fecha: '2026-12-08', hora: '20:00',
        ciudad: 'Bucaramanga', imagen: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?fit=crop&w=800&q=80',
        descripcion: 'Grandes éxitos del pop actual con invitados sorpresa.'
      },
      {
        id: Date.now() + 23, codigo: 'EVT013', nombre: 'Festival de Verano',
        categoriaId: storedCategorias[8]?.id || initialCategories[8].id,
        precio: 180000, fecha: '2027-02-20', hora: '15:00',
        ciudad: 'Santa Marta', imagen: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?fit=crop&w=800&q=80',
        descripcion: 'Festival multigénero al aire libre con playa, sol y música todo el día.'
      }
    ];
    saveEventos(seedEvents);
  }

  if (!loadCarrito().length) {
    saveCarrito([]);
  }

  if (!loadVentas().length) {
    saveVentas([]);
  }
}

ensureSeedData();
