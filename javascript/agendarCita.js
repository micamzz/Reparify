/* agendarCita.js
   Guarda reservas en: reparify_reservas_usuario_{email}
   Esa es la misma clave que lee miPerfil.js */

const HORARIOS_LUNES_VIERNES = [
    '08:00','09:00','10:00','11:00','12:00',
    '13:00','14:00','15:00','16:00','17:00'
];
const HORARIOS_SABADO = [
    '08:00','09:00','10:00','11:00','12:00','13:00'
];
const MESES = [
    'Enero','Febrero','Marzo','Abril','Mayo','Junio',
    'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'
];

let profesionalSeleccionado = null;
let fechaSeleccionada       = null;
let horarioSeleccionado     = null;
let mesActual               = new Date().getMonth();
let anioActual              = new Date().getFullYear();

function claveReservasPro(proId)       { return `reparify_reservas_pro_${proId}`; }
function claveReservasUsuario(email)   { return `reparify_reservas_usuario_${email}`; }
function obtenerSesion()               { return JSON.parse(localStorage.getItem('reparify_sesion') || 'null'); }

function obtenerProfesionales() {
    const base = [
        { id:1,  nombre:'María González',   profesion:'Carpintería',  ubicacion:'Palermo',            zona:'Palermo',      valoracion:4.8, foto:'../image/profesionales/persona1.png',  distancia:'2 km'   },
        { id:2,  nombre:'Roberto Silva',     profesion:'Plomería',     ubicacion:'Palermo, CABA',      zona:'Palermo',      valoracion:5.0, foto:'../image/profesionales/persona2.png',  distancia:'1 km'   },
        { id:3,  nombre:'Carlos Ramírez',    profesion:'Albañilería',  ubicacion:'Belgrano, CABA',     zona:'Belgrano',     valoracion:4.5, foto:'../image/profesionales/persona3.png',  distancia:'3.5 km' },
        { id:4,  nombre:'Ana Martínez',      profesion:'Electricista', ubicacion:'Recoleta, CABA',     zona:'Recoleta',     valoracion:4.9, foto:'../image/profesionales/persona4.png',  distancia:'4.2 km' },
        { id:5,  nombre:'Jorge Pérez',       profesion:'Gasista',      ubicacion:'Colegiales, CABA',   zona:'Colegiales',   valoracion:4.7, foto:'../image/profesionales/persona5.png',  distancia:'5 km'   },
        { id:6,  nombre:'Lucía Fernández',   profesion:'Pinturería',   ubicacion:'Villa Crespo, CABA', zona:'Villa Crespo', valoracion:4.6, foto:'../image/profesionales/persona6.png',  distancia:'3.2 km' },
        { id:7,  nombre:'Diego Romero',      profesion:'Plomería',     ubicacion:'Belgrano, CABA',     zona:'Belgrano',     valoracion:4.9, foto:'../image/profesionales/persona7.png',  distancia:'2.8 km' },
        { id:8,  nombre:'Sofía López',       profesion:'Electricista', ubicacion:'Palermo, CABA',      zona:'Palermo',      valoracion:4.8, foto:'../image/profesionales/persona8.png',  distancia:'1.5 km' },
        { id:9,  nombre:'Martín Torres',     profesion:'Carpintería',  ubicacion:'Colegiales, CABA',   zona:'Colegiales',   valoracion:4.7, foto:'../image/profesionales/persona9.png',  distancia:'4 km'   },
        { id:10, nombre:'Valentina Ruiz',    profesion:'Albañilería',  ubicacion:'Recoleta, CABA',     zona:'Recoleta',     valoracion:4.6, foto:'../image/profesionales/persona10.png', distancia:'4.8 km' },
        { id:11, nombre:'Pablo Díaz',        profesion:'Gasista',      ubicacion:'Palermo, CABA',      zona:'Palermo',      valoracion:5.0, foto:'../image/profesionales/persona11.png', distancia:'0.8 km' },
        { id:12, nombre:'Camila Sánchez',    profesion:'Pinturería',   ubicacion:'Belgrano, CABA',     zona:'Belgrano',     valoracion:4.5, foto:'../image/profesionales/persona12.png', distancia:'3 km'   },
        { id:13, nombre:'Tomás Vargas',      profesion:'Carpintería',  ubicacion:'Villa Crespo, CABA', zona:'Villa Crespo', valoracion:4.9, foto:'../image/profesionales/persona13.png', distancia:'2.2 km' },
        { id:14, nombre:'Florencia Medina',  profesion:'Electricista', ubicacion:'Villa Crespo, CABA', zona:'Villa Crespo', valoracion:4.7, foto:'../image/profesionales/persona14.png', distancia:'3.6 km' },
        { id:15, nombre:'Nicolás Herrera',   profesion:'Plomería',     ubicacion:'Colegiales, CABA',   zona:'Colegiales',   valoracion:4.8, foto:'../image/profesionales/persona15.png', distancia:'4.5 km' }
    ];
    const del = JSON.parse(localStorage.getItem('reparify_profesionales') || '[]');
    return [...base, ...del];
}

