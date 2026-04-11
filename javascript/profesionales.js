/* Base de datos de profesionales */
const profesionalesBase = [
    {
        id: 1,
        nombre: 'María González',
        profesion: 'Carpintería',
        ubicacion: 'Palermo',
        desde: 'Enero 2022',
        trabajos: 20,
        valoracion: 4.8,
        respuesta: '1h',
        foto: '../image/profesionales/persona1.png',
        zona: 'Palermo'
    },
    {
        id: 2,
        nombre: 'Roberto Silva',
        profesion: 'Plomería',
        ubicacion: 'Palermo, CABA',
        desde: 'Marzo 2021',
        trabajos: 30,
        valoracion: 5.0,
        respuesta: '30min',
        foto: '../image/profesionales/persona2.png',
        zona: 'Palermo'
    },
    {
        id: 3,
        nombre: 'Carlos Ramírez',
        profesion: 'Albañilería',
        ubicacion: 'Belgrano, CABA',
        desde: 'Junio 2020',
        trabajos: 10,
        valoracion: 4.5,
        respuesta: '2h',
        foto: '../image/profesionales/persona3.png',
        zona: 'Belgrano'
    },
    {
        id: 4,
        nombre: 'Ana Martínez',
        profesion: 'Electricista',
        ubicacion: 'Recoleta, CABA',
        desde: 'Agosto 2022',
        trabajos: 36,
        valoracion: 4.9,
        respuesta: '45min',
        foto: '../image/profesionales/persona4.png',
        zona: 'Recoleta'
    },
    {
        id: 5,
        nombre: 'Jorge Pérez',
        profesion: 'Gasista',
        ubicacion: 'Colegiales, CABA',
        desde: 'Febrero 2021',
        trabajos: 40,
        valoracion: 4.7,
        respuesta: '1h',
        foto: '../image/profesionales/persona5.png',
        zona: 'Colegiales'
    },
    {
        id: 6,
        nombre: 'Lucía Fernández',
        profesion: 'Pinturería',
        ubicacion: 'Villa Crespo, CABA',
        desde: 'Mayo 2023',
        trabajos: 120,
        valoracion: 4.6,
        respuesta: '2h',
        foto: '../image/profesionales/persona6.png',
        zona: 'Villa Crespo'
    },
    {
        id: 7,
        nombre: 'Diego Romero',
        profesion: 'Plomería',
        ubicacion: 'Belgrano, CABA',
        desde: 'Enero 2020',
        trabajos: 200,
        valoracion: 4.9,
        respuesta: '20min',
        foto: '../image/profesionales/persona7.png',
        zona: 'Belgrano'
    },
    {
        id: 8,
        nombre: 'Sofía López',
        profesion: 'Electricista',
        ubicacion: 'Palermo, CABA',
        desde: 'Septiembre 2022',
        trabajos: 70,
        valoracion: 4.8,
        respuesta: '1h',
        foto: '../image/profesionales/persona8.png',
        zona: 'Palermo'
    },
    {
        id: 9,
        nombre: 'Martín Torres',
        profesion: 'Carpintería',
        ubicacion: 'Colegiales, CABA',
        desde: 'Abril 2021',
        trabajos: 130,
        valoracion: 4.7,
        respuesta: '30min',
        foto:'../image/profesionales/persona9.png',
        zona: 'Colegiales'
    },
    {
        id: 10,
        nombre: 'Valentina Ruiz',
        profesion: 'Albañilería',
        ubicacion: 'Recoleta, CABA',
        desde: 'Noviembre 2021',
        trabajos: 90,
        valoracion: 4.6,
        respuesta: '45min',
        foto: '../image/profesionales/persona10.png',
        zona: 'Recoleta'
    },
    {
        id: 11,
        nombre: 'Pablo Díaz',
        profesion: 'Gasista',
        ubicacion: 'Palermo, CABA',
        desde: 'Julio 2020',
        trabajos: 115,
        valoracion: 5.0,
        respuesta: '15min',
        foto:'../image/profesionales/persona11.png',
        zona: 'Palermo'
    },
    {
        id: 12,
        nombre: 'Camila Sánchez',
        profesion: 'Pinturería',
        ubicacion: 'Belgrano, CABA',
        desde: 'Marzo 2023',
        trabajos: 45,
        valoracion: 4.5,
        respuesta: '2h',
        foto: '../image/profesionales/persona12.png',
        zona: 'Belgrano'
    },
    {
        id: 13,
        nombre: 'Tomás Vargas',
        profesion: 'Carpintería',
        ubicacion: 'Villa Crespo, CABA',
        desde: 'Octubre 2020',
        trabajos: 160,
        valoracion: 4.9,
        respuesta: '1h',
        foto: '../image/profesionales/persona13.png',
        zona: 'Villa Crespo'
    },
    {
        id: 14,
        nombre: 'Florencia Medina',
        profesion: 'Electricista',
        ubicacion: 'Villa Crespo, CABA',
        desde: 'Junio 2022',
        trabajos: 80,
        valoracion: 4.7,
        respuesta: '40min',
        foto: '../image/profesionales/persona14.png',
        zona: 'Villa Crespo'
    },
    {
        id: 15,
        nombre: 'Nicolás Herrera',
        profesion: 'Plomería',
        ubicacion: 'Colegiales, CABA',
        desde: 'Diciembre 2021',
        trabajos: 105,
        valoracion: 4.8,
        respuesta: '30min',
        foto: '../image/profesionales/persona15.png',
        zona: 'Colegiales'
    }
];

