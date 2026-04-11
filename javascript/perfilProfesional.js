/* perfilProfesional.js
   Vista del perfil profesional desde el usuario.
   - Si no hay sesión activa muestra el popup de registro.
   - Lee el id del profesional desde la URL (?id=3).
   - Busca en los hardcodeados y en los registrados en localStorage.
   - Renderiza datos, servicios, certificaciones e historial. */


/* DATOS EXTENDIDOS de cada profesional hardcodeado
   Estos se complementan con los datos base de profesionales.js.
   El id debe coincidir. */
const datosProfesionalesExtendidos = {
    1: {
        biografia: `Soy María González, carpintera con más de 8 años de experiencia en muebles a medida, restauración y carpintería fina en zona norte de CABA. Me especializo en trabajos de alta calidad, respetando siempre los tiempos acordados.\n\nCuento con certificaciones en seguridad laboral y en diseño de interiores en madera. Me gusta trabajar con el cliente para lograr exactamente lo que necesita.`,
        servicios: ['Muebles a medida', 'Restauración de muebles', 'Instalación de pisos de madera'],
        serviciosIconos: ['🪑', '🔨', '🪵'],
        certificaciones: [
            { label: 'Certificado Carpintería Fina', imagen: '../image/profesionales/cert-placeholder.jpg' },
            { label: 'Curso Restauración', imagen: '../image/profesionales/cert-placeholder.jpg' },
            { label: 'Seguridad Laboral', imagen: '../image/profesionales/cert-placeholder.jpg' }
        ],
        historial: [
            { servicio: 'Mueble de cocina a medida', cliente: 'Ana Ruiz',   fecha: '10/11/2025', estado: 'finalizado', valoracion: 5 },
            { servicio: 'Restauración comedor',      cliente: 'Leo Díaz',   fecha: '05/10/2025', estado: 'finalizado', valoracion: 5 },
            { servicio: 'Piso de madera living',     cliente: 'Juan Gómez', fecha: '01/10/2025', estado: 'finalizado', valoracion: 4 }
        ]
    },
    2: {
        biografia: `Soy Roberto Silva, plomero matriculado con 10 años de experiencia en instalaciones sanitarias, reparación de cañerías y destapes en CABA.\n\nTrabajo con materiales de primera calidad y garantizo mis trabajos. Respondo rápido y ofrezco presupuesto sin cargo.`,
        servicios: ['Reparación de cañerías', 'Destapes', 'Instalaciones sanitarias'],
        serviciosIconos: ['🔧', '🚿', '🛁'],
        certificaciones: [
            { label: 'Matrícula Plomero', imagen: '../image/profesionales/cert-placeholder.jpg' },
            { label: 'Certificado Gas', imagen: '../image/profesionales/cert-placeholder.jpg' }
        ],
        historial: [
            { servicio: 'Fuga de agua cocina',   cliente: 'María S.',  fecha: '07/11/2025', estado: 'finalizado', valoracion: 5 },
            { servicio: 'Destape baño',          cliente: 'Leo Díaz',  fecha: '05/10/2025', estado: 'finalizado', valoracion: 5 },
            { servicio: 'Instalación termotanque', cliente: 'Juan G.', fecha: '01/10/2025', estado: 'finalizado', valoracion: 4 }
        ]
    },
    3: {
        biografia: `Soy Carlos Ramírez, albañil con experiencia en obras y remodelaciones en Belgrano, Buenos Aires. Me dedico a la construcción y reparación de muros, colocación de pisos y refacción de paredes.\n\nTengo tres certificaciones en albañilería, seguridad en la construcción y colocación de cerámicos. Me gusta trabajar prolijo, cumplir con los tiempos y dejar cada trabajo bien terminado.`,
        servicios: ['Levantamiento de muros', 'Reparación de paredes', 'Colocación de pisos'],
        serviciosIconos: ['🧱', '🔨', '⬛'],
        certificaciones: [
            { label: 'Certificado Albañilería', imagen: '../image/profesionales/cert-placeholder.jpg' },
            { label: 'Seguridad Construcción',  imagen: '../image/profesionales/cert-placeholder.jpg' },
            { label: 'Colocación Cerámicos',    imagen: '../image/profesionales/cert-placeholder.jpg' }
        ],
        historial: [
            { servicio: 'Colocación de cerámicos', cliente: 'María Suárez', fecha: '07/11/2025', estado: 'finalizado', valoracion: 5 },
            { servicio: 'Instalación de durlock',  cliente: 'Leo Díaz',     fecha: '05/10/2025', estado: 'finalizado', valoracion: 5 },
            { servicio: 'Terminación de cielorraso', cliente: 'Juan Gómez', fecha: '01/10/2025', estado: 'finalizado', valoracion: 4 }
        ]
    }
};