function obtenerReservasPro(proId) {
    return JSON.parse(localStorage.getItem(claveReservasPro(proId)) || '[]');
}
function obtenerReservasUsuario() {
    const sesion = obtenerSesion();
    if (!sesion) return [];
    return JSON.parse(localStorage.getItem(claveReservasUsuario(sesion.email)) || '[]');
}
function formatearFecha(y, m, d) {
    return `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
}
function formatearFechaLegible(fechaStr, horario) {
    const [y, m, d] = fechaStr.split('-').map(Number);
    return `${d} de ${MESES[m-1]} ${y}, ${horario} hs`;
}


document.addEventListener('DOMContentLoaded', () => {

    const sesion = obtenerSesion();

    /* Sin sesión: redirigir */
    const popupOverlay = document.getElementById('popupOverlay');
    const popupCerrar  = document.getElementById('popupCerrar');

    if (!sesion) {
        /* Muestra el popup pero deja ver el contenido desenfocado */
        if (popupOverlay) popupOverlay.classList.remove('oculto');

        /* El botón X cierra el popup y vuelve atrás */
        popupCerrar?.addEventListener('click', () => {
            window.history.back();
        });
        /* No cortamos la ejecución: cargamos igual los datos para que
           el contenido detrás del popup sea visible. */
    } else {
        /* Hay sesión: ocultamos el popup */
        if (popupOverlay) popupOverlay.classList.add('oculto');
    }


    /* Preseleccionar profesional desde URL (?id=N) */
    const params      = new URLSearchParams(window.location.search);
    const idDesdeUrl  = parseInt(params.get('id')) || null;

    if (idDesdeUrl) {
        const pro = obtenerProfesionales().find(p => p.id === idDesdeUrl);
        if (pro) seleccionarProfesional(pro);
    }

    renderCalendario();

    document.getElementById('calPrev')?.addEventListener('click', () => {
        mesActual--;
        if (mesActual < 0) { mesActual = 11; anioActual--; }
        fechaSeleccionada = horarioSeleccionado = null;
        renderCalendario(); renderHorarios(); actualizarBotonConfirmar();
    });
    document.getElementById('calNext')?.addEventListener('click', () => {
        mesActual++;
        if (mesActual > 11) { mesActual = 0; anioActual++; }
        fechaSeleccionada = horarioSeleccionado = null;
        renderCalendario(); renderHorarios(); actualizarBotonConfirmar();
    });

    document.getElementById('modalCerrar')?.addEventListener('click', () => {
        document.getElementById('modalConfirmacion').style.display = 'none';
    });
    document.getElementById('btnConfirmar')?.addEventListener('click', confirmarReserva);
});


/* SELECCIONAR PROFESIONAL */
function seleccionarProfesional(pro) {
    profesionalSeleccionado = pro;
    fechaSeleccionada = horarioSeleccionado = null;
    const el = document.getElementById('proNombreHorario');
    if (el) el.textContent = pro.nombre;
    renderCalendario();
    renderHorarios();
    actualizarBotonConfirmar();
}


/* CALENDARIO */
function renderCalendario() {
    const calDias      = document.getElementById('calDias');
    const calMesActual = document.getElementById('calMesActual');
    if (!calDias || !calMesActual) return;

    calMesActual.textContent = `${MESES[mesActual]} ${anioActual}`;

    const hoy       = new Date();
    const hoyStr    = formatearFecha(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    const primerDia = new Date(anioActual, mesActual, 1).getDay();
    const diasEnMes = new Date(anioActual, mesActual + 1, 0).getDate();

    let html = '';
    for (let i = 0; i < primerDia; i++) html += `<div class="cal-dia cal-dia-vacio"></div>`;

    for (let d = 1; d <= diasEnMes; d++) {
        const fechaStr  = formatearFecha(anioActual, mesActual, d);
        const diaSemana = new Date(anioActual, mesActual, d).getDay();
        const esDomingo = diaSemana === 0;
        const esSabado  = diaSemana === 6;
        const esPasado  = fechaStr < hoyStr;

        let clases = 'cal-dia';
        if (esDomingo)                        clases += ' cal-dia-deshabilitado';
        else if (esPasado)                    clases += ' cal-dia-pasado';
        else if (esSabado)                    clases += ' cal-dia-sabado';
        if (fechaStr === fechaSeleccionada)   clases += ' seleccionado';

        html += `<button class="${clases}" data-fecha="${fechaStr}" ${(esDomingo||esPasado)?'disabled':''}>${d}</button>`;
    }

    calDias.innerHTML = html;

    calDias.querySelectorAll('.cal-dia:not(.cal-dia-deshabilitado):not(.cal-dia-pasado)').forEach(btn => {
        btn.addEventListener('click', () => {
            fechaSeleccionada   = btn.dataset.fecha;
            horarioSeleccionado = null;
            calDias.querySelectorAll('.cal-dia').forEach(b => b.classList.remove('seleccionado'));
            btn.classList.add('seleccionado');
            renderHorarios();
            actualizarBotonConfirmar();
        });
    });
}


/* HORARIOS */
function renderHorarios() {
    const grid = document.getElementById('horariosGrid');
    if (!grid) return;

    if (!profesionalSeleccionado || !fechaSeleccionada) {
        grid.innerHTML = `<p class="horario-vacio">Seleccioná un profesional y una fecha para ver los horarios disponibles.</p>`;
        return;
    }

    const diaSemana    = new Date(fechaSeleccionada + 'T00:00:00').getDay();
    const horarios     = diaSemana === 6 ? HORARIOS_SABADO : HORARIOS_LUNES_VIERNES;

    const reservasPro  = obtenerReservasPro(profesionalSeleccionado.id)
        .filter(r => r.fecha === fechaSeleccionada).map(r => r.horario);

    const reservasUser = obtenerReservasUsuario()
        .filter(r => r.fecha === fechaSeleccionada).map(r => r.horario);

    grid.innerHTML = horarios.map(h => {
        const ocupadoPro  = reservasPro.includes(h);
        const ocupadoUser = reservasUser.includes(h);
        const seleccionado = h === horarioSeleccionado;

        let clase = 'horario-btn', texto = h, disabled = '';
        if (ocupadoPro)       { clase += ' ocupado-pro';     disabled = 'disabled'; texto = `${h} (no disponible)`; }
        else if (ocupadoUser) { clase += ' ocupado-usuario'; disabled = 'disabled'; texto = `${h} (ya tenés cita)`;  }
        else if (seleccionado){ clase += ' seleccionado'; }

        return `<button class="${clase}" data-horario="${h}" ${disabled}>${texto}</button>`;
    }).join('');

    grid.querySelectorAll('.horario-btn:not(:disabled)').forEach(btn => {
        btn.addEventListener('click', () => {
            horarioSeleccionado = btn.dataset.horario;
            grid.querySelectorAll('.horario-btn').forEach(b => b.classList.remove('seleccionado'));
            btn.classList.add('seleccionado');
            actualizarBotonConfirmar();
        });
    });
}


function actualizarBotonConfirmar() {
    const btn = document.getElementById('btnConfirmar');
    if (btn) btn.disabled = !(profesionalSeleccionado && fechaSeleccionada && horarioSeleccionado);
}


/* CONFIRMAR RESERVA — guarda con la misma clave que lee miPerfil.js */
function confirmarReserva() {
    const sesion = obtenerSesion();
    if (!sesion || !profesionalSeleccionado || !fechaSeleccionada || !horarioSeleccionado) return;

    const reserva = {
        id:            Date.now(),           /* id único para poder cancelarla */
        proId:         profesionalSeleccionado.id,
        proNombre:     profesionalSeleccionado.nombre,
        proProfesion:  profesionalSeleccionado.profesion,
        proUbicacion:  profesionalSeleccionado.ubicacion,
        fecha:         fechaSeleccionada,
        horario:       horarioSeleccionado,
        estado:        'confirmada',
        valoracion:    null,                 /* se completa después de la cita */
        usuarioEmail:  sesion.email,
        fechaCreacion: new Date().toISOString()
    };

    /* 1. Bloquear horario en el profesional */
    const keyPro = claveReservasPro(profesionalSeleccionado.id);
    const listaP = JSON.parse(localStorage.getItem(keyPro) || '[]');
    listaP.push(reserva);
    localStorage.setItem(keyPro, JSON.stringify(listaP));

    /* 2. Guardar en el historial del usuario — misma clave que lee miPerfil.js */
    const keyUser = claveReservasUsuario(sesion.email);
    const listaU  = JSON.parse(localStorage.getItem(keyUser) || '[]');
    listaU.push(reserva);
    localStorage.setItem(keyUser, JSON.stringify(listaU));

    /* Mostrar modal */
    document.getElementById('modalPro').textContent        = profesionalSeleccionado.nombre;
    document.getElementById('modalFechaHora').textContent  = formatearFechaLegible(fechaSeleccionada, horarioSeleccionado);
    document.getElementById('modalUbicacion').textContent  = profesionalSeleccionado.ubicacion;
    document.getElementById('modalConfirmacion').style.display = 'flex';

    /* Resetear selección */
    fechaSeleccionada = horarioSeleccionado = null;
    renderCalendario();
    renderHorarios();
    actualizarBotonConfirmar();
}