/* Combina los hardcodeados con los del localStorage (registro de profesionales) */
function obtenerTodosProfesionales() {
    const delStorage = JSON.parse(localStorage.getItem('reparify_profesionales') || '[]');
    return [...profesionalesBase, ...delStorage];
}

/* ESTADO: profesionales actualmente visibles (pueden ser filtrados) */
let profesionalesActuales = obtenerTodosProfesionales();
let filtroActivoProfesion = null;

/* SLIDER */
let sliderIndex = 0;
const CARDS_VISIBLE = 3;
const MAX_DESTACADOS = 8;

/* INICIALIZAR */
document.addEventListener('DOMContentLoaded', () => {
    renderSlider();
    renderMapa();
    configurarBusqueda();
    configurarFiltrosCategorias();
    configurarSliderControles();
    configurarFiltrosMapa();
});


/* RENDER DEL SLIDER DE DESTACADOS
   Muestra hasta 3 profesionales ordenados por valoración. */
function renderSlider() {
    const track = document.getElementById('sliderTrack');
    if (!track) return;

    const todos = obtenerTodosProfesionales();
    const destacados = [...todos]
        .sort((a, b) => b.valoracion - a.valoracion)
        .slice(0, MAX_DESTACADOS);

    track.innerHTML = destacados.map(p => cardProfesionalHTML(p)).join('');

    sliderIndex = 0;
    moverSlider();
    actualizarBotonesSlider(destacados.length);
}

function cardProfesionalHTML(p) {
    const estrellas = renderEstrellas(p.valoracion);
    return `
        <div class="slider-card">
            <div class="slider-foto-wrapper">
                <img src="${p.foto}" alt="${p.nombre}"
                    class="slider-foto"
                    onerror="this.style.background='#ddd';this.src=''" />
            </div>
            <div class="slider-info">
                <p class="slider-nombre">${p.nombre}</p>
                <p class="slider-profesion">${p.profesion}</p>
                <div class="slider-estrellas">${estrellas}</div>
                <p class="slider-dato">📍 ${p.ubicacion}</p>
                <p class="slider-dato">🔧 +${p.trabajos} trabajos realizados</p>
                <p class="slider-dato">⏱ Respuesta en menos de ${p.respuesta}</p>
            </div>
            <div class="slider-acciones">
                <a href="./perfilProfesional.html?id=${p.id}" class="btn-ver-perfil">Ver perfil</a>
                <a href="./perfilProfesional.html?id=${p.id} class="btn-agendar-cita"" class="btn-ver-perfil">Contactar</a>
            </div>
        </div>
    `;
}

