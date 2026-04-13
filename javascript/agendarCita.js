/* agendarCita.js
   Reglas de negocio:
   - Lunes a viernes: 08:00 a 17:00 (horarios cada hora)
   - Sábados: 08:00 a 13:00
   - Domingos: inhabilitados
   - No se puede reservar en un horario ya ocupado por el profesional
   - No se puede reservar si el usuario ya tiene cita ese día y hora con otro profesional
   - No se puede reservar en fechas pasadas */


/* HORARIOS SEGÚN DÍA */
const HORARIOS_LUNES_VIERNES = [
    '08:00','09:00','10:00','11:00','12:00',
    '13:00','14:00','15:00','16:00','17:00'
];

const HORARIOS_SABADO = [
    '08:00','09:00','10:00','11:00','12:00','13:00'
];

/* Nombres de los meses */
const MESES = [
    'Enero','Febrero','Marzo','Abril','Mayo','Junio',
    'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'
];

/* ESTADO de la página */
let profesionalSeleccionado = null;
let fechaSeleccionada       = null;
let horarioSeleccionado     = null;
let mesActual               = new Date().getMonth();
let anioActual              = new Date().getFullYear();

/* CLAVE localStorage de reservas del profesional y del usuario */
function claveReservasPro(proId) {
    return `reparify_reservas_pro_${proId}`;
}

function claveReservasUsuario(email) {
    return `reparify_reservas_usuario_${email}`;
}

/* Obtiene la sesión activa */
function obtenerSesion() {
    return JSON.parse(localStorage.getItem('reparify_sesion') || 'null');
}

/* Obtiene todos los profesionales (base + storage) */
function obtenerProfesionales() {
    const base = [
        { id:1,  nombre:'María González',   profesion:'Carpintería',  ubicacion:'Palermo',           zona:'Palermo',      valoracion:4.8, foto:'../image/profesionales/persona1.png',  distancia:'2 km'   },
        { id:2,  nombre:'Roberto Silva',     profesion:'Plomería',     ubicacion:'Palermo, CABA',     zona:'Palermo',      valoracion:5.0, foto:'../image/profesionales/persona2.png',  distancia:'1 km'   },
        { id:3,  nombre:'Carlos Ramírez',    profesion:'Albañilería',  ubicacion:'Belgrano, CABA',    zona:'Belgrano',     valoracion:4.5, foto:'../image/profesionales/persona3.png',  distancia:'3.5 km' },
        { id:4,  nombre:'Ana Martínez',      profesion:'Electricista', ubicacion:'Recoleta, CABA',    zona:'Recoleta',     valoracion:4.9, foto:'../image/profesionales/persona4.png',  distancia:'4.2 km' },
        { id:5,  nombre:'Jorge Pérez',       profesion:'Gasista',      ubicacion:'Colegiales, CABA',  zona:'Colegiales',   valoracion:4.7, foto:'../image/profesionales/persona5.png',  distancia:'5 km'   },
        { id:6,  nombre:'Lucía Fernández',   profesion:'Pinturería',   ubicacion:'Villa Crespo, CABA',zona:'Villa Crespo', valoracion:4.6, foto:'../image/profesionales/persona6.png',  distancia:'3.2 km' },
        { id:7,  nombre:'Diego Romero',      profesion:'Plomería',     ubicacion:'Belgrano, CABA',    zona:'Belgrano',     valoracion:4.9, foto:'../image/profesionales/persona7.png',  distancia:'2.8 km' },
        { id:8,  nombre:'Sofía López',       profesion:'Electricista', ubicacion:'Palermo, CABA',     zona:'Palermo',      valoracion:4.8, foto:'../image/profesionales/persona8.png',  distancia:'1.5 km' },
        { id:9,  nombre:'Martín Torres',     profesion:'Carpintería',  ubicacion:'Colegiales, CABA',  zona:'Colegiales',   valoracion:4.7, foto:'../image/profesionales/persona9.png',  distancia:'4 km'   },
        { id:10, nombre:'Valentina Ruiz',    profesion:'Albañilería',  ubicacion:'Recoleta, CABA',    zona:'Recoleta',     valoracion:4.6, foto:'../image/profesionales/persona10.png', distancia:'4.8 km' },
        { id:11, nombre:'Pablo Díaz',        profesion:'Gasista',      ubicacion:'Palermo, CABA',     zona:'Palermo',      valoracion:5.0, foto:'../image/profesionales/persona11.png', distancia:'0.8 km' },
        { id:12, nombre:'Camila Sánchez',    profesion:'Pinturería',   ubicacion:'Belgrano, CABA',    zona:'Belgrano',     valoracion:4.5, foto:'../image/profesionales/persona12.png', distancia:'3 km'   },
        { id:13, nombre:'Tomás Vargas',      profesion:'Carpintería',  ubicacion:'Villa Crespo, CABA',zona:'Villa Crespo', valoracion:4.9, foto:'../image/profesionales/persona13.png', distancia:'2.2 km' },
        { id:14, nombre:'Florencia Medina',  profesion:'Electricista', ubicacion:'Villa Crespo, CABA',zona:'Villa Crespo', valoracion:4.7, foto:'../image/profesionales/persona14.png', distancia:'3.6 km' },
        { id:15, nombre:'Nicolás Herrera',   profesion:'Plomería',     ubicacion:'Colegiales, CABA',  zona:'Colegiales',   valoracion:4.8, foto:'../image/profesionales/persona15.png', distancia:'4.5 km' }
    ];
    const del = JSON.parse(localStorage.getItem('reparify_profesionales') || '[]');
    return [...base, ...del];
}

