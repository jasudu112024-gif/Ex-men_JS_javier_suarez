
// Escuchamos el clic en el botón "Generar Reporte" para arrancar el proceso
document.getElementById('btn-buscar').addEventListener('click', generarReporte);

async function generarReporte() {
    // Capturamos el año y el mes seleccionados por el administrador en los menús desplegables
    const anio = parseInt(document.getElementById('select-anio').value);
    const mes = parseInt(document.getElementById('select-mes').value);
    
    // Obtenemos las referencias a los elementos del HTML donde mostraremos los resultados
    const tablaCuerpo = document.getElementById('tabla-cuerpo');
    const mensajeVacio = document.getElementById('mensaje-vacio');
    const filaTotal = document.getElementById('fila-total');
    
    // REINICIO DE INTERFAZ: Limpiamos la tabla y ocultamos mensajes de búsquedas previas
    tablaCuerpo.innerHTML = '';
    mensajeVacio.style.display = 'none';
    filaTotal.style.display = 'none';

    // =========================================================================
    // PASO 1: Leer la lista de ventas desde localStorage
    // =========================================================================
    let ventasLocales = [];
    const datosRaw = localStorage.getItem('conciertos_ventas'); 
    if (datosRaw) {
        ventasLocales = JSON.parse(datosRaw); // Convertimos el texto plano a un arreglo de objetos
    }

    // Cargar el historial de meses pasados desde el archivo JSON auxiliar
    let ventasHistoricas = [];
    try {
        const respuesta = await fetch('../data/reportes_historial.json');
        if (respuesta.ok) {
            ventasHistoricas = await respuesta.json(); // Leemos las ventas viejas simuladas
        }
    } catch (error) {
        console.log("No hay historial previo o falló la lectura del archivo JSON.", error);
    }

    // Unimos las compras de hoy (localStorage) con las compras viejas (JSON) en una sola lista
    const todasLasVentas = [...ventasLocales, ...ventasHistoricas];

    // =========================================================================
    // PASOS 2 y 3: Convertir fechas con new Date() y filtrar por año y mes
    // =========================================================================
    const ventasFiltradas = todasLasVentas.filter(venta => {
        const fecha = new Date(venta.fecha); // Convierte el texto UTC a un objeto de calendario real
        
        // Compara si el año y el mes coinciden exactamente con los del formulario
        return fecha.getFullYear() === anio && fecha.getMonth() === mes;
    });

    // =========================================================================
    // PASO 7 (Validación): Mostrar mensaje de error si no existen ventas
    // =========================================================================
    if (ventasFiltradas.length === 0) {
        tablaCuerpo.innerHTML = `
            <tr>
                <td colspan="4" class="text-muted padding-30 text-center">
                    Sin registros para este período.
                </td>
            </tr>`;
        mensajeVacio.style.display = 'block'; // Muestra el texto en rojo
        return; // Detiene la ejecución de la función aquí mismo
    }

    // =========================================================================
    // PASOS 4, 5 y 6: Recorrer los ítems, agrupar por código de evento y acumular
    // =========================================================================
    const agrupado = {}; // Objeto vacío para acumular los totales por concierto

    ventasFiltradas.forEach(venta => {
        venta.items.forEach(item => {
            // Soportamos variaciones por si acaso en tu base de datos se llama de una u otra forma
            const cod = item.codigoEventoglobal || item.codigoEvento; 
            
            // Si es la primera vez que vemos este concierto, lo creamos en blanco en nuestro acumulador
            if (!agrupado[cod]) {
                agrupado[cod] = {
                    codigo: cod,
                    nombre: item.nombreEvento,
                    cantidad: 0,
                    totalDinero: 0
                };
            }
            
            // Sumamos la cantidad vendida y el dinero recaudado a ese concierto específico
            agrupado[cod].cantidad += item.cantidad;
            agrupado[cod].totalDinero += (item.cantidad * item.precio);
        });
    });

    // Variables acumuladoras para la fila de "Totalización General" del pie de página
    let granCantidad = 0;
    let granDinero = 0;

    // =========================================================================
    // PASO 7 (Renderizado): Pintar el reporte acumulado en la tabla HTML
    // =========================================================================
    Object.values(agrupado).forEach(concierto => {
        // Sumamos al gran total general antes de dibujar la fila
        granCantidad += concierto.cantidad;
        granDinero += concierto.totalDinero;

        // Creamos la fila HTML en memoria
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${concierto.codigo}</td>
            <td class="bold-white">${concierto.nombre}</td>
            <td class="text-center cant-destacada">${concierto.cantidad}</td>
            <td class="text-right">$${concierto.totalDinero.toLocaleString('es-CO')}</td>
        `;
        // Inyectamos la fila dentro del cuerpo de la tabla
        tablaCuerpo.appendChild(fila);
    });

    // Mostramos los totales generales formateados con signo de pesos en el <tfoot>
    document.getElementById('total-cantidad').textContent = granCantidad;
    document.getElementById('total-dinero').textContent = `$${granDinero.toLocaleString('es-CO')}`;
    
    // Hacemos visible la fila de totales cambiando su display a table-row
    filaTotal.style.display = 'table-row';
}