function moverSlider() {
    const track = document.getElementById('sliderTrack');
    if (!track) return;
    const cardWidth = track.querySelector('.slider-card')?.offsetWidth + 20 || 0;
    track.style.transform = `translateX(-${sliderIndex * cardWidth}px)`;
}

function actualizarBotonesSlider(total) {
    const btnPrev = document.getElementById('sliderPrev');
    const btnNext = document.getElementById('sliderNext');
    if (btnPrev) btnPrev.disabled = sliderIndex === 0;
    if (btnNext) btnNext.disabled = sliderIndex >= total - CARDS_VISIBLE;
}

function configurarSliderControles() {
    const btnPrev = document.getElementById('sliderPrev');
    const btnNext = document.getElementById('sliderNext');
    const track   = document.getElementById('sliderTrack');

    if (btnPrev) {
        btnPrev.addEventListener('click', () => {
            if (sliderIndex > 0) {
                sliderIndex--;
                moverSlider();
                const total = track?.querySelectorAll('.slider-card').length || 0;
                actualizarBotonesSlider(total);
            }
        });
    }

    if (btnNext) {
        btnNext.addEventListener('click', () => {
            const cards = track?.querySelectorAll('.slider-card') || [];
            const total = cards.length;
            if (sliderIndex < total - CARDS_VISIBLE) {
                sliderIndex++;
                moverSlider();
                actualizarBotonesSlider(total);
            }
        });
    }

    /* Recalcula posición en resize */
    window.addEventListener('resize', moverSlider);
}


/* BÚSQUEDA por servicio y zona */
function configurarBusqueda() {
    const form        = document.getElementById('formBusqueda');
    const inputServicio = document.getElementById('inputServicio');
    const inputZona     = document.getElementById('inputZona');

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const servicio = inputServicio.value.trim().toLowerCase();
        const zona     = inputZona.value.trim().toLowerCase();

        const todos = obtenerTodosProfesionales();

        const resultado = todos.filter(p => {
            const coincideServicio = !servicio ||
                p.profesion.toLowerCase().includes(servicio) ||
                p.nombre.toLowerCase().includes(servicio);
            const coincideZona = !zona ||
                p.zona.toLowerCase().includes(zona) ||
                p.ubicacion.toLowerCase().includes(zona);
            return coincideServicio && coincideZona;
        });

        profesionalesActuales = resultado;
        filtroActivoProfesion = null;
        renderResultados(resultado, servicio || zona || 'todos');
        actualizarMapa(resultado);

        /* Scroll suave a resultados */
        document.getElementById('seccionResultados')
            ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
}