/* Obtiene las reservas ya hechas de un profesional */
function obtenerReservasPro(proId) {
    return JSON.parse(localStorage.getItem(claveReservasPro(proId)) || '[]');
}

/* Obtiene las reservas del usuario actual */
function obtenerReservasUsuario() {
    const sesion = obtenerSesion();
    if (!sesion) return [];
    return JSON.parse(localStorage.getItem(claveReservasUsuario(sesion.email)) || '[]');
}

/* Formatea una fecha como string 'YYYY-MM-DD' */
function formatearFecha(year, month, day) {
    return `${year}-${String(month + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
}

/* Formatea fecha para mostrar */
function formatearFechaLegible(fechaStr, horario) {
    const [y, m, d] = fechaStr.split('-').map(Number);
    return `${d} de ${MESES[m - 1]} ${y}, ${horario} hs`;
}


document.addEventListener('DOMContentLoaded', () => {

    /* Verificar sesión: si no está logueado redirige */
    /* VERIFICAR SESIÓN */
    const sesion = JSON.parse(localStorage.getItem('reparify_sesion') || 'null');
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
    /* Leer el id del profesional de la URL (?id=3) si viene */
    const params   = new URLSearchParams(window.location.search);
    const idDesdeUrl = parseInt(params.get('id')) || null;

    /* Render inicial */
    renderCarrusel(idDesdeUrl);
    renderCalendario();

    /* Botón prev/next del calendario */
    document.getElementById('calPrev')?.addEventListener('click', () => {
        mesActual--;
        if (mesActual < 0) { mesActual = 11; anioActual--; }
        fechaSeleccionada  = null;
        horarioSeleccionado = null;
        renderCalendario();
        renderHorarios();
        actualizarBotonConfirmar();
    });

    document.getElementById('calNext')?.addEventListener('click', () => {
        mesActual++;
        if (mesActual > 11) { mesActual = 0; anioActual++; }
        fechaSeleccionada  = null;
        horarioSeleccionado = null;
        renderCalendario();
        renderHorarios();
        actualizarBotonConfirmar();
    });

    /* Favoritos toggle */
    // const btnFav = document.getElementById('btnFavoritos');
    // btnFav?.addEventListener('click', () => {
    //     btnFav.classList.toggle('activo');
    // });

    // /* Modal cerrar */
    document.getElementById('modalCerrar')?.addEventListener('click', () => {
        document.getElementById('modalConfirmacion').style.display = 'none';
    });

    /* Botón confirmar */
    document.getElementById('btnConfirmar')?.addEventListener('click', confirmarReserva);
});


/* RENDER DEL CARRUSEL */
function renderCarrusel(idPreseleccionado) {
    const contenedor = document.getElementById('prosCarrusel');
    if (!contenedor) return;

    const pros = obtenerProfesionales();

   
    /* Si viene un id desde la URL, lo preseleccionamos */
    if (idPreseleccionado) {
        const pro = pros.find(p => p.id === idPreseleccionado);
        if (pro) seleccionarProfesional(pro);
    }

}

function seleccionarProfesional(pro) {
    profesionalSeleccionado = pro;
    fechaSeleccionada       = null;
    horarioSeleccionado     = null;

    document.getElementById('proNombreHorario').textContent = pro.nombre;
    renderCalendario();
    renderHorarios();
    actualizarBotonConfirmar();
}


/* RENDER DEL CALENDARIO */
function renderCalendario() {
    const calDias      = document.getElementById('calDias');
    const calMesActual = document.getElementById('calMesActual');
    if (!calDias || !calMesActual) return;

    calMesActual.textContent = `${MESES[mesActual]} ${anioActual}`;

    const hoy          = new Date();
    const hoyStr       = formatearFecha(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    const primerDia    = new Date(anioActual, mesActual, 1).getDay(); /* 0=Dom */
    const diasEnMes    = new Date(anioActual, mesActual + 1, 0).getDate();

    let html = '';

    /* Celdas vacías al inicio */
    for (let i = 0; i < primerDia; i++) {
        html += `<div class="cal-dia cal-dia-vacio"></div>`;
    }

    for (let d = 1; d <= diasEnMes; d++) {
        const fechaStr  = formatearFecha(anioActual, mesActual, d);
        const diaSemana = new Date(anioActual, mesActual, d).getDay();
        const esDomingo = diaSemana === 0;
        const esSabado  = diaSemana === 6;
        const esPasado  = fechaStr < hoyStr;

        let clases = 'cal-dia';
        if (esDomingo)                    clases += ' cal-dia-deshabilitado';
        else if (esPasado)                clases += ' cal-dia-pasado';
        else if (esSabado)                clases += ' cal-dia-sabado';
        if (fechaStr === fechaSeleccionada) clases += ' seleccionado';

        const deshabilitado = esDomingo || esPasado ? 'disabled' : '';

        html += `<button class="${clases}" data-fecha="${fechaStr}" ${deshabilitado}>${d}</button>`;
    }

    calDias.innerHTML = html;

    /* Click en día */
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


/* RENDER DE HORARIOS */
function renderHorarios() {
    const grid = document.getElementById('horariosGrid');
    if (!grid) return;

    if (!profesionalSeleccionado || !fechaSeleccionada) {
        grid.innerHTML = `<p class="horario-vacio">Seleccioná un profesional y una fecha para ver los horarios disponibles.</p>`;
        return;
    }

    /* Determinar qué horarios corresponden según el día */
    const diaSemana = new Date(fechaSeleccionada + 'T00:00:00').getDay();
    const esSabado  = diaSemana === 6;
    const horarios  = esSabado ? HORARIOS_SABADO : HORARIOS_LUNES_VIERNES;

    /* Reservas ya hechas por el profesional en este día */
    const reservasPro = obtenerReservasPro(profesionalSeleccionado.id)
        .filter(r => r.fecha === fechaSeleccionada)
        .map(r => r.horario);

    /* Reservas del usuario en este día (con cualquier profesional) */
    const reservasUsuario = obtenerReservasUsuario()
        .filter(r => r.fecha === fechaSeleccionada)
        .map(r => r.horario);

    grid.innerHTML = horarios.map(h => {
        const ocupadoPro     = reservasPro.includes(h);
        const ocupadoUsuario = reservasUsuario.includes(h);
        const esSeleccionado = h === horarioSeleccionado;

        let clase = 'horario-btn';
        let texto = h;
        let disabled = '';

        if (ocupadoPro) {
            clase   += ' ocupado-pro';
            disabled = 'disabled';
            texto    = `${h} (no disponible)`;
        } else if (ocupadoUsuario) {
            clase   += ' ocupado-usuario';
            disabled = 'disabled';
            texto    = `${h} (ya tenés cita)`;
        } else if (esSeleccionado) {
            clase += ' seleccionado';
        }

        return `<button class="${clase}" data-horario="${h}" ${disabled}>${texto}</button>`;
    }).join('');

    /* Click en horario */
    grid.querySelectorAll('.horario-btn:not(:disabled)').forEach(btn => {
        btn.addEventListener('click', () => {
            horarioSeleccionado = btn.dataset.horario;
            grid.querySelectorAll('.horario-btn').forEach(b => b.classList.remove('seleccionado'));
            btn.classList.add('seleccionado');
            actualizarBotonConfirmar();
        });
    });
}


/* HABILITAR/DESHABILITAR BOTÓN CONFIRMAR */
function actualizarBotonConfirmar() {
    const btn = document.getElementById('btnConfirmar');
    if (!btn) return;
    btn.disabled = !(profesionalSeleccionado && fechaSeleccionada && horarioSeleccionado);
}


/* CONFIRMAR RESERVA */
function confirmarReserva() {
    const sesion = obtenerSesion();
    if (!sesion || !profesionalSeleccionado || !fechaSeleccionada || !horarioSeleccionado) return;

    const reserva = {
        proId:        profesionalSeleccionado.id,
        proNombre:    profesionalSeleccionado.nombre,
        proUbicacion: profesionalSeleccionado.ubicacion,
        fecha:        fechaSeleccionada,
        horario:      horarioSeleccionado,
        usuarioEmail: sesion.email,
        fechaCreacion: new Date().toISOString()
    };

    /* Guardar en reservas del profesional */
    const keyPro   = claveReservasPro(profesionalSeleccionado.id);
    const listaP   = JSON.parse(localStorage.getItem(keyPro) || '[]');
    listaP.push(reserva);
    localStorage.setItem(keyPro, JSON.stringify(listaP));

    /* Guardar en reservas del usuario */
    const keyUser  = claveReservasUsuario(sesion.email);
    const listaU   = JSON.parse(localStorage.getItem(keyUser) || '[]');
    listaU.push(reserva);
    localStorage.setItem(keyUser, JSON.stringify(listaU));

    /* Mostrar modal de confirmación */
    document.getElementById('modalPro').textContent      = profesionalSeleccionado.nombre;
    document.getElementById('modalFechaHora').textContent = formatearFechaLegible(fechaSeleccionada, horarioSeleccionado);
    document.getElementById('modalUbicacion').textContent = profesionalSeleccionado.ubicacion;
    document.getElementById('modalConfirmacion').style.display = 'flex';

    /* Limpiar selección para evitar doble reserva */
    horarioSeleccionado = null;
    fechaSeleccionada   = null;
    renderCalendario();
    renderHorarios();
    actualizarBotonConfirmar();
}