

/* Obtener email del usuario activo */
function obtenerEmailSesion() {
    const sesion = JSON.parse(localStorage.getItem('reparify_sesion') || 'null');
    return sesion ? sesion.email : null;
}

/* clave de historial por usuario */
function claveHistorial(email) {
    return `reparify_historial_${email}`;
}

/* LEE HISTORIAL DESDE LOCALSTORAGE
   Devuelve el array de servicios del usuario activo.
   Si no hay ninguno, devuelve array vacío.
 */
function obtenerHistorial() {
    const email = obtenerEmailSesion();
    if (!email) return [];
    return JSON.parse(localStorage.getItem(claveHistorial(email)) || '[]');
}

/*  Guarda historial en localStorage */
function guardarHistorial(servicios) {
    const email = obtenerEmailSesion();
    if (!email) return;
    localStorage.setItem(claveHistorial(email), JSON.stringify(servicios));
}

/* 
   AGREGAR UN SERVICIO NUEVO
   Se llama desde otras páginas cuando el usuario solicita un servicio.

   agregarServicio({
       servicio:   'Reparación de calefón',
       tecnico:    'Santiago Lopez',
       fecha:      '20/12/2025',
       estado:     'en-progreso',
       valoracion: null
   });
 */
function agregarServicio(nuevoServicio) {
    const historial = obtenerHistorial();
    const id = historial.length > 0 ? Math.max(...historial.map(s => s.id)) + 1 : 1;
    historial.push({ id, ...nuevoServicio });
    guardarHistorial(historial);

    /* Actualiza el contador de servicios solicitados en el perfil */
    actualizarContadorServicios(historial.length);
}

/* actualiza contador */
function actualizarContadorServicios(cantidad) {
    const el = document.getElementById('statServicios');
    if (el) el.textContent = cantidad;
}

/* Valoracion estrellas */
function renderEstrellas(valoracion) {
    if (valoracion === null) {
        return '<span class="badge-pendiente">Pendiente</span>';
    }
    return `<span class="estrellas">${'★'.repeat(valoracion)}${'☆'.repeat(5 - valoracion)}</span>`;
}

function renderEstado(estado) {
    const configs = {
        'en-progreso': { clase: 'badge-progreso',   texto: 'En progreso' },
        'finalizado':  { clase: 'badge-finalizado',  texto: 'Finalizado'  },
        'cancelado':   { clase: 'badge-cancelado',   texto: 'Cancelado'   }
    };
    const cfg = configs[estado] || { clase: '', texto: estado };
    return `<span class="badge-estado ${cfg.clase}">${cfg.texto}</span>`;
}

function renderAccion(item) {
    if (item.estado === 'en-progreso' && item.valoracion === null) {
        return `<button class="btn-valorar" data-id="${item.id}">Valorar</button>`;
    }
    if (item.estado === 'finalizado') {
        return `<button class="btn-ver-detalles" data-id="${item.id}">👁 Ver Detalles</button>`;
    }
    return '';
}

/* Historial de servicios */
function renderHistorial() {
    const tbody = document.getElementById('historialBody');
    if (!tbody) return;

    const historial = obtenerHistorial();

    /* Actualizar contador en la card */
    actualizarContadorServicios(historial.length);

    if (historial.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="tabla-vacia">
                    Todavía no solicitaste ningún servicio.
                </td>
            </tr>`;
        return;
    }

    /* Ordenar por fecha descendente (más reciente primero) */
    const ordenado = [...historial].reverse();

    tbody.innerHTML = ordenado.map(item => `
        <tr>
            <td>${item.servicio}</td>
            <td>${item.tecnico}</td>
            <td>${item.fecha}</td>
            <td>${renderEstado(item.estado)}</td>
            <td>${renderEstrellas(item.valoracion)}</td>
            <td>${renderAccion(item)}</td>
        </tr>
    `).join('');

    /* Eventos de los botones generados dinámicamente */
    tbody.querySelectorAll('.btn-valorar').forEach(btn => {
        btn.addEventListener('click', () => abrirModalValorar(parseInt(btn.dataset.id)));
    });

    tbody.querySelectorAll('.btn-ver-detalles').forEach(btn => {
        btn.addEventListener('click', () => verDetalles(parseInt(btn.dataset.id)));
    });
}

/* 
   MODAL VALORAR (placeholder — reemplazar con modal real)
 */
function abrirModalValorar(id) {
    const item = obtenerHistorial().find(s => s.id === id);
    if (!item) return;
    alert(`Valorar: "${item.servicio}" de ${item.tecnico}`);
}

/* VER DETALLES DE SERVICIOS SOLICITADOS */
function verDetalles(id) {
    const item = obtenerHistorial().find(s => s.id === id);
    if (!item) return;
    alert(`Detalles:\nServicio: ${item.servicio}\nTécnico: ${item.tecnico}\nFecha: ${item.fecha}\nEstado: ${item.estado}`);
}


document.addEventListener('DOMContentLoaded', renderHistorial);