/* FILTRO POR CATEGORÍA (click en las cards de profesión) */
function configurarFiltrosCategorias() {
    document.querySelectorAll('.categoria-card').forEach(card => {
        card.addEventListener('click', () => {
            const profesion = card.dataset.profesion;

            /* Toggle: si ya estaba activo, limpia el filtro */
            if (filtroActivoProfesion === profesion) {
                filtroActivoProfesion = null;
                document.querySelectorAll('.categoria-card').forEach(c => c.classList.remove('activa'));
                profesionalesActuales = obtenerTodosProfesionales();
            } else {
                filtroActivoProfesion = profesion;
                document.querySelectorAll('.categoria-card').forEach(c => c.classList.remove('activa'));
                card.classList.add('activa');
                profesionalesActuales = obtenerTodosProfesionales()
                    .filter(p => p.profesion.toLowerCase() === profesion.toLowerCase());
            }

            renderResultados(profesionalesActuales, filtroActivoProfesion || 'todos');
            actualizarMapa(profesionalesActuales);

            document.getElementById('seccionResultados')
                ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
}


/* RENDER DE RESULTADOS DE BÚSQUEDA */
function renderResultados(lista, termino) {
    const contenedor = document.getElementById('resultadosGrid');
    const titulo     = document.getElementById('resultadosTitulo');
    const seccion    = document.getElementById('seccionResultados');

    if (!contenedor || !seccion) return;

    seccion.style.display = 'block';

    if (titulo) {
        titulo.textContent = lista.length > 0
            ? `${lista.length} profesional${lista.length > 1 ? 'es' : ''} encontrado${lista.length > 1 ? 's' : ''}`
            : 'No se encontraron profesionales';
    }

    if (lista.length === 0) {
        contenedor.innerHTML = `
            <p class="sin-resultados">
                No encontramos profesionales para tu búsqueda.<br>
                Intentá con otro servicio o zona.
            </p>`;
        return;
    }

    contenedor.innerHTML = lista.map(p => {
        const estrellas = renderEstrellas(p.valoracion);
        return `
            <div class="resultado-card">
                <div class="resultado-foto-wrapper">
                    <img src="${p.foto}" alt="${p.nombre}"
                        class="resultado-foto"
                        onerror="this.style.background='#ddd';this.src=''" />
                </div>
                <div class="resultado-info">
                    <p class="resultado-nombre">${p.nombre}</p>
                    <p class="resultado-profesion">${p.profesion}</p>
                    <div class="resultado-estrellas">${estrellas} <span class="resultado-valor">${p.valoracion}</span></div>
                    <p class="resultado-dato">📍 ${p.ubicacion}</p>
                    <p class="resultado-dato">🔧 +${p.trabajos} trabajos realizados</p>
                    <p class="resultado-dato">⏱ Respuesta en menos de ${p.respuesta}</p>
                </div>
                <div class="resultado-acciones">
                    <a href="./perfilProfesional.html?id=${p.id}" class="btn-ver-perfil">Ver perfil</a>
                    <button class="btn-agendar-cita" data-id="${p.id}">Agendar cita</button>
                </div>
            </div>
        `;
    }).join('');
}


/* MAPA DE ZONAS CON GOOGLE MAPS */
const coordenadasZonas = {
    'Belgrano':     { lat: -34.5607, lng: -58.4538 },
    'Colegiales':   { lat: -34.5732, lng: -58.4456 },
    'Palermo':      { lat: -34.5796, lng: -58.4266 },
    'Villa Crespo': { lat: -34.5993, lng: -58.4394 },
    'Recoleta':     { lat: -34.5875, lng: -58.3930 }
};

let mapaInstancia = null;
let marcadores    = [];

function renderMapa() {
    const contenedor = document.getElementById('mapaContenedor');
    if (!contenedor) return;

    /* Si la API de Google Maps no está cargada, mostramos iframe de respaldo */
    if (typeof google === 'undefined') {
        contenedor.innerHTML = `
            <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d26256.5!2d-58.44!3d-34.585!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses!2sar!4v1"
                width="100%" height="100%"
                style="border:0; border-radius: 12px;"
                allowfullscreen loading="lazy"
                referrerpolicy="no-referrer-when-downgrade">
            </iframe>`;
        return;
    }

    mapaInstancia = new google.maps.Map(contenedor, {
        center: { lat: -34.585, lng: -58.440 },
        zoom: 13,
        styles: [{ featureType: 'poi', stylers: [{ visibility: 'off' }] }]
    });

    actualizarMapa(obtenerTodosProfesionales());
}

function actualizarMapa(lista) {
    if (!mapaInstancia) return;

    /* Limpiamos marcadores anteriores */
    marcadores.forEach(m => m.setMap(null));
    marcadores = [];

    /* Agrupamos por zona */
    const porZona = {};
    lista.forEach(p => {
        if (!porZona[p.zona]) porZona[p.zona] = [];
        porZona[p.zona].push(p);
    });

    Object.entries(porZona).forEach(([zona, profs]) => {
        const coords = coordenadasZonas[zona];
        if (!coords) return;

        const marker = new google.maps.Marker({
            position: coords,
            map: mapaInstancia,
            title: zona,
            label: {
                text: String(profs.length),
                color: 'white',
                fontWeight: 'bold'
            },
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                fillColor: '#186CFF',
                fillOpacity: 1,
                strokeColor: '#fff',
                strokeWeight: 2,
                scale: 20
            }
        });

        const infoWindow = new google.maps.InfoWindow({
            content: `
                <div style="font-family:Inter,sans-serif;padding:8px;min-width:140px">
                    <strong>${zona}</strong><br>
                    ${profs.length} profesional${profs.length > 1 ? 'es' : ''}<br>
                    <small>${profs.map(p => p.nombre).join(', ')}</small>
                </div>`
        });

        marker.addListener('click', () => infoWindow.open(mapaInstancia, marker));
        marcadores.push(marker);
    });
}


/* FILTROS DEL MAPA (zona + calificación) */
function configurarFiltrosMapa() {
    const btnAplicar  = document.getElementById('btnAplicarFiltros');
    const btnLimpiar  = document.getElementById('btnLimpiarFiltros');

    if (btnAplicar) {
        btnAplicar.addEventListener('click', () => {
            const zonaSeleccionada = document.querySelector('input[name="zona"]:checked')?.value || 'todas';
            const todos = obtenerTodosProfesionales();
            const filtrados = todos.filter(p => {
                const coincideZona = zonaSeleccionada === 'todas' || p.zona === zonaSeleccionada;
                return coincideZona;
            });

            actualizarMapa(filtrados);
            renderResultados(filtrados, zonaSeleccionada);
            document.getElementById('seccionResultados').style.display = 'block';
        });
    }

    if (btnLimpiar) {
        btnLimpiar.addEventListener('click', () => {
            /* Resetea los radios y el select */
            const radioTodas = document.querySelector('input[name="zona"][value="todas"]');
            if (radioTodas) radioTodas.checked = true;

            actualizarMapa(obtenerTodosProfesionales());
            document.getElementById('seccionResultados').style.display = 'none';
        });
    }
}

function configurarAutocomplete(inputId, sugerenciasId, propiedadABuscar) {
    const input = document.getElementById(inputId);
    const panel = document.getElementById(sugerenciasId);

    if (!input || !panel) return;

    input.addEventListener('input', () => {
        const texto = input.value.toLowerCase();
        const todos = obtenerTodosProfesionales();
        
        // Filtra valores únicos basados en la propiedad (profesion o zona)
        const filtrados = [...new Set(todos.map(p => p[propiedadABuscar]))]
            .filter(valor => valor.toLowerCase().includes(texto));

        if (texto && filtrados.length > 0) {
            panel.innerHTML = filtrados
                .map(item => `<div class="sugerencia-item">${item}</div>`)
                .join('');
            panel.style.display = 'block';
        } else {
            panel.style.display = 'none';
        }
    });

    // Cerrar al hacer click afuera
    document.addEventListener('click', (e) => {
        if (!input.contains(e.target) && !panel.contains(e.target)) {
            panel.style.display = 'none';
        }
    });

    // Seleccionar sugerencia
    panel.addEventListener('click', (e) => {
        if (e.target.classList.contains('sugerencia-item')) {
            input.value = e.target.textContent;
            panel.style.display = 'none';
        }
    });
}

// Llamar a la función para ambos campos
configurarAutocomplete('inputServicio', 'sugerenciasServicio', 'profesion');
configurarAutocomplete('inputZona', 'sugerenciasZona', 'zona');



/* HELPER: render de estrellas */
function renderEstrellas(valoracion) {
    const llenas = Math.round(valoracion);
    return '★'.repeat(llenas) + '☆'.repeat(5 - llenas);
}