/* Para los ids 4-15 usamos datos genéricos */
function datosGenericos(pro) {
    return {
        biografia: `Soy ${pro.nombre}, profesional verificado en ${pro.profesion} con base en ${pro.ubicacion}. Cuento con experiencia en el rubro y me comprometo a brindar un servicio de calidad, puntual y con garantía de trabajo.\n\nEstoy disponible para presupuestos sin cargo y atiendo de lunes a sábado.`,
        servicios: [pro.profesion],
        serviciosIconos: ['🔧'],
        certificaciones: [
            { label: 'Matrícula Profesional', imagen: '' }
        ],
        historial: []
    };
}


document.addEventListener('DOMContentLoaded', () => {

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


    /* OBTENER EL ID DEL PROFESIONAL DE LA URL */
    const params = new URLSearchParams(window.location.search);
    const id     = parseInt(params.get('id')) || 1;


    /* BUSCAR EL PROFESIONAL */
    const profesionalesStorage = JSON.parse(localStorage.getItem('reparify_profesionales') || '[]');
    const profesionalesBase    = obtenerBaseProfesionales();
    const todos                = [...profesionalesBase, ...profesionalesStorage];
    const pro                  = todos.find(p => p.id === id);

    if (!pro) {
        document.querySelector('.perfpro-container').innerHTML =
            '<p style="padding:3em;text-align:center;color:#6b7280">Profesional no encontrado.</p>';
        return;
    }

    /* DATOS EXTENDIDOS */
    const ext = datosProfesionalesExtendidos[id] || datosGenericos(pro);


    /* RENDER DE LA CARD HEADER */
    setText('proNombre',    pro.nombre);
    setText('proProfesion', pro.profesion);
    setText('proUbicacion', pro.ubicacion);
    setText('proDesde',     pro.desde);
    setText('proValoracion', pro.valoracion > 0 ? pro.valoracion : '—');
    setText('proTrabajos',   pro.trabajos   > 0 ? `${pro.trabajos}` : '0');
    setText('proRespuesta',  pro.respuesta !== 'N/A' ? `< ${pro.respuesta}` : '—');

    document.title = `Reparify – ${pro.nombre}`;

    if (pro.foto) {
        document.getElementById('proFoto').src = pro.foto;
    }


    /* RENDER BIOGRAFÍA */
    const bioEl = document.getElementById('proBiografia');
    if (bioEl) {
        bioEl.innerHTML = ext.biografia
            .split('\n\n')
            .map(p => `<p>${p.trim()}</p>`)
            .join('');
    }


    /* RENDER SERVICIOS */
    const serviciosGrid = document.getElementById('serviciosGrid');
    if (serviciosGrid && ext.servicios.length > 0) {
        serviciosGrid.innerHTML = ext.servicios.map((s, i) => `
            <div class="servicio-card">
                <span class="servicio-icono">${ext.serviciosIconos[i] || '🔧'}</span>
                <p class="servicio-nombre">${s}</p>
            </div>
        `).join('');
    }


    /* RENDER CERTIFICACIONES con slider */
    const certsTrack = document.getElementById('certsTrack');
    const certsDots  = document.getElementById('certsDots');
    let certIndex = 0;

    if (certsTrack && ext.certificaciones.length > 0) {
        certsTrack.innerHTML = ext.certificaciones.map(c => `
            <div class="cert-card ${!c.imagen ? 'sin-imagen' : ''}">
                ${c.imagen
                    ? `<img src="${c.imagen}" alt="${c.label}" onerror="this.parentElement.classList.add('sin-imagen');this.style.display='none'" />`
                    : `<span>${c.label}</span>`
                }
            </div>
        `).join('');

        /* Dots */
        if (certsDots) {
            certsDots.innerHTML = ext.certificaciones.map((_, i) => `
                <button class="cert-dot ${i === 0 ? 'activo' : ''}" data-i="${i}"></button>
            `).join('');

            certsDots.querySelectorAll('.cert-dot').forEach(dot => {
                dot.addEventListener('click', () => {
                    certIndex = parseInt(dot.dataset.i);
                    moverCerts();
                    certsDots.querySelectorAll('.cert-dot').forEach(d => d.classList.remove('activo'));
                    dot.classList.add('activo');
                });
            });
        }
    }

    function moverCerts() {
        if (!certsTrack) return;
        const card = certsTrack.querySelector('.cert-card');
        if (!card) return;
        const ancho = card.offsetWidth + 16;
        certsTrack.style.transform = `translateX(-${certIndex * ancho}px)`;
    }


    /* RENDER HISTORIAL */
    const historialBody = document.getElementById('historialBody');
    if (historialBody) {
        if (ext.historial.length === 0) {
            historialBody.innerHTML = `
                <tr><td colspan="6" class="tabla-vacia">Sin historial disponible.</td></tr>`;
        } else {
            historialBody.innerHTML = ext.historial.map(h => `
                <tr>
                    <td>${h.servicio}</td>
                    <td>${h.cliente}</td>
                    <td>${h.fecha}</td>
                    <td><span class="badge-estado badge-${h.estado === 'finalizado' ? 'finalizado' : 'progreso'}">
                        ${h.estado === 'finalizado' ? 'Finalizado' : 'En progreso'}
                    </span></td>
                    <td><span class="estrellas">${'★'.repeat(h.valoracion)}${'☆'.repeat(5 - h.valoracion)}</span></td>
                  
                </tr>
            `).join('');
        }
    }
  // <td><button class="btn-ver-detalles">👁 Ver Detalles</button></td>

    /* BOTÓN GUARDAR PERFIL */
    const btnGuardar = document.getElementById('btnGuardar');
    if (btnGuardar && sesion) {
        const KEY_GUARDADOS = `reparify_guardados_${sesion.email}`;
        const guardados = JSON.parse(localStorage.getItem(KEY_GUARDADOS) || '[]');

        if (guardados.includes(id)) {
            btnGuardar.classList.add('guardado');
        }

        btnGuardar.addEventListener('click', () => {
            const lista = JSON.parse(localStorage.getItem(KEY_GUARDADOS) || '[]');
            if (lista.includes(id)) {
                const nueva = lista.filter(i => i !== id);
                localStorage.setItem(KEY_GUARDADOS, JSON.stringify(nueva));
                btnGuardar.classList.remove('guardado');
            } else {
                lista.push(id);
                localStorage.setItem(KEY_GUARDADOS, JSON.stringify(lista));
                btnGuardar.classList.add('guardado');
            }
        });
    }


    /* MODAL CONTACTAR */
    const btnContactar   = document.getElementById('btnContactar');
    const modalContactar = document.getElementById('modalContactar');
    const modalCerrar    = document.getElementById('modalCerrar');
    const formContacto   = document.getElementById('formContactarPro');
    const modalFeedback  = document.getElementById('modalFeedback');

    setText('modalNombrePro', pro.nombre);

    btnContactar?.addEventListener('click', () => {
        if (!sesion) {
            /* Si no está logueado, muestra el popup */
            if (popupOverlay) popupOverlay.classList.remove('oculto');
            return;
        }
        if (modalContactar) modalContactar.style.display = 'flex';
    });

    modalCerrar?.addEventListener('click', () => {
        if (modalContactar) modalContactar.style.display = 'none';
        if (modalFeedback)  { modalFeedback.textContent = ''; modalFeedback.className = 'modal-feedback'; }
        if (formContacto)   formContacto.reset();
    });

    /* Cierra el modal al hacer click fuera */
    modalContactar?.addEventListener('click', (e) => {
        if (e.target === modalContactar) {
            modalContactar.style.display = 'none';
        }
    });

    if (formContacto) {
        formContacto.addEventListener('submit', (e) => {
            e.preventDefault();
            const msg    = document.getElementById('msgContacto').value.trim();
            const errEl  = document.getElementById('err-msgContacto');
            const btnEnv = formContacto.querySelector('.btn-enviar-msg');

            if (!msg || msg.length < 10) {
                document.getElementById('msgContacto').classList.add('input-error');
                if (errEl) errEl.textContent = 'Escribí al menos 10 caracteres.';
                return;
            }

            document.getElementById('msgContacto').classList.remove('input-error');
            if (errEl) errEl.textContent = '';

            btnEnv.disabled    = true;
            btnEnv.textContent = 'Enviando...';

            /* Simulamos el envío */
            setTimeout(() => {
                if (modalFeedback) {
                    modalFeedback.textContent = `¡Mensaje enviado a ${pro.nombre}! Te responderá pronto.`;
                    modalFeedback.classList.add('exito');
                }
                formContacto.reset();
                btnEnv.disabled    = false;
                btnEnv.textContent = 'Enviar mensaje';

                setTimeout(() => {
                    if (modalContactar) modalContactar.style.display = 'none';
                    if (modalFeedback)  { modalFeedback.textContent = ''; modalFeedback.className = 'modal-feedback'; }
                }, 2500);
            }, 1000);
        });
    }


    /* HELPERS */

    function setText(id, texto) {
        const el = document.getElementById(id);
        if (el) el.textContent = texto;
    }

    /* Datos base de profesionales (mismos que en profesionales.js, duplicados
       para que este archivo funcione de forma independiente) */
    function obtenerBaseProfesionales() {
        return [
            { id:1,  nombre:'María González',    profesion:'Carpintería',  ubicacion:'Palermo',          zona:'Palermo',      desde:'Enero 2022',      trabajos:120, valoracion:4.8, respuesta:'1h',   foto:'../image/profesionales/maria-gonzalez.jpg' },
            { id:2,  nombre:'Roberto Silva',      profesion:'Plomería',     ubicacion:'Palermo, CABA',    zona:'Palermo',      desde:'Marzo 2021',      trabajos:140, valoracion:5.0, respuesta:'30min',foto:'../image/profesionales/roberto-silva.jpg' },
            { id:3,  nombre:'Carlos Ramírez',     profesion:'Albañilería',  ubicacion:'Belgrano, CABA',   zona:'Belgrano',     desde:'Junio 2020',      trabajos:110, valoracion:4.5, respuesta:'2h',   foto:'../image/profesionales/carlos-ramirez.jpg' },
            { id:4,  nombre:'Ana Martínez',       profesion:'Electricista', ubicacion:'Recoleta, CABA',   zona:'Recoleta',     desde:'Agosto 2022',     trabajos:85,  valoracion:4.9, respuesta:'45min',foto:'../image/profesionales/ana-martinez.jpg' },
            { id:5,  nombre:'Jorge Pérez',        profesion:'Gasista',      ubicacion:'Colegiales, CABA', zona:'Colegiales',   desde:'Febrero 2021',    trabajos:95,  valoracion:4.7, respuesta:'1h',   foto:'../image/profesionales/jorge-perez.jpg' },
            { id:6,  nombre:'Lucía Fernández',    profesion:'Pinturería',   ubicacion:'Villa Crespo, CABA',zona:'Villa Crespo',desde:'Mayo 2023',       trabajos:60,  valoracion:4.6, respuesta:'2h',   foto:'../image/profesionales/lucia-fernandez.jpg' },
            { id:7,  nombre:'Diego Romero',       profesion:'Plomería',     ubicacion:'Belgrano, CABA',   zona:'Belgrano',     desde:'Enero 2020',      trabajos:200, valoracion:4.9, respuesta:'20min',foto:'../image/profesionales/diego-romero.jpg' },
            { id:8,  nombre:'Sofía López',        profesion:'Electricista', ubicacion:'Palermo, CABA',    zona:'Palermo',      desde:'Septiembre 2022', trabajos:70,  valoracion:4.8, respuesta:'1h',   foto:'../image/profesionales/sofia-lopez.jpg' },
            { id:9,  nombre:'Martín Torres',      profesion:'Carpintería',  ubicacion:'Colegiales, CABA', zona:'Colegiales',   desde:'Abril 2021',      trabajos:130, valoracion:4.7, respuesta:'30min',foto:'../image/profesionales/martin-torres.jpg' },
            { id:10, nombre:'Valentina Ruiz',     profesion:'Albañilería',  ubicacion:'Recoleta, CABA',   zona:'Recoleta',     desde:'Noviembre 2021',  trabajos:90,  valoracion:4.6, respuesta:'45min',foto:'../image/profesionales/valentina-ruiz.jpg' },
            { id:11, nombre:'Pablo Díaz',         profesion:'Gasista',      ubicacion:'Palermo, CABA',    zona:'Palermo',      desde:'Julio 2020',      trabajos:115, valoracion:5.0, respuesta:'15min',foto:'../image/profesionales/pablo-diaz.jpg' },
            { id:12, nombre:'Camila Sánchez',     profesion:'Pinturería',   ubicacion:'Belgrano, CABA',   zona:'Belgrano',     desde:'Marzo 2023',      trabajos:45,  valoracion:4.5, respuesta:'2h',   foto:'../image/profesionales/camila-sanchez.jpg' },
            { id:13, nombre:'Tomás Vargas',       profesion:'Carpintería',  ubicacion:'Villa Crespo, CABA',zona:'Villa Crespo',desde:'Octubre 2020',    trabajos:160, valoracion:4.9, respuesta:'1h',   foto:'../image/profesionales/tomas-vargas.jpg' },
            { id:14, nombre:'Florencia Medina',   profesion:'Electricista', ubicacion:'Villa Crespo, CABA',zona:'Villa Crespo',desde:'Junio 2022',      trabajos:80,  valoracion:4.7, respuesta:'40min',foto:'../image/profesionales/florencia-medina.jpg' },
            { id:15, nombre:'Nicolás Herrera',    profesion:'Plomería',     ubicacion:'Colegiales, CABA', zona:'Colegiales',   desde:'Diciembre 2021',  trabajos:105, valoracion:4.8, respuesta:'30min',foto:'../image/profesionales/nicolas-herrera.jpg' }
        ];
    }

});